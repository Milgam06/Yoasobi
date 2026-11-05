import { useCreateUserMutation, useGetExistingUserLazyQuery, UserEntity } from '@/libs';
import { supabaseAuth } from '@/libs/supabase.lib';
import { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

type ICreateNewUserInput = {
  name: string;
  signal: AbortSignal;
};

type ICreateNewUser = (input: ICreateNewUserInput) => Promise<UserEntity>;

type IGetAppUser = (input: { signal: AbortSignal }) => Promise<UserEntity | null>;

type ILoadAppUser = (input: { signal: AbortSignal }) => Promise<UserEntity | null>;

type ISyncAppUserInput = {
  signal: AbortSignal;
  loadUser: ILoadAppUser;
};

type ISyncAppUser = (input: ISyncAppUserInput) => Promise<void>;

export type IAuthActionResponse =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export type ISignUpWithEmailInput = {
  email: string;
  name: string;
  password: string;
};

export type ISignInWithEmailInput = {
  email: string;
  password: string;
};

export type IAuthContextProps = {
  session: Session | null;
  authUser: User | null;
  userId: string | null;
  appUser: UserEntity | null;
  isReady: boolean;
  hasAppUserError: boolean;
  retryAppUser: () => void;
  signUpWithEmail: (input: ISignUpWithEmailInput) => Promise<IAuthActionResponse>;
  signInWithEmail: (input: ISignInWithEmailInput) => Promise<IAuthActionResponse>;
  signInWithApple: () => Promise<IAuthActionResponse>;
  signOut: () => Promise<void>;
};

type IAuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<IAuthContextProps | null>(null);

export const AuthProvider = memo<IAuthProviderProps>(({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<UserEntity | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasAppUserError, setHasAppUserError] = useState<boolean>(false);

  const appUserRequestControllerRef = useRef<AbortController | null>(null);
  const retryAppUserRequestRef = useRef<ILoadAppUser | null>(null);

  const [createUserMutation] = useCreateUserMutation();
  const [getExistingUserQuery] = useGetExistingUserLazyQuery();

  const userId = session?.user.id || null;
  const authUser = session?.user || null;

  const createNewUser = useCallback<ICreateNewUser>(
    async ({ name, signal }) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data: createData, errors } = await createUserMutation({
        context: { fetchOptions: { signal } },
        variables: {
          input: {
            name,
            timezone,
          },
        },
      });
      if (signal.aborted) {
        throw new Error('App user request cancelled');
      }
      if (errors || !createData) {
        throw new Error('Failed to create user');
      }
      return createData.createUser.user;
    },
    [createUserMutation],
  );

  const getAppUser = useCallback<IGetAppUser>(
    async ({ signal }) => {
      const { data, error } = await getExistingUserQuery({
        fetchPolicy: 'network-only',
        context: { fetchOptions: { signal } },
      });

      if (signal.aborted || error || !data) {
        throw new Error('Failed to get user');
      }
      return data.getUser.user || null;
    },
    [getExistingUserQuery],
  );

  const readyAppUserRequest = useCallback(() => {
    appUserRequestControllerRef.current?.abort();
    const controller = new AbortController();
    appUserRequestControllerRef.current = controller;
    retryAppUserRequestRef.current = null;
    setAppUser(null);
    setIsReady(false);
    setHasAppUserError(false);
    return controller;
  }, []);

  const syncAppUser = useCallback<ISyncAppUser>(
    async ({ signal, loadUser }) => {
      if (signal.aborted) {
        return;
      }
      retryAppUserRequestRef.current = loadUser;
      try {
        const user = await loadUser({ signal });
        if (signal.aborted) {
          return;
        }
        if (user) {
          setAppUser(user);
        }
        if (!user) {
          const { data: authData, error: authError } = await supabaseAuth.getUser();
          if (signal.aborted || authError || !authData.user) {
            throw new Error('Failed to get authenticated user');
          }
          const nickname = authData.user.user_metadata.nickname;

          const name = (typeof nickname === 'string' && nickname.trim()) || authData.user.email?.trim() || 'User';
          const createdUser = await createNewUser({ name, signal });
          if (signal.aborted) {
            return;
          }
          setAppUser(createdUser);
        }
        setIsReady(true);
        retryAppUserRequestRef.current = null;
      } catch {
        if (!signal.aborted) {
          setHasAppUserError(true);
        }
      }
    },
    [createNewUser],
  );

  const retryAppUser = useCallback(() => {
    const loadUser = retryAppUserRequestRef.current;
    if (loadUser) {
      const controller = readyAppUserRequest();
      syncAppUser({ signal: controller.signal, loadUser });
    }
  }, [readyAppUserRequest, syncAppUser]);

  const signUpWithEmail = useCallback(
    async (input: ISignUpWithEmailInput): Promise<IAuthActionResponse> => {
      const controller = readyAppUserRequest();
      try {
        const { data, error } = await supabaseAuth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              nickname: input.name,
            },
          },
        });
        if (controller.signal.aborted || error || !data.user || !data.session) {
          throw new Error('Sign up failed');
        }
        const name = input.name;
        await syncAppUser({
          signal: controller.signal,
          loadUser: ({ signal }) => createNewUser({ name, signal }),
        });
        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          message: '회원가입에 실패했습니다. 다시 시도해주세요.',
        };
      }
    },
    [readyAppUserRequest, syncAppUser, createNewUser],
  );

  const signInWithEmail = useCallback(
    async (input: ISignInWithEmailInput): Promise<IAuthActionResponse> => {
      const controller = readyAppUserRequest();
      try {
        const { data, error } = await supabaseAuth.signInWithPassword({
          email: input.email,
          password: input.password,
        });
        if (controller.signal.aborted || error || !data.user || !data.session) {
          throw new Error('Sign in failed');
        }
        await syncAppUser({ signal: controller.signal, loadUser: getAppUser });
        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          message: '로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }
    },
    [readyAppUserRequest, syncAppUser, getAppUser],
  );

  const signInWithApple = useCallback(async (): Promise<IAuthActionResponse> => {
    const controller = readyAppUserRequest();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return {
          ok: false,
          message: '애플 로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }

      const appleFullName = [
        credential.fullName?.familyName,
        credential.fullName?.givenName,
        credential.fullName?.middleName,
      ]
        .filter(Boolean)
        .join(' ');

      const { data, error } = await supabaseAuth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (controller.signal.aborted || error || !data.user || !data.session) {
        throw new Error('Apple sign in failed');
      }
      const name =
        appleFullName ||
        data.user.user_metadata.nickname ||
        data.user.user_metadata.name ||
        data.user.email?.split('@')[0] ||
        'User';
      await syncAppUser({
        signal: controller.signal,
        loadUser: async ({ signal }) => {
          const { data, error } = await getExistingUserQuery({
            fetchPolicy: 'network-only',
            context: { fetchOptions: { signal } },
          });
          if (signal.aborted || error || !data) {
            throw new Error('Failed to get user');
          }
          return data.getUser.user || createNewUser({ name, signal });
        },
      });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        message: '애플 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    }
  }, [readyAppUserRequest, syncAppUser, getExistingUserQuery, createNewUser]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabaseAuth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseAuth.onAuthStateChange((event, authSession) => {
      switch (event) {
        case 'INITIAL_SESSION': {
          if (appUserRequestControllerRef.current) {
            return;
          }
          if (!authSession) {
            setIsReady(true);
            return;
          }
          setSession(authSession);
          const controller = readyAppUserRequest();
          syncAppUser({ signal: controller.signal, loadUser: getAppUser });
          return;
        }
        case 'SIGNED_OUT':
          appUserRequestControllerRef.current?.abort();
          appUserRequestControllerRef.current = null;
          retryAppUserRequestRef.current = null;
          setSession(null);
          setAppUser(null);
          setHasAppUserError(false);
          setIsReady(true);
          return;
        case 'SIGNED_IN':
          setSession(authSession);
          return;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
        case 'PASSWORD_RECOVERY':
          setSession(authSession);
          return;
      }
    });
    return () => {
      subscription.unsubscribe();
      appUserRequestControllerRef.current?.abort();
      appUserRequestControllerRef.current = null;
      retryAppUserRequestRef.current = null;
    };
  }, [getAppUser, readyAppUserRequest, syncAppUser]);

  return (
    <AuthContext.Provider
      value={{
        session,
        authUser,
        userId,
        appUser,
        isReady,
        hasAppUserError,
        retryAppUser,
        signUpWithEmail,
        signInWithEmail,
        signInWithApple,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
});

export const useAuth = (): IAuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

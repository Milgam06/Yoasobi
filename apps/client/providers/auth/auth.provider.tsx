import { supabaseAuth, useCreateUserMutation, useGetExistingUserLazyQuery, UserEntity } from '@/libs';
import { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, memo, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { useDidMount, useWillUnmount } from 'rooks';

type ICreateNewUserInput = {
  userId: string;
  name: string;
};
type ICreateNewUser = (input: ICreateNewUserInput) => Promise<UserEntity>;

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
  isLoading: boolean;
  isReady: boolean;
  signUpWithEmail: (input: ISignUpWithEmailInput) => Promise<IAuthActionResponse>;
  signInWithEmail: (input: ISignInWithEmailInput) => Promise<IAuthActionResponse>;
  signInWithGoogle: () => Promise<IAuthActionResponse>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isSigningUpRef = useRef<boolean>(false);

  const [getExistingUserQuery] = useGetExistingUserLazyQuery();
  const [createUserMutation] = useCreateUserMutation();

  const userId = session?.user.id || null;
  const authUser = session?.user || null;

  const syncAppUser = useCallback(
    async (userId: string): Promise<UserEntity> => {
      const { data, error } = await getExistingUserQuery({
        variables: {
          input: {
            userId,
          },
        },
      });
      if (error || !data) {
        throw new Error('Failed to fetch user');
      }
      const user = data.getUser.user;
      if (!user) {
        throw new Error('User not found');
      }
      setAppUser(user);
      return user;
    },
    [getExistingUserQuery],
  );

  const clearAuthState = useCallback(() => {
    setSession(null);
    setAppUser(null);
  }, []);

  const createNewUser = useCallback<ICreateNewUser>(
    async ({ userId, name }) => {
      const { data: existingData, error } = await getExistingUserQuery({
        variables: {
          input: { userId },
        },
        fetchPolicy: 'network-only',
      });
      if (error) {
        throw new Error('Failed to check existing user');
      }
      if (existingData?.getUser.user) {
        return existingData.getUser.user;
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data: createData, errors } = await createUserMutation({
        variables: {
          input: {
            userId,
            name,
            timezone,
          },
        },
      });
      if (errors || !createData) {
        throw new Error('Failed to create user');
      }
      return createData.createUser.user;
    },
    [getExistingUserQuery, createUserMutation],
  );

  const signUpWithEmail = useCallback(
    async (input: ISignUpWithEmailInput): Promise<IAuthActionResponse> => {
      try {
        setIsLoading(true);
        isSigningUpRef.current = true;
        const { data, error } = await supabaseAuth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              nickname: input.name,
            },
          },
        });
        if (error || !data.user || !data.session) {
          return {
            ok: false,
            message: '회원가입에 실패했습니다. 다시 시도해주세요.',
          };
        }
        const user = await createNewUser({ userId: data.user.id, name: input.name });
        setAppUser(user);
        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          message: '회원가입에 실패했습니다. 다시 시도해주세요.',
        };
      } finally {
        isSigningUpRef.current = false;
        setIsLoading(false);
      }
    },
    [createNewUser],
  );

  const signInWithEmail = useCallback(async (input: ISignInWithEmailInput): Promise<IAuthActionResponse> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      if (error || !data.user || !data.session) {
        return {
          ok: false,
          message: '로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: '로그인에 실패했습니다. 다시 시도해주세요.',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<IAuthActionResponse> => {
    try {
      setIsLoading(true);
      const { error } = await supabaseAuth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        return {
          ok: false,
          message: '구글 로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }
      const { data: userData } = await supabaseAuth.getUser();
      if (!userData.user) {
        return {
          ok: false,
          message: '구글 로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }
      const user = await createNewUser({ userId: userData.user.id, name: userData.user.user_metadata['name'] });
      setAppUser(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: '구글 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [createNewUser]);

  const signInWithApple = useCallback(async (): Promise<IAuthActionResponse> => {
    try {
      setIsLoading(true);
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

      const { data, error } = await supabaseAuth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error || !data.user || !data.session) {
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
        .join('');

      const name = appleFullName || data.user.user_metadata['nickname'] || 'Apple User';

      const user = await createNewUser({ userId: data.user.id, name });
      setAppUser(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: '애플 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [createNewUser]);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabaseAuth.signOut();
      clearAuthState();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  const bootstrapAuth = useCallback(async () => {
    try {
      const { data, error } = await supabaseAuth.getSession();
      if (!isMountedRef.current) {
        return;
      }
      if (error) {
        clearAuthState();
        setIsReady(true);
        return;
      }

      if (data.session) {
        setSession(data.session);
        await syncAppUser(data.session.user.id);
      }
      setIsReady(true);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      clearAuthState();
      setIsReady(true);
    }
  }, [clearAuthState, syncAppUser]);

  useDidMount(async () => {
    await bootstrapAuth();
    const {
      data: { subscription },
    } = supabaseAuth.onAuthStateChange(async (event, session) => {
      if (!isMountedRef.current) {
        return;
      }
      if (event === 'SIGNED_OUT') {
        clearAuthState();
        return;
      }
      if (isSigningUpRef.current) {
        setSession(session);
        return;
      }
      setSession(session);
      try {
        if (session) {
          await syncAppUser(session.user.id);
        }
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }
        clearAuthState();
      }
    });
    subscriptionRef.current = subscription;
  });

  useWillUnmount(() => {
    isMountedRef.current = false;
    subscriptionRef.current?.unsubscribe();
  });

  return (
    <AuthContext.Provider
      value={{
        session,
        authUser,
        userId,
        appUser,
        isLoading,
        isReady,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
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

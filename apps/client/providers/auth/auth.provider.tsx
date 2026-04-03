import { supabaseAuth, useCreateUserMutation, useGetExistingUserLazyQuery, UserEntity } from '@/libs';
import { Session, User } from '@supabase/supabase-js';
import { createContext, memo, ReactNode, useCallback, useRef, useState } from 'react';
import { useDidMount, useWillUnmount } from 'rooks';

type ICreateNewUserInput = {
  userId: string;
  name: string;
};
type ICreateNewUser = (input: ICreateNewUserInput) => Promise<{
  user: UserEntity;
}>;

type ICheckExistingUserInput = {
  userId: string;
};
type ICheckExistingUser = (input: ICheckExistingUserInput) => Promise<{
  isUserExists: boolean;
  user: UserEntity | null;
}>;

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

  const [getExistingUserQuery] = useGetExistingUserLazyQuery();
  const [createUserMutation] = useCreateUserMutation();

  const userId = session?.user.id || null;
  const authUser = session?.user || null;

  const clearAuthState = useCallback(() => {
    setSession(null);
    setAppUser(null);
  }, []);

  const checkExistingUser = useCallback<ICheckExistingUser>(
    async ({ userId }) => {
      const { data, error } = await getExistingUserQuery({
        variables: {
          input: {
            userId,
          },
        },
      });
      if (error || !data) {
        throw new Error('Failed to check existing user');
      }
      const isUserExists = !!data.getUser.user;
      return {
        isUserExists: isUserExists,
        user: data.getUser.user ?? null,
      };
    },
    [getExistingUserQuery],
  );

  const createNewUser = useCallback<ICreateNewUser>(
    async ({ userId, name }) => {
      const { isUserExists, user } = await checkExistingUser({ userId });
      if (isUserExists && user) {
        return {
          user,
        };
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data, errors } = await createUserMutation({
        variables: {
          input: {
            userId,
            name,
            timezone,
          },
        },
      });
      if (errors || !data) {
        throw new Error('Failed to create user');
      }
      return {
        user: data.createUser.user,
      };
    },
    [checkExistingUser, createUserMutation],
  );

  const signUpWithEmail = useCallback(
    async (input: ISignUpWithEmailInput): Promise<IAuthActionResponse> => {
      try {
        setIsLoading(true);
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
        const { user } = await createNewUser({ userId: data.user.id, name: input.name });
        setAppUser(user);
        setSession(data.session);
        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          message: '회원가입에 실패했습니다. 다시 시도해주세요.',
        };
      } finally {
        setIsLoading(false);
      }
    },
    [createNewUser],
  );

  const signInWithEmail = useCallback(
    async (input: ISignInWithEmailInput): Promise<IAuthActionResponse> => {
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
        const { user } = await checkExistingUser({ userId: data.user.id });
        if (!user) {
          return {
            ok: false,
            message: '로그인에 실패했습니다. 다시 시도해주세요.',
          };
        }
        setAppUser(user);
        setSession(data.session);
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
    },
    [checkExistingUser],
  );

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
      const { user } = await createNewUser({ userId: userData.user.id, name: userData.user.user_metadata['name'] });

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
      console.log('애플 로그인 시도');
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
  }, []);

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

      setSession(data.session);
      setIsReady(true);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      console.error('세션 정보 가져오기 실패:', error);
      clearAuthState();
      setIsReady(true);
    }
  }, [clearAuthState]);

  useDidMount(async () => {
    await bootstrapAuth();
    const {
      data: { subscription },
    } = supabaseAuth.onAuthStateChange((event, session) => {
      if (!isMountedRef.current) {
        return;
      }
      if (event === 'SIGNED_OUT') {
        clearAuthState();
        return;
      }
      setSession(session);
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

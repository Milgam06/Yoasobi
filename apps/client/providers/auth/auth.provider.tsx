import { supabaseAuth, UserEntity } from '@/libs';
import { Session, User } from '@supabase/supabase-js';
import { createContext, memo, ReactNode, useCallback, useRef, useState } from 'react';
import { useDidMount, useWillUnmount } from 'rooks';

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
  nickname: string;
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

  const userId = session?.user.id || null;
  const authUser = session?.user || null;

  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setAppUser(null);
  }, []);

  const signUpWithEmail = useCallback(async (input: ISignUpWithEmailInput): Promise<IAuthActionResponse> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            nickname: input.nickname,
          },
        },
      });
      const hasSignUpError = error || !data.user || !data.session;
      if (hasSignUpError) {
        return {
          ok: false,
          message: '회원가입에 실패했습니다. 다시 시도해주세요.',
        };
      }
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
  }, []);

  const signInWithEmail = useCallback(async (input: ISignInWithEmailInput): Promise<IAuthActionResponse> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseAuth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      const hasSignInError = error || !data.user || !data.session;
      if (hasSignInError) {
        return {
          ok: false,
          message: '로그인에 실패했습니다. 다시 시도해주세요.',
        };
      }
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
  }, []);

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

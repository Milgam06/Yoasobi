import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert, BlurBox, LinearGradientLayout } from '@/components';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Input, ScrollView, Separator, Stack, Text } from 'tamagui';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { useAuth } from '@/providers';
import { useRouter } from 'expo-router';
import { useDidUpdate } from 'rooks';

type IAuthType = 'login' | 'signUp';

export type IAuthScreenProps = {
  authType: IAuthType;
};

type ILoginFormType = {
  email: string;
  password: string;
};

type ISignUpFormType = {
  nickname: string;
  email: string;
  password: string;
};

type IAuthErrorType = {
  authType: IAuthType;
  message: string;
};

type ILoginBoxProps = {
  email: string;
  password: string;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressLogin: () => void;
  onPressConvertAuthType: () => void;
  onPressLoginWithApple: () => void;
};

type ISignUpBoxProps = {
  nickname: string;
  email: string;
  password: string;
  onChangeNickname: (nickname: string) => void;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressSignUp: () => void;
  onPressSignUpWithApple: () => void;
  onPressConvertAuthType: () => void;
};

const isPlatformAndroid = Platform.OS === 'android';

const LoginBox = memo<ILoginBoxProps>(
  ({
    email,
    password,
    onChangeEmail,
    onChangePassword,
    onPressLogin,
    onPressConvertAuthType,
    onPressLoginWithApple,
  }) => {
    const hasInputValues = email.length > 0 && password.length > 0;
    return (
      <Stack width="$fluid" flex={1} gap="$size.x6">
        <Stack width="$fluid" justify="center">
          <Text fontSize="$10" fontWeight="$900" color="$colors.lampYellow">
            로그인
          </Text>
          <Text fontSize="$6" fontWeight="$400" color="$colors.cloudGray">
            다시 만나서 반가워요.
          </Text>
        </Stack>
        <Stack gap="$size.x4">
          {!isPlatformAndroid && (
            <Stack>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={8}
                style={{ width: '100%', height: 52 }}
                onPress={onPressLoginWithApple}
              />
              <Stack flexDirection="row" width="$fluid" justify="center" items="center" gap="$size.x2" px="$size.x1">
                <Separator width="$fluid" borderColor="$colors.cloudGray" />
                <Text fontSize="$3" color="$colors.cloudGray">
                  OR
                </Text>
                <Separator width="$fluid" borderColor="$colors.cloudGray" />
              </Stack>
            </Stack>
          )}
          <Stack width="$fluid" gap="$size.x4">
            <BlurBox>
              <Stack width="$fluid" gap="$size.x4">
                <Text fontSize="$7" fontWeight="$600" color="$colors.moonSoftWhite">
                  이메일로 로그인
                </Text>
                <Stack gap="$size.x4">
                  <Stack gap="$size.x1">
                    <Text fontSize="$5" color="$colors.cloudGray">
                      이메일
                    </Text>
                    <Stack
                      flexDirection="row"
                      items="center"
                      px="$size.x3"
                      py="$size.x2_5"
                      borderWidth={1}
                      borderColor="$colors.cloudGray"
                      gap="$size.x2_5"
                      focusStyle={{
                        borderWidth: 1,
                        borderColor: '$colors.moonSoftWhite',
                      }}
                      style={{ borderRadius: 16 }}>
                      <FontAwesomeIcon icon={faAt} size={26} color="#858090" />
                      <Input
                        value={email}
                        width="$fluid"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        placeholder="이메일을 입력하세요"
                        borderWidth={0}
                        p={0}
                        bg="$colorTransparent"
                        height="$fit"
                        fontSize="$6"
                        color="$colors.moonSoftWhite"
                        onChangeText={onChangeEmail}
                      />
                    </Stack>
                  </Stack>
                  <Stack gap="$size.x1">
                    <Text fontSize="$5" color="$colors.cloudGray">
                      비밀번호
                    </Text>
                    <Stack
                      flexDirection="row"
                      items="center"
                      px="$size.x3"
                      py="$size.x2_5"
                      borderWidth={1}
                      borderColor="$colors.cloudGray"
                      gap="$size.x2_5"
                      focusStyle={{
                        borderWidth: 1,
                        borderColor: '$colors.moonSoftWhite',
                      }}
                      style={{ borderRadius: 16 }}>
                      <FontAwesomeIcon icon={faKey} size={26} color="#858090" />
                      <Input
                        value={password}
                        width="$fluid"
                        secureTextEntry
                        textContentType="password"
                        placeholder="비밀번호를 입력하세요"
                        borderWidth={0}
                        p={0}
                        bg="$colorTransparent"
                        height="$fit"
                        fontSize="$6"
                        color="$colors.moonSoftWhite"
                        onChangeText={onChangePassword}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </BlurBox>
          </Stack>
        </Stack>
        <Stack width="$fluid" items="center" gap="$size.x2_5">
          <Button
            width="$fluid"
            height="$fit"
            py="$size.x4"
            disabled={!hasInputValues}
            opacity={hasInputValues ? 1 : 0.8}
            bg="$colors.lampYellow"
            borderTopLeftRadius="$size.x4"
            borderTopRightRadius="$size.x4"
            borderBottomLeftRadius="$size.x4"
            borderBottomRightRadius="$size.x4"
            pressStyle={{
              bg: '$colors.lampYellow',
              opacity: 0.8,
            }}
            onPress={onPressLogin}>
            <Text fontSize="$8" fontWeight="$600" color="$colors.midnightPurple">
              로그인
            </Text>
          </Button>
          <Stack width="$fluid" flexDirection="row" justify="center" items="center" gap="$size.x2">
            <Text fontSize="$5" fontWeight="$600" color="$colors.cloudGray">
              Yoasobi는 처음이신가요?
            </Text>
            <Text fontSize="$5" fontWeight="$900" color="$colors.moonSoftWhite" onPress={onPressConvertAuthType}>
              회원가입
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  },
);

const SignUpBox = memo<ISignUpBoxProps>(
  ({
    nickname,
    email,
    password,
    onChangeNickname,
    onChangeEmail,
    onChangePassword,
    onPressSignUp,
    onPressSignUpWithApple,
    onPressConvertAuthType,
  }) => {
    const hasInputValues = nickname.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;
    return (
      <Stack width="$fluid" flex={1} gap="$size.x6">
        <Stack width="$fluid" justify="center">
          <Text fontSize="$10" fontWeight="$900" color="$colors.lampYellow">
            회원가입
          </Text>
          <Text fontSize="$6" fontWeight="$400" color="$colors.cloudGray">
            계정을 만들고, 첫 YOASOBI를 시작해요.
          </Text>
        </Stack>
        <Stack gap="$size.x4">
          {!isPlatformAndroid && (
            <Stack>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={8}
                style={{ width: '100%', height: 52 }}
                onPress={onPressSignUpWithApple}></AppleAuthentication.AppleAuthenticationButton>
              <Stack flexDirection="row" width="$fluid" justify="center" items="center" gap="$size.x2" px="$size.x1">
                <Separator width="$fluid" borderColor="$colors.cloudGray" />
                <Text fontSize="$3" color="$colors.cloudGray">
                  OR
                </Text>
                <Separator width="$fluid" borderColor="$colors.cloudGray" />
              </Stack>
            </Stack>
          )}
          <BlurBox>
            <Stack width="$fluid" gap="$size.x4">
              <Text fontSize="$7" fontWeight="$600" color="$colors.moonSoftWhite">
                이메일로 가입
              </Text>
              <Stack gap="$size.x4">
                <Stack gap="$size.x1">
                  <Text fontSize="$5" color="$colors.cloudGray">
                    닉네임
                  </Text>
                  <Stack
                    flexDirection="row"
                    items="center"
                    px="$size.x3"
                    py="$size.x2_5"
                    borderWidth={1}
                    borderColor="$colors.cloudGray"
                    gap="$size.x2_5"
                    focusStyle={{
                      borderWidth: 1,
                      borderColor: '$colors.moonSoftWhite',
                    }}
                    style={{ borderRadius: 16 }}>
                    <FontAwesomeIcon icon={faUser} size={26} color="#858090" />
                    <Input
                      value={nickname}
                      width="$fluid"
                      placeholder="닉네임을 입력하세요"
                      borderWidth={0}
                      p={0}
                      bg="$colorTransparent"
                      height="$fit"
                      fontSize="$6"
                      color="$colors.moonSoftWhite"
                      onChangeText={onChangeNickname}
                    />
                  </Stack>
                </Stack>
                <Stack gap="$size.x1">
                  <Text fontSize="$5" color="$colors.cloudGray">
                    이메일
                  </Text>
                  <Stack
                    flexDirection="row"
                    items="center"
                    px="$size.x3"
                    py="$size.x2_5"
                    borderWidth={1}
                    borderColor="$colors.cloudGray"
                    gap="$size.x2_5"
                    focusStyle={{
                      borderWidth: 1,
                      borderColor: '$colors.moonSoftWhite',
                    }}
                    style={{ borderRadius: 16 }}>
                    <FontAwesomeIcon icon={faAt} size={26} color="#858090" />
                    <Input
                      value={email}
                      width="$fluid"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      placeholder="이메일을 입력하세요"
                      borderWidth={0}
                      p={0}
                      bg="$colorTransparent"
                      height="$fit"
                      fontSize="$6"
                      color="$colors.moonSoftWhite"
                      onChangeText={onChangeEmail}
                    />
                  </Stack>
                </Stack>
                <Stack gap="$size.x1">
                  <Text fontSize="$5" color="$colors.cloudGray">
                    비밀번호
                  </Text>
                  <Stack
                    flexDirection="row"
                    items="center"
                    px="$size.x3"
                    py="$size.x2_5"
                    borderWidth={1}
                    borderColor="$colors.cloudGray"
                    gap="$size.x2_5"
                    focusStyle={{
                      borderWidth: 1,
                      borderColor: '$colors.moonSoftWhite',
                    }}
                    style={{ borderRadius: 16 }}>
                    <FontAwesomeIcon icon={faKey} size={26} color="#858090" />
                    <Input
                      value={password}
                      width="$fluid"
                      secureTextEntry
                      textContentType="password"
                      placeholder="비밀번호를 입력하세요"
                      borderWidth={0}
                      p={0}
                      bg="$colorTransparent"
                      height="$fit"
                      fontSize="$6"
                      color="$colors.moonSoftWhite"
                      onChangeText={onChangePassword}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </BlurBox>
        </Stack>
        <Stack width="$fluid" items="center" gap="$size.x2_5">
          <Button
            width="$fluid"
            height="$fit"
            py="$size.x4"
            disabled={!hasInputValues}
            opacity={hasInputValues ? 1 : 0.8}
            bg="$colors.lampYellow"
            borderTopLeftRadius="$size.x4"
            borderTopRightRadius="$size.x4"
            borderBottomLeftRadius="$size.x4"
            borderBottomRightRadius="$size.x4"
            pressStyle={{
              bg: '$colors.lampYellow',
              opacity: 0.8,
            }}
            onPress={onPressSignUp}>
            <Text fontSize="$8" fontWeight="$600" color="$colors.midnightPurple">
              가입하고 시작하기
            </Text>
          </Button>
          <Stack width="$fluid" flexDirection="row" justify="center" items="center" gap="$size.x2">
            <Text fontSize="$5" fontWeight="$600" color="$colors.cloudGray">
              이미 계정이 있으신가요?
            </Text>
            <Text fontSize="$5" fontWeight="$900" color="$colors.moonSoftWhite" onPress={onPressConvertAuthType}>
              로그인
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  },
);

export const AuthScreen = memo<IAuthScreenProps>(({ authType }) => {
  const route = useRouter();
  const { appUser, signUpWithEmail, signInWithEmail, signInWithApple } = useAuth();
  const [currentAuthType, setCurrentAuthType] = useState<IAuthType>(authType);
  const [loginFormData, setLoginFormData] = useState<ILoginFormType>({
    email: '',
    password: '',
  });
  const [signUpFormData, setSignUpFormData] = useState<ISignUpFormType>({
    email: '',
    password: '',
    nickname: '',
  });
  const [authError, setAuthError] = useState<IAuthErrorType | null>(null);

  const { isCurrentAuthTypeLogin, isCurrentAuthTypeSignUp } = useMemo(() => {
    const isCurrentAuthTypeLogin = currentAuthType === 'login';
    const isCurrentAuthTypeSignUp = currentAuthType === 'signUp';
    return {
      isCurrentAuthTypeLogin,
      isCurrentAuthTypeSignUp,
    };
  }, [currentAuthType]);

  const handlePressConvertAuthType = useCallback(() => {
    setAuthError(null);
    setCurrentAuthType((prev) => {
      const isPrevAuthTypeLogin = prev === 'login';
      return isPrevAuthTypeLogin ? 'signUp' : 'login';
    });
  }, []);

  const handlePressAuthTypeSignIn = useCallback(() => {
    setAuthError(null);
    setCurrentAuthType('login');
  }, []);

  const handlePressAuthTypeSignUp = useCallback(() => {
    setAuthError(null);
    setCurrentAuthType('signUp');
  }, []);

  const clearFormData = useCallback(() => {
    const isCurrentAuthTypeLogin = currentAuthType === 'login';
    if (isCurrentAuthTypeLogin) {
      setLoginFormData({
        email: '',
        password: '',
      });
      return;
    }
    setSignUpFormData({
      email: '',
      password: '',
      nickname: '',
    });
  }, [currentAuthType]);

  const handleChangeSignUpNickname = useCallback((nickname: string) => {
    setSignUpFormData((prev) => {
      return {
        ...prev,
        nickname,
      };
    });
  }, []);

  const handleChangeSignUpEmail = useCallback((email: string) => {
    setSignUpFormData((prev) => {
      return {
        ...prev,
        email,
      };
    });
  }, []);

  const handleChangeSignUpPassword = useCallback((password: string) => {
    setSignUpFormData((prev) => {
      return {
        ...prev,
        password,
      };
    });
  }, []);

  const handleChangeLoginEmail = useCallback((email: string) => {
    setLoginFormData((prev) => {
      return {
        ...prev,
        email,
      };
    });
  }, []);

  const handleChangeLoginPassword = useCallback((password: string) => {
    setLoginFormData((prev) => {
      return {
        ...prev,
        password,
      };
    });
  }, []);

  const handlePressLoginWithEmail = useCallback(async () => {
    try {
      const response = await signInWithEmail({
        email: loginFormData.email,
        password: loginFormData.password,
      });
      if (!response.ok) {
        setAuthError({ authType: 'login', message: response.message });
        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.';
      setAuthError({ authType: 'login', message: errorMessage });
    }
  }, [loginFormData.email, loginFormData.password, signInWithEmail]);

  const handlePressSignUpWithEmail = useCallback(async () => {
    try {
      const response = await signUpWithEmail({
        email: signUpFormData.email,
        password: signUpFormData.password,
        name: signUpFormData.nickname,
      });
      if (!response.ok) {
        setAuthError({ authType: 'signUp', message: response.message });
        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다. 다시 시도해주세요.';
      setAuthError({ authType: 'signUp', message: errorMessage });
    }
  }, [signUpWithEmail, signUpFormData.email, signUpFormData.password, signUpFormData.nickname]);

  const handlePressLoginWithApple = useCallback(async () => {
    try {
      const response = await signInWithApple();
      if (!response.ok) {
        setAuthError({ authType: 'login', message: response.message });
        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '애플 로그인에 실패했습니다. 다시 시도해주세요.';
      setAuthError({ authType: 'login', message: errorMessage });
    }
  }, [signInWithApple]);

  const handleCloseAuthError = useCallback(() => {
    clearFormData();
    setAuthError(null);
  }, [clearFormData]);

  useDidUpdate(() => {
    if (appUser) {
      route.push('/(tabs)/home');
    }
  }, [appUser]);

  return (
    <LinearGradientLayout screenEdge={['top']} hasHeader>
      {!!authError && (
        <Alert isOpen={!!authError} alertPadding="$size.x4" isErrorAlert onClose={handleCloseAuthError}>
          <Stack width="$fluid" gap="$size.x4">
            <Stack width="$fluid" gap="$size.x3">
              <Stack flexDirection="row" items="center" gap="$size.x2_5">
                <Stack py="$size.x1_5" px="$size.x1" bg="#ff909057" style={{ borderRadius: 12 }}>
                  <FontAwesomeIcon icon={faExclamation} size={24} color="#ff7474" />
                </Stack>
                <Text fontSize="$9" fontWeight="$900">
                  {authError.authType === 'login' ? '로그인' : '회원가입'}에 실패했어요
                </Text>
              </Stack>
              <Text fontSize="$5" color="$colors.cloudGray">
                {authError.message}
              </Text>
            </Stack>
            <Button
              width="$fluid"
              height="$fit"
              py="$size.x2_5"
              bg="$colors.lampYellow"
              borderTopLeftRadius="$size.x3"
              borderTopRightRadius="$size.x3"
              borderBottomLeftRadius="$size.x3"
              borderBottomRightRadius="$size.x3"
              pressStyle={{ bg: '$colors.lampYellow', opacity: 0.8 }}
              onPress={handleCloseAuthError}>
              <Text fontSize="$6" fontWeight="$900" color="$colors.midnightPurple">
                확인
              </Text>
            </Button>
          </Stack>
        </Alert>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isPlatformAndroid ? 'height' : 'padding'}
        keyboardVerticalOffset={0}>
        <ScrollView flex={1} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Stack flex={1} items="center" px="$size.x2" pt="$size.x4" pb="$size.x10" gap="$size.x6">
            <Stack width="$fluid" gap="$size.x3">
              <Text fontSize="$8" fontWeight="$600" color="$colors.moonSoftWhite">
                계정
              </Text>
              <BlurBox px="$size.x2" py="$size.x2">
                <Stack flexDirection="row" justify="center" items="center" gap="$size.x2">
                  <Stack
                    flex={1}
                    height="auto"
                    justify="center"
                    items="center"
                    bg={isCurrentAuthTypeLogin ? '$colors.moonSoftWhite' : '$colorTransparent'}
                    py="$size.x2_5"
                    animation="quicker"
                    style={{ borderRadius: 8 }}
                    onPress={handlePressAuthTypeSignIn}>
                    <Text
                      fontSize="$7"
                      fontWeight="$900"
                      animation="quick"
                      color={isCurrentAuthTypeLogin ? '$colors.midnightPurple' : '$colors.moonSoftWhite'}>
                      로그인
                    </Text>
                  </Stack>
                  <Stack
                    flex={1}
                    height="auto"
                    justify="center"
                    items="center"
                    bg={isCurrentAuthTypeSignUp ? '$colors.moonSoftWhite' : '$colorTransparent'}
                    py="$size.x2_5"
                    animation="quicker"
                    style={{ borderRadius: 8 }}
                    onPress={handlePressAuthTypeSignUp}>
                    <Text
                      fontSize="$7"
                      fontWeight="$900"
                      animation="quick"
                      color={isCurrentAuthTypeSignUp ? '$colors.midnightPurple' : '$colors.moonSoftWhite'}>
                      회원가입
                    </Text>
                  </Stack>
                </Stack>
              </BlurBox>
            </Stack>
            {isCurrentAuthTypeLogin ? (
              <LoginBox
                email={loginFormData.email}
                password={loginFormData.password}
                onChangeEmail={handleChangeLoginEmail}
                onChangePassword={handleChangeLoginPassword}
                onPressLogin={handlePressLoginWithEmail}
                onPressConvertAuthType={handlePressConvertAuthType}
                onPressLoginWithApple={handlePressLoginWithApple}
              />
            ) : (
              <SignUpBox
                email={signUpFormData.email}
                password={signUpFormData.password}
                nickname={signUpFormData.nickname}
                onChangeEmail={handleChangeSignUpEmail}
                onChangePassword={handleChangeSignUpPassword}
                onChangeNickname={handleChangeSignUpNickname}
                onPressSignUp={handlePressSignUpWithEmail}
                onPressSignUpWithApple={handlePressLoginWithApple}
                onPressConvertAuthType={handlePressConvertAuthType}
              />
            )}
          </Stack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradientLayout>
  );
});

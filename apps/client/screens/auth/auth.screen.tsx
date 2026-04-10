import * as AppleAuthentication from 'expo-apple-authentication';
import { BlurBox, LinearGradientLayout } from '@/components';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Input, ScrollView, Separator, Stack, Text } from 'tamagui';
import { signInWithApple } from '@/hooks/auth/signInWithApple.hook';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { useAuth } from '@/providers';
import { useRouter } from 'expo-router';

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

type ILoginBoxProps = {
  email: string;
  password: string;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressLogin: () => void;
  onPressConvertAuthType: () => void;
};

type ISignUpBoxProps = {
  nickname: string;
  email: string;
  password: string;
  onChangeNickname: (nickname: string) => void;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressSignUp: () => void;
  onPressConvertAuthType: () => void;
};

const isPlatformAndroid = Platform.OS === 'android';

const LoginBox = memo<ILoginBoxProps>(
  ({ email, password, onChangeEmail, onChangePassword, onPressLogin, onPressConvertAuthType }) => {
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
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={8}
              style={{ width: '100%', height: 52 }}
              onPress={async () => {
                try {
                  await signInWithApple();
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          )}
          <Stack flexDirection="row" width="$fluid" justify="center" items="center" gap="$size.x2" px="$size.x1">
            <Separator width="$fluid" borderColor="$colors.cloudGray" />
            <Text fontSize="$3" color="$colors.cloudGray">
              OR
            </Text>
            <Separator width="$fluid" borderColor="$colors.cloudGray" />
          </Stack>
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
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={8}
              style={{ width: '100%', height: 52 }}
              onPress={async () => {
                try {
                  await signInWithApple();
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          )}
          <Stack flexDirection="row" width="$fluid" justify="center" items="center" gap="$size.x2" px="$size.x1">
            <Separator width="$fluid" borderColor="$colors.cloudGray" />
            <Text fontSize="$3" color="$colors.cloudGray">
              OR
            </Text>
            <Separator width="$fluid" borderColor="$colors.cloudGray" />
          </Stack>
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
  const { signUpWithEmail, signInWithEmail } = useAuth();
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

  const { isCurrentAuthTypeLogin, isCurrentAuthTypeSignUp } = useMemo(() => {
    const isCurrentAuthTypeLogin = currentAuthType === 'login';
    const isCurrentAuthTypeSignUp = currentAuthType === 'signUp';
    return {
      isCurrentAuthTypeLogin,
      isCurrentAuthTypeSignUp,
    };
  }, [currentAuthType]);

  const handlePressConvertAuthType = useCallback(() => {
    setCurrentAuthType((prev) => {
      const isPrevAuthTypeLogin = prev === 'login';
      return isPrevAuthTypeLogin ? 'signUp' : 'login';
    });
  }, []);

  const handlePressAuthTypeSignIn = useCallback(() => {
    setCurrentAuthType('login');
  }, []);

  const handlePressAuthTypeSignUp = useCallback(() => {
    setCurrentAuthType('signUp');
  }, []);

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
    const response = await signInWithEmail({
      email: loginFormData.email,
      password: loginFormData.password,
    });
    if (!response.ok) {
      console.error(response.message);
      return;
    }
    route.push('/(tabs)/home');
  }, [loginFormData.email, loginFormData.password, route, signInWithEmail]);

  const handlePressSignUpWithEmail = useCallback(async () => {
    const response = await signUpWithEmail({
      email: signUpFormData.email,
      password: signUpFormData.password,
      name: signUpFormData.nickname,
    });
    if (!response.ok) {
      console.error(response.message);
      return;
    }
    route.push('/(tabs)/home');
  }, [signUpWithEmail, signUpFormData.email, signUpFormData.password, signUpFormData.nickname, route]);

  return (
    <LinearGradientLayout screenEdge={['top']} hasHeader>
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
                onPressConvertAuthType={handlePressConvertAuthType}
              />
            )}
          </Stack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradientLayout>
  );
});

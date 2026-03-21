import * as AppleAuthentication from 'expo-apple-authentication';
import { BlurBox, LinearGradientLayout } from '@/components';
import { memo, useCallback, useMemo, useState } from 'react';
import { Input, ScrollView, Separator, Stack, Text } from 'tamagui';
import { signInWithApple } from '@/hooks/auth/signInWithApple.hook';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';

type IAuthType = 'login' | 'signUp';

export type IAuthScreenProps = {
  authType: IAuthType;
};

type ILoginBoxProps = {
  email: string;
  password: string;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressLogin: () => void;
};

type ISignUpBoxProps = {
  nickname: string;
  email: string;
  password: string;
  onChangeNickname: (nickname: string) => void;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onPressSignUp: () => void;
};

export const AuthScreen = memo<IAuthScreenProps>(({ authType }) => {
  const isPlatformAndroid = Platform.OS === 'android';
  const LoginBox = memo<ILoginBoxProps>(({ email, password, onChangeEmail, onChangePassword, onPressLogin }) => {
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
    );
  });

  const SignUpBox = memo<ISignUpBoxProps>(
    ({ nickname, email, password, onChangeNickname, onChangeEmail, onChangePassword, onPressSignUp }) => {
      const hasInputValues = useMemo(() => {
        const hasNickname = nickname.trim().length > 0;
        const hasEmail = email.trim().length > 0;
        const hasPassword = password.trim().length > 0;
        return hasNickname && hasEmail && hasPassword;
      }, [nickname, email, password]);

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
        </Stack>
      );
    },
  );

  const [currentAuthType, setCurrentAuthType] = useState<IAuthType>(authType);

  const { isCurrentAuthTypeLogin, isCurrentAuthTypeSignUp } = useMemo(() => {
    const isCurrentAuthTypeLogin = currentAuthType === 'login';
    const isCurrentAuthTypeSignUp = currentAuthType === 'signUp';
    return {
      isCurrentAuthTypeLogin,
      isCurrentAuthTypeSignUp,
    };
  }, [currentAuthType]);

  const handlePressSignIn = useCallback(() => {
    setCurrentAuthType('login');
  }, []);

  const handlePressSignUp = useCallback(() => {
    setCurrentAuthType('signUp');
  }, []);

  return (
    <LinearGradientLayout screenEdge={['top']} hasHeader>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isPlatformAndroid ? 'height' : 'padding'}
        keyboardVerticalOffset={0}>
        <ScrollView flex={1} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Stack flex={1} items="center" px="$size.x2" py="$size.x8" gap="$size.x6">
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
                    onPress={handlePressSignIn}>
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
                    onPress={handlePressSignUp}>
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
                email="2"
                password="2"
                onChangeEmail={() => {}}
                onChangePassword={() => {}}
                onPressLogin={() => {}}
              />
            ) : (
              <SignUpBox
                email="2"
                password="2"
                nickname="2"
                onChangeEmail={() => {}}
                onChangePassword={() => {}}
                onChangeNickname={() => {}}
                onPressSignUp={() => {}}
              />
            )}
          </Stack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradientLayout>
  );
});

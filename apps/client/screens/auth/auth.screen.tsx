import * as AppleAuthentication from 'expo-apple-authentication';
import { BlurBox, LinearGradientLayout } from '@/components';
import { supabaseAuth } from '@/libs';
import { memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, Stack, Text } from 'tamagui';
import { signInWithApple } from '@/hooks/auth/signInWithApple.hook';

type IAuthType = 'login' | 'signUp';

export type IAuthScreenProps = {
  authType: IAuthType;
};

export const AuthScreen = memo<IAuthScreenProps>(({ authType }) => {
  const LoginBox = memo(() => {
    return (
      <Stack width="$fluid" flex={1} borderWidth={1}>
        <Text>Login Form</Text>
      </Stack>
    );
  });

  const SignUpBox = memo(() => {
    const handlePressSignInWithGoogle = useCallback(async () => {
      const { data, error } = await supabaseAuth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'yoasobi://auth/callback',
        },
      });
      if (error) {
        console.log('로그인 실패', error.message);
        return;
      }
      console.log('로그인 성공', data);
    }, []);

    return (
      <Stack width="$fluid" flex={1}>
        <Stack width="$fluid" justify="center" gap="$size.x2">
          <Text fontSize="$10" fontWeight="$900" color="$colors.moonSoftWhite">
            회원가입
          </Text>
          <Text fontSize="$6" fontWeight="$600" color="$colors.cloudGray">
            계정을 만들고, 첫 YOASOBI를 시작해요.
          </Text>
        </Stack>
        <Stack>
          {/* <Stack width="$fluid" onPress={handlePressSignInWithGoogle}>
            <Text>google</Text>
          </Stack> */}
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: '100%', height: 44 }}
            onPress={async () => {
              try {
                await signInWithApple();
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </Stack>
      </Stack>
    );
  });

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
    <LinearGradientLayout hasHeader>
      <ScrollView flex={1}>
        <Stack flex={1} items="center" px="$size.x2" pt="$size.x6" gap="$size.x6">
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
          {isCurrentAuthTypeLogin ? <LoginBox /> : <SignUpBox />}
        </Stack>
      </ScrollView>
    </LinearGradientLayout>
  );
});

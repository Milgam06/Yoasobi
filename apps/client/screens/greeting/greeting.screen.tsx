import { BlurBox, LinearGradientLayout } from '@/components';
import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { Button, Stack, Text } from 'tamagui';

export const GreetingScreen = memo(() => {
  const route = useRouter();
  const handlePressStart = useCallback(() => {
    route.push({ pathname: '/auth/auth', params: { authType: 'signUp' } });
  }, [route]);

  const handlePressLogin = useCallback(() => {
    route.push({ pathname: '/auth/auth', params: { authType: 'login' } });
  }, [route]);

  return (
    <LinearGradientLayout hasHeader>
      <Stack flex={1} justify="space-between" items="center" px="$size.x2" pt="$size.x15">
        <Stack width="$fluid" justify="center" gap="$size.x7">
          <Stack gap="$size.x2">
            <Text
              fontSize="$10"
              fontWeight="$900"
              color="$colors.lampYellow"
              shadowColor="$colors.lampYellow"
              shadowOpacity={1}
              shadowRadius={16}
              shadowOffset={{ width: 0, height: 2 }}>
              YOASOBI
            </Text>
            <Text fontSize="$8" fontWeight="$300" color="$colors.moonSoftWhite">
              일주일에 단 한 번, 새벽을 빌릴게요.
            </Text>
          </Stack>
          <BlurBox>
            <Stack gap="$size.x1">
              <Text fontSize="$6" color="$colors.moonSoftWhite">
                가볍게 시작해요.
              </Text>
              <Text fontSize="$5" color="$colors.cloudGray">
                요일을 정하고, 새벽에 산책해봐요.
              </Text>
            </Stack>
          </BlurBox>
        </Stack>
        <Stack width="$fluid" items="center" gap="$size.x3">
          <Button
            width="$fluid"
            height="auto"
            bg="$colors.moonSoftWhite"
            py="$size.x5"
            borderTopLeftRadius="$size.x5"
            borderTopRightRadius="$size.x5"
            borderBottomLeftRadius="$size.x5"
            borderBottomRightRadius="$size.x5"
            pressStyle={{
              bg: '$colors.moonSoftWhite',
              opacity: 0.8,
            }}
            onPress={handlePressStart}>
            <Text fontSize="$8" fontWeight="$800" color="$colors.midnightPurple">
              시작하기
            </Text>
          </Button>
          <Button
            width="$fluid"
            height="auto"
            bg="$colors.midnightPurple"
            borderWidth={1}
            borderColor="$colors.cloudGray"
            py="$size.x5"
            borderTopLeftRadius="$size.x5"
            borderTopRightRadius="$size.x5"
            borderBottomLeftRadius="$size.x5"
            borderBottomRightRadius="$size.x5"
            pressStyle={{
              bg: '$colors.midnightPurple',
              borderWidth: 1,
              borderColor: '$colors.cloudGray',
              opacity: 0.8,
            }}
            onPress={handlePressLogin}>
            <Text fontSize="$8" fontWeight="$800" color="$colors.moonSoftWhite">
              로그인
            </Text>
          </Button>
          <Text color="$colors.cloudGray">시작하기를 누르면 회원가입 화면으로 이동해요.</Text>
        </Stack>
      </Stack>
    </LinearGradientLayout>
  );
});

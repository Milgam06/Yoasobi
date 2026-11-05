import { Alert, DefaultLayout } from '@/components';
import { useAuth } from '@/providers';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { useDidUpdate } from 'rooks';
import { Button, Stack, Text } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export const SplashScreen = memo(() => {
  const route = useRouter();
  const { session, isReady, hasAppUserError, retryAppUser } = useAuth();
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState<boolean>(false);

  const handleLoadBackground = useCallback(() => {
    setIsBackgroundLoaded(true);
  }, []);

  useDidUpdate(() => {
    if (!isBackgroundLoaded || !isReady) {
      return;
    }
    const routeTimeout = setTimeout(() => {
      if (session) {
        route.replace('/(tabs)/home');
      } else {
        route.replace('/greeting/greeting');
      }
    }, 3000);

    return () => {
      clearTimeout(routeTimeout);
    };
  }, [isBackgroundLoaded, isReady, session]);

  return (
    <DefaultLayout isBlur onBackgroundLoad={handleLoadBackground}>
      {hasAppUserError && (
        <Alert
          isOpen={hasAppUserError}
          onClose={retryAppUser}
          isErrorAlert
          alertPadding="$size.x4"
          contentBorderRadius={12}>
          <Stack gap="$size.x3">
            <Text color="$colors.moonSoftWhite">프로필을 불러오지 못했어요. 다시 시도해 주세요.</Text>
            <Button height="$size.x10" onPress={retryAppUser}>
              <Text fontWeight="$700" color="$colors.lampYellow">
                재시도
              </Text>
            </Button>
          </Stack>
        </Alert>
      )}
      <Stack flex={1} justify="center" items="center" gap="$size.x2">
        <Stack
          width="auto"
          bg="$colors.midnightPurple"
          boxShadow="0 0 40px rgba(0, 0, 0, 0.2)"
          overflow="hidden"
          style={{ borderRadius: 60 }}
          opacity={isBackgroundLoaded ? 1 : 0}
          scale={isBackgroundLoaded ? 1 : 0.9}
          animation="lazy">
          <LinearGradient
            width="$fluid"
            colors={['#313252', '#FED896']}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            p="$size.x5">
            <Image source={require('@/assets/images/FullMoon.png')} style={{ width: 160, aspectRatio: 1 }} />
          </LinearGradient>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
});

import { DefaultLayout } from '@/components';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { useDidUpdate } from 'rooks';
import { Stack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export const SplashScreen = memo(() => {
  const route = useRouter();
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState<boolean>(false);

  const handleLoadBackground = useCallback(() => {
    setIsBackgroundLoaded(true);
  }, []);

  useDidUpdate(() => {
    if (!isBackgroundLoaded) {
      return;
    }
    const routeTimeout = setTimeout(() => {
      route.replace('/home/home');
    }, 3000);

    return () => {
      clearTimeout(routeTimeout);
    };
  }, [isBackgroundLoaded]);

  return (
    <DefaultLayout isBlur onBackgroundLoad={handleLoadBackground}>
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

SplashScreen.displayName = 'SplashScreen';

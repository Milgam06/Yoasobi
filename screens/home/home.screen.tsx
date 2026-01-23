import { DefaultLayout, Navbar } from '@/components';
import { memo, useCallback, useState } from 'react';
import { Stack, Text } from 'tamagui';

export const HomeScreen = memo(() => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState<boolean>(false);

  const handleLoadBackground = useCallback(() => {
    setIsBackgroundLoaded(true);
  }, []);
  return (
    <DefaultLayout isBlur onBackgroundLoad={handleLoadBackground}>
      <Stack flex={1} justify="center" items="center" gap="$size.x2">
        <Text fontSize="$6" fontWeight="$800">
          Welcome to the Home Screen!
        </Text>
      </Stack>
      <Navbar />
    </DefaultLayout>
  );
});

HomeScreen.displayName = 'HomeScreen';

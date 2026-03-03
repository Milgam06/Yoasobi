import { BlurBox, Header } from '@/components';
import { memo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, Text } from 'tamagui';

export const GreetingScreen = memo(() => {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
      <Header />
      <Stack flex={1} justify="space-between" items="center" px="$size.x4">
        <Stack width="$fluid" justify="center" gap="$size.x3">
          <Stack gap="$size.x1_5">
            <Text fontSize="$10" fontWeight="$900" color="$colors.lampYellow">
              YOASOBI
            </Text>
            <Text fontSize="$6" fontWeight="$400" color="$colors.cloudGray">
              일주일에 단 한 번, 새벽을 빌려요.
            </Text>
          </Stack>
          <BlurBox>
            <Stack gap="$size.x1">
              <Text fontSize="$5" color="$colors.moonSoftWhite">
                가볍게 시작해요.
              </Text>
              <Text color="$colors.cloudGray">요일을 정하고, 새벽에 산책해봐요. 부담없이 짧게.</Text>
            </Stack>
          </BlurBox>
        </Stack>
      </Stack>
    </SafeAreaView>
  );
});

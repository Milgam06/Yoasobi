import { DefaultLayout } from '@/components';
import { memo } from 'react';
import { Stack, Text } from 'tamagui';

export const HistoryScreen = memo(() => {
  return (
    <DefaultLayout>
      <Stack flex={1} justify="center" items="center">
        <Text>History</Text>
      </Stack>
    </DefaultLayout>
  );
});

HistoryScreen.displayName = 'HistoryScreen';

import { DefaultLayout } from '@/components';
import { memo } from 'react';
import { Stack, Text } from 'tamagui';

export const HistoryScreen = memo(() => {
  return (
    <DefaultLayout isBlur hasHeader>
      <Stack flex={1} justify="center" items="center">
        <Text>History</Text>
      </Stack>
    </DefaultLayout>
  );
});

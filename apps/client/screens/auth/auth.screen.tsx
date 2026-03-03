import { DefaultLayout } from '@/components';
import { memo } from 'react';
import { Stack, Text } from 'tamagui';

export const AuthScreen = memo(() => {
  return (
    <DefaultLayout isBlur hasHeader>
      <Stack flex={1}>
        <Text>asdf</Text>
      </Stack>
    </DefaultLayout>
  );
});

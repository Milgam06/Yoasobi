import { DefaultLayout } from '@/components';
import { memo } from 'react';
import { Stack, Text } from 'tamagui';

export type IAuthScreenProps = {
  authType: 'login' | 'signUp';
};

export const AuthScreen = memo<IAuthScreenProps>(({ authType }) => {
  return (
    <DefaultLayout isBlur hasHeader>
      <Stack flex={1}>
        <Text>{authType}</Text>
      </Stack>
    </DefaultLayout>
  );
});

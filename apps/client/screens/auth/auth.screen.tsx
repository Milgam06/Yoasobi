import { BlurBox, LinearGradientLayout } from '@/components';
import { memo, useState } from 'react';
import { ScrollView, Stack, Text } from 'tamagui';

type IAuthType = 'login' | 'signUp';

export type IAuthScreenProps = {
  authType: IAuthType;
};

export const AuthScreen = memo<IAuthScreenProps>(({ authType }) => {
  const [currentAuthType, setCurrentAuthType] = useState<IAuthType>(authType);
  return (
    <LinearGradientLayout hasHeader>
      <ScrollView flex={1}>
        <Stack flex={1} items="center" px="$size.x2">
          <Stack width="$fluid" gap="$size.x2">
            <Text fontSize="$5" fontWeight="$600" color="$colors.moonSoftWhite">
              계정
            </Text>
            <BlurBox>
              <Stack flexDirection="row">
                <Stack flex={1}>
                  <Text>아이디</Text>
                </Stack>
                <Stack flex={1}>
                  <Text>비밀번호</Text>
                </Stack>
              </Stack>
            </BlurBox>
          </Stack>
        </Stack>
      </ScrollView>
    </LinearGradientLayout>
  );
});

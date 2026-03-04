import { BlurView } from 'expo-blur';
import { memo, ReactNode } from 'react';
import { GetThemeValueForKey, Stack } from 'tamagui';

type IBlurBoxProps = {
  px?: GetThemeValueForKey<'paddingHorizontal'> | number;
  py?: GetThemeValueForKey<'paddingVertical'> | number;
  children: ReactNode;
};

export const BlurBox = memo<IBlurBoxProps>(({ px = '$size.x6', py = '$size.x4', children }) => {
  return (
    <BlurView
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 0.6,
        borderColor: '#858090',
        boxShadow: '0 0 8px #858090',
      }}
      intensity={80}
      tint="dark">
      <Stack width="$fluid" px="$size.x6" py="$size.x4">
        {children}
      </Stack>
    </BlurView>
  );
});

import { memo } from 'react';
import { Stack, Text } from 'tamagui';

export const Header = memo(() => {
  return (
    <Stack width="$fluid" flexDirection="row" justify="space-between" items="center" px="$size.x5" pt="$size.x2">
      <Stack width="$fit" bg="$colors.midnightPurple" px="$size.x3" py="$size.x1_5" style={{ borderRadius: 24 }}>
        <Text fontSize="$5" fontWeight="$600" color="$colors.moonSoftWhite">
          YOASOBI
        </Text>
      </Stack>
    </Stack>
  );
});

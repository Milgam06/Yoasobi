import { memo } from 'react';
import { Stack } from 'tamagui';

export const Navbar = memo(() => {
  return <Stack width="$fluid" borderWidth={1} b={0}></Stack>;
});

Navbar.displayName = 'Navbar';

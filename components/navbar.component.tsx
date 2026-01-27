import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';

export const Navbar = memo((props: BottomTabBarProps) => {
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();

  const isSelectedItemHome = state.index === state.routes.findIndex(({ name }) => name === 'home');
  const isSelectedItemCalendar = state.index === state.routes.findIndex(({ name }) => name === 'calendar');

  return (
    <Stack
      width="$fluid"
      position="absolute"
      b={0}
      pt="$size.x2"
      pb={insets.bottom}
      flexDirection="row"
      justify="space-between"
      overflow="hidden">
      <Stack
        flex={1}
        justify="center"
        items="center"
        py="$size.x4"
        opacity={isSelectedItemHome ? 1 : 0.4}
        onPress={() => navigation.navigate('home')}
        animation="200ms"
        {...(isSelectedItemHome && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
        })}>
        <FontAwesomeIcon size={44} icon={faHome} color="#FDE8D6" />
      </Stack>
      <Stack
        flex={1}
        justify="center"
        items="center"
        py="$size.x4"
        opacity={isSelectedItemCalendar ? 1 : 0.4}
        onPress={() => navigation.navigate('history')}
        animation="200ms"
        {...(isSelectedItemCalendar && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
        })}>
        <FontAwesomeIcon size={44} icon={faCalendarDays} color="#FDE8D6" />
      </Stack>
    </Stack>
  );
});

Navbar.displayName = 'Navbar';

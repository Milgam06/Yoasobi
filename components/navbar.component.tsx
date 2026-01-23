import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memo, useCallback, useMemo, useState } from 'react';
import { Stack } from 'tamagui';

type INavbarItem = 'HOME' | 'CALENDAR';

export const Navbar = memo(() => {
  const [selectedItem, setSelectedItem] = useState<INavbarItem>('HOME');
  const { isSelectedItemHome, isSelectedItemCalendar } = useMemo(() => {
    const isSelectedItemHome = selectedItem === 'HOME';
    const isSelectedItemCalendar = selectedItem === 'CALENDAR';
    return { isSelectedItemHome, isSelectedItemCalendar };
  }, [selectedItem]);

  const handlePressNavbarItem = useCallback((item: INavbarItem) => {
    setSelectedItem(item);
  }, []);
  return (
    <Stack width="$fluid" flexDirection="row" justify="space-between">
      <Stack
        flex={1}
        justify="center"
        items="center"
        py="$size.x5"
        opacity={isSelectedItemHome ? 1 : 0.6}
        onPress={() => handlePressNavbarItem('HOME')}
        animation="200ms"
        {...(isSelectedItemHome && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -2 },
        })}>
        <FontAwesomeIcon size={44} icon={faHome} color="#FDE8D6" />
      </Stack>
      <Stack
        flex={1}
        justify="center"
        items="center"
        py="$size.x5"
        opacity={isSelectedItemCalendar ? 1 : 0.6}
        onPress={() => handlePressNavbarItem('CALENDAR')}
        animation="200ms"
        {...(isSelectedItemCalendar && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -2 },
        })}>
        <FontAwesomeIcon size={44} icon={faCalendarDays} color="#FDE8D6" />
      </Stack>
    </Stack>
  );
});

Navbar.displayName = 'Navbar';

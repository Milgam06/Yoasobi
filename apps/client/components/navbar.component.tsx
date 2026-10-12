import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BottomTabBarHeightCallbackContext, BottomTabBarProps } from 'expo-router/js-tabs';
import { memo, RefObject, useContext } from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, Text } from 'tamagui';

type INavbarProps = BottomTabBarProps & {
  blurTarget?: RefObject<View | null>;
};

export const Navbar = memo((props: INavbarProps) => {
  const { state, navigation, blurTarget } = props;
  const insets = useSafeAreaInsets();
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);

  const isSelectedItemHome = state.index === state.routes.findIndex(({ name }) => name === 'home');
  const isSelectedItemHistory = state.index === state.routes.findIndex(({ name }) => name === 'history');

  return (
    <Stack
      width="$fluid"
      position="absolute"
      b={0}
      onLayout={(event) => onHeightChange?.(event.nativeEvent.layout.height)}
      pt="$size.x2"
      pb={insets.bottom}
      flexDirection="row"
      justify="space-between"
      borderTopLeftRadius="$size.x6"
      borderTopRightRadius="$size.x6"
      overflow="hidden">
      <BlurView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        blurTarget={blurTarget}
        blurMethod="dimezisBlurViewSdk31Plus"
        intensity={30}
        tint="dark"
      />
      <Stack
        flex={1}
        justify="center"
        items="center"
        pt="$size.x2"
        opacity={isSelectedItemHome ? 1 : 0.4}
        onPress={() => navigation.navigate('home')}
        animation="200ms"
        gap="$size.x1"
        {...(isSelectedItemHome && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
        })}>
        <FontAwesomeIcon size={24} icon={faHome} color="#FDE8D6" />
        <Text fontSize="$2" fontWeight="$800" color="$colors.moonSoftWhite">
          HOME
        </Text>
      </Stack>
      <Stack
        flex={1}
        justify="center"
        items="center"
        pt="$size.x2"
        opacity={isSelectedItemHistory ? 1 : 0.4}
        onPress={() => navigation.navigate('history')}
        animation="200ms"
        gap="$size.x1"
        {...(isSelectedItemHistory && {
          shadowColor: '$colors.lampYellow',
          shadowOpacity: 1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
        })}>
        <FontAwesomeIcon size={24} icon={faCalendarDays} color="#FDE8D6" />
        <Text fontSize="$2" fontWeight="$800" color="$colors.moonSoftWhite">
          HISTORY
        </Text>
      </Stack>
    </Stack>
  );
});

import { memo, ReactNode, useCallback } from 'react';
import { OpaqueColorValue } from 'react-native';
import { AlertDialog, GetThemeValueForKey, Stack } from 'tamagui';

type IAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  alertPadding?: GetThemeValueForKey<'padding'> | number;
  contentBorderRadius?: number;
  bg?: GetThemeValueForKey<'backgroundColor'> | OpaqueColorValue;
  isErrorAlert?: boolean;
  children: ReactNode;
};

export const Alert = memo<IAlertProps>(
  ({
    isOpen,
    onClose,
    alertPadding = '$size.x2',
    contentBorderRadius = 0,
    bg = '$colors.midnightPurple',
    isErrorAlert = false,
    children,
  }) => {
    const handlePressCloseAlert = useCallback(() => {
      onClose();
    }, [onClose]);
    return (
      <AlertDialog open={isOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="200ms"
            enterStyle={{ opacity: 1 }}
            exitStyle={{ opacity: 0 }}
            bg="rgba(0,0,0,0.4)"
            onPress={handlePressCloseAlert}
          />
          <AlertDialog.Content
            bg={bg}
            borderWidth={1}
            borderColor={isErrorAlert ? '$colors.emberRed' : '$colors.cloudGray'}
            p={alertPadding}
            y={0}
            style={{ borderRadius: contentBorderRadius }}
            enterStyle={{
              scale: 0.96,
              y: 20,
            }}
            animation="200ms">
            <Stack>{children}</Stack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  },
);

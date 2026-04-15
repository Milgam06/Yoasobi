import { memo, ReactNode, useCallback } from 'react';
import { OpaqueColorValue } from 'react-native';
import { AlertDialog, GetThemeValueForKey, Stack } from 'tamagui';

type IAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  alertPadding?: GetThemeValueForKey<'padding'> | number;
  bg?: GetThemeValueForKey<'backgroundColor'> | OpaqueColorValue;
  children: ReactNode;
};

export const Alert = memo<IAlertProps>(
  ({ isOpen, onClose, alertPadding = '$size.x2', bg = '$colors.midnightPurple', children }) => {
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
            radiused={false}
            p={alertPadding}
            enterStyle={{
              scale: 0.98,
            }}
            animation="200ms">
            <Stack>{children}</Stack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  },
);

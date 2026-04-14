import { memo, ReactNode, useCallback } from 'react';
import { AlertDialog, GetThemeValueForKey, Stack } from 'tamagui';

type IAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  alertPadding?: GetThemeValueForKey<'padding'> | number;
  children: ReactNode;
};

export const Alert = memo<IAlertProps>(({ isOpen, onClose, alertPadding = '$size.x2', children }) => {
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
});

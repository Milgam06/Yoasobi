import { Alert, DefaultLayout, Navbar } from '@/components';
import { useAuth } from '@/providers';
import { BlurTargetView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { createRef, RefObject, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Button, Spinner, Stack, Text } from 'tamagui';

export default function TabsLayout() {
  const { session, isReady, hasAppUserError, retryAppUser } = useAuth();
  const blurTargets = useRef<Record<string, RefObject<View | null>>>({});

  const getBlurTarget = useCallback((routeKey: string) => {
    const existingRef = blurTargets.current[routeKey];
    if (existingRef) {
      return existingRef;
    }
    const newRef = createRef<View>();
    blurTargets.current[routeKey] = newRef;
    return newRef;
  }, []);

  if (!isReady) {
    return (
      <DefaultLayout>
        <Stack flex={1} justify="center" items="center">
          {hasAppUserError ? (
            <Alert isOpen onClose={retryAppUser} isErrorAlert alertPadding="$size.x4" contentBorderRadius={12}>
              <Stack gap="$size.x3">
                <Text color="$colors.moonSoftWhite">프로필을 불러오지 못했어요. 다시 시도해 주세요.</Text>
                <Button
                  height="$size.x10"
                  bg="$colors.lampYellow"
                  pressStyle={{
                    bg: '$colors.lampYellow',
                    opacity: 0.8,
                  }}
                  onPress={() => retryAppUser()}>
                  <Text fontWeight="$700" color="$colors.midnightPurple">
                    재시도
                  </Text>
                </Button>
              </Stack>
            </Alert>
          ) : (
            <Spinner size="large" color="$colors.moonSoftWhite" />
          )}
        </Stack>
      </DefaultLayout>
    );
  }

  if (!session) {
    return <Redirect href={{ pathname: '/greeting/greeting' }} />;
  }

  return (
    <Tabs
      screenLayout={({ children, route }) => (
        <BlurTargetView ref={getBlurTarget(route.key)} style={{ flex: 1 }}>
          {children}
        </BlurTargetView>
      )}
      tabBar={(props) => <Navbar {...props} blurTarget={getBlurTarget(props.state.routes[props.state.index].key)} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

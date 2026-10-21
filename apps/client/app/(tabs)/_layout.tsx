import { Navbar } from '@/components';
import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { createRef, RefObject, useCallback, useRef } from 'react';
import { View } from 'react-native';

export default function TabsLayout() {
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

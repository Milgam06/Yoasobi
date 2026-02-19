import { config } from '@/tamagui.config';
import {
  NotoSans_100Thin,
  NotoSans_200ExtraLight,
  NotoSans_300Light,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  NotoSans_800ExtraBold,
  NotoSans_900Black,
} from '@expo-google-fonts/noto-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDidUpdate } from 'rooks';
import { TamaguiProvider } from 'tamagui';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/libs';

preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSans_100Thin,
    NotoSans_200ExtraLight,
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_800ExtraBold,
    NotoSans_900Black,
  });

  useDidUpdate(() => {
    const isFontsLoadingActive = loaded || error;
    if (isFontsLoadingActive) {
      hideAsync();
    }
  }, [loaded, error]);

  const isFontsLoadingActive = !loaded && !error;
  if (isFontsLoadingActive) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <TamaguiProvider config={config}>
            <Stack screenOptions={{ headerShown: false }} />
          </TamaguiProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

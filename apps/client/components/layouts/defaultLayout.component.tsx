import { memo, ReactNode } from 'react';
import { ImageBackground } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';
import { Header } from '../header.component';

type IDefaultLayoutProps = {
  screenEdge?: Edges;
  isBlur?: boolean;
  hasHeader?: boolean;
  children: ReactNode;
  onBackgroundLoad?: () => void;
};

export const DefaultLayout = memo<IDefaultLayoutProps>(
  ({ screenEdge = ['top'], isBlur, children, onBackgroundLoad, hasHeader = false }) => {
    return (
      <ImageBackground
        source={require('@/assets/images/BackgroundImage.png')}
        blurRadius={isBlur ? 12 : 0}
        style={{ flex: 1, backgroundColor: '#100F1E' }}
        fadeDuration={0}
        resizeMode="cover"
        onLoadEnd={onBackgroundLoad}>
        <SafeAreaView edges={screenEdge} style={{ flex: 1 }}>
          {hasHeader && <Header />}
          <Stack flex={1} px="$size.x4">
            {children}
          </Stack>
        </SafeAreaView>
      </ImageBackground>
    );
  },
);

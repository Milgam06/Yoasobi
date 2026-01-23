import { memo, ReactNode } from 'react';
import { ImageBackground } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

type IDefaultLayoutProps = {
  screenEdge?: Edges;
  isBlur?: boolean;
  children: ReactNode;
  onBackgroundLoad?: () => void;
};

export const DefaultLayout = memo<IDefaultLayoutProps>(
  ({ screenEdge = ['top'], isBlur, children, onBackgroundLoad }) => {
    return (
      <ImageBackground
        source={require('@/assets/images/BackgroundImage.png')}
        blurRadius={isBlur ? 12 : 0}
        style={{ flex: 1, backgroundColor: '#100F1E' }}
        fadeDuration={0}
        resizeMode="cover"
        onLoadEnd={onBackgroundLoad}>
        <SafeAreaView edges={screenEdge} style={{ flex: 1 }}>
          {children}
        </SafeAreaView>
      </ImageBackground>
    );
  },
);

DefaultLayout.displayName = 'DefaultLayout';

import { memo, ReactNode } from 'react';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Header } from '../header.component';

type ILinearGradientLayoutProps = {
  screenEdge?: Edges;
  hasHeader?: boolean;
  colors?: string[];
  children: ReactNode;
};

export const LinearGradientLayout = memo<ILinearGradientLayoutProps>(
  ({ screenEdge = ['top', 'bottom'], hasHeader = true, colors = ['#1B1D37', '#313252', '#100F1E'], children }) => {
    return (
      <LinearGradient flex={1} start={[0, 0]} end={[1, 1]} colors={colors}>
        <SafeAreaView edges={screenEdge} style={{ flex: 1 }}>
          {hasHeader && <Header />}
          <Stack flex={1} px="$size.x4">
            {children}
          </Stack>
        </SafeAreaView>
      </LinearGradient>
    );
  },
);

import { defaultConfig } from '@tamagui/config/v4';
import { createFont, createTamagui, createTokens } from 'tamagui';

const tokens = createTokens({
  colors: {
    midnightPurple: '#313252',
    moonSoftWhite: '#FDE8D6',
    streetBlack: '#100F1E',
    lampYellow: '#FED896',
  },
  size: {
    true: 4,
    x0_25: 1,
    x0_5: 2,
    x1: 4,
    x1_5: 6,
    x2: 8,
    x3: 12,
    x4: 16,
    x5: 20,
    x6: 24,
    x7: 28,
    x8: 32,
    x9: 36,
    x10: 40,
    x11: 44,
    x12: 48,
    x13: 52,
    x14: 56,
    x15: 60,
    x16: 64,
    x17: 68,
    x18: 72,
    x19: 76,
    x20: 80,
    x21: 84,
    x22: 88,
    x23: 92,
    x24: 96,
    x25: 100,
    x30: 120,
    x35: 140,
    x37_5: 150,
    x40: 160,
    x45: 180,
    x50: 200,
    fluid: '100%',
    fit: 'auto',
  },
  zIndex: {
    true: 0,
    x1: 0,
    x2: 1,
    x3: 2,
    x4: 3,
    x5: 4,
    x6: 5,
    x7: 10,
    x8: 50,
    x9: 100,
    x10: 1000,
  },
});

const notoSansFont = createFont({
  family: 'NotoSans_400Regular',
  size: defaultConfig.fonts.body.size,
  lineHeight: defaultConfig.fonts.body.lineHeight,
  weight: {
    100: '100',
    200: '200',
    300: '300',
    400: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
    900: '900',
  },
  face: {
    100: { normal: 'NotoSans_100Thin' },
    200: { normal: 'NotoSans_200ExtraLight' },
    300: { normal: 'NotoSans_300Light' },
    400: { normal: 'NotoSans_400Regular' },
    500: { normal: 'NotoSans_500Medium' },
    600: { normal: 'NotoSans_600SemiBold' },
    700: { normal: 'NotoSans_700Bold' },
    800: { normal: 'NotoSans_800ExtraBold' },
    900: { normal: 'NotoSans_900Black' },
  },
});

export const config = createTamagui({
  ...defaultConfig,
  tokens: { ...defaultConfig.tokens, ...tokens },
  fonts: { ...defaultConfig.fonts, body: notoSansFont, heading: notoSansFont },
  media: {
    ...defaultConfig.media,
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    md: { maxWidth: 980 },
    gtMd: { minWidth: 980 + 1 },
    lg: { maxWidth: 1120 },
    gtLg: { minWidth: 1120 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  settings: { ...defaultConfig.settings, styleCompat: 'react-native' },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

import { TextStyle } from 'react-native';

/**
 * OptionPluse Typography Tokens
 * Font: Inter (loaded via expo-font or google fonts)
 */
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
} as const;

export const Typography = {
  // Display / Hero
  heroDisplay: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 52,
  } as TextStyle,

  heroDisplayLg: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 68,
  } as TextStyle,

  // Headlines
  headlineLg: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
  } as TextStyle,

  headlineMd: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
  } as TextStyle,

  headlineSm: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 24,
  } as TextStyle,

  // Title
  titleLg: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 22,
  } as TextStyle,

  titleMd: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  } as TextStyle,

  // Body
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
  } as TextStyle,

  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,

  bodySm: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // Label / Overline
  overline: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  } as TextStyle,

  overlineMd: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  } as TextStyle,

  labelSm: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  } as TextStyle,

  // Stat Numbers
  statLg: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,

  statMd: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,
} as const;

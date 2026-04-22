/**
 * OptionPluse Design Tokens — Color Palette
 * Derived from "Clinical Precisionist" Material You design system
 */
export const Colors = {
  // Brand
  primary: '#bc000a',
  primaryContainer: '#e2241f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  primaryFixedDim: '#ffb4aa',

  // Bullish Green (secondary)
  secondary: '#006e2a',
  secondaryContainer: '#5cfd80',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#00732c',
  secondaryFixedDim: '#3ce36a',

  // Neutral tertiary
  tertiary: '#5d5c5b',
  tertiaryContainer: '#757474',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#f7feff',

  // Surface hierarchy
  surface: '#f9f9fb',
  surfaceBright: '#f9f9fb',
  surfaceDim: '#d9dadc',
  surfaceContainer: '#eeeef0',
  surfaceContainerLow: '#f3f3f5',
  surfaceContainerHigh: '#e8e8ea',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHighest: '#e2e2e4',

  // On-surface
  onSurface: '#1a1c1d',
  onSurfaceVariant: '#5d3f3b',
  onBackground: '#1a1c1d',
  background: '#f9f9fb',

  // Outline
  outline: '#926f6a',
  outlineVariant: '#e7bdb7',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Inverse
  inverseSurface: '#2f3132',
  inverseOnSurface: '#f0f0f2',
  inversePrimary: '#ffb4aa',
  surfaceTint: '#c0000a',

  // Semantic aliases
  bullishBg: '#5cfd80',
  bullishText: '#00732c',
  bearishBg: '#ffdad6',
  bearishText: '#93000a',
  neutralBg: '#e8e8ea',
  neutralText: '#5d5c5b',

  // Transparent utilities
  primaryAlpha05: 'rgba(188, 0, 10, 0.05)',
  primaryAlpha10: 'rgba(188, 0, 10, 0.10)',
  primaryAlpha20: 'rgba(188, 0, 10, 0.20)',
  primaryAlpha30: 'rgba(188, 0, 10, 0.30)',
  secondaryAlpha30: 'rgba(0, 110, 42, 0.30)',
  secondaryAlpha40: 'rgba(0, 110, 42, 0.40)',
  secondaryAlpha60: 'rgba(0, 110, 42, 0.60)',
  shadowColor: 'rgba(26, 28, 29, 0.04)',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

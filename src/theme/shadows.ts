import { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

/**
 * OptionPluse Shadow / Elevation Tokens
 * Cross-platform shadows using both iOS and Android styles
 */
const shadow = (
  offsetY: number,
  blur: number,
  opacity: number,
): ViewStyle => {
  if (Platform.OS === 'android') {
    return { elevation: Math.round(blur / 4) };
  }
  return {
    shadowColor: '#1a1c1d',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur / 2,
  };
};

export const Shadows = {
  none: {} as ViewStyle,
  xs: shadow(1, 4, 0.04),
  sm: shadow(4, 12, 0.05),
  md: shadow(8, 24, 0.06),
  lg: shadow(12, 32, 0.07),
  bottomNav: {
    ...shadow(20, 50, 0.12),
  } as ViewStyle,
} as const;

/**
 * OptionPluse Border Radius Tokens
 */
export const Radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof Radius;

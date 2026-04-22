import { StyleSheet } from 'react-native';
import { Colors } from './colors';

/**
 * useTheme Hook
 * Returns the current theme object. In this implementation, it returns 
 * the static Colors object wrapped in a 'colors' property to match the
 * widespread usage pattern in the project: const { colors } = useTheme();
 */
export const useTheme = () => {
  return {
    colors: Colors,
  };
};

/**
 * useAppStyles Hook
 * A wrapper hook that injects the theme colors into a stylesheet factory.
 * @param useStylesFactory A function that takes current colors and returns a StyleSheet
 */
export const useAppStyles = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  useStylesFactory: (colors: typeof Colors) => T
) => {
  return useStylesFactory(Colors);
};

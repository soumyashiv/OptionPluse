import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'low' | 'accent';
  accentColor?: string;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  accentColor = Colors.primary,
  style,
  padding = Spacing.xl,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const isAccent = variant === 'accent';

  return (
    <View
      style={[
        styles.base,
        variant === 'default' && styles.default,
        variant === 'low' && styles.low,
        isAccent && [styles.accent, { borderLeftColor: accentColor }],
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.surfaceContainerLowest,
    ...Shadows.lg,
  },
  low: {
    backgroundColor: colors.surfaceContainerLow,
    ...Shadows.xs,
  },
  accent: {
    backgroundColor: colors.surfaceContainerLow,
    borderLeftWidth: 4,
  },
});

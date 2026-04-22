import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../theme';

interface StatCardProps {
  label: string;
  value: string;
  barWidth?: number; // 0–1 ratio
  barColor?: 'primary' | 'secondary';
  subtitle?: string;
  subtitleColor?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  barWidth,
  barColor = 'secondary',
  subtitle,
  subtitleColor,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const filledColor = barColor === 'primary' ? colors.primary : colors.secondary;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      {subtitle ? (
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={[styles.subtitle, subtitleColor ? { color: subtitleColor } : undefined]}>{subtitle}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}

      {barWidth !== undefined && (
        <View style={styles.trackContainer}>
          <View style={[styles.fill, { width: `${Math.min(barWidth * 100, 100)}%`, backgroundColor: filledColor }]} />
        </View>
      )}
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flex: 1,
  },
  label: {
    ...Typography.overline,
    color: colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  value: {
    ...Typography.statMd,
    color: colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    fontWeight: '600',
    color: colors.secondary,
  },
  trackContainer: {
    marginTop: Spacing.sm,
    height: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});

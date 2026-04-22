import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import type { ExpiryFilter } from '../../types';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius } from '../../theme';

interface FilterPillBarProps {
  filters: ExpiryFilter[];
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
}

export const FilterPillBar: React.FC<FilterPillBarProps> = ({
  filters,
  onSelect,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, containerStyle]}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          onPress={() => onSelect(filter.value)}
          style={[styles.pill, filter.isActive && styles.pillActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.pillText, filter.isActive && styles.pillTextActive]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: colors.surfaceContainer,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillText: {
    ...Typography.labelSm,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  pillTextActive: {
    color: colors.onPrimary,
  },
});

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import type { SentimentFilter, SentimentFilterOption } from '../../types';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius } from '../../theme';

const FILTER_OPTIONS: SentimentFilterOption[] = [
  { label: 'All', value: 'all' },
  { label: '🟢 Positive', value: 'positive' },
  { label: '🔴 Negative', value: 'negative' },
  { label: '⚪ Neutral', value: 'neutral' },
];

interface SentimentFilterBarProps {
  activeFilter: SentimentFilter;
  onSelect: (filter: SentimentFilter) => void;
  containerStyle?: ViewStyle;
}

export const SentimentFilterBar: React.FC<SentimentFilterBarProps> = ({
  activeFilter,
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
      {FILTER_OPTIONS.map((opt) => {
        const isActive = opt.value === activeFilter;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[styles.pill, isActive && styles.pillActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    ...Typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  pillTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
});

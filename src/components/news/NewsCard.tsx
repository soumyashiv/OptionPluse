import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge, Card } from '../common';
import type { NewsItem } from '../../types';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius } from '../../theme';

interface NewsCardProps {
  item: NewsItem;
  onPress?: (item: NewsItem) => void;
}

const SENTIMENT_EMOJI: Record<NewsItem['sentiment'], string> = {
  positive: '🟢',
  negative: '🔴',
  neutral: '⚪',
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress?.(item)}>
      <Card style={styles.card} padding={Spacing.base}>
        {/* Top row: source + time + sentiment badge */}
        <View style={styles.topRow}>
          <Text style={styles.source}>{item.source}</Text>
          <View style={styles.rightRow}>
            <Text style={styles.sentiment}>{SENTIMENT_EMOJI[item.sentiment]}</Text>
            <Badge sentiment={item.sentiment} label={(item.sentiment || 'NEUTRAL').toUpperCase()} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {/* Summary */}
        <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{item.publishedAt}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  source: {
    ...Typography.overline,
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sentiment: {
    fontSize: 14,
  },
  title: {
    ...Typography.titleLg,
    color: colors.onSurface,
    marginBottom: Spacing.sm,
  },
  summary: {
    ...Typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  timestamp: {
    ...Typography.labelSm,
    color: colors.outline,
    fontSize: 10,
  },
});

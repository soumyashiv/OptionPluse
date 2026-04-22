import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, SectionLabel } from '../common';
import type { ExecutionInsight } from '../../types';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius } from '../../theme';

interface InsightCardProps {
  insights: ExecutionInsight[];
}

export const InsightCard: React.FC<InsightCardProps> = ({ insights }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <Card variant="accent" accentColor={colors.primary} padding={Spacing.xl}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="lightbulb" size={22} color={colors.primary} />
        <Text style={styles.title}>Execution Insight</Text>
      </View>

      {/* Insight items */}
      <View style={styles.list}>
        {insights.map((item, idx) => (
          <View key={idx} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.headlineSm,
    color: colors.onSurface,
  },
  list: {
    gap: Spacing.md,
  },
  item: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: Radius.md,
    padding: Spacing.base,
  },
  itemTitle: {
    ...Typography.titleMd,
    color: colors.onSurface,
    marginBottom: Spacing.xs,
  },
  itemBody: {
    ...Typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});

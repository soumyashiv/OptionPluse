import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge, Card, SectionLabel } from '../common';
import type { Sentiment, MarketLevel } from '../../types';
import { Colors, Spacing, Typography } from '../../theme';

interface SentimentHeroCardProps {
  sentiment: Sentiment;
  intradayChangePercent: number;
  vix: number;
  description: string;
  resistance: MarketLevel;
  support: MarketLevel;
}

const SENTIMENT_CONFIG = {
  BULLISH: { label: 'BULLISH', textColor: Colors.onSurface, badgeVariant: 'bullish' as const },
  BEARISH: { label: 'BEARISH', textColor: Colors.primary, badgeVariant: 'bearish' as const },
  SIDEWAYS: { label: 'SIDEWAYS', textColor: Colors.onSurfaceVariant, badgeVariant: 'stat' as const },
};

export const SentimentHeroCard: React.FC<SentimentHeroCardProps> = ({
  sentiment,
  intradayChangePercent,
  vix,
  description,
  resistance,
  support,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const cfg = SENTIMENT_CONFIG[sentiment];
  const changeSign = intradayChangePercent >= 0 ? '+' : '';

  return (
    <View style={styles.row}>
      {/* Hero card — BULLISH / BEARISH / SIDEWAYS */}
      <Card style={styles.heroCard} padding={Spacing['2xl']}>
        {/* Decorative orb */}
        <View style={styles.orb} pointerEvents="none" />

        <SectionLabel style={styles.overline}>Current Market Sentiment</SectionLabel>
        <Text style={[styles.heroText, { color: cfg.textColor }]}>{cfg.label}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>

        <View style={styles.badgeRow}>
          <Badge
            variant={cfg.badgeVariant}
            label={`${changeSign}${intradayChangePercent.toFixed(1)}% INTRADAY`}
          />
          <Badge variant="stat" label={`VIX: ${vix.toFixed(2)}`} />
        </View>
      </Card>

      {/* Resistance & Support column */}
      <View style={styles.levelColumn}>
        <LevelCard type="resistance" level={resistance} />
        <LevelCard type="support" level={support} />
      </View>
    </View>
  );
};

// ─── Internal Level Card ──────────────────────────────────────────────────

interface LevelCardProps {
  type: 'resistance' | 'support';
  level: MarketLevel;
}

const LevelCard: React.FC<LevelCardProps> = ({ type, level }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const isResistance = type === 'resistance';
  
  return (
    <Card style={styles.levelCard} padding={Spacing.xl}>
      <View style={styles.levelHeader}>
        <SectionLabel>{isResistance ? 'Resistance Ceiling' : 'Support Floor'}</SectionLabel>
        <MaterialIcons
          name={isResistance ? 'keyboard-double-arrow-up' : 'keyboard-double-arrow-down'}
          size={20}
          color={isResistance ? colors.primary : colors.secondary}
        />
      </View>
      <Text style={styles.levelPrice}>
        ₹{level.price.toLocaleString('en-IN')}
      </Text>
      <Text style={[styles.levelLabel, { color: isResistance ? colors.primary : colors.secondary }]}>
        {level.label}
      </Text>
    </Card>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  heroCard: {
    flex: 2,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryAlpha05,
  },
  overline: {
    marginBottom: Spacing.sm,
  },
  heroText: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 48,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Spacing.base,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  levelColumn: {
    flex: 1,
    gap: Spacing.base,
  },
  levelCard: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  levelPrice: {
    ...Typography.statLg,
    color: colors.onSurface,
    marginBottom: 2,
  },
  levelLabel: {
    ...Typography.bodySm,
    fontWeight: '500',
  },
});

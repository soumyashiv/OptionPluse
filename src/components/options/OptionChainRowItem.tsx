import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet } from 'react-native';
import type { OptionChainRow as OptionChainRowType } from '../../types';
import { Colors, Spacing, Typography } from '../../theme';

interface OptionChainRowProps {
  row: OptionChainRowType;
  isAtm?: boolean;
}

const formatOI = (oi: number): string => {
  if (oi >= 1_000_000) return `${(oi / 1_000_000).toFixed(1)}M`;
  if (oi >= 1_000) return `${(oi / 1_000).toFixed(0)}K`;
  return String(oi);
};

const formatChange = (change: number): string => {
  const sign = change > 0 ? '+' : '';
  return `${sign}${formatOI(change)}`;
};

export const OptionChainRowItem: React.FC<OptionChainRowProps> = ({ row, isAtm }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const callHighlight = row.highlightSide === 'call';
  const putHighlight = row.highlightSide === 'put';

  return (
    <View style={[styles.row, isAtm && styles.atmRow]}>
      {/* Call OI */}
      <View style={[styles.cell, styles.callCell, callHighlight && styles.callHighlight]}>
        <Text style={[styles.oiValue, callHighlight && styles.callHighlightText]}>
          {formatOI(row.callOI)}
        </Text>
        <Text style={[styles.changeValue, row.callOIChange >= 0 ? styles.positive : styles.negative]}>
          {formatChange(row.callOIChange)}
        </Text>
      </View>

      {/* Strike */}
      <View style={styles.strikeCell}>
        {isAtm && <View style={styles.atmDot} />}
        <Text style={[styles.strikeText, isAtm && styles.atmStrikeText]}>{row.strike}</Text>
      </View>

      {/* Put OI */}
      <View style={[styles.cell, styles.putCell, putHighlight && styles.putHighlight]}>
        <Text style={[styles.oiValue, putHighlight && styles.putHighlightText]}>
          {formatOI(row.putOI)}
        </Text>
        <Text style={[styles.changeValue, row.putOIChange >= 0 ? styles.positive : styles.negative]}>
          {formatChange(row.putOIChange)}
        </Text>
      </View>
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  atmRow: {
    backgroundColor: colors.primaryAlpha05,
  },
  cell: {
    flex: 2,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
  },
  callCell: {
    alignItems: 'flex-start',
  },
  putCell: {
    alignItems: 'flex-end',
  },
  callHighlight: {
    backgroundColor: colors.secondaryContainer + '40',
    borderRadius: 4,
    paddingVertical: 4,
  },
  putHighlight: {
    backgroundColor: colors.primaryAlpha10,
    borderRadius: 4,
    paddingVertical: 4,
  },
  callHighlightText: { color: colors.secondary, fontWeight: '700' },
  putHighlightText: { color: colors.primary, fontWeight: '700' },
  strikeCell: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  atmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  strikeText: {
    ...Typography.titleMd,
    color: colors.onSurface,
  },
  atmStrikeText: {
    color: colors.primary,
    fontWeight: '700',
  },
  oiValue: {
    ...Typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  changeValue: {
    ...Typography.labelSm,
    fontSize: 10,
    marginTop: 2,
  },
  positive: { color: colors.secondary },
  negative: { color: colors.primary },
});

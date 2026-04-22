import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { OptionChainRowItem } from './OptionChainRowItem';
import type { OptionChainRow } from '../../types';
import { Colors, useTheme, useAppStyles, Spacing, Typography } from '../../theme';

interface OptionChainTableProps {
  rows: OptionChainRow[];
  atmStrike: number;
}

const HEADER_COLS = ['CALL OI', 'STRIKE', 'PUT OI'];

export const OptionChainTable: React.FC<OptionChainTableProps> = ({ rows, atmStrike }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <View style={styles.container}>
      {/* Sticky-style header */}
      <View style={styles.headerRow}>
        {HEADER_COLS.map((col) => (
          <Text key={col} style={[styles.headerText, col === 'STRIKE' && styles.centerText]}>
            {col}
          </Text>
        ))}
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.strike)}
        renderItem={({ item }) => (
          <OptionChainRowItem row={item} isAtm={item.strike === atmStrike} />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
  },
  headerText: {
    flex: 2,
    ...Typography.overline,
    color: colors.onSurfaceVariant,
  },
  centerText: {
    flex: 1,
    textAlign: 'center',
  },
});

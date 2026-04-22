import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet } from 'react-native';
import { Card, SectionLabel } from '../common';
import type { VolumeDeltaBar } from '../../types';
import { Colors, Spacing, Typography } from '../../theme';

interface VolumeDeltaChartProps {
  data: VolumeDeltaBar[];
}

const CHART_HEIGHT = 160;

export const VolumeDeltaChart: React.FC<VolumeDeltaChartProps> = ({ data }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const maxOI = Math.max(...data.flatMap((d) => [d.callOI, d.putOI]), 1);

  return (
    <Card style={styles.card} padding={Spacing.xl}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Volume Delta Distribution</Text>
          <SectionLabel style={styles.subtitle}>Strike-wise Institutional Bias</SectionLabel>
        </View>
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
            <Text style={styles.legendLabel}>CALLS</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendLabel}>PUTS</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={[styles.chart, { height: CHART_HEIGHT }]}>
        {data.map((bar) => {
          const callH = (bar.callOI / maxOI) * CHART_HEIGHT;
          const putH = (bar.putOI / maxOI) * CHART_HEIGHT;
          return (
            <View key={bar.strike} style={styles.barGroup}>
              {/* Call bar (green) */}
              <View style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: callH,
                      backgroundColor: colors.secondary,
                    },
                  ]}
                />
              </View>
              {/* Put bar (red) */}
              <View style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: putH,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.strikeLabel}>{bar.strike}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  card: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
  },
  title: {
    ...Typography.headlineSm,
    color: colors.onSurface,
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...Typography.labelSm,
    fontWeight: '700',
    color: colors.onSurface,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 1,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT,
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  strikeLabel: {
    width: '100%',
    textAlign: 'center',
    ...Typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: Spacing.xs,
    fontSize: 9,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Line } from 'react-native-svg';
import { Colors, Radius, Shadows } from '../../theme';

const VB_W = 350;
const VB_H = 130;
const CURVE = `M0 115 C 60 115, 100 112, 150 100 C 200 88, 230 70, 270 42 C 290 28, 300 20, 310 16`;
const AREA  = `${CURVE} L310 ${VB_H} L0 ${VB_H} Z`;
const CROSSHAIR_X = 310;

import { MarketSummaryResponse } from '../../api/types';

interface VelocityChartCardProps {
  velocityData?: any;
}

export const VelocityChartCard: React.FC<VelocityChartCardProps> = ({ velocityData }) => {
  // Use mock values if no data is provided (e.g. before data finishes loading entirely)
  const current = velocityData?.current ?? 74;
  const status = velocityData?.status ?? 'HIGH GREED';
  const change = velocityData?.change ?? '+12% from previous week';
  const speed = velocityData?.speed ?? 'Acceleration';
  const trendLabel = velocityData?.trend === 'bullish' ? 'Bullish' : velocityData?.trend === 'bearish' ? 'Bearish' : 'Neutral';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{current}%</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeOverline}>CURRENT</Text>
              <Text style={styles.badgeText}>{status}</Text>
            </View>
            <View style={styles.phaseContainer}>
              <Text style={styles.phaseOverline}>MARKET{'\n'}PHASE</Text>
            </View>
          </View>
          <View style={styles.subtextRow}>
            <Text style={styles.subtext}>{change}</Text>
            <Text style={styles.subtextAccent}>{speed}</Text>
          </View>
        </View>
        <View style={styles.phaseValueContainer}>
          <Text style={styles.phaseText}>{trendLabel}</Text>
        </View>
      </View>

      <View style={styles.chartMockContainer}>
        <View style={styles.chartTooltipWrapper}>
          <View style={styles.chartTooltip}>
            <Text style={styles.tooltipText}>OCT 14 : 74% • HIGH GREED</Text>
          </View>
        </View>

        <View style={styles.chartArea}>
          <Svg width="100%" height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.18" />
                <Stop offset="1" stopColor={Colors.primary} stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Path d={AREA} fill="url(#areaGrad)" />
            <Path d={CURVE} fill="none" stroke={Colors.primary} strokeWidth="2" />
            <Line x1={CROSSHAIR_X} y1={0} x2={CROSSHAIR_X} y2={VB_H} stroke={Colors.primary} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
          </Svg>
          <View style={styles.dataPointDotWrapper}>
            <View style={styles.dataPointDot} />
          </View>
          <View style={styles.chartBaseline} />
        </View>

        <View style={styles.timeLabelsRow}>
          {['15 SEP', '22 SEP', '29 SEP', '06 OCT', 'CURRENT'].map((lbl, i) => (
            <Text key={i} style={styles.timeLabel}>{lbl}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  value: {
    fontSize: 44,
    fontWeight: '800',
    color: '#1A1C1D',
    letterSpacing: -1,
  },
  badgeContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverline: { fontSize: 7, fontWeight: '800', color: '#FFFFFF', lineHeight: 9 },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF', lineHeight: 11 },
  phaseContainer: { justifyContent: 'center' },
  phaseOverline: {
    fontSize: 8, fontWeight: '700', color: 'rgba(95, 63, 59, 0.35)', letterSpacing: 0.8, lineHeight: 11,
  },
  phaseValueContainer: { alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 4 },
  phaseText: { fontSize: 13, fontWeight: '700', color: Colors.primary, lineHeight: 17 },
  subtextRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  subtext: { fontSize: 11, color: 'rgba(95, 63, 59, 0.55)', fontStyle: 'italic' },
  subtextAccent: { fontSize: 11, fontWeight: '700', fontStyle: 'italic', color: Colors.primary },
  chartMockContainer: { marginTop: 16 },
  chartTooltipWrapper: { alignItems: 'flex-end', marginBottom: 8, paddingRight: 4 },
  chartTooltip: {
    backgroundColor: '#1A1C1D', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
    ...Shadows.md,
  },
  tooltipText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  chartArea: { height: VB_H, position: 'relative' },
  dataPointDotWrapper: {
    position: 'absolute', left: '88%', top: '12%', width: 8, height: 8, marginLeft: -4, marginTop: -4, zIndex: 10,
  },
  dataPointDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: '#FFFFFF', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4,
  },
  chartBaseline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(95, 63, 59, 0.08)' },
  timeLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  timeLabel: { fontSize: 8, fontWeight: '700', color: 'rgba(95, 63, 59, 0.3)', letterSpacing: 0.3 },
});

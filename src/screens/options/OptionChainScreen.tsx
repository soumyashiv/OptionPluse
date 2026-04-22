import React, { useState } from 'react';
import { useTheme, useAppStyles } from '../../theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Spacing } from '../../theme';
import { AppBar } from '../../components/common/AppBar';
import { useOptionChain } from '../../api/hooks/useOptionChain';
import { useMarketSummary } from '../../api/hooks/useMarketSummary';
import { useMarket } from '../../context/MarketContext';
import type { OptionChainScreenProps } from '../../types';
import type { OptionChainRow } from '../../api/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmtOI = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};
const fmtChange = (n: number): string => {
  const abs = Math.abs(n);
  return `${n >= 0 ? '+' : '-'}${fmtOI(abs)}`;
};

type FilterMode = 'all' | 'calls' | 'puts';

// ── Component ─────────────────────────────────────────────────────────────────

export const OptionChainScreen: React.FC<OptionChainScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const [filter, setFilter] = useState<FilterMode>('all');
  const { market } = useMarket();

  const { data: chainData, isLoading, isError, refetch, isFetching } = useOptionChain(market);
  const { data: summaryData } = useMarketSummary(market);

  const atmStrike = summaryData?.atm_strike ?? null;
  const pcr       = summaryData?.pcr ?? null;
  const mktDir    = summaryData?.market_direction ?? 'sideways';
  const mktPcr    = summaryData?.pcr ?? 1;

  // Apply filter
  const rows: OptionChainRow[] = (() => {
    const all = chainData?.data ?? [];
    if (filter === 'calls') return all.filter(r => r.call_coi > 0);
    if (filter === 'puts')  return all.filter(r => r.put_coi > 0);
    return all;
  })();

  return (
    <View style={styles.root}>
      <AppBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Spot Price Header ─────────────────── */}
        <View style={styles.spotSection}>
          <Text style={styles.spotLabel}>NIFTY 50 · Option Chain</Text>
          {summaryData?.atm_strike ? (
            <>
              <View style={styles.spotRow}>
                <Text style={styles.spotPrice}>
                  {summaryData.atm_strike.toLocaleString('en-IN')}
                </Text>
                <View style={[
                  styles.spotChangePill,
                  { backgroundColor: mktDir === 'bullish'
                      ? colors.secondaryContainer
                      : mktDir === 'bearish'
                      ? colors.primaryContainer
                      : colors.surfaceContainer
                  }
                ]}>
                  <Text style={[
                    styles.spotChangeText,
                    { color: mktDir === 'bullish'
                        ? colors.onSecondaryContainer
                        : mktDir === 'bearish'
                        ? colors.onPrimary
                        : colors.onSurfaceVariant
                    }
                  ]}>
                    {mktDir === 'bullish' ? '↑' : mktDir === 'bearish' ? '↓' : '→'}
                    {' '}{(mktDir || 'UNKNOWN').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.spotSubLabel}>
                ATM: ₹{summaryData.atm_strike.toLocaleString('en-IN')}
              </Text>
            </>
          ) : (
            <Text style={styles.spotPrice}>—</Text>
          )}
        </View>

        {/* ── Sentiment Score Card ─────────────────── */}
        {summaryData && (
          <View style={styles.sentimentScoreCard}>
            <View style={styles.sentimentScoreTop}>
              <View>
                <Text style={styles.sentimentScoreLabel}>SENTIMENT SCORE</Text>
                <Text style={styles.sentimentScoreValue}>
                  PCR {mktPcr.toFixed(2)}
                </Text>
              </View>
              <View style={[
                styles.sentimentBadge,
                { backgroundColor: mktDir === 'bullish'
                    ? colors.secondaryContainer
                    : mktDir === 'bearish'
                    ? colors.primaryContainer
                    : colors.surfaceContainer
                }
              ]}>
                <Text style={[
                  styles.sentimentBadgeText,
                  { color: mktDir === 'bullish'
                      ? colors.onSecondaryContainer
                      : mktDir === 'bearish'
                      ? colors.onPrimary
                      : colors.onSurface
                  }
                ]}>
                  {(mktDir || 'UNKNOWN').toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.sentimentProgressBg}>
              <View style={[
                styles.sentimentProgressFill,
                {
                  width: `${Math.min(100, Math.max(5, (mktPcr / 2) * 100))}%`,
                  backgroundColor: mktDir === 'bullish'
                    ? colors.secondary
                    : mktDir === 'bearish'
                    ? colors.primary
                    : colors.onSurfaceVariant,
                }
              ]} />
            </View>
            <Text style={styles.sentimentHint}>
              {mktPcr >= 1
                ? 'Put OI dominates – bullish market bias'
                : 'Call OI dominates – bearish market bias'}
            </Text>
          </View>
        )}

        {/* ── Filter Pills ──────────────────────── */}
        <View style={styles.filterRow}>
          {(['all', 'calls', 'puts'] as FilterMode[]).map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'ALL' : f === 'calls' ? 'CALL BUILDUP' : 'PUT BUILDUP'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Loading ───────────────────────────── */}
        {isLoading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {isError && !chainData && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.error }}>Option chain unavailable</Text>
          </View>
        )}

        {/* ── Table ────────────────────────────── */}
        {rows.length > 0 && (
          <>
            <Text style={{ textAlign: 'center', fontSize: 10, color: colors.onSurfaceVariant, marginBottom: Spacing.sm, letterSpacing: 0.5 }}>
              Tap any row for detailed strike analysis
            </Text>
            <View style={styles.tableCard}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <View style={styles.colGroup}>
                <Text style={styles.colLabel}>OI CHANGE</Text>
                <Text style={styles.colLabel}>OI (CALLS)</Text>
              </View>
              <View style={styles.strikeCol}>
                <Text style={styles.strikeLabelHeader}>STRIKE</Text>
              </View>
              <View style={styles.colGroup}>
                <Text style={styles.colLabel}>OI (PUTS)</Text>
                <Text style={styles.colLabel}>OI CHANGE</Text>
              </View>
            </View>

            {/* Rows */}
            {rows.map((row, idx) => {
              const isATM = atmStrike !== null && row.strike === atmStrike;
              const prevRow = rows[idx - 1];
              const showATMBanner =
                atmStrike !== null &&
                prevRow &&
                prevRow.strike < atmStrike &&
                row.strike >= atmStrike;

              const callHighlight = row.call_oi > row.put_oi;
              const putHighlight  = row.put_oi > row.call_oi;

              return (
                <View key={row.strike}>
                  {showATMBanner && (
                    <View style={styles.atmRow}>
                      <View style={styles.atmPill}>
                        <View style={styles.atmDot} />
                        <Text style={styles.atmText}>At the Money (ATM)</Text>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.tableRow, isATM && styles.atmRowHighlight]}
                    onPress={() => navigation.navigate('StrikeAnalysis', { strike: row.strike, symbol: market })}
                    activeOpacity={0.7}
                  >
                    {callHighlight && <View style={styles.leftBar} />}
                    {putHighlight  && <View style={styles.rightBar} />}

                    {/* Call side */}
                    <View style={[styles.colGroup, callHighlight && styles.callHighlightBg]}>
                      <Text style={[styles.cellVal, { color: row.call_coi >= 0 ? colors.secondary : colors.error }]}>
                        {fmtChange(row.call_coi)}
                      </Text>
                      <Text style={[styles.cellVal, callHighlight && styles.boldCell]}>
                        {fmtOI(row.call_oi)}
                      </Text>
                    </View>

                    {/* Strike */}
                    <View style={styles.strikeCol}>
                      <View style={[styles.strikePill, isATM && styles.strikePillATM]}>
                        <Text style={[styles.strikeText, isATM && styles.strikeTextATM]}>
                          {row.strike.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>

                    {/* Put side */}
                    <View style={[styles.colGroup, putHighlight && styles.putHighlightBg]}>
                      <Text style={[styles.cellVal, putHighlight && styles.boldCell]}>
                        {fmtOI(row.put_oi)}
                      </Text>
                      <Text style={[styles.cellVal, { color: row.put_coi >= 0 ? colors.secondary : colors.error }]}>
                        {fmtChange(row.put_coi)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          </>
        )}

        {/* ── Sentiment Summary ─────────────────── */}
        {summaryData && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>MARKET DIRECTION</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>
                  {mktDir === 'bullish' ? '↑' : mktDir === 'bearish' ? '↓' : '→'}
                </Text>
                <View style={styles.bullishPill}>
                  <Text style={styles.bullishPillText}>
                    {(mktDir || 'UNKNOWN').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>PCR (OI)</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{pcr?.toFixed(2) ?? '—'}</Text>
                <Text style={styles.trendArrow}>
                  {pcr !== null ? (pcr >= 1 ? '↑' : '↓') : ''}
                </Text>
              </View>
              <Text style={styles.summaryHint}>
                {pcr !== null && pcr >= 1
                  ? 'Put dominance — bullish bias'
                  : 'Call dominance — bearish bias'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>NEWS SENTIMENT</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>
                  {summaryData.news_sentiment === 'positive'
                    ? '🟢'
                    : summaryData.news_sentiment === 'negative'
                    ? '🔴'
                    : '⚪'}
                </Text>
              </View>
              <Text style={styles.summaryHint}>
                {(summaryData.news_sentiment || 'UNKNOWN').toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = (colors: any) =>
  StyleSheet.create({
    root:    { flex: 1, backgroundColor: colors.surface },
    scroll:  { flex: 1 },
    content: { paddingTop: 80, paddingBottom: 32, paddingHorizontal: Spacing.base, gap: Spacing.xl },

    // Spot
    spotSection:     { alignItems: 'center', marginTop: Spacing.base },
    spotLabel:       { fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 2.5, color: colors.onSurfaceVariant, marginBottom: 4 },
    spotRow:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    spotPrice:       { fontSize: 40, fontWeight: '900', letterSpacing: -1.5, color: colors.onSurface },
    spotChangePill:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    spotChangeText:  { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    spotSubLabel:    { fontSize: 10, color: colors.onSurfaceVariant, marginTop: 4 },

    // Sentiment Score Card
    sentimentScoreCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: 12,
      padding: Spacing.base,
      gap: Spacing.md,
      elevation: 2,
      shadowColor: 'rgba(26,28,29,1)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.03,
      shadowRadius: 20,
    },
    sentimentScoreTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    sentimentScoreLabel:  { fontSize: 9, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: colors.onSurfaceVariant },
    sentimentScoreValue:  { fontSize: 26, fontWeight: '900', letterSpacing: -1, color: colors.onSurface, marginTop: 2 },
    sentimentBadge:       { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
    sentimentBadgeText:   { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    sentimentProgressBg:  { height: 6, backgroundColor: colors.surfaceContainer, borderRadius: 3, overflow: 'hidden' },
    sentimentProgressFill:{ height: '100%', borderRadius: 3 },
    sentimentHint:        { fontSize: 10, color: colors.onSurfaceVariant },

    // Filter pills
    filterRow:        { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' },
    filterPill:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.surfaceContainerLowest },
    filterPillActive: { backgroundColor: colors.primary },
    filterText:       { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: colors.onSurface },
    filterTextActive: { color: colors.onPrimary },

    // Table
    tableCard:   { backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden', elevation: 2 },
    tableHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, backgroundColor: colors.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainer },
    colGroup:    { flex: 2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 4 },
    colLabel:    { fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: colors.onSurfaceVariant, textAlign: 'center' },
    strikeCol:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
    strikeLabelHeader: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, color: colors.primary },
    tableRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainer, position: 'relative' },
    atmRowHighlight: { backgroundColor: `${colors.primaryAlpha05}` },
    leftBar:     { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.primary },
    rightBar:    { position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.secondary },
    callHighlightBg: { backgroundColor: colors.primaryAlpha05 },
    putHighlightBg:  { backgroundColor: 'rgba(0,110,42,0.05)' },
    cellVal:    { fontSize: 12, fontWeight: '500', color: colors.onSurface, textAlign: 'center' },
    boldCell:   { fontWeight: '900' },
    strikePill: { backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    strikePillATM:  { backgroundColor: colors.primary },
    strikeText:     { fontSize: 11, fontWeight: '900', color: colors.onSurface },
    strikeTextATM:  { color: colors.onPrimary },

    // ATM banner
    atmRow:    { paddingVertical: 8, backgroundColor: `${colors.surfaceContainerHighest}66`, alignItems: 'center' },
    atmPill:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceContainerLowest, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: `${colors.outlineVariant}1A` },
    atmDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
    atmText:   { fontSize: 8, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.5, color: colors.onSurfaceVariant },

    // Summary row
    summaryRow: { flexDirection: 'row', gap: Spacing.md },
    summaryCard: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: Spacing.md, borderWidth: 1, borderColor: `${colors.outlineVariant}1A`, gap: Spacing.xs },
    summaryLabel:    { fontSize: 7, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, color: colors.onSurfaceVariant },
    summaryValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.xs },
    summaryValue:    { fontSize: 26, fontWeight: '900', letterSpacing: -1, color: colors.onSurface },
    bullishPill:     { backgroundColor: colors.onSecondaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, marginBottom: 4 },
    bullishPillText: { fontSize: 7, fontWeight: '900', textTransform: 'uppercase', color: colors.secondaryContainer },
    trendArrow:  { fontSize: 18, color: colors.secondary, marginBottom: 4 },
    summaryHint: { fontSize: 9, color: colors.onSurfaceVariant, lineHeight: 14 },
  });

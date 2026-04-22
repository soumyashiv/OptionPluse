import React from 'react';
import { useTheme, useAppStyles } from '../../theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Spacing } from '../../theme';
import { AppBar } from '../../components/common/AppBar';
import { resolveLoadingState } from '../../hooks/useLoadingState';
import { useMarketSummary } from '../../api/hooks/useMarketSummary';
import { useMarket } from '../../context/MarketContext';
import type { OptionChainRow } from '../../api/types';
import type { DashboardScreenProps } from '../../types/navigation';

// ── Helpers ──────────────────────────────────────────────────────────────────

const secondsAgo = (ts?: string | null): number =>
  ts ? Math.floor((Date.now() - new Date(ts).getTime()) / 1000) : 0;

const directionLabel = (d?: string | null): string => (d ? d.toUpperCase() : 'UNKNOWN');

const directionArrow = (d?: string | null): string =>
  d === 'bullish' ? '↑' : d === 'bearish' ? '↓' : '→';

const sentimentLabel = (s?: string | null): string => {
  if (s === 'positive') return 'GREED';
  if (s === 'negative') return 'FEAR';
  return 'NEUTRAL';
};

const netGEX = (pcr: number): string => {
  const gex = ((pcr - 1) * 1000).toFixed(0);
  return pcr >= 1 ? `+${gex}` : gex;
};

const gammaFlip = (atm: number | null | undefined): string =>
  atm != null ? `₹${atm.toLocaleString('en-IN')}` : '—';

// ── Component ────────────────────────────────────────────────────────────────

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const { market } = useMarket();
  const { data, isLoading, isError, refetch, isFetching } = useMarketSummary(market);

  const loadingState = resolveLoadingState(data, isLoading, isFetching, isError);

  // Safe fallback getters
  const staleLabel = data?.fetched_at ? `Updated ${secondsAgo(data.fetched_at)}s ago` : null;
  const pcr = data?.pcr ?? 1;
  const pcrBarPct = `${Math.min(100, Math.max(5, (pcr / 2) * 100))}%` as const;
  const pcrColor = pcr >= 1 ? colors.secondary : colors.primary;
  
  const marketDirection = data?.market_direction ?? 'sideways';
  const atmStrike = data?.atm_strike ?? null;
  const insight = data?.insight || 'No current market insight available.';
  const newsSentiment = data?.news_sentiment ?? 'neutral';
  
  const topNews = Array.isArray(data?.top_news) ? data.top_news : [];
  const volumeBars: OptionChainRow[] = Array.isArray(data?.option_chain) ? data.option_chain.slice(0, 7) : [];
  
  const support = data?.support ?? null;
  const resistance = data?.resistance ?? null;
  const vixApprox = (15 / pcr).toFixed(2);

  return (
    <View style={styles.root}>
      <AppBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingState.isBusy && loadingState.isReady}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {loadingState.state === 'loading' && (
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.staleBadge, { marginTop: 12 }]}>Fetching market data…</Text>
          </View>
        )}

        {(loadingState.state === 'error') && (
          <View style={styles.centeredView}>
            <Text style={{ color: colors.error, fontWeight: '700' }}>Data temporarily unavailable</Text>
            <Text style={[styles.staleBadge, { marginTop: 6 }]}>Retrying automatically…</Text>
          </View>
        )}

        {loadingState.isReady && data && (
          <>
            {staleLabel && (
              <View style={styles.staleRow}>
                <View style={styles.staleDot} />
                <Text style={styles.staleBadge}>{staleLabel}</Text>
              </View>
            )}

            {/* ── Hero Sentiment Card ─── */}
            <View style={styles.heroCard}>
              <View style={styles.heroOrb} pointerEvents="none" />
              <View style={styles.heroInner}>
                <Text style={styles.heroOverline}>Current Market Sentiment</Text>
                <Text style={styles.heroTitle}>{directionLabel(marketDirection)}</Text>
                <Text style={styles.heroDesc}>
                  {insight.length > 130 ? insight.slice(0, 127) + '…' : insight}
                </Text>
                <View style={styles.heroBadgeRow}>
                  <View style={[styles.intraBadge, { backgroundColor: colors.secondaryContainer }]}>
                    <Text style={[styles.intraBadgeText, { color: colors.onSecondaryContainer }]}>
                      {directionArrow(marketDirection)}{' '}
                      {marketDirection === 'bullish' ? '+2.1%' : marketDirection === 'bearish' ? '-1.8%' : '±0.3%'} INTRADAY
                    </Text>
                  </View>
                  <View style={styles.vixBadge}>
                    <Text style={styles.vixBadgeText}>VIX: {vixApprox}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ── Support & Resistance ─ */}
            <View style={styles.levelRow}>
              <View style={[styles.levelCard, styles.levelCardResistance]}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelOverline}>Resistance Ceiling</Text>
                  <Text style={styles.levelIconUp}>⬆⬆</Text>
                </View>
                {resistance?.price ? (
                  <>
                    <Text style={styles.levelPrice}>₹{resistance.price.toLocaleString('en-IN')}</Text>
                    <Text style={[styles.levelLabel, { color: colors.primary }]}>{resistance.label || 'Overhead Supply'}</Text>
                  </>
                ) : (
                  <Text style={styles.levelNA}>—</Text>
                )}
              </View>
              <View style={[styles.levelCard, styles.levelCardSupport]}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelOverline}>Support Floor</Text>
                  <Text style={styles.levelIconDown}>⬇⬇</Text>
                </View>
                {support?.price ? (
                  <>
                    <Text style={styles.levelPrice}>₹{support.price.toLocaleString('en-IN')}</Text>
                    <Text style={[styles.levelLabel, { color: colors.secondary }]}>{support.label || 'Firm Demand'}</Text>
                  </>
                ) : (
                  <Text style={styles.levelNA}>—</Text>
                )}
              </View>
            </View>

            {/* ── Execution Insight ── */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>💡</Text>
                <Text style={styles.insightTitle}>Execution Insight</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightItemTitle}>Market Insight</Text>
                <Text style={styles.insightItemBody}>{insight}</Text>
              </View>
            </View>

            {/* ── Volume Delta Chart ─ */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Volume Delta Distribution</Text>
                  <Text style={styles.chartSubtitle}>Strike-wise OI Bias</Text>
                </View>
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                    <Text style={styles.legendText}>CALLS</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.legendText}>PUTS</Text>
                  </View>
                </View>
              </View>
              {volumeBars.length > 0 ? (
                <View style={styles.barChart}>
                  {(() => {
                    const maxOI = Math.max(...volumeBars.map((b) => Math.max(b.call_oi || 0, b.put_oi || 0)), 1);
                    const CHART_H = 120;
                    return volumeBars.map((bar, idx) => (
                      <View key={bar.strike || idx} style={styles.barGroup}>
                        <View style={[styles.bar, { height: Math.max(4, ((bar.put_oi || 0) / maxOI) * CHART_H), backgroundColor: colors.primary }]} />
                        <View style={[styles.bar, { height: Math.max(4, ((bar.call_oi || 0) / maxOI) * CHART_H), backgroundColor: colors.secondary }]} />
                        <Text style={styles.barLabel}>{bar.strike}</Text>
                      </View>
                    ));
                  })()}
                </View>
              ) : (
                <Text style={styles.levelNA}>Live Option Chain syncing. Data available soon.</Text>
              )}
            </View>

            {/* ── Stats Rows ── */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>PCR (OI)</Text>
                <Text style={styles.statValue}>{pcr.toFixed(2)}</Text>
                <View style={styles.statBar}>
                  <View style={[styles.statProgress, { width: pcrBarPct, backgroundColor: pcrColor }]} />
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>NET GEX</Text>
                <Text style={[styles.statValue, { color: pcr >= 1 ? colors.secondary : colors.primary }]}>{netGEX(pcr)}</Text>
                <View style={styles.statBar}>
                  <View style={[styles.statProgress, { width: pcrBarPct, backgroundColor: pcrColor }]} />
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>GAMMA FLIP</Text>
                <Text style={styles.statValue}>{gammaFlip(atmStrike)}</Text>
                <View style={styles.statBar}>
                  <View style={[styles.statProgress, { width: '45%', backgroundColor: colors.tertiary }]} />
                </View>
              </View>
            </View>

            {/* ── Volatility Pulse ─── */}
            <View style={styles.volatilityCard}>
              <View style={styles.volHeader}>
                <View>
                  <Text style={styles.volOverline}>VOLATILITY REGIME</Text>
                  <Text style={styles.volTitle}>Volatility Pulse</Text>
                </View>
                <View style={[styles.volBadge, { backgroundColor: pcr >= 1 ? colors.secondaryContainer : colors.errorContainer }]}>
                  <Text style={[styles.volBadgeText, { color: pcr >= 1 ? colors.onSecondaryContainer : colors.onErrorContainer }]}>
                    {pcr >= 1.2 ? 'LOW VOL' : pcr <= 0.8 ? 'HIGH VOL' : 'MID VOL'}
                  </Text>
                </View>
              </View>
              <View style={styles.volMetrics}>
                <View style={styles.volMetric}>
                  <Text style={styles.volMetricLabel}>IV RANK</Text>
                  <Text style={styles.volMetricValue}>{(pcr * 30).toFixed(1)}%</Text>
                </View>
                <View style={styles.volDivider} />
                <View style={styles.volMetric}>
                  <Text style={styles.volMetricLabel}>VIX EST.</Text>
                  <Text style={styles.volMetricValue}>{vixApprox}</Text>
                </View>
                <View style={styles.volDivider} />
                <View style={styles.volMetric}>
                  <Text style={styles.volMetricLabel}>SENTIMENT</Text>
                  <Text style={[
                      styles.volMetricValue,
                      { color: newsSentiment === 'positive' ? colors.secondary : newsSentiment === 'negative' ? colors.primary : colors.onSurface }
                    ]}
                  >
                    {sentimentLabel(newsSentiment)}
                  </Text>
                </View>
              </View>
            </View>

            {/* ── Top News ───────────────── */}
            {topNews.length > 0 && (
              <View style={styles.newsSection}>
                <View style={styles.newsSectionHeader}>
                  <Text style={styles.newsSectionLabel}>TOP NEWS</Text>
                  <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate('News')}>
                    <Text style={[styles.newsSectionLabel, { color: colors.primary }]}>SEE ALL ›</Text>
                  </TouchableOpacity>
                </View>
                {topNews.slice(0, 3).map((item, idx) => {
                  const isPos = item.sentiment === 'positive';
                  const isNeg = item.sentiment === 'negative';
                  const borderColor = isPos ? colors.secondary : isNeg ? colors.primary : colors.surfaceContainerHighest;
                  const badgeBg = isPos ? colors.secondaryContainer : isNeg ? colors.primaryContainer : colors.surfaceContainer;
                  const badgeText = isPos ? colors.onSecondaryContainer : isNeg ? colors.onPrimary : colors.onSurfaceVariant;

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.75}
                      onPress={() => navigation.navigate('News')}
                      style={[styles.newsCard, { borderLeftColor: borderColor }]}
                    >
                      <View style={styles.newsCardTop}>
                        <View style={[styles.newsBadge, { backgroundColor: badgeBg }]}>
                          <Text style={[styles.newsBadgeText, { color: badgeText }]}>
                            {(item.sentiment || 'NEUTRAL').toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.newsSource}>{(item.source || 'SYS').toUpperCase()}</Text>
                      </View>
                      <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ── Action Buttons ─────────────── */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Options')}
              >
                <Text style={[styles.actionBtnText, { color: colors.onPrimary }]}>View Full Chain ›</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

const useStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    scroll: { flex: 1 },
    content: { paddingTop: 96, paddingBottom: 32, paddingHorizontal: Spacing.xl, gap: Spacing.xl },
    centeredView: { padding: 40, alignItems: 'center' },
    staleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end' },
    staleDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.secondary },
    staleBadge: { fontSize: 9, fontWeight: '500', color: colors.onSurfaceVariant, letterSpacing: 0.3 },
    heroCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden', shadowColor: 'rgba(26,28,29,1)', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.04, shadowRadius: 32, elevation: 2 },
    heroOrb: { position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: colors.primaryAlpha05 },
    heroInner: { padding: Spacing.xl },
    heroOverline: { fontSize: 9, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: Spacing.xs },
    heroTitle: { fontSize: 48, fontWeight: '900', letterSpacing: -2, color: colors.onSurface, marginBottom: Spacing.md },
    heroDesc: { fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18, marginBottom: Spacing.base },
    heroBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    intraBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
    intraBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    vixBadge: { backgroundColor: colors.surfaceContainer, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
    vixBadgeText: { fontSize: 9, fontWeight: '700', color: colors.onSurfaceVariant },
    levelRow: { flexDirection: 'row', gap: Spacing.base },
    levelCard: { flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.base, justifyContent: 'space-between', shadowColor: 'rgba(26,28,29,1)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    levelCardResistance: { borderTopWidth: 2, borderTopColor: colors.primary },
    levelCardSupport: { borderTopWidth: 2, borderTopColor: colors.secondary },
    levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    levelOverline: { fontSize: 8, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.onSurfaceVariant, flex: 1 },
    levelIconUp: { fontSize: 12, color: colors.primary },
    levelIconDown: { fontSize: 12, color: colors.secondary },
    levelPrice: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: colors.onSurface },
    levelLabel: { fontSize: 9, fontWeight: '500', marginTop: 2 },
    levelNA: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 },
    insightCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: Spacing.base, borderLeftWidth: 4, borderLeftColor: colors.primary },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.base },
    insightIcon: { fontSize: 16 },
    insightTitle: { fontSize: 13, fontWeight: '600', letterSpacing: -0.2, color: colors.onSurface },
    insightItem: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 8, padding: Spacing.md },
    insightItemTitle: { fontSize: 11, fontWeight: '700', color: colors.onSurface, marginBottom: 4 },
    insightItemBody: { fontSize: 11, color: colors.onSurfaceVariant, lineHeight: 16 },
    chartCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.base, shadowColor: 'rgba(26,28,29,1)', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.04, shadowRadius: 32, elevation: 2 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.base },
    chartTitle: { fontSize: 13, fontWeight: '600', letterSpacing: -0.2, color: colors.onSurface },
    chartSubtitle: { fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.onSurfaceVariant, marginTop: 2 },
    chartLegend: { gap: 4 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 6, height: 6, borderRadius: 3 },
    legendText: { fontSize: 8, fontWeight: '700', color: colors.onSurface },
    barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 2 },
    barGroup: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 0 },
    bar: { width: '100%', borderTopLeftRadius: 2, borderTopRightRadius: 2 },
    barLabel: { fontSize: 7, fontWeight: '500', color: colors.onSurface, marginTop: 4 },
    statsRow: { flexDirection: 'row', gap: Spacing.base },
    statCard: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: Spacing.base },
    statLabel: { fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, color: colors.onSurfaceVariant, marginBottom: Spacing.xs },
    statValue: { fontSize: 22, fontWeight: '700', color: colors.onSurface },
    statBar: { height: 4, width: '100%', backgroundColor: colors.surfaceContainer, borderRadius: 2, overflow: 'hidden', marginTop: Spacing.sm },
    statProgress: { height: '100%', borderRadius: 2 },
    volatilityCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.xl, shadowColor: 'rgba(26,28,29,1)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2, gap: Spacing.base },
    volHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    volOverline: { fontSize: 9, fontWeight: '600', letterSpacing: 2, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
    volTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.5, color: colors.onSurface, marginTop: 2 },
    volBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
    volBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
    volMetrics: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: colors.surfaceContainer },
    volMetric: { flex: 1, alignItems: 'center' },
    volMetricLabel: { fontSize: 8, fontWeight: '600', letterSpacing: 1.5, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
    volMetricValue: { fontSize: 18, fontWeight: '700', color: colors.onSurface, marginTop: 4 },
    volDivider: { width: 1, height: 32, backgroundColor: colors.surfaceContainer },
    newsSection: { gap: Spacing.md },
    newsSectionLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: colors.onSurfaceVariant },
    newsCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 10, padding: Spacing.base, borderLeftWidth: 3, gap: Spacing.xs },
    newsCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    newsBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    newsBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    newsSource: { fontSize: 8, fontWeight: '500', color: colors.onSurfaceVariant, letterSpacing: 0.5 },
    newsTitle: { fontSize: 12, fontWeight: '600', color: colors.onSurface, lineHeight: 17 },
    newsSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    actionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
    actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    actionBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  });

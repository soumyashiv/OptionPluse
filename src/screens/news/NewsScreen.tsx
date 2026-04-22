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
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../../theme';
import { AppBar } from '../../components/common/AppBar';
import type { NewsScreenProps } from '../../types';
import { useNews } from '../../api/hooks/useNews';
import { useMarketSummary } from '../../api/hooks/useMarketSummary';
import type { SentimentType } from '../../api/types';

// Sentiment filter options
const SENTIMENT_FILTERS = [
  { label: 'ALL NEWS', value: undefined as SentimentType | undefined },
  { label: 'POSITIVE',  value: 'positive' as SentimentType },
  { label: 'NEGATIVE',  value: 'negative' as SentimentType },
  { label: 'NEUTRAL',   value: 'neutral'  as SentimentType },
] as const;

/** Map raw sentiment to Fear/Greed display label */
const toGreedLabel = (s: string): string => {
  if (s === 'positive') return 'GREED';
  if (s === 'negative') return 'FEAR';
  return 'NEUTRAL';
};

const timeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diffMs / 60_000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const openArticle = async (url?: string) => {
  if (!url) {
    Alert.alert('No link', 'This article has no URL attached.');
    return;
  }
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Cannot open', `Unable to open: ${url}`);
  }
};

// ── Component ─────────────────────────────────────────────────────────────────

export const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const insets = useSafeAreaInsets();

  const [activeSentiment, setActiveSentiment] = useState<SentimentType | undefined>(undefined);

  const {
    data: newsData,
    isLoading,
    isFetching,
    isError,
    refetch: refetchNews,
  } = useNews(activeSentiment);

  const {
    data: summaryData,
    refetch: refetchSummary,
  } = useMarketSummary();

  const newsItems = newsData?.items ?? [];

  const pcr             = summaryData?.pcr ?? 1;
  const bullishPct      = Math.min(99, Math.max(1, Math.round((pcr / 2) * 100)));
  const marketSentimentLabel = summaryData?.news_sentiment
    ? toGreedLabel(summaryData.news_sentiment)
    : '—';
  const marketDirection = summaryData?.market_direction ?? 'sideways';

  const handleRefresh = async () => {
    await Promise.all([refetchNews(), refetchSummary()]);
  };



  return (
    <View style={styles.root}>
      <AppBar />

      {/* Sticky Sentiment Filter Bar */}
      <View style={[styles.filterContainer, { top: insets.top + 64 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {SENTIMENT_FILTERS.map(f => (
            <TouchableOpacity
              key={f.label}
              onPress={() => setActiveSentiment(f.value)}
              activeOpacity={0.75}
              style={[
                styles.filterPill,
                activeSentiment === f.value && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeSentiment === f.value && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 125 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Sentiment Hero ────────────────────────── */}
        <View style={styles.sentimentRow}>
          {/* Left card */}
          <View style={styles.sentimentLeft}>
            <Text style={styles.sentimentOverline}>Market Sentiment</Text>
            <Text style={styles.sentimentTitle}>{marketSentimentLabel}</Text>
            <Text style={styles.sentimentDesc}>
              {summaryData?.insight ?? 'Loading market intelligence…'}
            </Text>
            <View style={styles.sentimentActions}>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE UPDATE</Text>
              </View>
            </View>
          </View>

          {/* Right gauge */}
          <View style={styles.gaugeCard}>
            <View style={styles.gaugeOuter}>
              <View style={styles.gaugeRing}>
                <View style={styles.gaugeInner}>
                  <Text style={styles.gaugeValue}>{bullishPct}%</Text>
                  <Text style={styles.gaugeLabel}>
                    {marketDirection === 'bullish'
                      ? 'Bullish'
                      : marketDirection === 'bearish'
                      ? 'Bearish'
                      : 'Neutral'}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.gaugeTitle}>Sentiment Index</Text>
            <Text style={styles.gaugeSubtitle}>PCR {pcr.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Feed Header ───────────────────────────── */}
        <View style={styles.feedHeader}>
          <View>
            <Text style={styles.feedTitle}>Real-time Feed</Text>
            <Text style={styles.feedSubtitle}>
              {newsData?.count ?? 0} market-relevant articles
            </Text>
          </View>
        </View>

        {/* ── Loading ───────────────────────────────── */}
        {isLoading && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.onSurfaceVariant, marginTop: 10, fontSize: 12 }}>
              Fetching latest news…
            </Text>
          </View>
        )}

        {/* ── Error ─────────────────────────────────── */}
        {isError && !newsItems.length && (
          <View style={{ padding: 32, alignItems: 'center', gap: 12 }}>
            <MaterialIcons name="wifi-off" size={32} color={colors.onSurfaceVariant} />
            <Text style={{ color: colors.error, fontWeight: '700', fontSize: 14 }}>
              Could not load news
            </Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, textAlign: 'center' }}>
              Check your backend is running and reachable
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{
                marginTop: 4,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 99,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ color: colors.onPrimary, fontWeight: '700', fontSize: 13 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── News Cards ────────────────────────────── */}
        <View style={styles.newsCards}>
          {newsItems.map((item, idx) => {
            const borderColor =
              item.sentiment === 'positive'
                ? colors.secondary
                : item.sentiment === 'negative'
                ? colors.primary
                : colors.surfaceContainerHighest;
            const badgeBg =
              item.sentiment === 'positive'
                ? colors.secondaryContainer
                : item.sentiment === 'negative'
                ? colors.primaryContainer
                : colors.surfaceContainerHighest;
            const badgeText =
              item.sentiment === 'positive'
                ? colors.onSecondaryContainer
                : item.sentiment === 'negative'
                ? colors.onPrimary
                : colors.onSurface;

            return (
              <TouchableOpacity
                key={`${item.title}-${idx}`}
                activeOpacity={item.url ? 0.75 : 1}
                onPress={() => openArticle(item.url)}
                style={[styles.newsCard, { borderLeftColor: borderColor }]}
              >
                <View style={styles.newsCardMeta}>
                  <View style={[styles.sentimentBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.sentimentBadgeText, { color: badgeText }]}>
                      {(item.sentiment || 'NEUTRAL').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.newsCategory}>MARKET NEWS</Text>
                </View>

                {/* Title */}
                <Text style={styles.newsTitle}>{item.title}</Text>

                {/* Footer */}
                <View style={styles.newsFooter}>
                  <View style={styles.newsMetaRow}>
                    <MaterialIcons
                      name="schedule"
                      size={10}
                      color={colors.onSurfaceVariant}
                    />
                    <Text style={styles.newsTime}>
                      {item.published_at ? timeAgo(item.published_at).toUpperCase() : 'NOW'}
                    </Text>
                    <Text style={styles.newsDot}>•</Text>
                    <Text style={styles.newsSource}>
                      {(item.source || 'SYS').toUpperCase()}
                    </Text>
                  </View>
                  {item.url ? (
                    <View style={styles.openLinkBtn}>
                      <MaterialIcons
                        name="open-in-new"
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

          {!isLoading && !newsItems.length && !isError && (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <MaterialIcons name="article" size={32} color={colors.onSurfaceVariant} />
              <Text style={{ color: colors.onSurfaceVariant, marginTop: 10 }}>
                No news available for this filter
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const useStyles = (colors: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface },
    filterContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 40,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainer,
      paddingVertical: 10,
    },
    filterScroll:    { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
    filterPill:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.surfaceContainerLowest },
    filterPillActive:{ backgroundColor: colors.primary, shadowColor: '#bc000a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 },
    filterText:      { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: colors.onSurface },
    filterTextActive:{ color: colors.onPrimary },
    scroll:  { flex: 1 },
    content: { paddingBottom: 40, paddingHorizontal: Spacing.xl, gap: Spacing.xl },

    // Sentiment Hero
    sentimentRow:  { flexDirection: 'row', gap: Spacing.base, alignItems: 'stretch' },
    sentimentLeft: { flex: 7, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.xl, justifyContent: 'space-between', elevation: 2 },
    sentimentOverline: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 2, color: colors.onSurfaceVariant, marginBottom: Spacing.xs },
    sentimentTitle:    { fontSize: 28, fontWeight: '700', letterSpacing: -1, color: colors.onSurface, marginBottom: Spacing.md },
    sentimentDesc:     { fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18, marginBottom: Spacing.xl },
    sentimentActions:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
    analyticsWrapper:  { borderRadius: 12, overflow: 'hidden' },
    analyticsBtn:      { paddingHorizontal: Spacing.base, paddingVertical: 10 },
    analyticsBtnText:  { fontSize: 12, fontWeight: '600', color: colors.onPrimary },
    liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
    liveText:{ fontSize: 9, fontWeight: '700', letterSpacing: 0.5, color: colors.secondary },

    // Gauge
    gaugeCard:  { flex: 5, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.base, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    gaugeOuter: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    gaugeRing:  { width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: colors.surfaceContainer, borderTopColor: colors.primary, borderRightColor: colors.primary, borderBottomColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    gaugeInner: { alignItems: 'center' },
    gaugeValue: { fontSize: 22, fontWeight: '900', letterSpacing: -1, color: colors.onSurface },
    gaugeLabel: { fontSize: 7, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, color: colors.onSurfaceVariant },
    gaugeTitle:    { fontSize: 11, fontWeight: '600', color: colors.onSurface },
    gaugeSubtitle: { fontSize: 10, color: colors.onSurfaceVariant, marginTop: 2 },

    // Feed Header
    feedHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    feedTitle:    { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: colors.onSurface },
    feedSubtitle: { fontSize: 11, color: colors.onSurfaceVariant, marginTop: 2 },

    // News Cards
    newsCards:    { gap: Spacing.xl },
    newsCard:     { backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: Spacing.xl, borderLeftWidth: 4, elevation: 2 },
    newsCardMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
    sentimentBadge:     { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
    sentimentBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
    newsCategory: { fontSize: 8, fontWeight: '500', letterSpacing: 1.5, color: colors.onSurfaceVariant },
    newsTitle:    { fontSize: 15, fontWeight: '700', lineHeight: 22, color: colors.onSurface, marginBottom: Spacing.sm },
    newsFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.base, borderTopWidth: 1, borderTopColor: colors.surfaceContainer },
    newsMetaRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
    newsTime:     { fontSize: 8, fontWeight: '700', color: colors.onSurfaceVariant, letterSpacing: 0.5 },
    newsDot:      { fontSize: 8, color: colors.surfaceDim },
    newsSource:   { fontSize: 8, fontWeight: '700', color: colors.onSurfaceVariant, letterSpacing: 0.5 },
    openLinkBtn:  { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  });

import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StrikeAnalysisScreenProps } from '../../types/navigation';
import { useMarketSummary } from '../../api/hooks/useMarketSummary';
import { useStrikeAnalysis } from '../../api/hooks/useStrikeAnalysis';
import { useMarket } from '../../context/MarketContext';

export const StrikeAnalysisScreen = ({ route, navigation }: StrikeAnalysisScreenProps) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const { market } = useMarket();
  const { strike = 22450, symbol = market } = route.params || {};

  const { data: summary, isLoading: isSummaryLoading } = useMarketSummary(symbol);
  const { data: strikeDataRoot, isLoading: isStrikeLoading } = useStrikeAnalysis(symbol, strike);

  const strikeData = strikeDataRoot?.data;

  const callOi = strikeData?.call_oi;
  const putOi = strikeData?.put_oi;
  const callCoi = strikeData?.call_coi;
  const putCoi = strikeData?.put_coi;

  if (isSummaryLoading || isStrikeLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Spot status
  const spotValue = summary?.atm_strike;
  const isAtm = spotValue === strike;
  const statusLabel = isAtm ? "ATM" : (strike > (spotValue ?? 0) ? "OTM" : "ITM");

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Strike: {strike.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.appBarDivider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.spotPriceCard}>
            <Text style={styles.heroOverline}>CURRENT SPOT PRICE</Text>
            <View style={styles.spotPriceRow}>
              <Text style={styles.spotPriceText}>
                {spotValue?.toLocaleString() ?? '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.statusCard, { backgroundColor: isAtm ? colors.primaryContainer : colors.secondaryContainer }]}>
            <Text style={styles.statusOverline}>STATUS</Text>
            <Text style={styles.statusText}>{statusLabel}</Text>
            <Text style={styles.statusSubtext}>
              {isAtm ? 'At The Money' : (statusLabel === 'OTM' ? 'Out of The Money' : 'In The Money')}
            </Text>
          </View>
        </View>

        {/* Side-by-Side Comparison Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <View style={styles.tableHeaderCol3}><Text style={styles.callsHeader}>CALLS</Text></View>
            <View style={styles.tableHeaderCol1}><Text style={styles.metricHeader}>METRIC</Text></View>
            <View style={styles.tableHeaderCol3}><Text style={styles.putsHeader}>PUTS</Text></View>
          </View>

          <View style={styles.tableBody}>
            {/* LTP */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{strikeData?.call_ltp?.toLocaleString() ?? '—'}</Text></View>
              <View style={styles.tableCol1}><Text style={styles.metricLabel}>LTP</Text></View>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{strikeData?.put_ltp?.toLocaleString() ?? '—'}</Text></View>
            </View>
            {/* IV */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{strikeData?.call_iv?.toFixed(1) ?? '—'}</Text></View>
              <View style={styles.tableCol1}><Text style={styles.metricLabel}>IMPL VOL</Text></View>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{strikeData?.put_iv?.toFixed(1) ?? '—'}</Text></View>
            </View>
            {/* Open Interest */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol3}><Text style={styles.rowTextBold}>{callOi?.toLocaleString() ?? '—'}</Text></View>
              <View style={styles.tableCol1}><Text style={styles.metricLabel}>OPEN INT.</Text></View>
              <View style={styles.tableCol3}><Text style={styles.rowTextBold}>{putOi?.toLocaleString() ?? '—'}</Text></View>
            </View>
            {/* Change in OI */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{callCoi?.toLocaleString() ?? '—'}</Text></View>
              <View style={styles.tableCol1}><Text style={styles.metricLabel}>CHG IN OI</Text></View>
              <View style={styles.tableCol3}><Text style={styles.rowText}>{putCoi?.toLocaleString() ?? '—'}</Text></View>
            </View>
          </View>
        </View>

        {/* Insight Box */}
        <View style={styles.insightBox}>
          <MaterialIcons name="lightbulb" size={24} color={colors.tertiary} style={{ marginTop: 2 }} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Market Insight</Text>
            <Text style={styles.insightText}>
              Traders should continually monitor the ratio of calls to puts. Rapid changes in Open Interest at this strike may indicate major institutional positioning.
            </Text>
          </View>
        </View>

        {/* Visualization Card */}
        <View style={styles.vizCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.vizImage} 
          />
          <View style={styles.vizOverlay}>
            <Text style={styles.vizOverline}>VOLATILITY METRICS</Text>
            <Text style={styles.vizTitle}>
              Call IV: {strikeData?.call_iv ? `${strikeData.call_iv.toFixed(1)}%` : '—'}  |  Put IV: {strikeData?.put_iv ? `${strikeData.put_iv.toFixed(1)}%` : '—'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  appBarTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appBarDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120, // Space for BottomNav
    gap: 32,
  },
  heroSection: {
    gap: 24,
  },
  spotPriceCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 32,
    shadowColor: '#1A1C1D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    justifyContent: 'center',
  },
  heroOverline: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  spotPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  spotPriceText: {
    fontFamily: 'Inter',
    fontSize: 40, // 5xl roughly
    fontWeight: '800',
    color: colors.onSurface,
    letterSpacing: -1,
  },
  statusCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOverline: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: '700',
    color: '#FFF',
  },
  statusSubtext: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  tableCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: '#1A1C1D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(233, 188, 182, 0.15)', // outline-variant/15
    backgroundColor: colors.surfaceContainerLow,
  },
  tableHeaderCol3: {
    flex: 3,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tableHeaderCol1: {
    flex: 1.5, // Giving slightly more space than strict 1-3-1 ratio for better text fit
    paddingVertical: 16,
    alignItems: 'center',
  },
  callsHeader: {
    fontFamily: 'Inter',
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  putsHeader: {
    fontFamily: 'Inter',
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  metricHeader: {
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  tableBody: {
    // border dividing happens per row
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(233, 188, 182, 0.1)',
  },
  tableCol3: {
    flex: 3,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tableCol1: {
    flex: 1.5,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 233, 230, 0.2)', // surface-container/20
  },
  metricLabel: {
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
    fontWeight: '500',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  rowText: {
    fontFamily: 'Inter',
    color: colors.onSurface,
    fontWeight: '600',
    fontSize: 14,
  },
  rowTextBold: {
    fontFamily: 'Inter',
    color: colors.onSurface,
    fontWeight: '700',
    fontSize: 14,
  },
  insightBox: {
    backgroundColor: 'rgba(0, 97, 145, 0.05)', // tertiary/5
    borderRadius: 12,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: 'Inter',
    color: colors.tertiary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  insightText: {
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 22,
  },
  vizCard: {
    height: 192, // h-48
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  vizImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vizOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  vizOverline: {
    fontFamily: 'Inter',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  vizTitle: {
    fontFamily: 'Inter',
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
});

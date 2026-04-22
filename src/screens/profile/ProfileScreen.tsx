import React, { useState, useEffect } from 'react';
import { useTheme, useAppStyles } from '../../theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Spacing } from '../../theme';
import { AppBar } from '../../components/common/AppBar';
import type { ProfileScreenProps } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';
import { supabase } from '../../lib/supabase';

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const { user, profile, refreshProfile, isGuest } = useAuth();
  const { market, setMarket } = useMarket();

  const [isUpdating,    setIsUpdating]    = useState(false);
  const [isSigningOut,  setIsSigningOut]  = useState(false);

  // Effect removed as default index is handled by MarketContext globally

  const updatePreference = async (updates: Record<string, unknown>) => {
    if (isGuest) {
      Alert.alert('Guest Mode', 'Sign in with a real account to save preferences.');
      return;
    }
    if (!user || isUpdating) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      if (refreshProfile) await refreshProfile();
    } catch (err: any) {
      console.error('[ProfileScreen] Failed to update preference:', err);
      Alert.alert('Error', 'Failed to save preference. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeIndex = (index: 'NIFTY' | 'BANKNIFTY') => {
    setMarket(index);
    updatePreference({ default_index: index });
  };

  const handleSignOut = async () => {
    if (isGuest) {
      Alert.alert('Guest Mode', 'You are using the app as a guest. No sign-in to undo.');
      return;
    }
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await supabase.auth.signOut();
              // RootNavigator will automatically switch to Auth screen
              // via its onAuthStateChange listener — no manual navigate needed
            } catch (e) {
              Alert.alert('Error', 'Could not sign out. Try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ],
    );
  };

  const displayName  = profile?.full_name || (isGuest ? 'Guest Trader' : 'Trader Profile');
  const displayEmail = user?.email || (isGuest ? 'guest@optionpluse.com' : '—');

  return (
    <View style={styles.root}>
      <AppBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header ─── */}
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.verifiedText}>
            {isGuest ? 'GUEST MODE' : 'VERIFIED'}
          </Text>
        </View>

        {/* ── Profile Card ──── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={{ width: '100%', height: '100%', borderRadius: 44 }}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="person" size={44} color={colors.onSurfaceVariant} />
              )}
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Edit Avatar', 'Profile photo upload coming soon!')}
            >
              <MaterialIcons name="edit" size={14} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>
          {isGuest && (
            <View style={[styles.guestBadge, { backgroundColor: colors.surfaceContainerHighest }]}>
              <MaterialIcons name="info-outline" size={12} color={colors.onSurfaceVariant} />
              <Text style={[styles.guestBadgeText, { color: colors.onSurfaceVariant }]}>
                Using guest session — real data requires Supabase login
              </Text>
            </View>
          )}
        </View>

        {/* ── Saving indicator ─────────────────────── */}
        {isUpdating && (
          <View style={styles.savingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.savingText, { color: colors.onSurfaceVariant }]}>
              Saving preference…
            </Text>
          </View>
        )}

        {/* ── Market Settings ─────────────────────── */}
        <Text style={styles.sectionLabel}>MARKET SETTINGS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.marketSettingsInner}>
            <View style={styles.settingsLeft}>
              <View style={styles.settingsIconBox}>
                <MaterialIcons name="analytics" size={20} color={colors.onSurface} />
              </View>
              <View>
                <Text style={styles.settingsTitle}>Default Index</Text>
                <Text style={styles.settingsSubtitle}>Primary view for terminal dashboard</Text>
              </View>
            </View>
            <View style={styles.indexBtnRow}>
              {(['NIFTY', 'BANKNIFTY'] as const).map(idx => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleChangeIndex(idx)}
                  disabled={isUpdating}
                  style={[styles.indexBtn, market === idx && styles.indexBtnActive]}
                  activeOpacity={0.8}
                >
                  {market === idx && (
                    <MaterialIcons name="check-circle" size={14} color={colors.primary} />
                  )}
                  <Text
                    style={[
                      styles.indexBtnText,
                      market === idx && styles.indexBtnTextActive,
                    ]}
                  >
                    {idx}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Account Security ─────────────────────── */}
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert('Two-Factor Authentication', '2FA setup coming in the next release.')
            }
          >
            <View style={styles.settingsLeft}>
              <View style={styles.settingsIconBox}>
                <MaterialIcons name="security" size={20} color={colors.onSurface} />
              </View>
              <Text style={styles.settingsTitle}>Two-Factor Authentication</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={`${colors.onSurfaceVariant}66`}
            />
          </TouchableOpacity>

          <View style={styles.dividerLine} />

          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert('Subscription Billing', 'Subscription management coming soon.')
            }
          >
            <View style={styles.settingsLeft}>
              <View style={styles.settingsIconBox}>
                <MaterialIcons name="receipt-long" size={20} color={colors.onSurface} />
              </View>
              <Text style={styles.settingsTitle}>Subscription Billing</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={`${colors.onSurfaceVariant}66`}
            />
          </TouchableOpacity>
        </View>

        {/* ── Sign Out ─────────────────────────────── */}
        <TouchableOpacity
          style={[styles.signOutBtn, isSigningOut && { opacity: 0.6 }]}
          onPress={handleSignOut}
          disabled={isSigningOut}
          activeOpacity={0.8}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <MaterialIcons name="logout" size={20} color={colors.error} />
          )}
          <Text style={styles.signOutText}>
            {isSigningOut ? 'Signing out…' : 'Sign Out of Account'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    root:    { flex: 1, backgroundColor: colors.surface },
    scroll:  { flex: 1 },
    content: { paddingTop: 96, paddingBottom: 32, paddingHorizontal: Spacing.xl, gap: Spacing.xl },

    profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    profileTitle:  { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: colors.onSurface },
    verifiedText:  { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: `${colors.primary}99`, textTransform: 'uppercase' },

    profileCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: 12,
      padding: Spacing['2xl'],
      alignItems: 'center',
      gap: Spacing.xs,
      shadowColor: 'rgba(26,28,29,1)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.04,
      shadowRadius: 32,
      elevation: 2,
      borderWidth: 1,
      borderColor: `${colors.outlineVariant}0D`,
    },
    avatarWrapper: { position: 'relative', marginBottom: Spacing.xs },
    avatar: {
      width: 88, height: 88, borderRadius: 44,
      backgroundColor: colors.surfaceContainerHigh,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 3, borderColor: colors.surface,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12, shadowRadius: 12, elevation: 4, overflow: 'hidden',
    },
    editBtn: {
      position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
      borderRadius: 14, backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
    },
    profileName:  { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: colors.onSurface },
    profileEmail: { fontSize: 12, fontWeight: '500', color: `${colors.onSurfaceVariant}B3` },
    guestBadge:   {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 4,
    },
    guestBadgeText: { fontSize: 10, fontWeight: '500' },

    savingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: -Spacing.md },
    savingText: { fontSize: 11 },

    sectionLabel: {
      fontSize: 10, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase',
      color: `${colors.onSurfaceVariant}99`, paddingHorizontal: 4, marginBottom: -Spacing.md,
    },
    settingsCard: {
      backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden',
      borderWidth: 1, borderColor: `${colors.outlineVariant}0D`,
      shadowColor: 'rgba(26,28,29,1)', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.02, shadowRadius: 20, elevation: 1,
    },
    settingsRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
    settingsLeft:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, flex: 1 },
    settingsIconBox:{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
    settingsTitle:   { fontSize: 14, fontWeight: '600', color: colors.onSurface },
    settingsSubtitle:{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 },
    toggleTrack:  { width: 46, height: 24, borderRadius: 12, backgroundColor: colors.surfaceContainerHighest, paddingHorizontal: 3, alignItems: 'flex-start', justifyContent: 'center' },
    toggleTrackOn:{ backgroundColor: colors.primary, alignItems: 'flex-end' },
    toggleThumb:  { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.surfaceContainerLowest, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    toggleThumbOn:{},
    dividerLine:  { height: 1, backgroundColor: colors.surfaceContainer, marginHorizontal: Spacing.lg },

    marketSettingsInner: { padding: Spacing.lg, gap: Spacing.base },
    indexBtnRow: { flexDirection: 'row', gap: Spacing.md },
    indexBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 11, borderRadius: 12,
      backgroundColor: colors.surfaceContainerLow, borderWidth: 2, borderColor: 'transparent',
    },
    indexBtnActive:     { backgroundColor: colors.primaryAlpha05, borderColor: colors.primary },
    indexBtnText:       { fontSize: 12, fontWeight: '600', color: colors.onSurface },
    indexBtnTextActive: { color: colors.primary, fontWeight: '700' },

    signOutBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: Spacing.sm, paddingVertical: 15, borderRadius: 12,
      borderWidth: 1, borderColor: `${colors.error}33`,
    },
    signOutText: { fontSize: 14, fontWeight: '700', color: colors.error },
  });

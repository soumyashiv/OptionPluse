import React, { useState } from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../../theme';
import type { SignInScreenProps } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <LinearGradient
            colors={['#bc000a', '#e2241f']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoBox}
          />
          <Text style={styles.logoText}>OPTIONPLUSE</Text>
        </View>

        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your credentials to access the terminal.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputRow, emailFocused && styles.inputRowFocused]}>
              <MaterialIcons
                name="alternate-email"
                size={20}
                color={emailFocused ? colors.primary : colors.outline}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="trader@optionpluse.com"
                placeholderTextColor={`${colors.outline}80`}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
            {emailFocused && <View style={styles.focusUnderline} />}
          </View>

          {/* Password */}
          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <TouchableOpacity onPress={() => Alert.alert('Recovery', 'Password recovery coming soon.')}>
                <Text style={styles.forgotLink}>FORGOT?</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputRow, pwFocused && styles.inputRowFocused]}>
              <MaterialIcons
                name="lock"
                size={20}
                color={pwFocused ? colors.primary : colors.outline}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.inputWithRight]}
                placeholder="••••••••••••"
                placeholderTextColor={`${colors.outline}80`}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                style={styles.rightIconBtn}
              >
                <MaterialIcons
                  name={secureText ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={colors.outline}
                />
              </TouchableOpacity>
            </View>
            {pwFocused && <View style={styles.focusUnderline} />}
          </View>

          {/* Remember Device */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRemember(!remember)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && (
                <MaterialIcons name="check" size={12} color={colors.onPrimary} />
              )}
            </View>
            <Text style={styles.rememberText}>Remember this device for 30 days</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.88} style={styles.signInBtnWrapper} disabled={loading}>
            <LinearGradient
              colors={['#bc000a', '#e2241f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.signInBtn, loading && { opacity: 0.8 }]}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.signInBtnText}>Sign In to Terminal</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>INSTITUTIONAL ACCESS</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75} onPress={() => Alert.alert('SSO', 'Google Sign-In coming soon.')}>
            <MaterialIcons name="language" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.socialBtnText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75} onPress={() => Alert.alert('Passkey', 'Passkey Login coming soon.')}>
            <MaterialIcons name="fingerprint" size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.socialBtnText}>Passkey</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Don't have an institutional account?{'\n'}
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            Apply for Trading Access
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
    justifyContent: 'center',
  },
  logoBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  logoText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3.5,
    color: colors.onSurface,
    textTransform: 'uppercase',
  },
  headerBlock: {
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  form: {
    gap: Spacing.xl,
  },
  fieldBlock: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  forgotLink: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  inputRowFocused: {
    backgroundColor: colors.surfaceContainer,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 14,
    color: colors.onSurface,
  },
  inputWithRight: {
    paddingRight: 48,
  },
  rightIconBtn: {
    position: 'absolute',
    right: 16,
    padding: 2,
  },
  focusUnderline: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: 2,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLowest,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  signInBtnWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: Spacing.xs,
    shadowColor: '#7f000a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
  },
  signInBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginTop: Spacing['3xl'],
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: `${colors.outlineVariant}50`,
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: colors.outline,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}35`,
    backgroundColor: colors.surfaceContainerLowest,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  footerText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing['3xl'],
    lineHeight: 22,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

import React, { useState } from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../theme';
import type { SignUpScreenProps } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Field Required', 'Please enter name, email and password.');
      return;
    }
    if (!terms) {
      Alert.alert('Terms Required', 'Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      Alert.alert('Success', 'Account created! You can now sign in.');
      navigation.navigate('SignIn');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Experience the future of asset management.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={[styles.inputRow, nameFocused && styles.inputRowFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Alexander Hamilton"
                placeholderTextColor={colors.outlineVariant}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
              <MaterialIcons
                name="person"
                size={18}
                color={colors.outlineVariant}
                style={styles.rightIcon}
              />
            </View>
            {nameFocused && <View style={styles.focusUnderline} />}
          </View>

          {/* Email */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputRow, emailFocused && styles.inputRowFocused]}>
              <TextInput
                style={styles.input}
                placeholder="alexander@optionpluse.com"
                placeholderTextColor={colors.outlineVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <MaterialIcons
                name="mail"
                size={18}
                color={colors.outlineVariant}
                style={styles.rightIcon}
              />
            </View>
            {emailFocused && <View style={styles.focusUnderline} />}
          </View>

          {/* Password */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>SECURE PASSWORD</Text>
            <View style={[styles.inputRow, pwFocused && styles.inputRowFocused]}>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor={colors.outlineVariant}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
              />
              <MaterialIcons
                name="lock"
                size={18}
                color={colors.outlineVariant}
                style={styles.rightIcon}
              />
            </View>
            {pwFocused && <View style={styles.focusUnderline} />}
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setTerms(!terms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
              {terms && (
                <MaterialIcons name="check" size={10} color={colors.onPrimary} />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSignUp} activeOpacity={0.88} style={styles.submitWrapper} disabled={loading}>
            <LinearGradient
              colors={['#bc000a', '#e2241f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.submitBtn, loading && { opacity: 0.8 }]}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Sign Up</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerArea}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <MaterialIcons name="language" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <MaterialIcons name="phone-iphone" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('SignIn')}
          >
            Sign In
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
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  headerBlock: {
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
  form: {
    gap: Spacing.xl,
  },
  fieldBlock: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: `${colors.onSurfaceVariant}B3`,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  inputRowFocused: {
    backgroundColor: colors.surfaceContainer,
    borderBottomColor: colors.primary,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurface,
  },
  rightIcon: {
    marginRight: 16,
  },
  focusUnderline: {
    height: 0, // handled via borderBottomColor on inputRow
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingTop: Spacing.xs,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.onSurface,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7f000a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  dividerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
  dividerText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginBottom: Spacing['2xl'],
  },
  socialBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

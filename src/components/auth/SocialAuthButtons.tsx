import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius, Shadows } from '../../theme';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onPasskeyPress?: () => void;
  onApplePress?: () => void;
  mode?: 'passkey' | 'apple'; // second button variant
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGooglePress,
  onPasskeyPress,
  onApplePress,
  mode = 'passkey',
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  return (
  <View style={styles.container}>
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.dividerText}>INSTITUTIONAL ACCESS</Text>
      <View style={styles.line} />
    </View>

    <View style={styles.row}>
      <TouchableOpacity style={styles.btn} onPress={onGooglePress} activeOpacity={0.75}>
        <MaterialIcons name="g-translate" size={18} color={colors.onSurface} />
        <Text style={styles.btnText}>Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={mode === 'passkey' ? onPasskeyPress : onApplePress}
        activeOpacity={0.75}
      >
        <MaterialIcons
          name={mode === 'passkey' ? 'fingerprint' : 'phone-iphone'}
          size={18}
          color={colors.onSurface}
        />
        <Text style={styles.btnText}>{mode === 'passkey' ? 'Passkey' : 'Apple'}</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: Spacing['3xl'],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
    opacity: 0.5,
  },
  dividerText: {
    ...Typography.overline,
    color: colors.outline,
    fontSize: 9,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  btnText: {
    ...Typography.titleMd,
    color: colors.onSurface,
    fontSize: 13,
  },
});

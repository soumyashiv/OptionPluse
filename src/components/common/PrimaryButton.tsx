import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, useTheme, useAppStyles, Spacing, Typography, Radius, Shadows } from '../../theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.button, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
          {icon && (
            <MaterialIcons name={icon} size={20} color={colors.onPrimary} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  disabled: {
    opacity: 0.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.titleMd,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});

import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

interface AppBarProps {
  onNotificationPress?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onNotificationPress }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.inner}>
        {/* Avatar + Brand */}
        <View style={styles.brandRow}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={16} color={colors.onSurfaceVariant} />
          </View>
          <Text style={styles.brandText}>OPTION PLUSE</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="notifications"
            size={24}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(249,249,251,0.80)',
    // iOS blur effect workaround — can add BlurView from expo-blur if available
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,28,29,0.05)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.7,
    color: colors.onSurface,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
});

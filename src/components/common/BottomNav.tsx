import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export type TabKey = 'Dashboard' | 'Options' | 'News' | 'Profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const TABS: TabItem[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'Options', label: 'Options', icon: 'query-stats' },
  { key: 'News', label: 'News', icon: 'article' },
  { key: 'Profile', label: 'Profile', icon: 'person' },
];

export const BottomNav: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]}>
      <View style={styles.pillContainer}>
        <View style={styles.inner}>
          {state.routes.map((route, index) => {
            const tabDef = TABS.find((t) => t.key === route.name);
            if (!tabDef) return null;
            const isActive = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.75}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
              >
                <MaterialIcons
                  name={tabDef.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive
                      ? styles.tabLabelActive
                      : styles.tabLabelInactive,
                  ]}
                >
                  {tabDef.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: '4%',
    right: '4%',
    alignItems: 'center',
    zIndex: 50,
  },
  pillContainer: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.70)'
      : 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 50,
    elevation: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 76,
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: 9999,
    opacity: 0.6,
  },
  tabItemActive: {
    backgroundColor: colors.surfaceContainerLow,
    opacity: 1,
    paddingHorizontal: Spacing.xl,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelInactive: {
    color: colors.onSurfaceVariant,
  },
});

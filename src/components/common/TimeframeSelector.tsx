import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../theme';

interface TimeframeSelectorProps {
  activeTimeframe: string;
  onSelect: (timeframe: string) => void;
  timeframes?: string[];
  style?: ViewStyle;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  activeTimeframe,
  onSelect,
  timeframes = ['1D', '1W', '1M', '3M', '1Y'],
  style,
}) => {
  return (
    <View style={[styles.outerContainer, style]}>
      <View style={styles.innerContainer}>
        {timeframes.map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[styles.button, activeTimeframe === tf && styles.buttonActive]}
            onPress={() => onSelect(tf)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, activeTimeframe === tf && styles.textActive]}>
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#FFF0EE',
    padding: 4,
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
  },
  innerContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  buttonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(95, 63, 59, 0.4)',
  },
  textActive: {
    color: Colors.primary,
  },
});

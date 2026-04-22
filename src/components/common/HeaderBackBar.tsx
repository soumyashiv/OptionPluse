import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme';

interface HeaderBackBarProps {
  title: string;
  onBackPress: () => void;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
}

export const HeaderBackBar: React.FC<HeaderBackBarProps> = ({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onBackPress} activeOpacity={0.7}>
        <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.iconButton} onPress={onRightPress} activeOpacity={0.7}>
        {rightIcon ? (
          <MaterialIcons name={rightIcon} size={24} color="#71717A" />
        ) : (
          <View style={{ width: 24 }} /> /* Spacer for alignment */
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
  },
  title: {
    ...Typography.titleMd,
    color: '#1A1C1D',
  },
  iconButton: {
    padding: Spacing.sm,
  },
});

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, useTheme, useAppStyles, Typography } from '../../theme';

interface SectionLabelProps {
  children: string;
  color?: string;
  style?: TextStyle;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  color = Colors.onSurfaceVariant,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);

  return (
    <Text style={[styles.label, { color }, style]}>
      {children}
    </Text>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  label: {
    ...Typography.overline,
  },
});

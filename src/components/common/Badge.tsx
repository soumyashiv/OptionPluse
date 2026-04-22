import React from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import type { SentimentTag } from '../../types';
import { Colors, Spacing, Typography } from '../../theme';

type BadgeVariant = 'bullish' | 'bearish' | 'neutral' | 'stat' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  sentiment?: SentimentTag;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SENTIMENT_STYLES: Record<SentimentTag, { bg: string; text: string; dot: string }> = {
  positive: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, dot: Colors.secondary },
  negative: { bg: Colors.bearishBg, text: Colors.bearishText, dot: Colors.primary },
  neutral: { bg: Colors.neutralBg, text: Colors.neutralText, dot: Colors.tertiary },
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'stat', sentiment, label, style, textStyle }) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  let bgColor: string = colors.surfaceContainer;
  let textColor: string = colors.onSurfaceVariant;

  if (sentiment) {
    bgColor = SENTIMENT_STYLES[sentiment].bg;
    textColor = SENTIMENT_STYLES[sentiment].text;
  } else if (variant === 'bullish') {
    bgColor = colors.secondaryContainer;
    textColor = colors.onSecondaryContainer;
  } else if (variant === 'bearish') {
    bgColor = colors.bearishBg;
    textColor = colors.bearishText;
  }

  return (
    <Text
      style={[
        styles.badge,
        { backgroundColor: bgColor, color: textColor },
        style,
        textStyle,
      ]}
    >
      {label}
    </Text>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  badge: {
    ...Typography.labelSm,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 9999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});

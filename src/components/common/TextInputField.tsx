import React, { useRef, useState } from 'react'; 
import { useTheme, useAppStyles } from "../../theme";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius } from '../../theme';

interface TextInputFieldProps extends TextInputProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  rightAction?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
  };
  error?: string;
  containerStyle?: ViewStyle;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  icon,
  rightAction,
  error,
  containerStyle,
  ...inputProps
}) => {
  const { colors } = useTheme();
  const styles = useAppStyles(useStyles);
  const [isFocused, setIsFocused] = useState(false);
  const underlineWidth = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(underlineWidth, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    inputProps.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(underlineWidth, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    inputProps.onBlur?.({} as any);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.outline}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, icon && styles.inputWithIcon, rightAction && styles.inputWithRight]}
          placeholderTextColor={colors.outline}
        />
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightIcon}>
            <MaterialIcons name={rightAction.icon} size={20} color={colors.outline} />
          </TouchableOpacity>
        )}
        {/* Animated focus underline */}
        <Animated.View
          style={[
            styles.underline,
            {
              width: underlineWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const useStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.overlineMd,
    color: colors.onSurfaceVariant,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.base,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    ...Typography.bodyMd,
    color: colors.onSurface,
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
  inputWithRight: {
    paddingRight: 44,
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.base,
    zIndex: 1,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    height: 2,
    backgroundColor: colors.primary,
    transform: [{ translateX: -0.5 }],
  },
  errorText: {
    ...Typography.bodySm,
    color: colors.error,
    marginLeft: Spacing.xs,
  },
});

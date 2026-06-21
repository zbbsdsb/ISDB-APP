import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {m3Shape} from '../../constants/m3-shape';

/**
 * M3 Button variants:
 *   filled  → Primary action, filled bg
 *   tonal   → Secondary action, container color
 *   outlined → Tertiary action, border only
 *   text    → Lowest emphasis, no bg/border
 *
 * Legacy aliases (kept for backward compat):
 *   primary  → filled
 *   secondary → tonal
 *   ghost    → text
 *   danger   → filled (error color)
 */

export type M3ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';
export type M3ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | M3ButtonVariant
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger';
  size?: M3ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const resolveVariant = (v: string): M3ButtonVariant => {
  switch (v) {
    case 'primary':
    case 'danger':
    case 'filled':
      return 'filled';
    case 'secondary':
    case 'tonal':
      return 'tonal';
    case 'outline':
    case 'outlined':
      return 'outlined';
    case 'ghost':
    case 'text':
      return 'text';
    default:
      return 'filled';
  }
};

const isDangerVariant = (v: string): boolean => v === 'danger';

export function Button({
  title,
  onPress,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const {colors} = useTheme();
  const m3Variant = resolveVariant(variant);
  const danger = isDangerVariant(variant);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  // ── Color resolution ──
  const getColors = () => {
    if (disabled) {
      return {
        bg: 'transparent',
        text: colors.onSurfaceVariant,
        border: colors.outline,
      };
    }
    switch (m3Variant) {
      case 'filled':
        return {
          bg: danger ? colors.error : colors.primary,
          text: danger ? colors.onError : colors.onPrimary,
          border: 'transparent',
        };
      case 'tonal':
        return {
          bg: colors.secondaryContainer,
          text: colors.onSecondaryContainer,
          border: 'transparent',
        };
      case 'outlined':
        return {
          bg: 'transparent',
          text: danger ? colors.error : colors.primary,
          border: danger ? colors.error : colors.outline,
        };
      case 'text':
        return {
          bg: 'transparent',
          text: danger ? colors.error : colors.primary,
          border: 'transparent',
        };
    }
  };

  // ── Size resolution ──
  const getSize = () => {
    switch (size) {
      case 'sm':
        return {py: 6, px: 12, fontSize: 14, minHeight: 32};
      case 'md':
        return {py: 10, px: 20, fontSize: 14, minHeight: 40};
      case 'lg':
        return {py: 14, px: 28, fontSize: 16, minHeight: 48};
    }
  };

  const c = getColors();
  const s = getSize();

  // ── Press animation ──
  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });

  // State layer opacity (M3: press = 0.12)
  const stateLayer = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  // Computed style object (avoids inline object literal in style prop)
  const computedButtonStyle = {
    backgroundColor: c.bg,
    borderColor: c.border,
    borderWidth: m3Variant === 'outlined' ? 1 : 0,
    paddingVertical: s.py,
    paddingHorizontal: s.px,
    minHeight: s.minHeight,
    borderRadius: m3Shape.small,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[
        styles.base,
        computedButtonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}>
      <Animated.View style={[styles.inner, {transform: [{scale}]}]}>
        {/* State layer overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.stateLayer,
            {backgroundColor: c.text, opacity: stateLayer},
          ]}
        />

        {/* Loading spinner */}
        {loading ? (
          <ActivityIndicator color={c.text} size="small" />
        ) : (
          <>
            {/* Left icon */}
            {icon && <>{icon}</>}

            {/* Text */}
            <Text
              style={[
                styles.label,
                {color: c.text, fontSize: s.fontSize},
                icon ? styles.labelWithIcon : null,
                textStyle,
              ]}>
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  labelWithIcon: {
    marginLeft: 8,
  },
  stateLayer: {
    borderRadius: m3Shape.small,
  },
});

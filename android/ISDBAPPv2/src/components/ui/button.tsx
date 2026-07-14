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
import {BrandGradient} from './gradient';

/**
 * Web-aligned Button.
 *   filled   → premium gradient (amber → coral), white text, glow  [.btn-premium]
 *   tonal    → glass surface + amber tint                            [.glass-pill]
 *   outlined → transparent + amber border
 *   text     → transparent, amber text
 *
 * Legacy aliases kept: primary→filled, secondary→tonal, outline→outlined,
 * ghost→text, danger→filled(error gradient).
 */
export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const resolveVariant = (v: string): ButtonVariant => {
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

const isDanger = (v: string) => v === 'danger';

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
  const v = resolveVariant(variant);
  const danger = isDanger(variant);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () =>
    Animated.spring(pressAnim, {toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4}).start();
  const handlePressOut = () =>
    Animated.spring(pressAnim, {toValue: 0, useNativeDriver: true, speed: 50, bounciness: 4}).start();

  const getSize = () => {
    switch (size) {
      case 'sm':
        return {py: 8, px: 14, fontSize: 13, minHeight: 36};
      case 'md':
        return {py: 12, px: 20, fontSize: 15, minHeight: 44};
      case 'lg':
        return {py: 15, px: 28, fontSize: 16, minHeight: 52};
    }
  };

  const s = getSize();
  const scale = pressAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0.97]});

  const getTextColor = () => {
    if (disabled) {return colors.onSurfaceVariant;}
    switch (v) {
      case 'filled':
        return '#FFFFFF';
      case 'tonal':
        return colors.onSecondaryContainer;
      case 'outlined':
      case 'text':
        return danger ? colors.error : colors.primary;
    }
  };
  const textColor = getTextColor();

  const outer: ViewStyle = {
    borderRadius: colors.radius,
    minHeight: s.minHeight,
    paddingVertical: s.py,
    paddingHorizontal: s.px,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(disabled && {opacity: 0.5}),
    ...(v === 'filled' && !disabled
      ? {
          shadowColor: danger ? colors.error : colors.brandFrom,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        }
      : {}),
    ...(v === 'tonal'
      ? {backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.glassBorder}
      : {}),
    ...(v === 'outlined'
      ? {backgroundColor: 'transparent', borderWidth: 1, borderColor: danger ? colors.error : colors.outline}
      : {}),
    ...(v === 'text' ? {backgroundColor: 'transparent'} : {}),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[styles.base, outer, fullWidth && styles.fullWidth, style]}>
      {v === 'filled' && (
        <BrandGradient
          from={danger ? '#EF4444' : colors.brandFrom}
          to={danger ? '#DC2626' : colors.brandTo}
          style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
        />
      )}
      <Animated.View style={[styles.inner, {transform: [{scale}]}]}>
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.label,
                {color: textColor, fontSize: s.fontSize, fontFamily: colors.font.bodyMedium},
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
  base: {alignItems: 'center', justifyContent: 'center'},
  inner: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  fullWidth: {width: '100%'},
  label: {fontWeight: '600', letterSpacing: 0.1, textAlign: 'center'},
  labelWithIcon: {marginLeft: 8},
});

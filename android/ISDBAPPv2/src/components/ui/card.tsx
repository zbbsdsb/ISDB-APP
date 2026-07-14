import React, {useRef} from 'react';
import {StyleSheet, ViewStyle, View, TouchableOpacity, Animated} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {BrandGradient} from './gradient';

/**
 * Web-aligned Card.
 *   glass    → translucent surface + amber-tinted border + soft shadow  [.glass-card]
 *   elevated → glass + subtle amber→coral gradient wash                [.elevated-card]
 *   outlined → transparent + border
 */
export type CardVariant = 'glass' | 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: number;
  marginBottom?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'glass',
  padding = 16,
  marginBottom,
  onPress,
  style,
}: CardProps) {
  const {colors} = useTheme();
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(pressAnim, {toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4}).start();
  };
  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(pressAnim, {toValue: 0, useNativeDriver: true, speed: 50, bounciness: 4}).start();
  };

  const radius = 16;

  const base: ViewStyle = {
    borderRadius: radius,
    padding,
    backgroundColor: variant === 'outlined' ? 'transparent' : colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...(variant !== 'outlined'
      ? {
          shadowColor: colors.brandFrom,
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 3,
        }
      : {}),
  };

  const pressScale = pressAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0.98]});

  const content = (
    <Animated.View
      style={[
        styles.card,
        base,
        onPress ? {transform: [{scale: pressScale}]} : null,
        marginBottom !== undefined ? {marginBottom} : null,
        style,
      ]}>
      {variant === 'elevated' && (
        <BrandGradient
          from={colors.brandFrom}
          to={colors.brandTo}
          style={[{position: 'absolute' as const, left: 0, top: 0, right: 0, bottom: 0}, {opacity: 0.06}]}
        />
      )}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {overflow: 'hidden'},
  content: {zIndex: 1},
});

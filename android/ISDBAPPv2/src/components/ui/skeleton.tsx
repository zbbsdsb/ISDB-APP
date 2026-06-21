import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { m3Shape } from '../../constants/m3-shape';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius,
  variant = 'text',
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const getBorderRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    switch (variant) {
      case 'circular':
        return 9999;
      case 'rectangular':
        return m3Shape.extraSmall;
      case 'text':
      default:
        return m3Shape.extraSmall;
    }
  };

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as any,
          height: height as any,
          borderRadius: getBorderRadius(),
          backgroundColor: colors.surfaceVariant,
          opacity,
        },
        variant === 'circular' && { width: (width as number) || 40, height: (height as number) || 40 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
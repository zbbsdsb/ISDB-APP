import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { m3Shape } from '../../constants/m3-shape';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  value,
  color,
  height = 8,
  animated = true,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const animValue = useRef(new Animated.Value(0)).current;
  const fillColor = color || colors.primary;

  useEffect(() => {
    if (animated) {
      Animated.spring(animValue, {
        toValue: Math.min(value, 100),
        useNativeDriver: false,
        speed: 10,
        bounciness: 3,
      }).start();
    } else {
      animValue.setValue(Math.min(value, 100));
    }
  }, [value, animated, animValue]);

  const width = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: colors.surfaceVariant,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: fillColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
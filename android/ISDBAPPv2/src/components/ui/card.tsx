import React, {useRef} from 'react';
import {StyleSheet, ViewStyle, TouchableOpacity, Animated} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {m3Shape} from '../../constants/m3-shape';
import {m3Elevation} from '../../constants/m3-elevation';

/**
 * M3 Card variants:
 *   elevated → surface bg, shadow level 1, press → level 2
 *   filled   → surfaceVariant bg, no shadow, no elevation
 *   outlined → transparent bg, outline border, no elevation
 */

export type M3CardVariant = 'elevated' | 'filled' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: M3CardVariant;
  padding?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 16,
  onPress,
  style,
}: CardProps) {
  const {colors} = useTheme();
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!onPress) {
      return;
    }
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) {
      return;
    }
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getStyle = () => {
    const base: ViewStyle = {
      borderRadius: m3Shape.medium,
      padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          backgroundColor: colors.surface,
          borderWidth: 0,
          ...m3Elevation[1],
        };
      case 'filled':
        return {
          ...base,
          backgroundColor: colors.surfaceVariant,
          borderWidth: 0,
          elevation: 0,
        };
      case 'outlined':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.outline,
          elevation: 0,
        };
    }
  };

  const pressScale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  const content = (
    <Animated.View
      style={[
        styles.card,
        getStyle(),
        onPress ? {transform: [{scale: pressScale}]} : null,
        style,
      ]}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    // Base shape handled by getStyle()
  },
});

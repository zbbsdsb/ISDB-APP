import React from 'react';
import {View, StyleSheet, type ViewStyle} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

/**
 * Brand gradient background (amber #E8A838 → coral #D4664A).
 * Pure SVG so it works without adding a native gradient dependency.
 */
export function BrandGradient({
  style,
  from = '#E8A838',
  to = '#D4664A',
  children,
}: {
  style?: ViewStyle | ViewStyle[];
  from?: string;
  to?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={[styles.container, style]}>
      <Svg
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="none"
        viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={from} />
            <Stop offset="100%" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect width="100" height="100" fill="url(#brandGrad)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {m3Spacing} from '../../constants/m3-spacing';

interface DividerProps {
  /** Optional text to show in the middle (── Text ──) */
  text?: string;
  /** Left inset (for list items) */
  insetLeft?: number;
  /** Right inset (for list items) */
  insetRight?: number;
}

/**
 * M3 Divider component.
 * Plain: a thin line separating content.
 * With text: ─── text ─── style divider.
 */
export function Divider({text, insetLeft = 0, insetRight = 0}: DividerProps) {
  const {colors} = useTheme();

  if (text) {
    return (
      <View
        style={[
          styles.withText,
          {marginLeft: insetLeft, marginRight: insetRight},
        ]}>
        <View style={[styles.line, {backgroundColor: colors.outlineVariant}]} />
        <Text style={[styles.label, {color: colors.onSurfaceVariant}]}>
          {text}
        </Text>
        <View style={[styles.line, {backgroundColor: colors.outlineVariant}]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.plain,
        {
          backgroundColor: colors.outlineVariant,
          marginLeft: insetLeft,
          marginRight: insetRight,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  plain: {
    height: 1,
    marginVertical: m3Spacing.sm,
  },
  withText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: m3Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginHorizontal: m3Spacing.md,
  },
});

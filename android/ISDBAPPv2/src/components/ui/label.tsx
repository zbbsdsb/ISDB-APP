import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function Label({ children, style }: LabelProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.label, { color: colors.onBackground }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    marginBottom: 6,
  },
});
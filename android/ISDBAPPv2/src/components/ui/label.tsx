import React from 'react';
import {StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {Text} from './text';

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function Label({children, style}: LabelProps) {
  const {colors} = useTheme();

  return (
    <Text variant="label" style={[styles.label, {color: colors.onBackground}, style]}>
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

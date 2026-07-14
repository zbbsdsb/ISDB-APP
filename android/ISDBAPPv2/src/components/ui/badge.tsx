import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {m3Shape} from '../../constants/m3-shape';
import {Text} from './text';

type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'error';
type BadgeVariant = 'filled' | 'outlined' | 'tint';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const COLOR_MAP: Record<
  BadgeColor,
  {
    bg: keyof ReturnType<typeof useTheme>['colors'];
    text: keyof ReturnType<typeof useTheme>['colors'];
    border: keyof ReturnType<typeof useTheme>['colors'];
  }
> = {
  primary: {
    bg: 'primaryContainer',
    text: 'onPrimaryContainer',
    border: 'primary',
  },
  secondary: {
    bg: 'secondaryContainer',
    text: 'onSecondaryContainer',
    border: 'secondary',
  },
  tertiary: {
    bg: 'tertiaryContainer',
    text: 'onTertiaryContainer',
    border: 'tertiary',
  },
  success: {
    bg: 'primaryContainer',
    text: 'onPrimaryContainer',
    border: 'primary',
  },
  warning: {
    bg: 'tertiaryContainer',
    text: 'onTertiaryContainer',
    border: 'tertiary',
  },
  error: {bg: 'errorContainer', text: 'onErrorContainer', border: 'error'},
};

export function Badge({
  label,
  variant = 'filled',
  color = 'primary',
  size = 'sm',
  icon,
  style,
}: BadgeProps) {
  const {colors} = useTheme();
  const colorTokens = COLOR_MAP[color];

  const getStyle = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors[colorTokens.bg] as string,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors[colorTokens.border] as string,
        };
      case 'tint':
        return {
          backgroundColor: (colors[colorTokens.bg] as string) + '60',
          borderWidth: 1,
          borderColor: (colors[colorTokens.border] as string) + '30',
        };
    }
  };

  const isSm = size === 'sm';

  return (
    <View
      style={[styles.base, isSm ? styles.sm : styles.md, getStyle(), style]}>
      {icon && <View style={isSm ? styles.iconSm : styles.iconMd}>{icon}</View>}
      <Text
        variant="caption"
        style={[
          isSm ? styles.labelSm : styles.labelMd,
          {color: colors[colorTokens.text] as string},
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: m3Shape.small,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  iconSm: {
    marginRight: 4,
  },
  iconMd: {
    marginRight: 6,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  labelMd: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

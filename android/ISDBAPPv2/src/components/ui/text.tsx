import React from 'react';
import {Text as RNText, type TextProps, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/use-theme';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'label'
  | 'caption';

interface Props extends TextProps {
  variant?: TextVariant;
}

/**
 * Brand-aware Text.
 *   display/heading → Syne (display font, tight tracking)
 *   title/subtitle/body/label/caption → DM Sans
 * Color defaults to onSurface; override via style.
 */
export function Text({variant = 'body', style, children, ...rest}: Props) {
  const {colors} = useTheme();
  const base = styles[variant];
  const fontFamily =
    variant === 'display' || variant === 'heading'
      ? colors.font.heading
      : variant === 'title'
      ? colors.font.headingMedium
      : variant === 'label'
      ? colors.font.bodyMedium
      : colors.font.body;

  return (
    <RNText
      style={[base, {color: colors.onSurface, fontFamily}, style]}
      {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  display: {fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5},
  heading: {fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.3},
  title: {fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2},
  subtitle: {fontSize: 16, lineHeight: 22, fontWeight: '500'},
  body: {fontSize: 15, lineHeight: 22, fontWeight: '400'},
  label: {fontSize: 13, lineHeight: 18, fontWeight: '500'},
  caption: {fontSize: 12, lineHeight: 16, fontWeight: '400'},
});

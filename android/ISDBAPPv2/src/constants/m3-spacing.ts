/**
 * Material Design 3 Spacing System
 *
 * 8dp grid-based spacing values.
 * All layout spacings should use these constants.
 */

export const m3Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type M3SpacingToken = keyof typeof m3Spacing;

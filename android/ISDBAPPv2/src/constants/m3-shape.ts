/**
 * Material Design 3 Shape System
 *
 * Corner radii for components.
 * Usage:
 *   Card → m3Shape.medium (12)
 *   Button → m3Shape.small (8)
 *   FAB → m3Shape.large (16)
 *   Dialog → m3Shape.extraLarge (28)
 */

export const m3Shape = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
} as const;

export type M3ShapeToken = keyof typeof m3Shape;

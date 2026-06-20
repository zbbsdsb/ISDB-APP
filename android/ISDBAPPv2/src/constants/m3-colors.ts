/**
 * Material Design 3 Color System
 *
 * Based on brand colors:
 *   Primary:   Indigo  (#6366f1 → M3 tonal palette)
 *   Secondary: Purple  (#8b5cf6)
 *   Tertiary:  Pink    (#ec4899)
 */

export interface M3Colors {
  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface / Background
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  // Outline
  outline: string;
  outlineVariant: string;

  // Inverse
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  // Elevation
  surfaceTint: string;
  shadow: string;
  scrim: string;

  // --- Custom brand extensions (non-M3, for convenience) ---
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
}

export const lightColors: M3Colors = {
  // Primary — Indigo
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0E7FF',
  onPrimaryContainer: '#1E1B4B',

  // Secondary — Purple
  secondary: '#7C3AED',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#EDE9FE',
  onSecondaryContainer: '#2E1065',

  // Tertiary — Pink
  tertiary: '#DB2777',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FCE7F3',
  onTertiaryContainer: '#831843',

  // Error
  error: '#DC2626',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#7F1D1D',

  // Surface / Background
  background: '#FEFBFF',
  onBackground: '#1B1B1F',
  surface: '#FEFBFF',
  onSurface: '#1B1B1F',
  surfaceVariant: '#F1F5F9',
  onSurfaceVariant: '#475569',

  // Outline
  outline: '#94A3B8',
  outlineVariant: '#CBD5E1',

  // Inverse
  inverseSurface: '#1E293B',
  inverseOnSurface: '#F1F5F9',
  inversePrimary: '#A5B4FC',

  // Elevation
  surfaceTint: '#4F46E5',
  shadow: '#000000',
  scrim: '#000000',

  // Custom brand
  success: '#16A34A',
  onSuccess: '#FFFFFF',
  warning: '#D97706',
  onWarning: '#FFFFFF',
};

export const darkColors: M3Colors = {
  // Primary — Indigo
  primary: '#818CF8',
  onPrimary: '#1E1B4B',
  primaryContainer: '#3730A3',
  onPrimaryContainer: '#E0E7FF',

  // Secondary — Purple
  secondary: '#A78BFA',
  onSecondary: '#2E1065',
  secondaryContainer: '#5B21B6',
  onSecondaryContainer: '#EDE9FE',

  // Tertiary — Pink
  tertiary: '#F472B6',
  onTertiary: '#831843',
  tertiaryContainer: '#9D174D',
  onTertiaryContainer: '#FCE7F3',

  // Error
  error: '#FCA5A5',
  onError: '#7F1D1D',
  errorContainer: '#991B1B',
  onErrorContainer: '#FEE2E2',

  // Surface / Background
  background: '#0F0F12',
  onBackground: '#E4E2E6',
  surface: '#1A1A24',
  onSurface: '#E4E2E6',
  surfaceVariant: '#1E293B',
  onSurfaceVariant: '#94A3B8',

  // Outline
  outline: '#475569',
  outlineVariant: '#334155',

  // Inverse
  inverseSurface: '#E4E2E6',
  inverseOnSurface: '#303035',
  inversePrimary: '#4F46E5',

  // Elevation
  surfaceTint: '#818CF8',
  shadow: '#000000',
  scrim: '#000000',

  // Custom brand
  success: '#4ADE80',
  onSuccess: '#052E16',
  warning: '#FBBF24',
  onWarning: '#451A03',
};

export const getM3Colors = (isDark: boolean): M3Colors => {
  return isDark ? darkColors : lightColors;
};

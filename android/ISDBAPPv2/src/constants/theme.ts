/**
 * Insane-Dream-Builder aligned theme tokens.
 *
 * Mirrors the web app's design language (src/app/globals.css):
 *   - Brand gradient: amber #E8A838 → coral #D4664A
 *   - Warm near-black dark surfaces / clean white light surfaces
 *   - Fonts: Syne (display/headings) + DM Sans (body)
 *   - Radius 12px, glassmorphism borders
 *
 * Field names intentionally keep the legacy M3 names so existing screens
 * keep compiling; values are re-skinned to the web brand.
 */
import type {M3Colors} from './m3-colors';

export interface ThemeColors extends M3Colors {
  // Brand
  brand: string;
  brandFrom: string; // amber
  brandTo: string; // coral
  brandGradient: [string, string];

  // Radius
  radius: number; // 12 (lg)
  radiusMd: number; // 10
  radiusSm: number; // 8
  radiusPill: number; // 999

  // Glassmorphism helpers
  glassBg: string; // translucent surface overlay
  glassBorder: string; // translucent border

  // Font families (filename-based, registered in android assets/fonts)
  font: {
    heading: string; // Syne 800
    headingMedium: string; // Syne 700
    body: string; // DM Sans 400
    bodyMedium: string; // DM Sans 500
    bodyBold: string; // DM Sans 700
  };
}

const fontStack = {
  heading: 'Syne_800ExtraBold',
  headingMedium: 'Syne_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

export const darkColors: ThemeColors = {
  // Primary — amber
  primary: '#E8A838',
  onPrimary: '#FFFFFF',
  primaryContainer: '#2E2410',
  onPrimaryContainer: '#F0B454',

  // Secondary — warm neutral
  secondary: '#262524',
  onSecondary: '#EFECE7',
  secondaryContainer: '#2E2410',
  onSecondaryContainer: '#F0B454',

  // Tertiary — coral
  tertiary: '#D4664A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#2E1A16',
  onTertiaryContainer: '#F0A48C',

  // Error
  error: '#F87171',
  onError: '#1A0A0A',
  errorContainer: '#3A1A1A',
  onErrorContainer: '#FCA5A5',

  // Surface / Background — warm near-black
  background: '#14110E',
  onBackground: '#EFECE7',
  surface: '#1A1714',
  onSurface: '#EFECE7',
  surfaceVariant: '#262524',
  onSurfaceVariant: '#8D8D8B',

  // Outline
  outline: '#31302B',
  outlineVariant: '#232220',

  // Inverse
  inverseSurface: '#EFECE7',
  inverseOnSurface: '#1A1714',
  inversePrimary: '#B8771F',

  // Elevation
  surfaceTint: '#E8A838',
  shadow: '#000000',
  scrim: '#000000',

  // Custom brand
  success: '#4ADE80',
  onSuccess: '#052E16',
  warning: '#FBBF24',
  onWarning: '#451A03',

  // ── Web-aligned extensions ──
  brand: '#E8A838',
  brandFrom: '#E8A838',
  brandTo: '#D4664A',
  brandGradient: ['#E8A838', '#D4664A'],
  radius: 12,
  radiusMd: 10,
  radiusSm: 8,
  radiusPill: 999,
  glassBg: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(232,168,56,0.14)',
  font: fontStack,
};

export const lightColors: ThemeColors = {
  // Primary — amber
  primary: '#E8A838',
  onPrimary: '#FFFFFF',
  primaryContainer: '#F7EBD3',
  onPrimaryContainer: '#7A4E12',

  // Secondary — cool neutral
  secondary: '#F2F2F3',
  onSecondary: '#17181A',
  secondaryContainer: '#F7EBD3',
  onSecondaryContainer: '#7A4E12',

  // Tertiary — coral
  tertiary: '#D4664A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FBE3DC',
  onTertiaryContainer: '#8A2E18',

  // Error
  error: '#DC2626',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#7F1D1D',

  // Surface / Background — clean white
  background: '#FFFFFF',
  onBackground: '#0A0A0B',
  surface: '#FFFFFF',
  onSurface: '#0A0A0B',
  surfaceVariant: '#F2F2F3',
  onSurfaceVariant: '#75767A',

  // Outline
  outline: '#E4E4E7',
  outlineVariant: '#EDEDF0',

  // Inverse
  inverseSurface: '#1A1714',
  inverseOnSurface: '#EFECE7',
  inversePrimary: '#E8A838',

  // Elevation
  surfaceTint: '#E8A838',
  shadow: '#000000',
  scrim: '#000000',

  // Custom brand
  success: '#16A34A',
  onSuccess: '#FFFFFF',
  warning: '#D97706',
  onWarning: '#FFFFFF',

  // ── Web-aligned extensions ──
  brand: '#E8A838',
  brandFrom: '#E8A838',
  brandTo: '#D4664A',
  brandGradient: ['#E8A838', '#D4664A'],
  radius: 12,
  radiusMd: 10,
  radiusSm: 8,
  radiusPill: 999,
  glassBg: 'rgba(20,17,14,0.03)',
  glassBorder: 'rgba(232,168,56,0.18)',
  font: fontStack,
};

export const getColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};

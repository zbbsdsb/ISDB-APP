/**
 * Material Design 3 Elevation System
 *
 * Elevation levels determine shadow depth AND surface tint overlay.
 * In dark mode, elevated surfaces get lighter (surface → surfaceTint blend).
 *
 * Usage:
 *   level0: 0dp   — Cards rest state, dialogs
 *   level1: 1dp   — Cards elevated state
 *   level2: 3dp   — FAB resting
 *   level3: 6dp   — Top app bar
 *   level4: 8dp   — Bottom navigation
 *   level5: 12dp  — FAB pressed, navigation drawer
 */

import {type ViewStyle} from 'react-native';

export const m3Elevation: Record<
  number,
  Pick<
    ViewStyle,
    | 'shadowColor'
    | 'shadowOffset'
    | 'shadowOpacity'
    | 'shadowRadius'
    | 'elevation'
  >
> = {
  0: {
    elevation: 0,
  },
  1: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  3: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  4: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  5: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const getElevation = (level: 0 | 1 | 2 | 3 | 4 | 5) =>
  m3Elevation[level];

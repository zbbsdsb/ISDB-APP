import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemDarkMode = (): boolean => {
  // In React Native, we'd use Appearance API
  // For now, default to dark on Android
  return true;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark', // Default to dark on Android
      isDark: true,
      setMode: (mode) => {
        const isDark = mode === 'system' ? getSystemDarkMode() : mode === 'dark';
        set({ mode, isDark });
      },
      toggleTheme: () => {
        const newMode = get().mode === 'dark' ? 'light' : 'dark';
        get().setMode(newMode);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isDark = state.mode === 'system' ? getSystemDarkMode() : state.mode === 'dark';
          state.isDark = isDark;
        }
      },
    }
  )
);

// Theme colors
export const lightColors = {
  background: '#ffffff',
  surface: '#f8fafc',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};

export const darkColors = {
  background: '#0f0f12',
  surface: '#1a1a24',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#2d2d3a',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};

export type Colors = typeof lightColors;

export const getColors = (isDark: boolean): Colors => {
  return isDark ? darkColors : lightColors;
};

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

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useThemeStore } from '../store/theme-store';
import { getColors, type Colors } from '../constants/theme-colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: Colors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  colors: getColors(true),
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDark } = useThemeStore();

  const value = useMemo(
    () => ({
      isDark,
      colors: getColors(isDark),
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

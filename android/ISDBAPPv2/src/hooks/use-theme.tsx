import React, {createContext, useContext, useMemo, type ReactNode} from 'react';
import {useThemeStore} from '../store/theme-store';
import {getColors, type ThemeColors} from '../constants/theme';

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  colors: getColors(true),
});

export function ThemeProvider({children}: {children: ReactNode}) {
  const {isDark} = useThemeStore();

  const value = useMemo(
    () => ({
      isDark,
      colors: getColors(isDark),
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

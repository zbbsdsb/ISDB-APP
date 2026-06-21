import {createContext, useContext, useMemo, type ReactNode} from 'react';
import {useThemeStore} from '../store/theme-store';
import {getM3Colors, type M3Colors} from '../constants/m3-colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: M3Colors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  colors: getM3Colors(true),
});

export function ThemeProvider({children}: {children: ReactNode}) {
  const {isDark} = useThemeStore();

  const value = useMemo(
    () => ({
      isDark,
      colors: getM3Colors(isDark),
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

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "@/theme/colors";

type ThemeContextValue = {
  colors: ThemeColors;
  dark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({ colors: lightColors, dark: false });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const dark = scheme === "dark";
  const value = useMemo<ThemeContextValue>(() => ({ colors: dark ? darkColors : lightColors, dark }), [dark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

import { useMemo } from "react";

import { useTheme } from "@/theme/ThemeContext";
import type { ThemeColors } from "@/theme/colors";

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors]);
}

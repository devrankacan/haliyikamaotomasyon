import { Pressable, StyleSheet, Text } from "react-native";

import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

export function HeaderAddButton({ onPress }: { onPress: () => void }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 4,
    },
    pressed: {
      opacity: 0.7,
    },
    plus: {
      color: "#ffffff",
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 22,
    },
  });

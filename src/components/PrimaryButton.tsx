import { Pressable, StyleSheet, Text } from "react-native";

import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ title, onPress, disabled, variant = "primary" }: Props) {
  const styles = useThemedStyles(createStyles);
  const isSecondary = variant === "secondary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    base: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    pressed: {
      opacity: 0.7,
    },
    text: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "700",
    },
    secondaryText: {
      color: colors.primary,
    },
  });

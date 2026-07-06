import { Pressable, StyleSheet, Text } from "react-native";

export function HeaderAddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563eb",
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

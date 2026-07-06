import { StyleSheet, Text, View } from "react-native";

const PALETTE = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#16a34a", "#db2777"];

function colorForName(name: string) {
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colorForName(name) },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    color: "#ffffff",
    fontWeight: "700",
  },
});

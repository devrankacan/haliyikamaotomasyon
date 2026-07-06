import { StyleSheet, View } from "react-native";

import { PersonIcon } from "@/components/icons";

const PALETTE = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#16a34a", "#db2777"];

function colorForName(name: string) {
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colorForName(name) },
      ]}
    >
      <PersonIcon size={size * 0.56} color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

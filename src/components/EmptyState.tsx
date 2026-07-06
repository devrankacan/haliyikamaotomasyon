import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗂️</Text>
      <Text style={styles.text}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  icon: {
    fontSize: 40,
  },
  text: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
  },
  action: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});

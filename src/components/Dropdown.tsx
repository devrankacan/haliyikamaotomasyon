import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

export type DropdownOption<T extends string> = { value: T; label: string; danger?: boolean };

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{current?.label ?? "Seçin"}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <ScrollView bounces={false}>
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        opt.danger && styles.menuItemDanger,
                        isActive && styles.menuItemActiveText,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isActive ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.surface,
    },
    triggerText: { fontSize: 15, fontWeight: "600", color: colors.text },
    chevron: { color: colors.textMuted, fontSize: 14 },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    menu: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      width: "100%",
      maxWidth: 360,
      maxHeight: 420,
      paddingVertical: 6,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 18,
    },
    menuItemPressed: { backgroundColor: colors.background },
    menuItemText: { fontSize: 15, color: colors.text },
    menuItemDanger: { color: colors.error },
    menuItemActiveText: { fontWeight: "700", color: colors.primary },
    check: { color: colors.primary, fontWeight: "700" },
  });

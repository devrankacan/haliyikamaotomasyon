import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ITEM_TYPE_DEFAULT_UNIT, ITEM_TYPE_LABELS } from "@/constants/itemTypes";
import { TagIcon } from "@/components/icons";
import { usePriceList, useUpdatePriceEntry } from "@/hooks/usePriceList";
import type { ItemType } from "@/types/domain";

const ITEM_TYPES = Object.keys(ITEM_TYPE_LABELS) as ItemType[];

export function SettingsScreen() {
  const { data: priceList } = usePriceList();
  const updatePrice = useUpdatePriceEntry();
  const [editingType, setEditingType] = useState<ItemType | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const rows = ITEM_TYPES.map((itemType) => {
    const entry = priceList?.find((p) => p.itemType === itemType);
    return {
      itemType,
      label: ITEM_TYPE_LABELS[itemType],
      unit: entry?.unit ?? ITEM_TYPE_DEFAULT_UNIT[itemType],
      unitPrice: entry?.unitPrice ?? 0,
    };
  });

  function startEditing(itemType: ItemType, currentPrice: number) {
    setEditingType(itemType);
    setDraftValue(currentPrice > 0 ? String(currentPrice) : "");
  }

  function cancelEditing() {
    setEditingType(null);
    setDraftValue("");
  }

  function saveEditing(unit: "m2" | "adet") {
    if (!editingType) return;
    setError(null);
    updatePrice.mutate(
      { itemType: editingType, unit, unitPrice: Number(draftValue.replace(",", ".")) || 0 },
      {
        onSuccess: cancelEditing,
        onError: (err) => setError(err instanceof Error ? err.message : "Fiyat kaydedilemedi."),
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Fiyat Listesi</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.card}>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.itemType}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isEditing = editingType === item.itemType;
            return (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <TagIcon size={16} color="#2563eb" />
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.unit}>/{item.unit}</Text>
                </View>

                {isEditing ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.input}
                      value={draftValue}
                      onChangeText={setDraftValue}
                      keyboardType="numeric"
                      placeholder="0"
                      autoFocus
                    />
                    <Pressable onPress={() => saveEditing(item.unit)} hitSlop={8}>
                      <Text style={styles.saveText}>Kaydet</Text>
                    </Pressable>
                    <Pressable onPress={cancelEditing} hitSlop={8}>
                      <Text style={styles.cancelText}>Vazgeç</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => startEditing(item.itemType, item.unitPrice)} hitSlop={8}>
                    <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f1f5f9" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#64748b", marginBottom: 8, textTransform: "uppercase" },
  error: { color: "#ef4444", marginBottom: 8 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#e2e8f0" },
  label: { fontSize: 15, color: "#0f172a" },
  unit: { fontSize: 13, color: "#94a3b8" },
  price: { fontSize: 15, fontWeight: "600", color: "#2563eb" },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 70,
    fontSize: 14,
    color: "#0f172a",
  },
  saveText: { color: "#2563eb", fontWeight: "700", fontSize: 13 },
  cancelText: { color: "#94a3b8", fontSize: 13 },
});

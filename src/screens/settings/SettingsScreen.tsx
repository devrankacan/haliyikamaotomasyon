import { FlatList, StyleSheet, Text, View } from "react-native";

import { ITEM_TYPE_LABELS } from "@/constants/itemTypes";

// TODO(Faz 2): Supabase price_list tablosundan oku/yaz; şimdilik yapı gösterimi.
const PLACEHOLDER_PRICE_LIST = Object.entries(ITEM_TYPE_LABELS).map(([itemType, label]) => ({
  itemType,
  label,
  unitPrice: 0,
}));

export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Fiyat Listesi</Text>
      <View style={styles.card}>
        <FlatList
          data={PLACEHOLDER_PRICE_LIST}
          keyExtractor={(item) => item.itemType}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.tagIcon}>🏷️</Text>
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f1f5f9" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#64748b", marginBottom: 8, textTransform: "uppercase" },
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
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  tagIcon: { fontSize: 15 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#e2e8f0" },
  label: { fontSize: 15, color: "#0f172a" },
  price: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
});

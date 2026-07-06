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
      <Text style={styles.title}>Fiyat Listesi</Text>
      <FlatList
        data={PLACEHOLDER_PRICE_LIST}
        keyExtractor={(item) => item.itemType}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#cbd5e1",
  },
  label: { fontSize: 15 },
  price: { fontSize: 15, fontWeight: "600" },
});

import { StyleSheet, Text, View } from "react-native";

import { ORDER_STATUS_LABELS, type OrderStatus } from "@/constants/orderStatus";

const STATUS_COLORS: Record<OrderStatus, string> = {
  talep_alindi: "#94a3b8",
  alim_planlandi: "#60a5fa",
  alindi: "#38bdf8",
  yikaniyor: "#fbbf24",
  kurutuluyor: "#fb923c",
  teslime_hazir: "#34d399",
  teslimat_planlandi: "#22c55e",
  teslim_edildi: "#16a34a",
  iptal_edildi: "#ef4444",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
      <Text style={styles.text}>{ORDER_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "600",
  },
});

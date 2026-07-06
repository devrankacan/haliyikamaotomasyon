import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/types/domain";

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}1a` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const { data: orders } = useOrders();

  const openOrders = (orders ?? []).filter((o: Order) => o.status !== "teslim_edildi" && o.status !== "iptal_edildi");
  const pendingPayment = (orders ?? []).filter((o: Order) => o.paymentStatus !== "tahsil_edildi");
  const todayDeliveries = (orders ?? []).filter((o: Order) => {
    if (!o.deliveryDate) return false;
    const d = new Date(o.deliveryDate);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Özet</Text>
      <View style={styles.row}>
        <SummaryCard label="Devam Eden Sipariş" value={String(openOrders.length)} icon="cube" color="#2563eb" />
        <SummaryCard label="Bekleyen Tahsilat" value={String(pendingPayment.length)} icon="cash" color="#d97706" />
        <SummaryCard
          label="Bugünkü Teslimat"
          value={String(todayDeliveries.length)}
          icon="car"
          color="#16a34a"
        />
      </View>
      {/* TODO(Faz 2): gelir grafiği, personel iş yükü */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f1f5f9" },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  row: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  card: {
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardValue: { fontSize: 26, fontWeight: "700", color: "#0f172a" },
  cardLabel: { color: "#64748b", marginTop: 4, fontSize: 13 },
});

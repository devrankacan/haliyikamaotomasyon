import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { StatusBadge } from "@/components/StatusBadge";
import type { Customer, Order, OrderItem } from "@/types/domain";
import { ITEM_TYPE_LABELS } from "@/constants/itemTypes";
import { PAYMENT_STATUS_LABELS } from "@/constants/orderStatus";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

export function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { data: orders } = useOrders();
  const { data: customers } = useCustomers();
  const order = orders?.find((o: Order) => o.id === orderId);
  const customer = customers?.find((c: Customer) => c.id === order?.customerId);

  if (!order) {
    return <Text style={styles.notFound}>Sipariş bulunamadı.</Text>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
          <StatusBadge status={order.status} />
        </View>
        {customer ? <Text style={styles.customerName}>{customer.name}</Text> : null}
        <Text style={styles.detail}>
          Tutar: {order.paidAmount.toFixed(2)} / {order.totalAmount.toFixed(2)} ₺ ·{" "}
          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Kalemler</Text>
      {order.items.map((item: OrderItem) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.itemType}>{ITEM_TYPE_LABELS[item.itemType]}</Text>
          <Text style={styles.detail}>
            {item.quantity} adet · {item.areaM2 ?? "-"} m² · {item.unitPrice.toFixed(2)} ₺
          </Text>
          {item.stainNotes ? <Text style={styles.detail}>Not: {item.stainNotes}</Text> : null}
        </View>
      ))}
      {/* TODO(Faz 2): durum güncelleme butonları, fotoğraf galerisi, tahsilat ekleme */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f1f5f9" },
  container: { padding: 16, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  customerName: { fontSize: 15, fontWeight: "600", color: "#334155", marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#64748b", marginTop: 4, textTransform: "uppercase" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    gap: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemType: { fontWeight: "600", color: "#0f172a" },
  detail: { color: "#334155", fontSize: 14 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

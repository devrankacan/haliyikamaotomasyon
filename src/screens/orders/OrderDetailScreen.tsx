import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useOrders } from "@/hooks/useOrders";
import { StatusBadge } from "@/components/StatusBadge";
import type { Order, OrderItem } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

export function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { data: orders } = useOrders();
  const order = orders?.find((o: Order) => o.id === orderId);

  if (!order) {
    return <Text style={styles.notFound}>Sipariş bulunamadı.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.detail}>
        Tutar: {order.paidAmount.toFixed(2)} / {order.totalAmount.toFixed(2)} ₺ ({order.paymentStatus})
      </Text>
      <Text style={styles.sectionTitle}>Kalemler</Text>
      {order.items.map((item: OrderItem) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemType}>{item.itemType}</Text>
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
  container: { padding: 16, gap: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: 18, fontWeight: "700" },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 16 },
  itemRow: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    gap: 2,
  },
  itemType: { fontWeight: "600" },
  detail: { color: "#334155", fontSize: 14 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

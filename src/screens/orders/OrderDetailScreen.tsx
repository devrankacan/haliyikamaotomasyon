import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { StatusBadge } from "@/components/StatusBadge";
import type { Customer, Order, OrderItem } from "@/types/domain";
import { ITEM_TYPE_LABELS } from "@/constants/itemTypes";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, type OrderStatus } from "@/constants/orderStatus";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

const FLOW_STATUSES = ORDER_STATUSES.filter((s) => s !== "iptal_edildi");

export function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { data: orders } = useOrders();
  const { data: customers } = useCustomers();
  const updateStatus = useUpdateOrderStatus();
  const [error, setError] = useState<string | null>(null);
  const order = orders?.find((o: Order) => o.id === orderId);
  const customer = customers?.find((c: Customer) => c.id === order?.customerId);

  if (!order) {
    return <Text style={styles.notFound}>Sipariş bulunamadı.</Text>;
  }

  function handleStatusChange(status: OrderStatus) {
    if (status === order!.status) return;
    setError(null);
    updateStatus.mutate(
      { orderId, status },
      { onError: (err) => setError(err instanceof Error ? err.message : "Durum güncellenemedi.") }
    );
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

      <Text style={styles.sectionTitle}>Durumu Güncelle</Text>
      <View style={styles.card}>
        <View style={styles.chipsRow}>
          {FLOW_STATUSES.map((status) => {
            const active = order.status === status;
            return (
              <Pressable
                key={status}
                onPress={() => handleStatusChange(status)}
                disabled={updateStatus.isPending}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {ORDER_STATUS_LABELS[status]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={() => handleStatusChange("iptal_edildi")}
          disabled={updateStatus.isPending}
          style={styles.cancelRow}
        >
          <Text style={[styles.cancelText, order.status === "iptal_edildi" && styles.cancelTextActive]}>
            {order.status === "iptal_edildi" ? "İptal Edildi ✓" : "Siparişi İptal Et"}
          </Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
      {/* TODO(Faz 2): fotoğraf galerisi, tahsilat ekleme */}
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
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#334155", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },
  cancelRow: { marginTop: 12, alignSelf: "flex-start" },
  cancelText: { color: "#ef4444", fontSize: 13, fontWeight: "600" },
  cancelTextActive: { color: "#94a3b8" },
  itemType: { fontWeight: "600", color: "#0f172a" },
  detail: { color: "#334155", fontSize: 14 },
  error: { color: "#ef4444", marginTop: 8 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

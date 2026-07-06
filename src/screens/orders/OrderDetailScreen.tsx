import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { StatusBadge } from "@/components/StatusBadge";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { WhatsAppIcon } from "@/components/icons";
import type { Customer, Order, OrderItem } from "@/types/domain";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, type OrderStatus } from "@/constants/orderStatus";
import { buildStatusMessage, openWhatsapp } from "@/lib/whatsapp";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

const STATUS_OPTIONS: DropdownOption<OrderStatus>[] = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABELS[status],
  danger: status === "iptal_edildi",
}));

export function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { data: orders } = useOrders();
  const { data: customers } = useCustomers();
  const updateStatus = useUpdateOrderStatus();
  const [error, setError] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
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

  async function handleSendWhatsapp() {
    if (!customer) return;
    setWhatsappError(null);
    const itemsLabel = Array.from(new Set(order!.items.map((i) => i.itemType))).join(", ");
    const message = buildStatusMessage(order!.status, customer.name, itemsLabel);
    try {
      await openWhatsapp(customer.phone, message);
    } catch {
      setWhatsappError("WhatsApp açılamadı. Telefon numarasını kontrol edin.");
    }
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
        <Dropdown value={order.status} options={STATUS_OPTIONS} onChange={handleStatusChange} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={handleSendWhatsapp}
          disabled={!customer}
          style={({ pressed }) => [styles.whatsappButton, pressed && styles.whatsappButtonPressed]}
        >
          <WhatsAppIcon size={18} color="#ffffff" />
          <Text style={styles.whatsappButtonText}>WhatsApp ile Bilgilendir</Text>
        </Pressable>
        {whatsappError ? <Text style={styles.error}>{whatsappError}</Text> : null}
      </View>

      <Text style={styles.sectionTitle}>Kalemler</Text>
      {order.items.map((item: OrderItem) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.itemType}>{item.itemType}</Text>
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
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#25D366",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
  },
  whatsappButtonPressed: { opacity: 0.8 },
  whatsappButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  itemType: { fontWeight: "600", color: "#0f172a" },
  detail: { color: "#334155", fontSize: 14 },
  error: { color: "#ef4444", marginTop: 8 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

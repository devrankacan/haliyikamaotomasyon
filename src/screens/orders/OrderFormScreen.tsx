import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer, ItemType } from "@/types/domain";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Avatar } from "@/components/Avatar";

type Props = NativeStackScreenProps<RootStackParamList, "OrderForm">;

export function OrderFormScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const { data: customers } = useCustomers();
  const customer = customers?.find((c: Customer) => c.id === customerId);
  const [areaM2, setAreaM2] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [itemType] = useState<ItemType>("hali");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError(null);
    setSaving(true);

    const total = Number(areaM2 || 0) * Number(unitPrice || 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ customer_id: customerId, total_amount: total })
      .select()
      .single();

    if (orderError || !order) {
      setError(orderError?.message ?? "Sipariş oluşturulamadı.");
      setSaving(false);
      return;
    }

    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      item_type: itemType,
      area_m2: Number(areaM2 || 0),
      unit_price: Number(unitPrice || 0),
      quantity: 1,
    });

    setSaving(false);

    if (itemError) {
      setError(itemError.message);
      return;
    }

    navigation.replace("OrderDetail", { orderId: order.id });
  }

  return (
    <View style={styles.screen}>
      {customer ? (
        <View style={styles.customerRow}>
          <Avatar name={customer.name} size={40} />
          <Text style={styles.customerName}>{customer.name}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>Alan (m²)</Text>
        <TextInput
          style={styles.input}
          value={areaM2}
          onChangeText={setAreaM2}
          keyboardType="numeric"
          placeholder="Örn. 12"
        />
        <Text style={styles.label}>Birim Fiyat (₺)</Text>
        <TextInput
          style={styles.input}
          value={unitPrice}
          onChangeText={setUnitPrice}
          keyboardType="numeric"
          placeholder="Örn. 50"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonWrap}>
          <PrimaryButton
            title={saving ? "Kaydediliyor…" : "Siparişi Oluştur"}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9", padding: 16, gap: 16 },
  customerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  customerName: { fontSize: 17, fontWeight: "700", color: "#0f172a" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  label: { fontSize: 13, color: "#475569", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  error: { color: "#ef4444", marginTop: 4 },
  buttonWrap: { marginTop: 12 },
});

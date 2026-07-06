import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import type { ItemType } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "OrderForm">;

export function OrderFormScreen({ route, navigation }: Props) {
  const { customerId } = route.params ?? {};
  const [areaM2, setAreaM2] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [itemType] = useState<ItemType>("hali");

  async function handleSave() {
    if (!customerId) return;

    const total = Number(areaM2 || 0) * Number(unitPrice || 0);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({ customer_id: customerId, total_amount: total })
      .select()
      .single();

    if (error || !order) {
      // TODO(Faz 1): kullanıcıya hata mesajı göster
      return;
    }

    await supabase.from("order_items").insert({
      order_id: order.id,
      item_type: itemType,
      area_m2: Number(areaM2 || 0),
      unit_price: Number(unitPrice || 0),
      quantity: 1,
    });

    navigation.replace("OrderDetail", { orderId: order.id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Alan (m²)</Text>
      <TextInput style={styles.input} value={areaM2} onChangeText={setAreaM2} keyboardType="numeric" />
      <Text style={styles.label}>Birim Fiyat (₺)</Text>
      <TextInput style={styles.input} value={unitPrice} onChangeText={setUnitPrice} keyboardType="numeric" />
      <Button title="Siparişi Oluştur" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  label: { fontSize: 13, color: "#475569", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
});

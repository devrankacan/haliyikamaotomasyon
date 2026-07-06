import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { useCustomers } from "@/hooks/useCustomers";
import { usePriceList } from "@/hooks/usePriceList";
import { useItemTypes } from "@/hooks/useItemTypes";
import type { Customer } from "@/types/domain";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Avatar } from "@/components/Avatar";

type Props = NativeStackScreenProps<RootStackParamList, "OrderForm">;

export function OrderFormScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const { data: customers } = useCustomers();
  const { data: priceList } = usePriceList();
  const { data: itemTypes } = useItemTypes();
  const customer = customers?.find((c: Customer) => c.id === customerId);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedTypeEntry = itemTypes?.find((t) => t.label === selectedType);
  const priceEntry = priceList?.find((p) => p.itemType === selectedType);
  const unit = selectedType ? priceEntry?.unit ?? selectedTypeEntry?.unit ?? "adet" : null;
  const unitPrice = priceEntry?.unitPrice ?? 0;
  const total = Number(quantity.replace(",", ".")) * unitPrice || 0;

  async function handleSave() {
    if (!selectedType || !unit) {
      setError("Önce bir ürün seçin.");
      return;
    }
    if (!quantity || Number(quantity.replace(",", ".")) <= 0) {
      setError(unit === "m2" ? "Alan (m²) girin." : "Adet girin.");
      return;
    }
    if (unitPrice <= 0) {
      setError("Bu ürün için Ayarlar > Fiyat Listesi'nden fiyat belirlemelisiniz.");
      return;
    }

    setError(null);
    setSaving(true);

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

    const qty = Number(quantity.replace(",", "."));
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      item_type: selectedType,
      area_m2: unit === "m2" ? qty : null,
      quantity: unit === "adet" ? qty : 1,
      unit_price: unitPrice,
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
        <Text style={styles.label}>Ürün</Text>
        {itemTypes && itemTypes.length === 0 ? (
          <Text style={styles.note}>Henüz ürün eklenmedi. Ayarlar &gt; Fiyat Listesi'nden ürün ekleyin.</Text>
        ) : (
          <View style={styles.chipsRow}>
            {(itemTypes ?? []).map((type) => {
              const active = selectedType === type.label;
              return (
                <Pressable
                  key={type.id}
                  onPress={() => setSelectedType(type.label)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{type.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {selectedType ? (
          <>
            <Text style={styles.priceInfo}>
              Birim fiyat: {unitPrice > 0 ? `${unitPrice.toFixed(2)} ₺ / ${unit}` : "belirlenmemiş"}
            </Text>

            <Text style={styles.label}>{unit === "m2" ? "Alan (m²)" : "Adet"}</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder={unit === "m2" ? "Örn. 12" : "Örn. 1"}
            />

            <Text style={styles.total}>Toplam: {total.toFixed(2)} ₺</Text>
          </>
        ) : null}

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
  note: { color: "#64748b", fontSize: 13 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#334155", fontSize: 14, fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },
  priceInfo: { color: "#64748b", fontSize: 13, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  total: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginTop: 8 },
  error: { color: "#ef4444", marginTop: 4 },
  buttonWrap: { marginTop: 12 },
});

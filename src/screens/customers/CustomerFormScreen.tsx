import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerForm">;

export function CustomerFormScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressText, setAddressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || !phone.trim()) {
      setError("Ad soyad ve telefon zorunlu.");
      return;
    }

    setError(null);
    setSaving(true);

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({ name: name.trim(), phone: phone.trim() })
      .select()
      .single();

    if (customerError || !customer) {
      setError(customerError?.message ?? "Müşteri kaydedilemedi.");
      setSaving(false);
      return;
    }

    if (addressText.trim()) {
      await supabase.from("customer_addresses").insert({
        customer_id: customer.id,
        label: "Ev",
        address_text: addressText.trim(),
      });
    }

    setSaving(false);
    navigation.replace("CustomerDetail", { customerId: customer.id });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Örn. Ahmet Yılmaz" />
        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Örn. 0532 000 00 00"
        />
        <Text style={styles.label}>Adres (opsiyonel)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={addressText}
          onChangeText={setAddressText}
          multiline
          placeholder="Ev veya işyeri adresi"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonWrap}>
          <PrimaryButton title={saving ? "Kaydediliyor…" : "Kaydet"} onPress={handleSave} disabled={saving} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9", padding: 16 },
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
  multiline: { minHeight: 80, textAlignVertical: "top" },
  error: { color: "#ef4444", marginTop: 4 },
  buttonWrap: { marginTop: 12 },
});

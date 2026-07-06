import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerForm">;

export function CustomerFormScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressText, setAddressText] = useState("");

  async function handleSave() {
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({ name, phone })
      .select()
      .single();

    if (error || !customer) {
      // TODO(Faz 1): kullanıcıya hata mesajı göster (toast/alert)
      return;
    }

    if (addressText) {
      await supabase.from("customer_addresses").insert({
        customer_id: customer.id,
        label: "Ev",
        address_text: addressText,
      });
    }

    navigation.replace("CustomerDetail", { customerId: customer.id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Telefon</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Text style={styles.label}>Adres</Text>
      <TextInput style={styles.input} value={addressText} onChangeText={setAddressText} multiline />
      <Button title="Kaydet" onPress={handleSave} />
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

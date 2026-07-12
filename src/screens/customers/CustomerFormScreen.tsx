import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { useCustomers } from "@/hooks/useCustomers";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerForm">;

export function CustomerFormScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { customerId } = route.params ?? {};
  const isEditing = Boolean(customerId);
  const { data: customers } = useCustomers();
  const existing = customers?.find((c) => c.id === customerId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressText, setAddressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadedExisting, setLoadedExisting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditing ? "Müşteriyi Düzenle" : "Yeni Müşteri" });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (existing && !loadedExisting) {
      setName(existing.name);
      setPhone(existing.phone);
      setAddressText(existing.addresses[0]?.addressText ?? "");
      setLoadedExisting(true);
    }
  }, [existing, loadedExisting]);

  async function handleSave() {
    if (!name.trim() || !phone.trim()) {
      setError("Ad soyad ve telefon zorunlu.");
      return;
    }

    setError(null);
    setSaving(true);

    if (isEditing && customerId) {
      const { error: updateError } = await supabase
        .from("customers")
        .update({ name: name.trim(), phone: phone.trim() })
        .eq("id", customerId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      const existingAddress = existing?.addresses[0];
      if (existingAddress) {
        if (addressText.trim() !== existingAddress.addressText) {
          await supabase
            .from("customer_addresses")
            .update({ address_text: addressText.trim() })
            .eq("id", existingAddress.id);
        }
      } else if (addressText.trim()) {
        await supabase
          .from("customer_addresses")
          .insert({ customer_id: customerId, label: "Ev", address_text: addressText.trim() });
      }

      setSaving(false);
      navigation.replace("CustomerDetail", { customerId });
      return;
    }

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
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Örn. Ahmet Yılmaz"
          placeholderTextColor={colors.textFaint}
        />
        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Örn. 0532 000 00 00"
          placeholderTextColor={colors.textFaint}
        />
        <Text style={styles.label}>Adres (opsiyonel)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={addressText}
          onChangeText={setAddressText}
          multiline
          placeholder="Ev veya işyeri adresi"
          placeholderTextColor={colors.textFaint}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonWrap}>
          <PrimaryButton
            title={saving ? "Kaydediliyor…" : isEditing ? "Güncelle" : "Kaydet"}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      gap: 8,
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    label: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
    input: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      color: colors.text,
    },
    multiline: { minHeight: 80, textAlignVertical: "top" },
    error: { color: colors.error, marginTop: 4 },
    buttonWrap: { marginTop: 12 },
  });

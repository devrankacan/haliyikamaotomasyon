import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ITEM_TYPE_DEFAULT_UNIT, ITEM_TYPE_LABELS } from "@/constants/itemTypes";
import { TagIcon } from "@/components/icons";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { usePriceList, useUpdatePriceEntry } from "@/hooks/usePriceList";
import { useSmsSettings, useUpdateSmsSettings } from "@/hooks/useSmsSettings";
import type { ItemType, SmsProvider } from "@/types/domain";

const ITEM_TYPES = Object.keys(ITEM_TYPE_LABELS) as ItemType[];

const PROVIDER_OPTIONS: DropdownOption<SmsProvider>[] = [
  { value: "netgsm", label: "Netgsm" },
  { value: "iletimerkezi", label: "İleti Merkezi" },
  { value: "twilio", label: "Twilio" },
  { value: "diger", label: "Diğer" },
];

export function SettingsScreen() {
  const { data: priceList } = usePriceList();
  const updatePrice = useUpdatePriceEntry();
  const [editingType, setEditingType] = useState<ItemType | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [priceError, setPriceError] = useState<string | null>(null);

  const { data: smsSettings } = useSmsSettings();
  const updateSmsSettings = useUpdateSmsSettings();
  const [provider, setProvider] = useState<SmsProvider>("netgsm");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [senderId, setSenderId] = useState("");
  const [smsError, setSmsError] = useState<string | null>(null);
  const [smsSaved, setSmsSaved] = useState(false);
  const [loadedSmsSettings, setLoadedSmsSettings] = useState(false);

  useEffect(() => {
    if (smsSettings && !loadedSmsSettings) {
      setProvider(smsSettings.provider);
      setApiKey(smsSettings.apiKey ?? "");
      setApiSecret(smsSettings.apiSecret ?? "");
      setSenderId(smsSettings.senderId ?? "");
      setLoadedSmsSettings(true);
    }
  }, [smsSettings, loadedSmsSettings]);

  const rows = ITEM_TYPES.map((itemType) => {
    const entry = priceList?.find((p) => p.itemType === itemType);
    return {
      itemType,
      label: ITEM_TYPE_LABELS[itemType],
      unit: entry?.unit ?? ITEM_TYPE_DEFAULT_UNIT[itemType],
      unitPrice: entry?.unitPrice ?? 0,
    };
  });

  function startEditing(itemType: ItemType, currentPrice: number) {
    setEditingType(itemType);
    setDraftValue(currentPrice > 0 ? String(currentPrice) : "");
  }

  function cancelEditing() {
    setEditingType(null);
    setDraftValue("");
  }

  function saveEditing(unit: "m2" | "adet") {
    if (!editingType) return;
    setPriceError(null);
    updatePrice.mutate(
      { itemType: editingType, unit, unitPrice: Number(draftValue.replace(",", ".")) || 0 },
      {
        onSuccess: cancelEditing,
        onError: (err) => setPriceError(err instanceof Error ? err.message : "Fiyat kaydedilemedi."),
      }
    );
  }

  function handleSaveSmsSettings() {
    setSmsError(null);
    setSmsSaved(false);
    updateSmsSettings.mutate(
      { provider, apiKey: apiKey.trim(), apiSecret: apiSecret.trim(), senderId: senderId.trim() },
      {
        onSuccess: () => setSmsSaved(true),
        onError: (err) => setSmsError(err instanceof Error ? err.message : "Ayarlar kaydedilemedi."),
      }
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Fiyat Listesi</Text>
      {priceError ? <Text style={styles.error}>{priceError}</Text> : null}
      <View style={styles.card}>
        {rows.map((item, index) => {
          const isEditing = editingType === item.itemType;
          return (
            <View key={item.itemType}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <TagIcon size={16} color="#2563eb" />
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.unit}>/{item.unit}</Text>
                </View>

                {isEditing ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.input}
                      value={draftValue}
                      onChangeText={setDraftValue}
                      keyboardType="numeric"
                      placeholder="0"
                      autoFocus
                    />
                    <Pressable onPress={() => saveEditing(item.unit)} hitSlop={8}>
                      <Text style={styles.saveText}>Kaydet</Text>
                    </Pressable>
                    <Pressable onPress={cancelEditing} hitSlop={8}>
                      <Text style={styles.cancelText}>Vazgeç</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => startEditing(item.itemType, item.unitPrice)} hitSlop={8}>
                    <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>SMS Sağlayıcı Ayarları</Text>
      <View style={styles.card}>
        <Text style={styles.note}>
          Bu bilgiler kaydedilir; toplu SMS'in sessizce/otomatik gönderilebilmesi için sağlayıcınızın API'siyle
          bağlantı ayrıca kurulacaktır.
        </Text>

        <Text style={styles.fieldLabel}>Sağlayıcı</Text>
        <Dropdown value={provider} options={PROVIDER_OPTIONS} onChange={setProvider} />

        <Text style={styles.fieldLabel}>API Anahtarı / Kullanıcı Adı</Text>
        <TextInput
          style={styles.input2}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Örn. kullanıcı adınız ya da API key"
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>API Şifresi / Secret</Text>
        <TextInput
          style={styles.input2}
          value={apiSecret}
          onChangeText={setApiSecret}
          placeholder="API şifresi / secret key"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text style={styles.fieldLabel}>Gönderen Başlığı (Sender ID)</Text>
        <TextInput
          style={styles.input2}
          value={senderId}
          onChangeText={setSenderId}
          placeholder="Örn. firma adınız"
          autoCapitalize="none"
        />

        {smsError ? <Text style={styles.error}>{smsError}</Text> : null}
        {smsSaved ? <Text style={styles.success}>Kaydedildi.</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
          onPress={handleSaveSmsSettings}
          disabled={updateSmsSettings.isPending}
        >
          <Text style={styles.saveButtonText}>
            {updateSmsSettings.isPending ? "Kaydediliyor…" : "Ayarları Kaydet"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f1f5f9" },
  container: { padding: 16, gap: 4, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
  },
  error: { color: "#ef4444", marginBottom: 8 },
  success: { color: "#16a34a", marginBottom: 8 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#e2e8f0" },
  label: { fontSize: 15, color: "#0f172a" },
  unit: { fontSize: 13, color: "#94a3b8" },
  price: { fontSize: 15, fontWeight: "600", color: "#2563eb" },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 70,
    fontSize: 14,
    color: "#0f172a",
  },
  saveText: { color: "#2563eb", fontWeight: "700", fontSize: 13 },
  cancelText: { color: "#94a3b8", fontSize: 13 },
  note: { color: "#64748b", fontSize: 13, paddingVertical: 12, lineHeight: 18 },
  fieldLabel: { fontSize: 13, color: "#475569", marginTop: 10, marginBottom: 4 },
  input2: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 14,
  },
  saveButtonPressed: { opacity: 0.8 },
  saveButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
});

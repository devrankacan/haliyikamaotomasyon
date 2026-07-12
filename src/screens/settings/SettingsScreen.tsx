import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PencilIcon, TagIcon } from "@/components/icons";
import { Dropdown, type DropdownOption } from "@/components/Dropdown";
import { usePriceList, useUpdatePriceEntry } from "@/hooks/usePriceList";
import { useCreateItemType, useItemTypes } from "@/hooks/useItemTypes";
import { useSmsSettings, useUpdateSmsSettings } from "@/hooks/useSmsSettings";
import type { SmsProvider } from "@/types/domain";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

const PROVIDER_OPTIONS: DropdownOption<SmsProvider>[] = [
  { value: "netgsm", label: "Netgsm" },
  { value: "iletimerkezi", label: "İleti Merkezi" },
  { value: "twilio", label: "Twilio" },
  { value: "diger", label: "Diğer" },
];

const UNIT_OPTIONS: DropdownOption<"m2" | "adet">[] = [
  { value: "m2", label: "m² (alan bazlı)" },
  { value: "adet", label: "Adet" },
];

export function SettingsScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: itemTypes } = useItemTypes();
  const createItemType = useCreateItemType();
  const { data: priceList } = usePriceList();
  const updatePrice = useUpdatePriceEntry();
  const [editingType, setEditingType] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [priceError, setPriceError] = useState<string | null>(null);

  const [newLabel, setNewLabel] = useState("");
  const [newUnit, setNewUnit] = useState<"m2" | "adet">("m2");
  const [newItemError, setNewItemError] = useState<string | null>(null);

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

  const rows = (itemTypes ?? []).map((type) => {
    const entry = priceList?.find((p) => p.itemType === type.label);
    return {
      itemType: type.label,
      label: type.label,
      unit: entry?.unit ?? type.unit,
      unitPrice: entry?.unitPrice ?? 0,
    };
  });

  function startEditing(itemType: string, currentPrice: number) {
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

  function handleAddItemType() {
    if (!newLabel.trim()) {
      setNewItemError("Ürün adı girin.");
      return;
    }
    setNewItemError(null);
    createItemType.mutate(
      { label: newLabel.trim(), unit: newUnit },
      {
        onSuccess: () => setNewLabel(""),
        onError: (err) => setNewItemError(err instanceof Error ? err.message : "Ürün eklenemedi."),
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
                  <TagIcon size={16} color={colors.primary} />
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
                      placeholderTextColor={colors.textFaint}
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
                  <Pressable
                    style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
                    onPress={() => startEditing(item.itemType, item.unitPrice)}
                    hitSlop={8}
                  >
                    <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
                    <PencilIcon size={14} color={colors.primary} />
                    <Text style={styles.editButtonText}>Düzenle</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        {rows.length === 0 ? <Text style={styles.note}>Henüz ürün eklenmedi.</Text> : null}

        <View style={styles.separator} />
        <View style={styles.addItemRow}>
          <TextInput
            style={[styles.input2, styles.addItemInput]}
            value={newLabel}
            onChangeText={setNewLabel}
            placeholder="Yeni ürün adı (örn. Battaniye)"
            placeholderTextColor={colors.textFaint}
          />
          <View style={styles.addItemUnit}>
            <Dropdown value={newUnit} options={UNIT_OPTIONS} onChange={setNewUnit} />
          </View>
        </View>
        {newItemError ? <Text style={styles.error}>{newItemError}</Text> : null}
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={handleAddItemType}
          disabled={createItemType.isPending}
        >
          <Text style={styles.addButtonText}>
            {createItemType.isPending ? "Ekleniyor…" : "+ Yeni Ürün Ekle"}
          </Text>
        </Pressable>
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
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>API Şifresi / Secret</Text>
        <TextInput
          style={styles.input2}
          value={apiSecret}
          onChangeText={setApiSecret}
          placeholder="API şifresi / secret key"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          secureTextEntry
        />

        <Text style={styles.fieldLabel}>Gönderen Başlığı (Sender ID)</Text>
        <TextInput
          style={styles.input2}
          value={senderId}
          onChangeText={setSenderId}
          placeholder="Örn. firma adınız"
          placeholderTextColor={colors.textFaint}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { backgroundColor: colors.background },
    container: { padding: 16, gap: 4, paddingBottom: 32 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textMuted,
      marginBottom: 8,
      marginTop: 16,
      textTransform: "uppercase",
    },
    error: { color: colors.error, marginBottom: 8 },
    success: { color: "#16a34a", marginBottom: 8 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: colors.shadow,
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
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    label: { fontSize: 15, color: colors.text },
    unit: { fontSize: 13, color: colors.textFaint },
    price: { fontSize: 15, fontWeight: "600", color: colors.primary },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primarySoft,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    editButtonPressed: { opacity: 0.7 },
    editButtonText: { color: colors.primary, fontWeight: "700", fontSize: 13 },
    editRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    input: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      width: 70,
      fontSize: 14,
      color: colors.text,
    },
    saveText: { color: colors.primary, fontWeight: "700", fontSize: 13 },
    cancelText: { color: colors.textFaint, fontSize: 13 },
    note: { color: colors.textMuted, fontSize: 13, paddingVertical: 12, lineHeight: 18 },
    addItemRow: { gap: 8, marginTop: 12 },
    addItemInput: {},
    addItemUnit: {},
    addButton: {
      backgroundColor: colors.primarySoft,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 12,
    },
    addButtonPressed: { opacity: 0.7 },
    addButtonText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
    fieldLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 10, marginBottom: 4 },
    input2: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 14,
      marginBottom: 14,
    },
    saveButtonPressed: { opacity: 0.8 },
    saveButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  });

import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as SMS from "expo-sms";

import { useCustomers } from "@/hooks/useCustomers";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { EmptyState } from "@/components/EmptyState";
import type { Customer } from "@/types/domain";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

export function BulkSmsScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return customers ?? [];
    return (customers ?? []).filter((c: Customer) => {
      const phoneDigits = c.phone.replace(/\D/g, "");
      const queryDigits = query.replace(/\D/g, "");
      return normalize(c.name).includes(q) || (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
    });
  }, [customers, query]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev);
        filtered.forEach((c) => next.delete(c.id));
        return next;
      }
      const next = new Set(prev);
      filtered.forEach((c) => next.add(c.id));
      return next;
    });
  }

  async function handleSend() {
    if (selected.size === 0) {
      setError("En az bir müşteri seçin.");
      return;
    }
    if (!message.trim()) {
      setError("Bir mesaj yazın.");
      return;
    }

    setError(null);
    setSending(true);

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      setSending(false);
      setError("Bu cihazda SMS gönderimi kullanılamıyor.");
      return;
    }

    const numbers = (customers ?? [])
      .filter((c: Customer) => selected.has(c.id))
      .map((c: Customer) => c.phone);

    await SMS.sendSMSAsync(numbers, message.trim());
    setSending(false);
  }

  if (!isLoading && (customers ?? []).length === 0) {
    return <EmptyState message="Henüz müşteri eklenmedi." />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="İsim veya telefon ile ara"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
        />
      </View>

      <Pressable style={styles.selectAllRow} onPress={toggleSelectAll}>
        <View style={[styles.checkbox, allFilteredSelected && styles.checkboxChecked]}>
          {allFilteredSelected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.selectAllText}>
          {allFilteredSelected ? "Tümünü Kaldır" : "Tümünü Seç"} ({filtered.length})
        </Text>
      </Pressable>

      {filtered.length === 0 ? (
        <EmptyState message={`"${query}" ile eşleşen müşteri bulunamadı.`} />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isSelected = selected.has(item.id);
            return (
              <Pressable
                style={({ pressed }) => [styles.row, isSelected && styles.rowSelected, pressed && styles.rowPressed]}
                onPress={() => toggle(item.id)}
              >
                <Avatar name={item.name} size={40} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <View style={styles.footer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Göndermek istediğiniz mesajı yazın…"
          placeholderTextColor={colors.textFaint}
          multiline
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          title={sending ? "Açılıyor…" : `SMS Gönder (${selected.size})`}
          onPress={handleSend}
          disabled={sending || selected.size === 0}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    searchWrap: { padding: 16, paddingBottom: 0 },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
    },
    selectAllRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    selectAllText: { fontSize: 14, fontWeight: "700", color: colors.primary },
    list: { paddingHorizontal: 16, gap: 8, paddingBottom: 200 },
    row: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    rowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    rowPressed: { opacity: 0.7 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: "600", color: colors.text },
    phone: { color: colors.textMuted, marginTop: 2, fontSize: 13 },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    checkmark: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.surface,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 8,
    },
    messageInput: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      color: colors.text,
      minHeight: 70,
      textAlignVertical: "top",
    },
    error: { color: colors.error },
  });

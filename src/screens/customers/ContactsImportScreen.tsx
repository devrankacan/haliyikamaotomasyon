import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useQueryClient } from "@tanstack/react-query";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "ContactsImport">;

type PickedContact = { id: string; name: string; phone: string };

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

export function ContactsImportScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [contacts, setContacts] = useState<PickedContact[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      const parsed = data
        .filter((c) => c.name && c.phoneNumbers && c.phoneNumbers.length > 0 && c.phoneNumbers[0].number)
        .map((c) => ({
          id: c.id ?? `${c.name}-${c.phoneNumbers![0].number}`,
          name: c.name!,
          phone: c.phoneNumbers![0].number!,
        }));

      setContacts(parsed);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return contacts;
    return contacts.filter((c) => normalize(c.name).includes(q));
  }, [contacts, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleImport() {
    const toImport = contacts.filter((c) => selected.has(c.id));
    if (toImport.length === 0) {
      setError("En az bir kişi seçin.");
      return;
    }

    setError(null);
    setSaving(true);

    const { error: insertError } = await supabase
      .from("customers")
      .insert(toImport.map((c) => ({ name: c.name, phone: c.phone })));

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["customers"] });
    navigation.goBack();
  }

  if (loading) {
    return <EmptyState message="Rehber yükleniyor…" />;
  }

  if (permissionDenied) {
    return (
      <EmptyState message="Rehbere erişim izni verilmedi. Telefon ayarlarından bu uygulamaya kişiler izni verip tekrar deneyin." />
    );
  }

  if (contacts.length === 0) {
    return <EmptyState message="Telefon numarası olan bir kişi bulunamadı." />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="İsimle ara"
          placeholderTextColor={colors.textFaint}
        />
      </View>

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

      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          title={saving ? "Ekleniyor…" : `Seçilenleri Ekle (${selected.size})`}
          onPress={handleImport}
          disabled={saving || selected.size === 0}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    searchWrap: { padding: 16, paddingBottom: 8 },
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
    list: { padding: 16, paddingTop: 4, gap: 8, paddingBottom: 100 },
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
    error: { color: colors.error },
  });

import { Modal, Pressable, SectionList, StyleSheet, Text, TextInput, View } from "react-native";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";
import { HeaderAddButton } from "@/components/HeaderAddButton";
import { Avatar } from "@/components/Avatar";
import { AlphabetIndex } from "@/components/AlphabetIndex";
import { ContactBookIcon, PersonIcon } from "@/components/icons";
import type { Customer } from "@/types/domain";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = BottomTabScreenProps<MainTabsParamList, "Customers">;

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

function firstLetter(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "#";
  const char = trimmed.charAt(0).toLocaleUpperCase("tr-TR");
  return /[A-ZÇĞİÖŞÜ]/.test(char) ? char : "#";
}

function groupIntoSections(customers: Customer[]) {
  const sorted = [...customers].sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
  const map = new Map<string, Customer[]>();
  for (const customer of sorted) {
    const letter = firstLetter(customer.name);
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(customer);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b, "tr-TR")))
    .map(([title, data]) => ({ title, data }));
}

export function CustomerListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");
  const [chooserOpen, setChooserOpen] = useState(false);
  const sectionListRef = useRef<SectionList<Customer>>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderAddButton onPress={() => setChooserOpen(true)} />,
    });
  }, [navigation]);

  const filteredCustomers = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return customers ?? [];
    return (customers ?? []).filter((c: Customer) => {
      const phoneDigits = c.phone.replace(/\D/g, "");
      const queryDigits = query.replace(/\D/g, "");
      return normalize(c.name).includes(q) || (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
    });
  }, [customers, query]);

  const sections = useMemo(() => groupIntoSections(filteredCustomers), [filteredCustomers]);
  const letters = useMemo(() => sections.map((s) => s.title), [sections]);

  function handleSelectLetter(letter: string) {
    const sectionIndex = sections.findIndex((s) => s.title === letter);
    if (sectionIndex === -1) return;
    sectionListRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      animated: true,
      viewOffset: 0,
    });
  }

  const chooserModal = (
    <Modal visible={chooserOpen} transparent animationType="fade" onRequestClose={() => setChooserOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setChooserOpen(false)}>
        <View style={styles.chooserMenu}>
          <Pressable
            style={({ pressed }) => [styles.chooserItem, pressed && styles.chooserItemPressed]}
            onPress={() => {
              setChooserOpen(false);
              navigation.navigate("CustomerForm", {});
            }}
          >
            <PersonIcon size={20} color={colors.primary} />
            <Text style={styles.chooserText}>Manuel Müşteri Ekle</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.chooserItem, pressed && styles.chooserItemPressed]}
            onPress={() => {
              setChooserOpen(false);
              navigation.navigate("ContactsImport");
            }}
          >
            <ContactBookIcon size={20} color={colors.primary} />
            <Text style={styles.chooserText}>Rehberden Ekle</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  if (!isLoading && (customers ?? []).length === 0) {
    return (
      <>
        <EmptyState message="Henüz müşteri eklenmedi." actionLabel="+ Müşteri Ekle" onAction={() => setChooserOpen(true)} />
        {chooserModal}
      </>
    );
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
          clearButtonMode="while-editing"
        />
      </View>

      {filteredCustomers.length === 0 ? (
        <EmptyState message={`"${query}" ile eşleşen müşteri bulunamadı.`} />
      ) : (
        <View style={styles.listWrap}>
          <SectionList
            ref={sectionListRef}
            contentContainerStyle={styles.list}
            sections={sections}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            onScrollToIndexFailed={() => {}}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
              >
                <Avatar name={item.name} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            )}
          />
          <AlphabetIndex letters={letters} onSelect={handleSelectLetter} />
        </View>
      )}
      {chooserModal}
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
    listWrap: { flex: 1 },
    list: { padding: 16, paddingTop: 4, paddingRight: 28, gap: 8 },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textMuted,
      backgroundColor: colors.background,
      paddingVertical: 4,
    },
    row: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    rowPressed: { opacity: 0.6 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: colors.text },
    phone: { color: colors.textMuted, marginTop: 2 },
    chevron: { color: colors.borderStrong, fontSize: 22 },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    chooserMenu: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      width: "100%",
      maxWidth: 340,
      paddingVertical: 6,
    },
    chooserItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 16,
      paddingHorizontal: 18,
    },
    chooserItemPressed: { backgroundColor: colors.background },
    chooserText: { fontSize: 15, fontWeight: "600", color: colors.text },
  });

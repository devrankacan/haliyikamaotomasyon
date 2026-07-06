import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from "react-native";
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
import type { Customer } from "@/types/domain";

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
  const { data: customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");
  const sectionListRef = useRef<SectionList<Customer>>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderAddButton onPress={() => navigation.navigate("CustomerForm", {})} />,
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

  if (!isLoading && (customers ?? []).length === 0) {
    return (
      <EmptyState
        message="Henüz müşteri eklenmedi."
        actionLabel="+ Müşteri Ekle"
        onAction={() => navigation.navigate("CustomerForm", {})}
      />
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
          placeholderTextColor="#94a3b8"
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },
  searchWrap: { padding: 16, paddingBottom: 8 },
  searchInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
  },
  listWrap: { flex: 1 },
  list: { padding: 16, paddingTop: 4, paddingRight: 28, gap: 8 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingVertical: 4,
  },
  row: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowPressed: { opacity: 0.6 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  phone: { color: "#64748b", marginTop: 2 },
  chevron: { color: "#cbd5e1", fontSize: 22 },
});

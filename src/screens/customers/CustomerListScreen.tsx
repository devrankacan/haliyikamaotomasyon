import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLayoutEffect, useMemo, useState } from "react";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";
import { HeaderAddButton } from "@/components/HeaderAddButton";
import { Avatar } from "@/components/Avatar";

type Props = BottomTabScreenProps<MainTabsParamList, "Customers">;

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

export function CustomerListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderAddButton onPress={() => navigation.navigate("CustomerForm", {})} />,
    });
  }, [navigation]);

  const filteredCustomers = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return customers ?? [];
    return (customers ?? []).filter((c) => {
      const phoneDigits = c.phone.replace(/\D/g, "");
      const queryDigits = query.replace(/\D/g, "");
      return normalize(c.name).includes(q) || (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
    });
  }, [customers, query]);

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
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
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
  list: { padding: 16, paddingTop: 4, gap: 10 },
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

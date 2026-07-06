import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLayoutEffect } from "react";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";
import { HeaderAddButton } from "@/components/HeaderAddButton";

type Props = BottomTabScreenProps<MainTabsParamList, "Customers">;

export function CustomerListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers, isLoading } = useCustomers();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderAddButton onPress={() => navigation.navigate("CustomerForm", {})} />,
    });
  }, [navigation]);

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
    <FlatList
      contentContainerStyle={styles.list}
      data={customers ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
        >
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  row: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: { opacity: 0.6 },
  name: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  phone: { color: "#64748b", marginTop: 2 },
  chevron: { color: "#cbd5e1", fontSize: 22 },
});

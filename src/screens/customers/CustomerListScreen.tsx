import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLayoutEffect } from "react";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";
import { HeaderAddButton } from "@/components/HeaderAddButton";
import { Avatar } from "@/components/Avatar";

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
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={customers ?? []}
      keyExtractor={(item) => item.id}
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
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f1f5f9" },
  list: { padding: 16, gap: 10 },
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

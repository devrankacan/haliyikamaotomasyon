import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList } from "@/navigation/types";
import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";

type Props = BottomTabScreenProps<MainTabsParamList, "Customers">;

export function CustomerListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers, isLoading } = useCustomers();

  if (!isLoading && (customers ?? []).length === 0) {
    return <EmptyState message="Henüz müşteri eklenmedi. Sağ üstten yeni müşteri ekleyebilirsiniz." />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={customers ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  row: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 14,
  },
  name: { fontSize: 16, fontWeight: "600" },
  phone: { color: "#64748b", marginTop: 2 },
});

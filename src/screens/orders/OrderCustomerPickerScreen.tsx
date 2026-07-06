import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";

type Props = NativeStackScreenProps<RootStackParamList, "OrderCustomerPicker">;

export function OrderCustomerPickerScreen({ navigation }: Props) {
  const { data: customers, isLoading } = useCustomers();

  if (!isLoading && (customers ?? []).length === 0) {
    return (
      <EmptyState
        message="Sipariş oluşturmak için önce bir müşteri eklemelisiniz."
        actionLabel="+ Müşteri Ekle"
        onAction={() => navigation.replace("CustomerForm", {})}
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
          onPress={() => navigation.replace("OrderForm", { customerId: item.id })}
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
    borderRadius: 12,
    padding: 14,
  },
  rowPressed: { opacity: 0.6 },
  name: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  phone: { color: "#64748b", marginTop: 2 },
});

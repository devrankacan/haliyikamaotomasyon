import { useLayoutEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useCustomers";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { HeaderAddButton } from "@/components/HeaderAddButton";
import { Avatar } from "@/components/Avatar";
import type { Customer } from "@/types/domain";

type Props = BottomTabScreenProps<MainTabsParamList, "Orders">;

export function OrderListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useOrders();
  const { data: customers } = useCustomers();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderAddButton onPress={() => navigation.navigate("OrderCustomerPicker")} />,
    });
  }, [navigation]);

  if (!isLoading && (orders ?? []).length === 0) {
    return (
      <EmptyState
        message="Henüz sipariş yok."
        actionLabel="+ Sipariş Oluştur"
        onAction={() => navigation.navigate("OrderCustomerPicker")}
      />
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={orders ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const customerName = customers?.find((c: Customer) => c.id === item.customerId)?.name ?? "Bilinmeyen müşteri";
        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
          >
            <Avatar name={customerName} size={40} />
            <View style={styles.info}>
              <View style={styles.rowHeader}>
                <Text style={styles.customerName}>{customerName}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.amount}>
                {item.paidAmount.toFixed(2)} / {item.totalAmount.toFixed(2)} ₺
              </Text>
            </View>
          </Pressable>
        );
      }}
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
  info: { flex: 1, gap: 4 },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  customerName: { fontWeight: "600", color: "#0f172a", fontSize: 15 },
  amount: { color: "#475569" },
});

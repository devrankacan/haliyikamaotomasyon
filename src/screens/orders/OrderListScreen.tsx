import { useLayoutEffect, useState } from "react";
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
import type { Customer, Order } from "@/types/domain";

type Props = BottomTabScreenProps<MainTabsParamList, "Orders">;

type Filter = "active" | "completed";

function isCompleted(order: Order) {
  return order.status === "teslim_edildi" || order.status === "iptal_edildi";
}

export function OrderListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useOrders();
  const { data: customers } = useCustomers();
  const [filter, setFilter] = useState<Filter>("active");

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

  const filteredOrders = (orders ?? []).filter((o) => (filter === "active" ? !isCompleted(o) : isCompleted(o)));

  return (
    <View style={styles.screen}>
      <View style={styles.segmentWrap}>
        <Pressable
          style={[styles.segment, filter === "active" && styles.segmentActive]}
          onPress={() => setFilter("active")}
        >
          <Text style={[styles.segmentText, filter === "active" && styles.segmentTextActive]}>Aktif</Text>
        </Pressable>
        <Pressable
          style={[styles.segment, filter === "completed" && styles.segmentActive]}
          onPress={() => setFilter("completed")}
        >
          <Text style={[styles.segmentText, filter === "completed" && styles.segmentTextActive]}>Tamamlanan</Text>
        </Pressable>
      </View>

      {filteredOrders.length === 0 ? (
        <EmptyState
          message={filter === "active" ? "Aktif sipariş yok." : "Tamamlanan sipariş yok."}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const customerName =
              customers?.find((c: Customer) => c.id === item.customerId)?.name ?? "Bilinmeyen müşteri";
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },
  segmentWrap: {
    flexDirection: "row",
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: { color: "#64748b", fontWeight: "600", fontSize: 14 },
  segmentTextActive: { color: "#0f172a" },
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
  info: { flex: 1, gap: 4 },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  customerName: { fontWeight: "600", color: "#0f172a", fontSize: 15 },
  amount: { color: "#475569" },
});

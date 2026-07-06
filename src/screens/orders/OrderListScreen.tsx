import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { useOrders } from "@/hooks/useOrders";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

type Props = BottomTabScreenProps<MainTabsParamList, "Orders">;

export function OrderListScreen(_props: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: orders, isLoading } = useOrders();

  if (!isLoading && (orders ?? []).length === 0) {
    return <EmptyState message="Henüz sipariş yok. Yeni sipariş oluşturarak başlayın." />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={orders ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable style={styles.row} onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}>
          <View style={styles.rowHeader}>
            <Text style={styles.orderId}>#{item.id.slice(0, 8)}</Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.amount}>
            {item.paidAmount.toFixed(2)} / {item.totalAmount.toFixed(2)} ₺
          </Text>
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
    gap: 6,
  },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontWeight: "600" },
  amount: { color: "#475569" },
});

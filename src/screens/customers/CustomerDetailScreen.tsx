import { useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import type { Customer, CustomerAddress, Order } from "@/types/domain";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetail">;

export function CustomerDetailScreen({ route }: Props) {
  const { customerId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers } = useCustomers();
  const { data: orders } = useOrders();
  const customer = customers?.find((c: Customer) => c.id === customerId);
  const customerOrders = (orders ?? []).filter((o: Order) => o.customerId === customerId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("CustomerForm", { customerId })} hitSlop={12}>
          <Text style={styles.editText}>Düzenle</Text>
        </Pressable>
      ),
    });
  }, [navigation, customerId]);

  if (!customer) {
    return <Text style={styles.notFound}>Müşteri bulunamadı.</Text>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Avatar name={customer.name} size={52} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.detail}>{customer.phone}</Text>
          </View>
        </View>
        {customer.secondaryPhone ? (
          <Text style={styles.detail}>İkincil telefon: {customer.secondaryPhone}</Text>
        ) : null}

        {customer.addresses.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Adresler</Text>
            {customer.addresses.map((a: CustomerAddress) => (
              <Text key={a.id} style={styles.detail}>
                {a.label}: {a.addressText}
              </Text>
            ))}
          </>
        ) : null}

        {customer.notes ? (
          <>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <Text style={styles.detail}>{customer.notes}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="+ Yeni Sipariş Oluştur"
          onPress={() => navigation.navigate("OrderForm", { customerId })}
        />
      </View>

      <Text style={styles.sectionTitleOutside}>Sipariş Geçmişi</Text>
      {customerOrders.length === 0 ? (
        <Text style={styles.detail}>Bu müşteriye ait sipariş yok.</Text>
      ) : (
        customerOrders.map((order: Order) => (
          <Pressable
            key={order.id}
            style={({ pressed }) => [styles.orderRow, pressed && styles.orderRowPressed]}
            onPress={() => navigation.navigate("OrderDetail", { orderId: order.id })}
          >
            <Text style={styles.detail}>#{order.id.slice(0, 8)}</Text>
            <StatusBadge status={order.status} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f1f5f9" },
  container: { padding: 16, gap: 4 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  headerInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#64748b", marginTop: 14, textTransform: "uppercase" },
  sectionTitleOutside: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 20,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detail: { color: "#334155", fontSize: 14 },
  editText: { color: "#2563eb", fontWeight: "700", fontSize: 15, marginRight: 4 },
  buttonWrap: { marginTop: 16 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  orderRowPressed: { opacity: 0.6 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

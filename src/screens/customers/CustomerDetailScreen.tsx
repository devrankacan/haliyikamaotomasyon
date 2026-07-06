import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import type { Customer, CustomerAddress, Order } from "@/types/domain";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetail">;

export function CustomerDetailScreen({ route }: Props) {
  const { customerId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: customers } = useCustomers();
  const { data: orders } = useOrders();
  const customer = customers?.find((c: Customer) => c.id === customerId);
  const customerOrders = (orders ?? []).filter((o: Order) => o.customerId === customerId);

  if (!customer) {
    return <Text style={styles.notFound}>Müşteri bulunamadı.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{customer.name}</Text>
      <Text style={styles.detail}>Telefon: {customer.phone}</Text>
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

      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="+ Yeni Sipariş Oluştur"
          onPress={() => navigation.navigate("OrderForm", { customerId })}
        />
      </View>

      <Text style={styles.sectionTitle}>Sipariş Geçmişi</Text>
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
  container: { padding: 16, gap: 4 },
  name: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#0f172a" },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 16, color: "#0f172a" },
  detail: { color: "#334155", fontSize: 14 },
  buttonWrap: { marginTop: 20 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  orderRowPressed: { opacity: 0.6 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

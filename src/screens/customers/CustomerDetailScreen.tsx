import { ScrollView, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer, CustomerAddress } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetail">;

export function CustomerDetailScreen({ route }: Props) {
  const { customerId } = route.params;
  const { data: customers } = useCustomers();
  const customer = customers?.find((c: Customer) => c.id === customerId);

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
      <Text style={styles.sectionTitle}>Adresler</Text>
      {customer.addresses.map((a: CustomerAddress) => (
        <Text key={a.id} style={styles.detail}>
          {a.label}: {a.addressText}
        </Text>
      ))}
      {customer.notes ? (
        <>
          <Text style={styles.sectionTitle}>Notlar</Text>
          <Text style={styles.detail}>{customer.notes}</Text>
        </>
      ) : null}
      {/* TODO(Faz 1): bu müşteriye ait sipariş geçmişi listesi */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  name: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 16 },
  detail: { color: "#334155", fontSize: 14 },
  notFound: { padding: 24, textAlign: "center", color: "#64748b" },
});

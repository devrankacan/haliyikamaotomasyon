import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useCustomers } from "@/hooks/useCustomers";
import { EmptyState } from "@/components/EmptyState";
import { Avatar } from "@/components/Avatar";
import type { Customer } from "@/types/domain";
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "OrderCustomerPicker">;

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

export function OrderCustomerPickerScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: customers, isLoading } = useCustomers();
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return customers ?? [];
    return (customers ?? []).filter((c: Customer) => {
      const phoneDigits = c.phone.replace(/\D/g, "");
      const queryDigits = query.replace(/\D/g, "");
      return normalize(c.name).includes(q) || (queryDigits.length > 0 && phoneDigits.includes(queryDigits));
    });
  }, [customers, query]);

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
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="İsim veya telefon ile ara"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {filteredCustomers.length === 0 ? (
        <EmptyState message={`"${query}" ile eşleşen müşteri bulunamadı.`} />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => navigation.replace("OrderForm", { customerId: item.id })}
            >
              <Avatar name={item.name} size={40} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    searchWrap: { padding: 16, paddingBottom: 8 },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
    },
    list: { padding: 16, paddingTop: 4, gap: 8 },
    row: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    rowPressed: { opacity: 0.6 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: colors.text },
    phone: { color: colors.textMuted, marginTop: 2 },
  });

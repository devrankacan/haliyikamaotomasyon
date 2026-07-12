import type { ReactElement } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/types/domain";
import { CashIcon, PackageIcon, TruckIcon } from "@/components/icons";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

function SummaryCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: string;
  Icon: (props: { size?: number; color?: string }) => ReactElement;
  color: string;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}1a` }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const styles = useThemedStyles(createStyles);
  const { data: orders } = useOrders();

  const openOrders = (orders ?? []).filter((o: Order) => o.status !== "teslim_edildi" && o.status !== "iptal_edildi");
  const pendingPayment = (orders ?? []).filter((o: Order) => o.paymentStatus !== "tahsil_edildi");
  const todayDeliveries = (orders ?? []).filter((o: Order) => {
    if (!o.deliveryDate) return false;
    const d = new Date(o.deliveryDate);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Özet</Text>
      <View style={styles.row}>
        <SummaryCard label="Devam Eden Sipariş" value={String(openOrders.length)} Icon={PackageIcon} color="#2563eb" />
        <SummaryCard label="Bekleyen Tahsilat" value={String(pendingPayment.length)} Icon={CashIcon} color="#d97706" />
        <SummaryCard
          label="Bugünkü Teslimat"
          value={String(todayDeliveries.length)}
          Icon={TruckIcon}
          color="#16a34a"
        />
      </View>
      {/* TODO(Faz 2): gelir grafiği, personel iş yükü */}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { backgroundColor: colors.background },
    container: { padding: 16, gap: 16 },
    title: { fontSize: 22, fontWeight: "700", color: colors.text },
    row: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
    card: {
      flexGrow: 1,
      minWidth: 140,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    cardValue: { fontSize: 26, fontWeight: "700", color: colors.text },
    cardLabel: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  });

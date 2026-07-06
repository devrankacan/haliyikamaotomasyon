import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { CustomerListScreen } from "@/screens/customers/CustomerListScreen";
import { CustomerDetailScreen } from "@/screens/customers/CustomerDetailScreen";
import { CustomerFormScreen } from "@/screens/customers/CustomerFormScreen";
import { OrderListScreen } from "@/screens/orders/OrderListScreen";
import { OrderCustomerPickerScreen } from "@/screens/orders/OrderCustomerPickerScreen";
import { OrderDetailScreen } from "@/screens/orders/OrderDetailScreen";
import { OrderFormScreen } from "@/screens/orders/OrderFormScreen";
import { SettingsScreen } from "@/screens/settings/SettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2563eb",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    border: "#e2e8f0",
  },
};

const screenHeaderOptions = {
  headerStyle: { backgroundColor: "#ffffff" },
  headerTitleStyle: { color: "#0f172a", fontWeight: "700" as const },
  headerTintColor: "#2563eb",
  headerShadowVisible: false,
};

const TAB_ICONS: Record<keyof MainTabsParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { active: "grid", inactive: "grid-outline" },
  Customers: { active: "people", inactive: "people-outline" },
  Orders: { active: "cube", inactive: "cube-outline" },
  Settings: { active: "settings", inactive: "settings-outline" },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...screenHeaderOptions,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" as const },
        tabBarStyle: {
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
          borderTopColor: "#e2e8f0",
        },
        tabBarIcon: ({ color, focused, size }) => {
          const icons = TAB_ICONS[route.name];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Özet" }} />
      <Tab.Screen name="Customers" component={CustomerListScreen} options={{ title: "Müşteriler" }} />
      <Tab.Screen name="Orders" component={OrderListScreen} options={{ title: "Siparişler" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Ayarlar" }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  // TODO(Faz 1): Supabase auth durumuna göre Login <-> MainTabs geçişini yönet.
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ ...screenHeaderOptions, headerShown: true, title: "Müşteri" }}
        />
        <Stack.Screen
          name="CustomerForm"
          component={CustomerFormScreen}
          options={{ ...screenHeaderOptions, headerShown: true, title: "Yeni Müşteri" }}
        />
        <Stack.Screen
          name="OrderCustomerPicker"
          component={OrderCustomerPickerScreen}
          options={{ ...screenHeaderOptions, headerShown: true, title: "Müşteri Seç" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ ...screenHeaderOptions, headerShown: true, title: "Sipariş" }}
        />
        <Stack.Screen
          name="OrderForm"
          component={OrderFormScreen}
          options={{ ...screenHeaderOptions, headerShown: true, title: "Yeni Sipariş" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import type { MainTabsParamList, RootStackParamList } from "@/navigation/types";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { CustomerListScreen } from "@/screens/customers/CustomerListScreen";
import { CustomerDetailScreen } from "@/screens/customers/CustomerDetailScreen";
import { CustomerFormScreen } from "@/screens/customers/CustomerFormScreen";
import { OrderListScreen } from "@/screens/orders/OrderListScreen";
import { OrderDetailScreen } from "@/screens/orders/OrderDetailScreen";
import { OrderFormScreen } from "@/screens/orders/OrderFormScreen";
import { SettingsScreen } from "@/screens/settings/SettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ headerShown: true, title: "Müşteri" }}
        />
        <Stack.Screen
          name="CustomerForm"
          component={CustomerFormScreen}
          options={{ headerShown: true, title: "Müşteri Formu" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ headerShown: true, title: "Sipariş" }}
        />
        <Stack.Screen
          name="OrderForm"
          component={OrderFormScreen}
          options={{ headerShown: true, title: "Yeni Sipariş" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

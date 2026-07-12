import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "@/navigation/RootNavigator";
import { ThemeProvider } from "@/theme/ThemeContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <RootNavigator />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

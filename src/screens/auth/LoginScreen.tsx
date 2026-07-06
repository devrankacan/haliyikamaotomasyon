import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  async function handleLogin() {
    setError(null);
    setSigningIn(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigation.replace("MainTabs");
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonWrap}>
            <PrimaryButton
              title={signingIn ? "Giriş yapılıyor…" : "Giriş Yap"}
              onPress={handleLogin}
              disabled={signingIn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 10 },
  logoWrap: { alignItems: "center" },
  logo: { width: 240, height: 240 / (586 / 135) },
  subtitle: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  error: { color: "#ef4444" },
  buttonWrap: { marginTop: 8 },
});

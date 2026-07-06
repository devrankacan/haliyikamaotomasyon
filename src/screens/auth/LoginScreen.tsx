import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/PrimaryButton";
import { LogoMark } from "@/components/LogoMark";

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
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <LogoMark size={72} />
        </View>
        <Text style={styles.title}>Halı Yıkama Otomasyonu</Text>
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
          <PrimaryButton title={signingIn ? "Giriş yapılıyor…" : "Giriş Yap"} onPress={handleLogin} disabled={signingIn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  logoWrap: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 12 },
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

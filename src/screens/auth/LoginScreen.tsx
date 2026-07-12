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
import { useTheme } from "@/theme/ThemeContext";
import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { colors, dark } = useTheme();
  const styles = useThemedStyles(createStyles);
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
            <Image
              source={dark ? require("../../../assets/logo-white.png") : require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor={colors.textFaint}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    flex: { flex: 1 },
    container: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 10 },
    logoWrap: { alignItems: "center" },
    logo: { width: 240, height: 240 / (586 / 135) },
    subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 4 },
    input: {
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    error: { color: colors.error },
    buttonWrap: { marginTop: 8 },
  });

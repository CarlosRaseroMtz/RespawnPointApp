import FondoLayout from "@/src/components/FondoLayout";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { sendResetLink } from "../../src/utils/auth-reset-password";

/**
 * Pantalla de recuperación de contraseña
 * Permite al usuario ingresar su email para recibir un enlace de restablecimiento
 * Utiliza el layout FondoLayout para el fondo y estilo general
 */

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleRecovery = async () => {
    try {
      await sendResetLink(email);
      Alert.alert(t("forgot.successTitle"), t("forgot.successMsg"));
      router.replace("/login");
    } catch (e) {
      console.error("❌ Recuperación:", e);
      Alert.alert(t("forgot.errorTitle"), t("forgot.errorMsg"));
    }
  };

  return (

  // —— interfaz principal —— */
    <FondoLayout>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>{t("forgot.title")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("forgot.placeholder")}
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRecovery}>
          <Text style={styles.primaryButtonText}>{t("forgot.button")}</Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>{t("forgot.or")}</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.linkText}>
          {t("forgot.noAccount")}{" "}
          <Text style={styles.pink} onPress={() => router.push("/register")}>
            {t("forgot.register")}
          </Text>
        </Text>

        <Text style={styles.terms}>
          {t("forgot.terms1")}{" "}
          <Text style={styles.linkBlue}>{t("forgot.termsLink")}</Text> {t("forgot.and")}{" "}
          <Text style={styles.linkBlue}>{t("forgot.privacyLink")}</Text>.
        </Text>
      </View>
    </FondoLayout>
  );
}


/* —— estilos —— */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    color: "#000",
  },
  primaryButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold" },
  separator: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  separatorText: { marginHorizontal: 10, color: "#888" },
  linkText: { fontSize: 13, color: "#000", marginBottom: 15, textAlign: "center" },
  pink: { color: "#FF66C4" },
  terms: { fontSize: 12, textAlign: "center", color: "#888" },
  linkBlue: { color: "#42BAFF" },
});

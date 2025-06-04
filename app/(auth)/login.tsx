import FondoLayout from "@/src/components/FondoLayout";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginWithEmail } from "../../src/utils/auth-login";

const { width } = Dimensions.get("window");

/**
 * Pantalla de inicio de sesión
 * Permite al usuario ingresar su email y contraseña para acceder a la aplicación
 * Utiliza el layout FondoLayout para el fondo y estilo general
 */

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      router.replace("/home");
    } catch (err: any) {
      let message = t("login.error");
      switch (err.code) {
        case "auth/user-not-found":
          message = t("login.userNotFound");
          break;
        case "auth/wrong-password":
          message = t("login.wrongPassword");
          break;
        case "auth/invalid-email":
          message = t("login.invalidEmail");
          break;
      }
      alert(message);
    }
  };

  return (
    // —— interfaz principal —— */
    <FondoLayout>
      <View style={styles.container}>
        <View style={styles.background} />
        <View style={styles.inner}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>{t("login.title")}</Text>

          {/* —— Inputs —— */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t("login.email")}
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t("login.password")}
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <AntDesign
                name={showPassword ? "eye" : "eyeo"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* —— Enlaces —— */}
          <Text style={styles.linkText}>
            {t("login.forgotQuestion")}{" "}
            <Text style={styles.pink} onPress={() => router.push("/forgot-password")}>
              {t("login.forgotLink")}
            </Text>
          </Text>

          {/* —— Botones —— */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>{t("login.continue")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, { opacity: 0.5 }]}
            disabled
          >
            <AntDesign name="google" size={20} color="#999" />
            <Text style={[styles.googleButtonText, { color: "#999" }]}>
              {t("login.googleDisabled")}
            </Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>{t("login.or")}</Text>
            <View style={styles.line} />
          </View>

          <Text style={styles.linkText}>
            {t("login.noAccount")}{" "}
            <Text style={styles.pink} onPress={() => router.push("/register")}>
              {t("login.register")}
            </Text>
          </Text>

          <Text style={styles.terms}>
            {t("login.terms1")}{" "}
            <Text
              style={styles.linkBlue}
              onPress={() => Linking.openURL("https://www.ejemplo.com/terminos")}
            >
              {t("login.termsLink")}
            </Text>{" "}
            {t("login.and")}{" "}
            <Text
              style={styles.linkBlue}
              onPress={() =>
                Linking.openURL("https://www.ejemplo.com/privacidad")
              }
            >
              {t("login.privacyLink")}
            </Text>
            .
          </Text>
        </View>
      </View>
    </FondoLayout>
  );
}


/* ——— estilos ——— */
const styles = StyleSheet.create({
  container: { flex: 1, position: "relative"},
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width,
  },
  inner: { flex: 1, padding: 20, justifyContent: "center" },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  inputContainer: { marginBottom: 15, position: "relative" },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    paddingRight: 40,
  },
  eyeIcon: { position: "absolute", right: 12, top: 14 },
  linkText: { fontSize: 13, textAlign: "center", color: "#000", marginBottom: 20 },
  pink: { color: "#FF66C4" },
  primaryButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: { color: "#fff", fontWeight: "bold" },
  googleButton: {
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  googleButtonText: { fontWeight: "500", color: "#000" },
  separator: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  separatorText: { marginHorizontal: 10, color: "#888" },
  terms: { fontSize: 12, textAlign: "center", marginTop: 10, color: "#888" },
  linkBlue: { color: "#42BAFF" },
});

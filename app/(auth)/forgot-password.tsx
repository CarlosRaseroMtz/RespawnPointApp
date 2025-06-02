import FondoLayout from "@/src/components/FondoLayout";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleRecovery = async () => {
    try {
      await sendResetLink(email);
      Alert.alert("Recuperación enviada", "Revisa tu bandeja de entrada.");
      router.replace("/login");
    } catch (e) {
      console.error("❌ Recuperación:", e);
      Alert.alert("Error", "No se pudo enviar el correo. ¿Está bien escrito?");
    }
  };

  return (
    <FondoLayout>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Recuperar contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRecovery}>
          <Text style={styles.primaryButtonText}>Enviar recuperación</Text>
        </TouchableOpacity>

        {/* separador */}
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.linkText}>
          ¿Aún no tienes cuenta?{" "}
          <Text
            style={styles.pink}
            onPress={() => router.push("/register")}
          >
            Regístrate aquí
          </Text>
        </Text>

        <Text style={styles.terms}>
          Al continuar aceptas nuestros{" "}
          <Text style={styles.linkBlue}>Términos de servicio</Text> y{" "}
          <Text style={styles.linkBlue}>Política de privacidad</Text>.
        </Text>
      </View>
    </FondoLayout>
  );
}

/* —— estilos sin cambios —— */
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

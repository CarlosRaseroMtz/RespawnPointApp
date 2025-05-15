import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login aún no implementado.");
  };

  return (
    <View style={styles.container}>
      {/* Fondo personalizado en diagonal */}
      <View style={styles.background} />

      {/* Contenido */}
      <View style={styles.inner}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

        <Text style={styles.title}>Inicio de sesión</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Usuario o correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <AntDesign name="eyeo" size={20} color="#888" style={styles.eyeIcon} />
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.linkText}>Si has olvidado la contraseña, <Text style={styles.pink}>pulsa aquí</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <AntDesign name="google" size={20} color="black" />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.linkText}>Si aún no tienes cuenta, <Text style={styles.pink}>pulsa aquí para registrarte</Text></Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          Al hacer click en continuar, aceptas nuestros <Text style={styles.linkBlue}>Términos de servicio</Text> y <Text style={styles.linkBlue}>Política de privacidad</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative", backgroundColor: "#fff" },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
    position: "relative",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  linkText: {
    fontSize: 13,
    color: "#000",
    marginBottom: 20,
  },
  pink: {
    color: "#FF66C4",
  },
  primaryButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
  googleButtonText: {
    fontWeight: "500",
    color: "#000",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
  },
  terms: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    color: "#888",
  },
  linkBlue: {
    color: "#42BAFF",
  },
});

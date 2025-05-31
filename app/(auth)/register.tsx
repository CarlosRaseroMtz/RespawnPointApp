import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ⬇️  ruta correcta: 2 niveles arriba desde (auth) */
import { auth, firestore } from "../../config/firebase-config";

const platforms = ["Xbox 360",
  "Xbox One",
  "Xbox Series X/S",
  "PlayStation 3",
  "PlayStation 4",
  "PlayStation 5",
  "Wii",
  "Wii U",
  "Nintendo Switch",
  "PC",
  "Nintendo 3DS",
  "Consola retro/antigua",
  "Móviles",
  "VRs",
  "Otro",
  "No tengo una plataforma favorita"];

const genres = ["Acción", "Aventura", "RPG", "Shooter", "Estrategia",
  "Deportes", "Simulación", "Lucha", "Plataformas", "Terror",
  "Carreras", "Puzzle", "Indie", "Multijugador", "Sandbox", "MOBA",
  "Mundo abierto", "Narrativo", "Survival", "Battle Royale",
  "Sigilo", "Construcción", "Educativo", "Otro"];

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [passwordFocused, setPasswordFocused] = useState(false);

  /* —— validaciones auxiliares —— */
  const criterios = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password),
  };
  const evaluarFuerza = (pass: string) => {
    let f = 0;
    if (pass.length >= 8) f++;
    if (/[A-Z]/.test(pass)) f++;
    if (/[a-z]/.test(pass)) f++;
    if (/\d/.test(pass)) f++;
    if (/[\W_]/.test(pass)) f++;
    return ["Débil", "Débil", "Media", "Fuerte", "Muy fuerte"][f - 1] ?? "Débil";
  };
  const fuerza = evaluarFuerza(password);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre))
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    else if (selectedGenres.length < 2)
      setSelectedGenres([...selectedGenres, genre]);
    else Alert.alert("Límite", "Solo puedes elegir 2 géneros");
  };

  /* —— registro —— */
  const handleRegister = async () => {
    if (
      !email || !password || !fullName || !username ||
      selectedGenres.length === 0
    ) {
      Alert.alert("Campos incompletos", "Completa todos los datos.");
      return;
    }
    if (!criterios.longitud || !criterios.mayuscula ||
      !criterios.minuscula || !criterios.numero) {
      Alert.alert(
        "Contraseña insegura",
        "Mínimo 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth, email.trim(), password
      );
      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(firestore, "usuarios", user.uid), {
        username,
        email: user.email,
        fotoPerfil: "https://i.pravatar.cc/150?img=12",
        plataformaFav: platform,
        generoFav: selectedGenres.join(", "),
        descripcion: "Nuevo jugador registrado.",
        nivel: null,
        reputacion: 1,
        rol: "jugador",
        comunidades: [],
      });

      Alert.alert("Registro exitoso", "¡Bienvenido!");
      router.replace("/login");          // ✔️  usa ruta absoluta
    } catch (e: any) {
      console.error("❌ Registro:", e);
      const msg =
        e.code === "auth/email-already-in-use"
          ? "El correo ya está registrado."
          : e.code === "auth/invalid-email"
            ? "Correo inválido."
            : e.code === "auth/weak-password"
              ? "Contraseña muy débil."
              : "Ocurrió un error.";
      Alert.alert("Error de registro", msg);
    }
  };

  /* —— UI —— */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Regístrate</Text>

      {/*  correo / contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPass(!showPass)}
        >
          <AntDesign name={showPass ? "eye" : "eyeo"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {passwordFocused && (
        <View style={{ marginBottom: 10, marginTop: -10 }}>
          <Text style={{ color: "#888", fontSize: 12, marginBottom: 5 }}>
            Fuerza: {fuerza}
          </Text>
          <Text style={{ color: criterios.longitud ? "#0c0" : "#999" }}>
            {criterios.longitud ? "✅" : "❌"} 8+ caracteres
          </Text>
          <Text style={{ color: criterios.mayuscula ? "#0c0" : "#999" }}>
            {criterios.mayuscula ? "✅" : "❌"} Una mayúscula
          </Text>
          <Text style={{ color: criterios.minuscula ? "#0c0" : "#999" }}>
            {criterios.minuscula ? "✅" : "❌"} Una minúscula
          </Text>
          <Text style={{ color: criterios.numero ? "#0c0" : "#999" }}>
            {criterios.numero ? "✅" : "❌"} Un número
          </Text>
        </View>
      )}

      {/*  nombre / user */}
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor="#888"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      {/*  plataforma */}
      <Text style={styles.label}>Plataforma favorita</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={platform}
          onValueChange={setPlatform}
          style={styles.picker}
        >
          {platforms.map((p) => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      {/*  géneros */}
      <Text style={styles.label}>Géneros favoritos (máx. 2)</Text>
      <View style={styles.genreContainer}>
        {genres.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genreTag,
              selectedGenres.includes(g) && styles.genreTagSelected,
            ]}
            onPress={() => toggleGenre(g)}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenres.includes(g) && styles.genreTextSelected,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Registrarme</Text>
      </TouchableOpacity>

      {/* separador / login */}
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>o</Text>
        <View style={styles.line} />
      </View>

      <View style={[styles.googleButton, { opacity: 0.5 }]}>
        <AntDesign name="google" size={20} color="#999" />
        <Text style={[styles.googleButtonText, { color: "#999" }]}>
          Próximamente
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={{ color: "#FF66C4", textAlign: "center" }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* —— estilos idénticos … —— */
const styles = StyleSheet.create({ /* ↓ mantenidos como los tuyos */

  container: { padding: 20, paddingBottom: 40, backgroundColor: "#fff" },
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
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    paddingRight: 40,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  genreTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  genreTagSelected: {
    backgroundColor: "#FF66C4",
    borderColor: "#FF66C4",
  },
  genreText: {
    color: "#000",
  },
  genreTextSelected: {
    color: "#fff",
    fontWeight: "bold",
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
    gap: 10,
  },
  googleButtonText: {
    fontWeight: "500",
    color: "#000",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
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
});

import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, firestore } from "../../config/firebase-config";

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

const platforms = [
  "Xbox 360",
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
];

const genres = [
  "Acción", "Aventura", "RPG", "Shooter", "Estrategia",
  "Deportes", "Simulación", "Lucha", "Plataformas", "Terror",
  "Carreras", "Puzzle", "Indie", "Multijugador", "Sandbox", "MOBA",
  "Mundo abierto", "Narrativo", "Survival",
];

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

  const criterios = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password),
  };


  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < 2) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      Alert.alert("Límite", "Solo puedes elegir 2 géneros");
    }
  };


  const evaluarFuerza = (pass: string) => {
    let fuerza = 0;
    if (pass.length >= 8) fuerza++;
    if (/[A-Z]/.test(pass)) fuerza++;
    if (/[a-z]/.test(pass)) fuerza++;
    if (/\d/.test(pass)) fuerza++;
    if (/[\W_]/.test(pass)) fuerza++;

    if (fuerza <= 2) return "Débil";
    if (fuerza === 3) return "Media";
    if (fuerza === 4) return "Fuerte";
    return "Muy fuerte";
  };

  const fuerza = evaluarFuerza(password);


  const handleRegister = async () => {
    if (!email || !password || !fullName || !username || selectedGenres.length === 0) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      Alert.alert("Contraseña insegura", "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      // ✅ Crear documento en Firestore
      await setDoc(doc(firestore, "usuarios", user.uid), {
        username: username,
        email: user.email,
        fotoPerfil: "https://i.pravatar.cc/150?img=12", // avatar por defecto
        plataformaFav: platform,
        generoFav: selectedGenres.join(", "),
        descripcion: "Nuevo jugador registrado.",
        nivel: null,
        reputacion: 1,
        rol: "jugador",
        comunidades: [],
      });

      console.log("✅ Usuario y perfil creados:", user.email);
      Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
      router.replace("/login");
    } catch (error: any) {
      console.error("❌ Error al registrar:", error);
      let message = "Ocurrió un error.";
      if (error.code === "auth/email-already-in-use") {
        message = "El correo ya está registrado.";
      } else if (error.code === "auth/invalid-email") {
        message = "Correo inválido.";
      } else if (error.code === "auth/weak-password") {
        message = "La contraseña debe tener al menos 6 caracteres.";
      }
      Alert.alert("Error de registro", message);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Regístrate</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
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
            Fuerza de la contraseña: {fuerza}
          </Text>
          <Text style={{ color: criterios.longitud ? "#0c0" : "#999" }}>
            {criterios.longitud ? "✅" : "❌"} Mínimo 8 caracteres
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
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Plataforma favorita</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={platform}
          onValueChange={setPlatform}
          style={styles.picker}
        >
          {platforms.map(p => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Géneros favoritos (máx. 2)</Text>
      <View style={styles.genreContainer}>
        {genres.map(g => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genreTag,
              selectedGenres.includes(g) && styles.genreTagSelected,
            ]}
            onPress={() => toggleGenre(g)}
          >
            <Text style={[
              styles.genreText,
              selectedGenres.includes(g) && styles.genreTextSelected
            ]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>o</Text>
        <View style={styles.line} />
      </View>

      <View style={[styles.googleButton, { opacity: 0.5 }]}>
        <AntDesign name="google" size={20} color="#999" />
        <Text style={[styles.googleButtonText, { color: "#999" }]}>Próximamente</Text>
      </View>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={{ color: "#FF66C4", textAlign: "center" }}>
          ¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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


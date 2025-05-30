import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
import { firestore } from "../../../config/firebase-config";
import { useAuth } from "../../../hooks/useAuth";

const platforms = [
  "Xbox 360", "Xbox One", "Xbox Series X/S",
  "PlayStation 3", "PlayStation 4", "PlayStation 5",
  "Wii", "Wii U", "Nintendo Switch", "Consola retro/antigua"
];

const genres = [
  "Acción", "Aventura", "RPG", "Shooter", "Estrategia",
  "Deportes", "Simulación", "Lucha", "Plataformas", "Terror",
];

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [username, setUsername] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [plataforma, setPlataforma] = useState(platforms[0]);
  const [generos, setGeneros] = useState<string[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;
      const ref = doc(firestore, "usuarios", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "");
        setFotoPerfil(data.fotoPerfil || "");
        setPlataforma(data.plataformaFav || platforms[0]);
        setGeneros(data.generoFav?.split(", ") || []);
      }
    };
    cargarDatos();
  }, [user]);

  const elegirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  const toggleGenero = (g: string) => {
    if (generos.includes(g)) {
      setGeneros(generos.filter(x => x !== g));
    } else if (generos.length < 2) {
      setGeneros([...generos, g]);
    } else {
      Alert.alert("Límite", "Solo puedes elegir 2 géneros favoritos.");
    }
  };

  const guardarCambios = async () => {
    if (!user) return;
    try {
      const ref = doc(firestore, "usuarios", user.uid);
      await updateDoc(ref, {
        username,
        fotoPerfil,
        plataformaFav: plataforma,
        generoFav: generos.join(", "),
      });
      Alert.alert("Perfil actualizado", "Los cambios se guardaron correctamente.");
      router.back();
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity onPress={elegirImagen}>
        <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
        <Text style={styles.changePhoto}>Cambiar foto</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Plataforma favorita</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={plataforma}
          onValueChange={setPlataforma}
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
              generos.includes(g) && styles.genreTagSelected,
            ]}
            onPress={() => toggleGenero(g)}
          >
            <Text style={[
              styles.genreText,
              generos.includes(g) && styles.genreTextSelected,
            ]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 8,
  },
  changePhoto: {
    textAlign: "center",
    color: "#FF66C4",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
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
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

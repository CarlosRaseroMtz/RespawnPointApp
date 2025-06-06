import FondoLayout from "@/src/components/FondoLayout";
import { normalizarNombreArchivo } from "@/src/utils/normalizar-nombre-archivo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useAuth } from "../../../src/hooks/useAuth";
import { firestore } from "../../../src/services/config/firebase-config";

const platforms = [ /* mantenemos como está */
  "Xbox 360", "Xbox One", "Xbox Series X/S", "PlayStation 3", "PlayStation 4",
  "PlayStation 5", "Wii", "Wii U", "Nintendo Switch", "PC", "Nintendo 3DS",
  "Consola retro/antigua", "Móviles", "VRs", "Otro", "No tengo una plataforma favorita"
];

const genres = [
  "Acción", "Aventura", "RPG", "Shooter", "Estrategia", "Deportes",
  "Simulación", "Lucha", "Plataformas", "Terror", "Carreras", "Puzzle",
  "Indie", "Multijugador", "Sandbox", "MOBA", "Mundo abierto", "Narrativo",
  "Survival", "Battle Royale", "Sigilo", "Construcción", "Educativo", "Otro"
];

// * —— pantalla de edición de perfil —— */
// Esta pantalla permite a los usuarios editar su perfil, incluyendo nombre de usuario, foto de perfil,

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [bio, setBio] = useState("");
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
        setBio(data.descripcion || "");
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
      Alert.alert(t("editProfile.limitTitle"), t("editProfile.limitMsg"));
    }
  };

  const guardarCambios = async () => {
    if (!user) return;
    try {
      let avatarUrl = fotoPerfil;
      if (fotoPerfil && !fotoPerfil.startsWith("http")) {
        const ts = Date.now();
        const nombreBase = fotoPerfil.split("/").pop() || `avatar_${ts}.jpg`;
        const nombreLimpio = normalizarNombreArchivo(nombreBase);
        const ruta = `avatars/${user.uid}/${ts}-${nombreLimpio}`;
        const blob = await (await fetch(fotoPerfil)).blob();
        const avatarStorageRef = storageRef(getStorage(), ruta);
        await uploadBytes(avatarStorageRef, blob);
        avatarUrl = await getDownloadURL(avatarStorageRef);
      }

      const ref = doc(firestore, "usuarios", user.uid);
      await updateDoc(ref, {
        username,
        fotoPerfil: avatarUrl,
        plataformaFav: plataforma,
        generoFav: generos.join(", "),
        descripcion: bio,
      });
      Alert.alert(t("editProfile.savedTitle"), t("editProfile.savedMsg"));
      router.back();
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.errorMsg"));
    }
  };

  return (
    //* —— interfaz principal —— */
    <FondoLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t("editProfile.title")}</Text>

        <TouchableOpacity onPress={elegirImagen}>
          <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
          <Text style={styles.changePhoto}>{t("editProfile.changePhoto")}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={t("editProfile.usernamePlaceholder")}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>{t("editProfile.platformLabel")}</Text>
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

        <Text style={styles.label}>{t("editProfile.genresLabel")}</Text>
        <View style={styles.genreContainer}>
          {genres.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.genreTag, generos.includes(g) && styles.genreTagSelected]}
              onPress={() => toggleGenero(g)}
            >
              <Text style={[styles.genreText, generos.includes(g) && styles.genreTextSelected]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t("editProfile.bioLabel")}</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder={t("editProfile.bioPlaceholder")}
          multiline
          numberOfLines={4}
          maxLength={200}
          value={bio}
          onChangeText={setBio}
        />

        <TouchableOpacity style={styles.button} onPress={guardarCambios}>
          <Text style={styles.buttonText}>{t("editProfile.saveButton")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </FondoLayout>
  );
}

////* —— estilos —— */
const styles = StyleSheet.create({
  container: {
    padding: 20,
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

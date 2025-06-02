import FondoLayout from "@/src/components/FondoLayout";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { firestore } from "../../../src/config/firebase-config";
import { useAuth } from "../../../src/hooks/useAuth";
import { normalizarNombreArchivo } from "../../../src/utils/normalizar-nombre-archivo";

const { width } = Dimensions.get("window");
const CATEGORIAS = ["Videojuego", "Meme"]; // puedes ampliar

export default function CreatePostScreen() {
  const { user, loading } = useAuth();

  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [subiendo, setSubiendo] = useState(false);

  /* ---------- elegir imagen ---------- */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets.length) {
      setImagen(res.assets[0].uri);
    }
  };

  /* ---------- publicar ---------- */
  const subirPost = async () => {
    if (loading || !user) {
      Alert.alert("Sesión no lista", "Inicia sesión primero");
      return;
    }
    if (!texto.trim() || !imagen) {
      Alert.alert("Campos incompletos", "Añade mensaje e imagen.");
      return;
    }

    try {
      setSubiendo(true);

      /* 1. Subir imagen a Storage */
      const ts = Date.now();
      const nombreBase = imagen.split("/").pop() || `img_${ts}.jpg`;
      const nombreLimpio = normalizarNombreArchivo(nombreBase);
      const rutaStorage = `publicaciones/${user.uid}/${ts}-${nombreLimpio}`;

      const blob = await (await fetch(imagen)).blob();
      const storageRef = ref(getStorage(), rutaStorage);
      await uploadBytes(storageRef, blob);
      const mediaUrl = await getDownloadURL(storageRef);

      /* 2. Crear documento en Firestore */
      await addDoc(collection(firestore, "publicaciones"), {
        userId: user.uid,
        contenido: texto.trim(),
        mediaUrl,
        categoria,
        likes: [],
        commentsCount: 0,
        timestamp: Timestamp.now(),
        comunidadId: "GENERAL",
      });

      Alert.alert("✅ ¡Publicación creada!");
      router.back(); // ← vuelve a la pantalla anterior
    } catch (e: any) {
      console.error("❌ Error al subir publicación:", e);
      Alert.alert("Error", e.message || "Fallo al subir.");
    } finally {
      setSubiendo(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <FondoLayout>
      <View style={styles.container}>
        <View style={styles.box}>
          {/* selector de imagen */}
          <Pressable style={styles.uploadArea} onPress={pickImage}>
            {imagen ? (
              <Image source={{ uri: imagen }} style={styles.preview} />
            ) : (
              <Text style={styles.uploadText}>Pulsa para elegir imagen</Text>
            )}
          </Pressable>

          {/* mensaje */}
          <TextInput
            style={styles.input}
            placeholder="Escribe algo..."
            placeholderTextColor="#888"
            multiline
            value={texto}
            onChangeText={setTexto}
          />

          {/* chips de categoría */}
          <View style={styles.catRow}>
            {CATEGORIAS.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategoria(cat)}
                style={[
                  styles.chip,
                  categoria === cat && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    categoria === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* botón publicar */}
          <Pressable
            style={[styles.button, subiendo && { opacity: 0.6 }]}
            onPress={subirPost}
            disabled={subiendo}
          >
            <Text style={styles.buttonText}>
              {subiendo ? "Subiendo..." : "Publicar"}
            </Text>
          </Pressable>
        </View>
      </View>
    </FondoLayout>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    backgroundColor: "#fff",
  },
  uploadArea: {
    width: width * 0.8,
    height: 180,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  uploadText: { color: "#888" },
  preview: { width: "100%", height: "100%", borderRadius: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 15,
    color: "#000",
  },
  catRow: { flexDirection: "row", gap: 8, marginBottom: 15, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  chipActive: { backgroundColor: "#FF66C4" },
  chipText: { color: "#666" },
  chipTextActive: { color: "#fff" },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});

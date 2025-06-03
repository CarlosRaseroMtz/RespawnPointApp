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
import { useTranslation } from "react-i18next";
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
import { useAuth } from "../../../src/hooks/useAuth";
import { firestore } from "../../../src/services/config/firebase-config";
import { normalizarNombreArchivo } from "../../../src/utils/normalizar-nombre-archivo";

const { width } = Dimensions.get("window");
const CATEGORIAS = ["Videojuego", "Meme"];

export default function CreatePostScreen() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [subiendo, setSubiendo] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets.length) {
      setImagen(res.assets[0].uri);
    }
  };

  const subirPost = async () => {
    if (loading || !user) {
      Alert.alert(t("create.sessionErrorTitle"), t("create.sessionErrorMsg"));
      return;
    }
    if (!texto.trim() || !imagen) {
      Alert.alert(t("create.incompleteTitle"), t("create.incompleteMsg"));
      return;
    }

    try {
      setSubiendo(true);

      const ts = Date.now();
      const nombreBase = imagen.split("/").pop() || `img_${ts}.jpg`;
      const nombreLimpio = normalizarNombreArchivo(nombreBase);
      const rutaStorage = `publicaciones/${user.uid}/${ts}-${nombreLimpio}`;

      const blob = await (await fetch(imagen)).blob();
      const storageRef = ref(getStorage(), rutaStorage);
      await uploadBytes(storageRef, blob);
      const mediaUrl = await getDownloadURL(storageRef);

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

      Alert.alert("✅ " + t("create.success"));
      router.back();
    } catch (e: any) {
      console.error("❌ Error al subir publicación:", e);
      Alert.alert(t("create.error"), e.message || t("create.errorFallback"));
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <FondoLayout>
      <View style={styles.container}>
        <View style={styles.box}>
          <Pressable style={styles.uploadArea} onPress={pickImage}>
            {imagen ? (
              <Image source={{ uri: imagen }} style={styles.preview} />
            ) : (
              <Text style={styles.uploadText}>{t("create.tapToUpload")}</Text>
            )}
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder={t("create.placeholder")}
            placeholderTextColor="#888"
            multiline
            value={texto}
            onChangeText={setTexto}
          />

          <View style={styles.catRow}>
            {CATEGORIAS.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategoria(cat)}
                style={[styles.chip, categoria === cat && styles.chipActive]}
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

          <Pressable
            style={[styles.button, subiendo && { opacity: 0.6 }]}
            onPress={subirPost}
            disabled={subiendo}
          >
            <Text style={styles.buttonText}>
              {subiendo ? t("create.uploading") : t("create.publish")}
            </Text>
          </Pressable>
        </View>
      </View>
    </FondoLayout>
  );
}

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

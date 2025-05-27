import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
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
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";
import { normalizarNombreArchivo } from "../utils/normalizar-nombre-archivo";

const { width } = Dimensions.get("window");

export default function CreatePostScreen() {
  const { user, loading } = useAuth();
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagen(result.assets[0].uri);
    }
  };

  const subirPost = async () => {
    if (loading || !user) {
      Alert.alert("Sesión no lista", "Inicia sesión primero");
      return;
    }

    if (!texto.trim() || !imagen) {
      Alert.alert("Campos incompletos", "Debes añadir texto e imagen.");
      return;
    }

    try {
      setSubiendo(true);

      const uid = user.uid;
      const userDisplayName = user.displayName || "Anónimo";
      const timestamp = Date.now();
      const nombreOriginal = imagen.split("/").pop() || `imagen_${timestamp}.jpg`;
      const nombreLimpio = normalizarNombreArchivo(nombreOriginal);
      const ruta = `publicaciones/${uid}/${timestamp}-${nombreLimpio}`;

      const response = await fetch(imagen);
      const blob = await response.blob();

      const storageRef = ref(getStorage(), ruta);
      await uploadBytes(storageRef, blob);

      const mediaUrl = await getDownloadURL(storageRef);

      await addDoc(collection(firestore, "publicaciones"), {
        userId: userDisplayName,
        contenido: texto,
        mediaUrl,
        likes: [],
        timestamp: Timestamp.now(),
        comunidadId: "GENERAL",
      });

      Alert.alert("¡Publicación creada!");
      setTexto("");
      setImagen(null);
    } catch (e: any) {
      console.error("❌ Error al subir publicación:", e);
      Alert.alert("Error", e.message || "Fallo al subir.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadBox}>
        <Pressable style={styles.uploadArea} onPress={pickImage}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.preview} />
          ) : (
            <Text style={styles.uploadText}>Pulsa para subir tus archivos</Text>
          )}
        </Pressable>

        <TextInput
          placeholder="Escribe algo..."
          value={texto}
          onChangeText={setTexto}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  uploadBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
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
    backgroundColor: "#fdfdfd",
  },
  uploadText: {
    color: "#888",
    fontSize: 14,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 15,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

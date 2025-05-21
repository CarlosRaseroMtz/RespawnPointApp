import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Alert, Button, Image, TextInput, View } from "react-native";
import { auth, firestore, storage } from "../config/firebase-config";

export default function CreatePostScreen() {
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
    if (!texto.trim() || !imagen) {
      Alert.alert("Completa el texto y selecciona una imagen");
      return;
    }

    try {
      setSubiendo(true);
      // Subir imagen a Firebase Storage
      const res = await fetch(imagen);
      const blob = await res.blob();
      const nombreArchivo = `${Date.now()}.jpg`;
      const refStorage = ref(storage, `posts/${nombreArchivo}`);
      await uploadBytes(refStorage, blob);
      const urlImagen = await getDownloadURL(refStorage);

      // Guardar post en Firestore
      await addDoc(collection(firestore, "publicaciones"), {
        userId: auth.currentUser?.uid ?? "anónimo",
        contenido: texto,
        mediaUrl: urlImagen,
        likes: [],
        timestamp: Timestamp.now(),
        comunidadId: "GENERAL",
      });

      Alert.alert("¡Publicación creada!");
      setTexto("");
      setImagen(null);
    } catch (e) {
      console.error("Error al subir post:", e);
      Alert.alert("Error al publicar.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="¿Qué estás pensando?"
        value={texto}
        onChangeText={setTexto}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      {imagen && (
        <Image
          source={{ uri: imagen }}
          style={{ width: "100%", height: 200, marginBottom: 10 }}
          resizeMode="cover"
        />
      )}
      <Button title="Seleccionar imagen" onPress={pickImage} />
      <Button title={subiendo ? "Subiendo..." : "Publicar"} onPress={subirPost} disabled={subiendo} />
    </View>
  );
}

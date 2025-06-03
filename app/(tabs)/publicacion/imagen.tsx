import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ImagenScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const imageUrl = Array.isArray(url) ? url[0] : url;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const guardarImagen = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("imageScreen.permissionTitle"), t("imageScreen.permissionMsg"));
        return;
      }

      const fileUri = FileSystem.documentDirectory + "imagen.jpg";
      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl as string,
        fileUri
      );

      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult) throw new Error("Descarga fallida");

      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      Alert.alert(t("imageScreen.successTitle"), t("imageScreen.successMsg"));
    } catch (error) {
      console.error("❌ Error al guardar imagen:", error);
      Alert.alert(t("imageScreen.errorTitle"), t("imageScreen.errorMsg"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.downloadButton} onPress={guardarImagen}>
        <Ionicons name="download-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {imageUrl ? (
        <Animated.Image
          source={{ uri: imageUrl as string }}
          style={[
            styles.image,
            { opacity, transform: [{ scale }] },
          ]}
          resizeMode="contain"
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width, height },
  backButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  downloadButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
  },
});

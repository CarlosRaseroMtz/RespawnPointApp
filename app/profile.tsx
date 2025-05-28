import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";
import BottomTabBar from "./comp/bottom-tab-bar";

const { width } = Dimensions.get("window");
const imageSize = (width - 36) / 2;

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [perfil, setPerfil] = useState<any>(null);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDatos = async () => {
      try {
        const userRef = doc(firestore, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setPerfil(userSnap.data());

        const publiQuery = query(
          collection(firestore, "publicaciones"),
          where("userId", "==", user.uid)
        );
        const publiSnap = await getDocs(publiQuery);
        const data = publiSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(data);
      } catch (error) {
        console.error("Error al cargar perfil o publicaciones:", error);
      }
    };

    fetchDatos();
  }, [user]);

  if (!perfil) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: perfil.fotoPerfil }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.username}>{perfil.username}</Text>
            <Text style={styles.platform}>{perfil.plataformaFav || "Sin plataforma"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/configuracion")}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{publicaciones.length}</Text>
          <Text style={styles.statLabel}>Contenido</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>567</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>191</Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      <View style={styles.bio}>
        <Text style={styles.genre}>{perfil.generoFav || "Sin género favorito"}</Text>
        <Text style={styles.description}>
          {perfil.descripcion || "Jugador/a apasionado/a por los videojuegos 🎮"}
        </Text>
      </View>

      <FlatList
        data={publicaciones}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gallery}
        renderItem={({ item }) => (
          <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />
        )}
      />

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  headerText: {},
  username: { fontSize: 18, fontWeight: "700" },
  platform: { fontSize: 14, color: "#888" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  stat: { alignItems: "center" },
  statNumber: { fontWeight: "700", fontSize: 16 },
  statLabel: { fontSize: 13, color: "#555" },
  bio: { marginBottom: 16 },
  genre: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  description: { color: "#444" },
  gallery: { gap: 4 },
  postImage: {
    width: imageSize,
    height: imageSize * 1.2,
    margin: 4,
    borderRadius: 10,
  },
});

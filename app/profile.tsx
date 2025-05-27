import { Ionicons } from "@expo/vector-icons";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("window");
const imageSize = (width - 40) / 3;

export default function ProfileScreen() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [publicaciones, setPublicaciones] = useState<any>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      if (!user) return;

      try {
        // 🔍 Obtener perfil del usuario
        const userRef = doc(firestore, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setPerfil(userSnap.data());
        }

        // 🧾 Obtener publicaciones del usuario
        const publicacionesRef = query(
          collection(firestore, "publicaciones"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(publicacionesRef);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPublicaciones(data);
      } catch (error) {
        console.error("❌ Error cargando perfil o publicaciones:", error);
      }
    };

    fetchDatos();
  }, [user]);

  if (!perfil) return null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: perfil.fotoPerfil }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{perfil.username}</Text>
          <Text style={styles.plataforma}>{perfil.plataformaFavorita}</Text>
        </View>
        <Pressable onPress={() => console.log("Abrir ajustes")}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </Pressable>
      </View>

      {/* STATS */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{publicaciones.length}</Text>
          <Text style={styles.statLabel}>Contenido</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {perfil.seguidores?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {perfil.siguiendo?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      {/* DESCRIPCIÓN */}
      <View style={styles.descripcion}>
        <Text style={styles.genero}>
          {perfil.generoFavorito}, {perfil.plataformaFavorita} y Competitivo
        </Text>
        <Text style={styles.bio}>
          {perfil.bio ||
            "Jugador de PC y Xbox, pseudoretirado, ya solo juego con colegas, en busca del resurgimiento gamer"}
        </Text>
      </View>

      {/* GRID DE PUBLICACIONES */}
      <FlatList
        data={publicaciones}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (!item?.mediaUrl) return null;
          return (
            <Image
              source={{ uri: item.mediaUrl }}
              style={styles.postImage}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: "bold" },
  plataforma: { fontSize: 12, color: "#888" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#666" },
  descripcion: { marginBottom: 16 },
  genero: { fontWeight: "bold", marginBottom: 4 },
  bio: { color: "#333", fontSize: 13 },
  grid: { gap: 4 },
  postImage: {
    width: imageSize,
    height: imageSize,
    margin: 2,
    borderRadius: 6,
  },
});

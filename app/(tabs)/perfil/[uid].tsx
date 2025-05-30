import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
import { firestore } from "../../../config/firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import BottomTabBar from "../../comp/bottom-tab-bar";

const { width } = Dimensions.get("window");
const imageSize = (width - 36) / 2;

const truncarTexto = (texto: string, max: number) => {
  return texto.length > max ? texto.slice(0, max - 1) + "…" : texto;
};

export default function OtroProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { uid } = useLocalSearchParams(); // UID del otro usuario

  const [perfil, setPerfil] = useState<any>(null);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [seguido, setSeguido] = useState(false);

  useEffect(() => {
    if (!uid || typeof uid !== "string") return;

    const fetchDatos = async () => {
      try {
        const perfilRef = doc(firestore, "usuarios", uid);
        const perfilSnap = await getDoc(perfilRef);
        if (perfilSnap.exists()) setPerfil(perfilSnap.data());

        const pubQuery = query(
          collection(firestore, "publicaciones"),
          where("userId", "==", uid)
        );
        const pubSnap = await getDocs(pubQuery);
        const data = pubSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(data);

        if (user) {
          const miPerfilRef = doc(firestore, "usuarios", user.uid);
          const miPerfilSnap = await getDoc(miPerfilRef);
          const miData = miPerfilSnap.exists() ? miPerfilSnap.data() : {};
          setSeguido(miData.siguiendo?.includes(uid));
        }
      } catch (error) {
        console.error("❌ Error al cargar otro perfil:", error);
      }
    };

    fetchDatos();
  }, [uid]);

  const toggleSeguir = async () => {
    if (!user || !uid) return;

    const miRef = doc(firestore, "usuarios", user.uid);
    if (typeof uid !== "string") return;
    const otroRef = doc(firestore, "usuarios", uid);

    try {
      if (seguido) {
        await updateDoc(miRef, {
          siguiendo: arrayRemove(uid),
        });
        await updateDoc(otroRef, {
          seguidores: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(miRef, {
          siguiendo: arrayUnion(uid),
        });
        await updateDoc(otroRef, {
          seguidores: arrayUnion(user.uid),
        });
      }

      setSeguido(!seguido);
    } catch (err) {
      console.error("❌ Error al seguir:", err);
    }
  };

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
            <Text style={styles.username}>
              {truncarTexto(perfil.username, 18)}
            </Text>
            <Text style={styles.platform}>
              {perfil.plataformaFav || "Sin plataforma"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={toggleSeguir}
          style={[
            styles.seguirBtn,
            seguido && { backgroundColor: "#FF66C4" },
          ]}
        >
          <Text style={styles.seguirText}>
            {seguido ? "Seguido" : "Seguir"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/chats/${uid}`)}
          style={styles.msgBtn}
        >
          <Text style={styles.msgText}>Mensaje</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bio}>
        <Text style={styles.genre}>
          {perfil.generoFav || "Sin género favorito"}
        </Text>
        <Text style={styles.description}>
          {perfil.descripcion ||
            "Jugador/a apasionado/a por los videojuegos 🎮"}
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
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  headerText: {
    maxWidth: width * 0.5,
    overflow: "hidden",
  },
  username: { fontSize: 18, fontWeight: "700" },
  platform: { fontSize: 14, color: "#888" },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  seguirBtn: {
    backgroundColor: "#42BAFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seguirText: {
    color: "#fff",
    fontWeight: "600",
  },
  msgBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  msgText: {
    color: "#fff",
    fontWeight: "600",
  },
  bio: { marginBottom: 16 },
  genre: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  description: { color: "#444" },
  gallery: { gap: 4 },
  postImage: {
    width: imageSize,
    height: imageSize * 1.2,
    margin: 1,
    borderRadius: 10,
  },
});

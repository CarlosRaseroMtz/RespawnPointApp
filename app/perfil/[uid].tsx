import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
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
import { firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import BottomTabBar from "../comp/bottom-tab-bar";

const { width } = Dimensions.get("window");
const imageSize = (width - 36) / 2;

export default function PerfilAjeno() {
  const { uid } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [perfil, setPerfil] = useState<any>(null);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [seguidores, setSeguidores] = useState<any[]>([]);
  const [siguiendo, setSiguiendo] = useState<any[]>([]);
  const [sigo, setSigo] = useState(false);

  useEffect(() => {
    if (!uid || !user) return;

    const cargar = async () => {
      const userRef = doc(firestore, "usuarios", uid as string);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setPerfil(userSnap.data());

      const publiQuery = query(
        collection(firestore, "publicaciones"),
        where("userId", "==", uid)
      );
      const publiSnap = await getDocs(publiQuery);
      const data = publiSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPublicaciones(data);

      // Seguidores
      const seguidoresSnap = await getDocs(
        collection(firestore, "usuarios", uid as string, "seguidores")
      );
      setSeguidores(seguidoresSnap.docs);

      // Siguiendo
      const siguiendoSnap = await getDocs(
        collection(firestore, "usuarios", uid as string, "siguiendo")
      );
      setSiguiendo(siguiendoSnap.docs);

      // ¿Ya lo sigo?
      const yoSigoRef = doc(
        firestore,
        "usuarios",
        uid as string,
        "seguidores",
        user.uid
      );
      const yoSigoSnap = await getDoc(yoSigoRef);
      setSigo(yoSigoSnap.exists());
    };

    cargar();
  }, [uid]);

  const handleToggleSeguir = async () => {
    if (!user) return; // <- solución simple y segura
    const ref = doc(firestore, "usuarios", uid as string, "seguidores", user.uid);
    if (sigo) {
      await deleteDoc(ref);
      setSigo(false);
    } else {
      await setDoc(ref, {
        uid: user.uid,
        username: user.displayName,
        avatar: user.photoURL,
      });
      setSigo(true);
    }
  };

  const enviarMensaje = () => {
    router.push(`/chats/${uid}`);
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
            <Text style={styles.username}>{perfil.username}</Text>
            <Text style={styles.platform}>
              {perfil.plataformaFav || "Sin plataforma"}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{publicaciones.length}</Text>
          <Text style={styles.statLabel}>Contenido</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{seguidores.length}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{siguiendo.length}</Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.followBtn, sigo ? styles.following : styles.follow]}
          onPress={handleToggleSeguir}
        >
          <Text style={styles.followBtnText}>
            {sigo ? "Siguiendo" : "Seguir"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageBtn} onPress={enviarMensaje}>
          <Text style={styles.messageBtnText}>Mensaje</Text>
        </TouchableOpacity>
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
  headerText: {
    maxWidth: width * 0.5,
    overflow: "hidden",
  },
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  followBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  follow: {
    backgroundColor: "#42BAFF",
  },
  following: {
    backgroundColor: "#FF66C4",
  },
  followBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageBtn: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  messageBtnText: {
    color: "#000",
    fontWeight: "bold",
  },
  gallery: { gap: 4 },
  postImage: {
    width: imageSize,
    height: imageSize * 1.2,
    margin: 1,
    borderRadius: 10,
  },
});

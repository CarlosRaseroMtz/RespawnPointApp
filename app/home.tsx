import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
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
import { firestore } from "../config/firebase-config";

const { width } = Dimensions.get("window");

const tabs = ["Juegos", "Para ti", "Memes"];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Para ti");
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  // Escuchar Firestore en tiempo real
  useEffect(() => {
    const q = query(
      collection(firestore, "publicaciones"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevosPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(nuevosPosts);
    });

    return () => unsubscribe();
  }, []);

  const renderPost = ({ item }: any) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={require("../assets/images/foto_perfil_isi.jpg")}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.postUser}>
            {item.userId} en {item.comunidadId}
          </Text>
          <Text style={styles.postTime}>
            {formatearFecha(item.timestamp)}
          </Text>
        </View>
        <Entypo name="dots-three-horizontal" size={18} color="#555" />
      </View>

      {item.mediaUrl && (
        <Image
          source={{ uri: item.mediaUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {item.contenido && <Text style={styles.postText}>{item.contenido}</Text>}

      <View style={styles.reactions}>
        <TouchableOpacity style={styles.reactionBtn}>
          <AntDesign name="hearto" size={16} color="#555" />
          <Text style={styles.reactionText}>
            {item.likes?.length || 0} me gusta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn}>
          <Feather name="message-circle" size={16} color="#555" />
          <Text style={styles.reactionText}>0 comentarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomTabBar}>
        <AntDesign name="home" size={24} color="#000" />
        <AntDesign name="clockcircleo" size={24} color="#000" />
        <TouchableOpacity onPress={() => router.push("/create-post")}>
          <AntDesign
            name="pluscircle"
            size={40}
            color="#000"
            style={{ marginTop: -10 }}
          />
        </TouchableOpacity>
        <AntDesign name="bells" size={24} color="#000" />
        <Ionicons name="person-circle-outline" size={26} color="#000" />
      </View>
    </SafeAreaView>
  );
}

// 🔧 Función auxiliar para mostrar fecha
function formatearFecha(timestamp: Timestamp | any) {
  if (!timestamp?.toDate) return "";
  const fecha = timestamp.toDate();
  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  activeUnderline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 4,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUser: {
    fontWeight: "600",
    color: "#000",
  },
  postTime: {
    fontSize: 12,
    color: "#888",
  },
  postImage: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 12,
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  reactions: {
    flexDirection: "row",
    gap: 20,
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reactionText: {
    fontSize: 13,
    color: "#555",
  },
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
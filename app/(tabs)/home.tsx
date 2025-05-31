import { useRouter } from "expo-router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import { crearNotificacion } from "../../utils/crear-notificacion";
import BottomTabBar from "../comp/bottom-tab-bar";
import PostCard from "../comp/post-card"; // ⬅️ nuevo

const tabs = ["Juegos", "Para ti", "Memes"];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Para ti");
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  /* —— carga publicaciones + autor —— */
  useEffect(() => {
    const q = query(
      collection(firestore, "publicaciones"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const arr = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const usnap = await getDoc(doc(firestore, "usuarios", data.userId));
          const autor = usnap.exists() ? usnap.data() : {};
          return {
            id: d.id,
            ...data,
            autor: {
              uid: data.userId,
              username: autor.username ?? "Player",
              fotoPerfil: autor.fotoPerfil ?? null,
            },
          };
        })
      );
      setPosts(arr);
    });
    return unsub;
  }, []);

  /* —— like / unlike —— */
  const toggleLike = async (postId: string, likes: string[]) => {
    if (!user) return;
    const ref = doc(firestore, "publicaciones", postId);
    const yaLike = likes.includes(user.uid);

    await updateDoc(ref, {
      likes: yaLike ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });

    if (!yaLike) {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { userId } = snap.data();
        if (userId !== user.uid) {
          await crearNotificacion({
            paraUid: userId,
            deUid: user.uid,
            contenido: "le ha dado me gusta a tu publicación",
            tipo: "like",
          });
        }
      }
    }
  };

  /* —— render —— */
  const renderPost = ({ item }: any) => (
    <View style={{ marginBottom: 20 }}>
      <PostCard
        post={item}
        autor={item.autor}
        likes={item.likes || []}
        isLiked={item.likes?.includes(user?.uid)}
        onLike={() => toggleLike(item.id, item.likes || [])}
        onComment={() =>
          router.push({ pathname: "/publicacion/[id]", params: { id: item.id } })
        }
        onPress={() =>
          router.push({ pathname: "/publicacion/[id]", params: { id: item.id } })
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* pestañas superior */}
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(t)}>
            <Text
              style={[
                styles.tabText,
                activeTab === t && styles.tabActive,
              ]}
            >
              {t}
            </Text>
            {activeTab === t && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* feed */}
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tabText: { fontSize: 16, color: "#888" },
  tabActive: { color: "#000", fontWeight: "bold" },
  underline: { height: 2, backgroundColor: "#000", marginTop: 4 },
  row: { flexDirection: "row", gap: 20, paddingHorizontal: 4 },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { color: "#555", fontSize: 13 },
});

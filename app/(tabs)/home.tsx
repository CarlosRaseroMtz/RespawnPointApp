import FondoLayout from "@/src/components/FondoLayout";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PostCard from "../../src/components/post-card";
import { useAuth } from "../../src/hooks/useAuth";
import { usePublicacionesFeed } from "../../src/hooks/usePublicacionesFeed";
import * as FeedActions from "../../src/utils/feed-actions";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("foryou");
  const router = useRouter();
  const { user } = useAuth();

  const allPosts = usePublicacionesFeed();
  // Filtrar publicaciones según la pestaña activa
  // "foryou" muestra todas, "games" filtra por videojuegos, "memes" por memes

  const posts = allPosts.filter((post) => {
    const categoria = post.categoria?.toLowerCase?.() || "";
    if (activeTab === "foryou") return true;
    if (activeTab === "games") return categoria === "videojuego";
    if (activeTab === "memes") return categoria === "meme";
    return true;
  });

  const renderPost = ({ item }: any) => (
    <View style={{ marginBottom: 20 }}>
      <PostCard
        post={item}
        autor={item.autor}
        likes={item.likes || []}
        isLiked={item.likes?.includes(user?.uid)}
        onLike={() => {
          if (!user) return;
          FeedActions.toggleLike({
            postId: item.id,
            userUid: user.uid,
            likes: item.likes || [],
          });
        }}
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
    // —— interfaz principal —— */
    <FondoLayout>
      <SafeAreaView style={styles.container}>
        {/* pestañas */}
        <View style={styles.tabs}>
          {["games", "foryou", "memes"].map((key) => (
            <TouchableOpacity key={key} onPress={() => setActiveTab(key)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === key && styles.tabActive,
                ]}
              >
                {t(`home.tabs.${key}`)}
              </Text>
              {activeTab === key && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={posts}
          keyExtractor={(i) => i.id}
          renderItem={renderPost}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </FondoLayout>
  );
}

//* —— estilos —— */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
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
});

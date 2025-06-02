import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PostCard from "../../src/components/post-card"; // ⬅️ nuevo
import { useAuth } from "../../src/hooks/useAuth";
import { usePublicacionesFeed } from "../../src/hooks/usePublicacionesFeed";
import * as FeedActions from "../../src/utils/feed-actions";

const tabs = ["Juegos", "Para ti", "Memes"];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Para ti");
  const router = useRouter();
  const { user } = useAuth();

  /* —— carga publicaciones + autor —— */
  const posts = usePublicacionesFeed();

  /* —— render —— */
  const renderPost = ({ item }: any) => (
    <View style={{ marginBottom: 20 }}>
      <PostCard
        post={item}
        autor={item.autor}
        likes={item.likes || []}
        isLiked={item.likes?.includes(user?.uid)}
        onLike={() => {
          if (!user) return;                     // no llames sin uid
          FeedActions.toggleLike({
            postId: item.id,
            userUid: user.uid,                   // ✅ uid real, sin fallback ""
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 16 },
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

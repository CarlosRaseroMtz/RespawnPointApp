import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* —— tipos —— */
type Post = {
  id: string;
  mediaUrl: string;
  contenido: string;
  categoria?: string;
  likes?: string[];
  timestamp?: any;
};
type Autor = {
  username: string;
  fotoPerfil?: string;
};

interface Props {
  post: Post;
  autor: Autor | null;
  inDetail?: boolean;

  /* acciones */
  likes?: string[];
  commentsCount?: number;        // 👈 NUEVO
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onPress?: () => void;
  onAuthorPress?: () => void;    // 👈 NUEVO
}

export default function PostCard({
  post,
  autor,
  inDetail = false,
  likes = [],
  commentsCount = 0,
  isLiked = false,
  onLike,
  onComment,
  onPress,
  onAuthorPress,
}: Props) {
  return (
    <View style={styles.card}>
      {/* —— header —— */}
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.8}
        onPress={onAuthorPress}
      >
        <Image
          source={{
            uri:
              autor?.fotoPerfil ??
              "https://i.pravatar.cc/100?u=" + autor?.username,
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{autor?.username ?? "Player"}</Text>
      </TouchableOpacity>

      {/* —— media —— */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Image source={{ uri: post.mediaUrl || "https://via.placeholder.com/400x300" }} style={styles.media} />
      </TouchableOpacity>

      {/* —— meta (chip) —— */}
      {post.categoria && (
        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{post.categoria}</Text>
          </View>
        </View>
      )}

      {/* —— caption —— */}
      {post.contenido ? (
        <Text numberOfLines={inDetail ? undefined : 3} style={styles.caption}>
          {post.contenido}
        </Text>
      ) : null}

      {/* —— acciones —— */}
      <View style={styles.actionRow}>
        {/* Like */}
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={18}
            color={isLiked ? "#FF66C4" : "#555"}
          />
          <Text style={styles.actionText}>{likes.length} me gusta</Text>
        </TouchableOpacity>

        {/* Comentarios */}
        <TouchableOpacity style={styles.action} onPress={onComment}>
          <Feather
            name="message-circle"
            size={18}
            color={commentsCount ? "#42BAFF" : "#555"}
          />
          <Text
            style={[
              styles.actionText,
              commentsCount ? { color: "#42BAFF", fontWeight: "600" } : null,
            ]}
          >
            {commentsCount ? commentsCount : ""} Comentarios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* —— estilos —— */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  avatar: { width: 32, height: 32, borderRadius: 16, borderColor: "#FF66C4", },
  username: { fontWeight: "600", color: "#000" },

  media: { width: "100%", height: 240, backgroundColor: "#ddd" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  chip: {
    backgroundColor: "#FF66C4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  chipText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  caption: { padding: 12, color: "#000" },

  /* acciones */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 13, color: "#555" },
});

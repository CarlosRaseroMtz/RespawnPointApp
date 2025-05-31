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
  /* Mostrar texto completo cuando true (detalle) */
  inDetail?: boolean;

  /* —— acciones ——— */
  likes?: string[];
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  /* Pulsar la imagen / tarjeta */
  onPress?: () => void;
}

export default function PostCard({
  post,
  autor,
  inDetail = false,
  likes = [],
  isLiked = false,
  onLike,
  onComment,
  onPress,
}: Props) {
  return (
    <View style={styles.card}>
      {/* —— header —— */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              autor?.fotoPerfil ??
              "https://i.pravatar.cc/100?u=" + autor?.username,
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{autor?.username ?? "Player"}</Text>
      </View>

      {/* —— media —— */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Image source={{ uri: post.mediaUrl }} style={styles.media} />
      </TouchableOpacity>

      {/* —— meta fila (chip + mini like) —— */}
      <View style={styles.metaRow}>
        {post.categoria && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{post.categoria}</Text>
          </View>
        )}
      </View>

      {/* —— caption —— */}
      {post.contenido ? (
        <Text
          numberOfLines={inDetail ? undefined : 3}
          style={styles.caption}
        >
          {post.contenido}
        </Text>
      ) : null}
      {/* —— acciones —— */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={18}
            color={isLiked ? "red" : "#555"}
          />
          <Text style={styles.actionText}>{likes.length} me gusta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onComment}>
          <Feather name="message-circle" size={18} color="#555" />
          <Text style={styles.actionText}>Comentarios</Text>
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
  avatar: { width: 32, height: 32, borderRadius: 16 },
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

  likeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  likeText: { color: "#000", fontSize: 12 },

  caption: { padding: 12, color: "#000" },

  /* —— acciones —— */
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

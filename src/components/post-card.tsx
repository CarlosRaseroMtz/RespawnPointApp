import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Datos de un post.
 */
type Post = {
  /** ID del post. */
  id: string;
  /** URL de la imagen o video principal. */
  mediaUrl: string;
  /** Contenido textual del post. */
  contenido: string;
  /** Categoría del post (opcional). */
  categoria?: string;
  /** Lista de IDs de usuarios que han dado like. */
  likes?: string[];
  /** Timestamp de creación del post. */
  timestamp?: any;
};

/**
 * Información del autor del post.
 */
type Autor = {
  /** Nombre de usuario. */
  username: string;
  /** URL de la foto de perfil (opcional). */
  fotoPerfil?: string;
};

/**
 * Props del componente PostCard.
 */
interface Props {
  /** Objeto con los datos del post. */
  post: Post;
  /** Información del autor del post (puede ser null). */
  autor: Autor | null;
  /** Indica si se está mostrando en la vista de detalle. */
  inDetail?: boolean;
  /** Lista de usuarios que han dado like. */
  likes?: string[];
  /** Número de comentarios. */
  commentsCount?: number;
  /** Si el usuario actual ha dado like. */
  isLiked?: boolean;
  /** Callback para manejar el like. */
  onLike?: () => void;
  /** Callback para manejar el comentario. */
  onComment?: () => void;
  /** Callback al presionar la tarjeta completa. */
  onPress?: () => void;
  /** Callback al presionar al autor. */
  onAuthorPress?: () => void;
}

/**
 * Componente visual que representa una tarjeta de post.
 * Incluye: avatar del autor, imagen del post, contenido, categoría, likes y comentarios.
 *
 * Admite callbacks para interacciones como: dar like, comentar, abrir detalle o perfil del autor.
 *
 * @param {Props} props Propiedades del componente.
 * @returns {JSX.Element} Tarjeta de post renderizada.
 */
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
}: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    //* —— componente de tarjeta de post —— */
    <View style={styles.card}>
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

      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Image
          source={{ uri: post.mediaUrl || "https://via.placeholder.com/400x300" }}
          style={styles.media}
        />
      </TouchableOpacity>

      {post.categoria && (
        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{post.categoria}</Text>
          </View>
        </View>
      )}

      {post.contenido ? (
        <Text numberOfLines={inDetail ? undefined : 3} style={styles.caption}>
          {post.contenido}
        </Text>
      ) : null}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={18}
            color={isLiked ? "#FF66C4" : "#555"}
          />
          <Text style={styles.actionText}>
            {likes.length} {t("postP.likes")}
          </Text>
        </TouchableOpacity>

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
            {commentsCount ? commentsCount + " " : ""}
            {t("postP.comments")}
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: "#FF66C4",
  },
  username: {
    fontWeight: "600",
    color: "#000",
  },
  media: {
    width: "100%",
    height: 240,
    backgroundColor: "#ddd",
  },
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
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  caption: {
    padding: 12,
    color: "#000",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: "#555",
  },
});

import FondoLayout from "@/src/components/FondoLayout";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PostCard from "../../../src/components/post-card";
import { useAuth } from "../../../src/hooks/useAuth";
import { firestore } from "../../../src/services/config/firebase-config";
import { comentarPublicacion } from "../../../src/utils/feed-actions";

type Publicacion = {
  id: string;
  userId: string;
  mediaUrl: string;
  contenido: string;
  categoria?: string;
  likes: string[];
  commentsCount?: number;
  timestamp: Timestamp;
};

type Comentario = {
  id: string;
  userId: string;
  texto: string;
  timestamp: Timestamp;
  autor: { username: string; fotoPerfil?: string };
};

export default function PublicacionDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [post, setPost] = useState<Publicacion>();
  const [autor, setAutor] = useState<any>();
  const [comentarios, setComs] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);

  const flatRef = useRef<FlatList>(null);

  // Redirigir al usuario si no hay ID de publicación
  useEffect(() => {
    if (!id) return;
    const ref = doc(firestore, "publicaciones", id);

    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) return;
      const data = { id: snap.id, ...snap.data() } as Publicacion;
      setPost(data);

      const uSnap = await getDoc(doc(firestore, "usuarios", data.userId));
      uSnap.exists() && setAutor(uSnap.data());
      setLoading(false);
    });

    return unsub;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(firestore, "publicaciones", id, "comentarios"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const arr = await Promise.all(
        snap.docs.map(async (d) => {
          const c = d.data();
          const textoReal = c.texto ?? c.mensaje ?? c.contenido ?? "";
          const usnap = await getDoc(doc(firestore, "usuarios", c.userId));
          const autor = usnap.exists()
            ? {
                username: usnap.data().username,
                fotoPerfil: usnap.data().fotoPerfil,
              }
            : { username: "Player" };

          return { id: d.id, ...c, texto: textoReal, autor } as Comentario;
        })
      );
      arr.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
      setComs(arr);
    });

    return unsub;
  }, [id]);

  const toggleLike = async () => {
    if (!post || !user) return;
    const ref = doc(firestore, "publicaciones", post.id);
    const ya = post.likes.includes(user.uid);
    await updateDoc(ref, {
      likes: ya ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const enviarComentario = async () => {
    if (!user || !texto.trim()) return;

    try {
      await comentarPublicacion({
        publicacionId: post?.id ?? "",
        contenido: texto,
        autorUid: user.uid,
      });

      setTexto("");
    } catch (error) {
      console.error("❌ Error al comentar:", error);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    //* ——— interfaz principal —— */
    <FondoLayout>
      <FlatList
        ref={flatRef}
        data={comentarios}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          post &&
          autor && (
            <PostCard
              post={post}
              autor={autor}
              inDetail
              likes={post.likes}
              commentsCount={post.commentsCount ?? 0}
              isLiked={post.likes.includes(user?.uid ?? "")}
              onLike={toggleLike}
              onComment={() =>
                flatRef.current?.scrollToEnd({ animated: true })
              }
              onPress={() => {}}
              onAuthorPress={() =>
                router.push({
                  pathname: "/perfil/[uid]",
                  params: { uid: post.userId },
                })
              }
            />
          )
        }
        renderItem={({ item }) => (
          <View style={styles.coment}>
            <Image
              source={{
                uri:
                  item.autor.fotoPerfil ??
                  "https://i.pravatar.cc/100?u=" + item.autor.username,
              }}
              style={styles.comAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.comAutor}>{item.autor.username}</Text>
              <Text style={styles.comTexto}>{item.texto}</Text>
              <Text style={styles.comFecha}>
                {item.timestamp.toDate().toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        )}
      />

      {user && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={t("post.writeComment")}
              value={texto}
              onChangeText={setTexto}
              placeholderTextColor="#666"
            />
            <TouchableOpacity onPress={enviarComentario}>
              <Text style={styles.enviar}>{t("post.send")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </FondoLayout>
  );
}

////* —— estilos —— */
const styles = StyleSheet.create({
  coment: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  comAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF66C4",
  },
  comTexto: { color: "#000", marginTop: 2 },
  comAutor: { fontWeight: "600" },
  comFecha: { fontSize: 10, color: "#888", marginTop: 2 },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  enviar: { color: "#FF66C4", fontWeight: "600" },
});

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { firestore } from "../../../config/firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { crearNotificacion } from "../../../utils/crear-notificacion";


export default function PublicacionScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEditado, setTextoEditado] = useState("");

  useEffect(() => {
    if (!id) return;
    const cargarPublicacion = async () => {
      const ref = doc(firestore, "publicaciones", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) setPost(snap.data());
    };
    cargarPublicacion();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const ref = collection(firestore, "publicaciones", id as string, "comentarios");
    const unsubscribe = onSnapshot(ref, async (snap) => {
      const rawComentarios = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const enriched = await Promise.all(
        rawComentarios.map(async (comentario: any) => {
          try {
            const userSnap = await getDoc(doc(firestore, "usuarios", comentario.userId));
            const perfil = userSnap.exists() ? userSnap.data() : null;
            return {
              ...comentario,
              autor: {
                username: perfil?.username || "Usuario",
                fotoPerfil: perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=1",
              },
            };
          } catch {
            return comentario;
          }
        })
      );

      // Ordenar por fecha descendente
      setComentarios(enriched.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    });

    return () => unsubscribe();
  }, [id]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim() || !user) return;

    const comentario = {
      contenido: nuevoComentario.trim(),
      userId: user.uid,
      timestamp: Timestamp.now(),
    };

    try {
      await addDoc(
        collection(firestore, "publicaciones", id as string, "comentarios"),
        comentario
      );
      setNuevoComentario("");

      if (post?.userId && user?.uid !== post.userId) {
        await crearNotificacion({
          paraUid: post.userId,
          deUid: user.uid,
          contenido: "ha comentado tu publicación",
          tipo: "comentario",
        });
      }

    } catch (error) {
      console.error("❌ Error al comentar:", error);
    }
  };


  const eliminarComentario = async (comentarioId: string) => {
    try {
      const ref = doc(firestore, "publicaciones", id as string, "comentarios", comentarioId);
      await deleteDoc(ref);
    } catch (error) {
      console.error("❌ Error al eliminar comentario:", error);
    }
  };

  const editarComentario = async (comentarioId: string) => {
    try {
      const ref = doc(firestore, "publicaciones", id as string, "comentarios", comentarioId);
      await updateDoc(ref, { contenido: textoEditado });
      setEditandoId(null);
      setTextoEditado("");
    } catch (error) {
      console.error("❌ Error al editar comentario:", error);
    }
  };

  if (!post) return <Text style={{ padding: 20 }}>Cargando publicación...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Image source={{ uri: post.mediaUrl }} style={styles.imagen} />
        <Text style={styles.texto}>{post.contenido}</Text>

        <View style={styles.divisor} />
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => {
                if (item.userId === user?.uid) {
                  Alert.alert("Comentario", "¿Qué deseas hacer?", [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Editar",
                      onPress: () => {
                        setEditandoId(item.id);
                        setTextoEditado(item.contenido);
                      },
                    },
                    {
                      text: "Eliminar",
                      style: "destructive",
                      onPress: () => eliminarComentario(item.id),
                    },
                  ]);
                }
              }}
              delayLongPress={500}
            >
              <View style={styles.comentario}>
                <Image source={{ uri: item.autor?.fotoPerfil }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.username}>{item.autor?.username}</Text>

                  {editandoId === item.id ? (
                    <>
                      <TextInput
                        style={[styles.input, { marginBottom: 4 }]}
                        value={textoEditado}
                        onChangeText={setTextoEditado}
                      />
                      <TouchableOpacity
                        onPress={() => editarComentario(item.id)}
                        style={[styles.sendBtn, { alignSelf: "flex-end" }]}
                      >
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.comentarioTexto}>{item.contenido}</Text>
                      <Text style={styles.comentarioHora}>
                        {item.timestamp?.toDate().toLocaleString("es-ES")}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
        />
        <TouchableOpacity onPress={enviarComentario} style={styles.sendBtn}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  back: { marginBottom: 10 },
  imagen: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  texto: {
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
  },
  divisor: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  comentario: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  username: {
    fontWeight: "600",
    fontSize: 13,
    color: "#000",
    marginBottom: 2,
  },
  comentarioTexto: {
    color: "#000",
    fontSize: 14,
  },
  comentarioHora: {
    fontSize: 11,
    color: "#999",
  },
  inputArea: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#FF66C4",
    padding: 10,
    borderRadius: 50,
  },
});

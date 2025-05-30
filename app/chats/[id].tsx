import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ⬇️  ruta intacta: dos niveles arriba desde app/chats */
import { firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";

export default function ChatScreen() {
  /* tipamos el parámetro */
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuth();
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const flatListRef = useRef<FlatList>(null);

  /* ----------- listener de mensajes ----------- */
  useEffect(() => {
    if (!id || !user?.uid) return;

    const q = query(
      collection(firestore, "chats", id, "mensajes"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMensajes(data);

      /* marcar como leído */
      data.forEach(async (msg: any) => {
        if (msg.userId !== user.uid && !msg.leidoPor?.includes(user.uid)) {
          try {
            await updateDoc(
              doc(firestore, "chats", id, "mensajes", msg.id),
              { leidoPor: [...(msg.leidoPor || []), user.uid] }
            );
          } catch (e) {
            console.error("❌ update leído:", e);
          }
        }
      });

      /* scroll al final */
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return unsub;
  }, [id, user?.uid]);

  /* ----------- enviar mensaje ----------- */
  const enviar = async () => {
    if (!texto.trim() || !user || !id) return;

    const chatRef = doc(firestore, "chats", id);

    await addDoc(collection(chatRef, "mensajes"), {
      userId: user.uid,
      texto: texto.trim(),
      timestamp: Timestamp.now(),
      leidoPor: [],
    });

    await updateDoc(chatRef, {
      lastMessage: texto.trim(),
      timestamp: Timestamp.now(),
    });

    setTexto("");
  };

  /* ----------- UI ----------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.burbuja,
                item.userId === user?.uid ? styles.mia : styles.suya,
              ]}
            >
              <Text style={styles.texto}>{item.texto}</Text>
              <Text style={styles.hora}>
                {item.timestamp?.toDate().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        />

        <SafeAreaView edges={["bottom"]} style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={texto}
            onChangeText={setTexto}
          />
          <TouchableOpacity style={styles.btn} onPress={enviar}>
            <Text style={{ color: "#fff" }}>Enviar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

/* ----------- estilos ----------- */
const styles = StyleSheet.create({
  burbuja: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  mia: {
    backgroundColor: "#FF66C4",
    alignSelf: "flex-end",
  },
  suya: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  texto: { color: "#000" },
  hora: { fontSize: 10, color: "#666", marginTop: 4 },
  inputArea: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
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
  btn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});

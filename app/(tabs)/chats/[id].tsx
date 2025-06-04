import { useAuth } from "@/src/hooks/useAuth";
import { useMarcarMensajesLeidos } from "@/src/hooks/useMarcarMensajesLeidos";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import FondoLayout from "../../../src/components/FondoLayout";
import { firestore } from "../../../src/services/config/firebase-config";

export default function ChatScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chatId } = useLocalSearchParams(); 
  const { user } = useAuth();
  const { marcarMensajesComoLeidos } = useMarcarMensajesLeidos();

  const [mensajes, setMensajes] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Marcar mensajes como leídos al entrar al chat
  // Se usa useFocusEffect para asegurarse de que se ejecute al entrar en el chat
  useFocusEffect(
    useCallback(() => {
      if (user?.uid && typeof chatId === "string") {
        marcarMensajesComoLeidos(chatId, user.uid);
      }
    }, [chatId, user?.uid])
  );

  useEffect(() => {
    if (!id || !user?.uid) return;

    const q = query(
      collection(firestore, "chats", id, "mensajes"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMensajes(data);

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

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return unsub;
  }, [id, user?.uid]);

  const enviar = async () => {
    if (!texto.trim() || !user || !id) return;

    const chatRef = doc(firestore, "chats", id);

    await addDoc(collection(chatRef, "mensajes"), {
      userId: user.uid,
      contenido: texto.trim(),
      timestamp: serverTimestamp(),
      leidoPor: [user.uid],
    });

    await updateDoc(chatRef, {
      lastMessage: texto.trim(),
      timestamp: Timestamp.now(),
    });

    setTexto("");
  };

  return (
      // Renderiza el layout del chat
    <FondoLayout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
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
              <Text style={styles.texto}>
                {item.contenido || item.texto || t("chat.noContent")}
              </Text>
              <Text style={styles.hora}>
                {item.timestamp?.toDate().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder={t("chat.placeholder")}
            value={texto}
            onChangeText={setTexto}
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.btn} onPress={enviar}>
            <Text style={{ color: "#fff" }}>{t("chat.send")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </FondoLayout>
  );
}

//* —— estilos —— */
const styles = StyleSheet.create({
  burbuja: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  mia: {
    backgroundColor: "#f9a6d9",
    alignSelf: "flex-end",
  },
  suya: {
    backgroundColor: "#87cbf2",
    alignSelf: "flex-start",
  },
  texto: { color: "#000" },
  hora: { fontSize: 10, color: "#666", marginTop: 4 },
  inputArea: {
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
  btn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});

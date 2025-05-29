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
import React, { useEffect, useRef, useState } from "react";
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
import { firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // chatId
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(firestore, "chats", id as string, "mensajes"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensajes(data);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => unsub();
  }, [id]);

  const enviar = async () => {
    if (!texto.trim() || !user || !id) return;

    const ref = doc(firestore, "chats", id as string);

    await addDoc(collection(ref, "mensajes"), {
      userId: user.uid,
      texto: texto.trim(),
      timestamp: Timestamp.now(),
      leido: false,
    });

    await updateDoc(ref, {
      ultimoMensaje: texto.trim(),
      timestamp: Timestamp.now(),
    });

    setTexto("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
  texto: {
    color: "#000",
  },
  hora: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
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
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";
import BottomTabBar from "./comp/bottom-tab-bar";

const tabs = ["Usuarios", "Comunidades", "Torneos"];

export default function ChatsScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "chats"),
      where("participantes", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      const resultados = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otroUid = data.participantes.find((uid: string) => uid !== user.uid);
          const userSnap = await getDoc(doc(firestore, "usuarios", otroUid));
          const userInfo = userSnap.exists() ? userSnap.data() : {};

          return {
            id: docSnap.id,
            tipo: data.tipo || "usuario",
            nombre: userInfo.username || "Usuario",
            avatar: userInfo.fotoPerfil || "https://i.pravatar.cc/150?img=2",
            lastMessage: data.lastMessage || "",
            timestamp: data.timestamp?.toDate().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }) || "",
          };
        })
      );
      setChats(resultados);
    });

    return () => unsubscribe();
  }, [user]);

  const buscarUsuarios = async () => {
    const ref = collection(firestore, "usuarios");
    const snap = await getDocs(ref);
    type Usuario = {
      id: string;
      username: string;
      fotoPerfil?: string;
    };

    const encontrados: Usuario[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Usuario[];

    const filtrados = encontrados.filter(
      (u) =>
        u.username?.toLowerCase().includes(busqueda.toLowerCase()) &&
        u.id !== user?.uid
    );

    setResultados(filtrados);

    if (filtrados.length === 0) {
      setResultados([{ id: "no-results", username: "No se encontraron usuarios" }]);
    }
  };

  const iniciarChatCon = async (usuario: any) => {
    if (!user) return;

    const q = query(
      collection(firestore, "chats"),
      where("participantes", "array-contains", user.uid)
    );
    const snap = await getDocs(q);

    const existente = snap.docs.find((doc) => {
      const p = doc.data().participantes;
      return p.includes(usuario.id) && p.length === 2;
    });

    if (existente) {
      router.push(`./chat/${existente.id}`);
      return;
    }

    const chatId = `${user.uid}_${usuario.id}`;
    await setDoc(doc(firestore, "chats", chatId), {
      participantes: [user.uid, usuario.id],
      tipo: "usuario",
      timestamp: new Date(),
      lastMessage: "",
    });

    router.push(`./chats/${chatId}`);
  };

  const userChats = chats.filter((c) => c.tipo === "usuario");
  const groupChats = chats.filter((c) => c.tipo === "grupo");

  const chatsToShow =
    activeTab === "Usuarios"
      ? userChats
      : activeTab === "Comunidades"
        ? groupChats
        : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chats de</Text>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => tab !== "Torneos" && setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
              tab === "Torneos" && styles.disabledTab,
            ]}
            disabled={tab === "Torneos"}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
                tab === "Torneos" && styles.disabledText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Buscar usuarios..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 12,
        }}
        value={busqueda}
        onChangeText={(text) => {
          setBusqueda(text);
          if (text.length >= 2) buscarUsuarios();
          else setResultados([]);
        }}
      />

      {resultados.map((u) => (
        <TouchableOpacity
          key={u.id}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          onPress={() => iniciarChatCon(u)}
        >
          <Image
            source={{ uri: u.fotoPerfil }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <Text style={{ fontSize: 16 }}>{u.username}</Text>
        </TouchableOpacity>
      ))}

      <ScrollView>
        {chatsToShow.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => router.push(`./chats/${chat.id}`)}
          >
            <View style={styles.chatRow}>
              <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <Text style={styles.name}>
                  {chat.nombre} {" "}
                  <Text style={styles.time}>{chat.timestamp}</Text>
                </Text>
                <Text style={styles.message}>{chat.lastMessage}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {busqueda.length > 0 && resultados.length > 0 && (
        <>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>Usuarios encontrados:</Text>
          {resultados.map((usuario) => (
            <TouchableOpacity
              key={usuario.id}
              style={styles.chatItem}
              onPress={() => iniciarChatCon(usuario)}
            >
              <View style={styles.chatRow}>
                <Image source={{ uri: usuario.fotoPerfil }} style={styles.avatar} />
                <View style={styles.chatInfo}>
                  <Text style={styles.name}>{usuario.username}</Text>
                  <Text style={styles.message}>Pulsar para chatear</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: "#FF66C4",
  },
  disabledTab: {
    backgroundColor: "#ddd",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  disabledText: {
    color: "#aaa",
  },
  chatItem: {
    marginBottom: 20,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
  },
  message: {
    color: "#555",
    marginTop: 2,
  },
  time: {
    fontWeight: "400",
    color: "#888",
    fontSize: 12,
  },
});

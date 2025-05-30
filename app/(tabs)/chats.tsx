import { useRouter } from "expo-router";
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
import { useEffect, useState } from "react";
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

/* 👈 sigue siendo dos niveles arriba desde (tabs) */
import { firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";

/* ❌ BottomTabBar ya no hace falta porque usamos <Tabs>.
   Si todavía lo quieres como extra UI, importa con:
   import BottomTabBar from "../../comp/bottom-tab-bar";
*/

const tabs = ["Usuarios", "Comunidades", "Torneos"];

export default function ChatsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Usuarios");
  const [chats, setChats] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);

  /* ---------- listener de todos mis chats ---------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "chats"),
      where("participantes", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const res = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const otroUid = data.participantes.find((uid: string) => uid !== user.uid);
          const otroSnap = await getDoc(doc(firestore, "usuarios", otroUid));
          const userInfo = otroSnap.exists() ? otroSnap.data() : {};

          return {
            id: d.id,
            tipo: data.tipo ?? "usuario",
            nombre: userInfo.username ?? "Usuario",
            avatar: userInfo.fotoPerfil ?? "https://i.pravatar.cc/150?img=2",
            lastMessage: data.lastMessage ?? "",
            timestamp:
              data.timestamp?.toDate().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              }) ?? "",
          };
        })
      );
      setChats(res);
    });

    return unsub;
  }, [user]);

  /* ---------- búsqueda de usuarios ---------- */
  const buscarUsuarios = async () => {
    const snap = await getDocs(collection(firestore, "usuarios"));

    const encontrados = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as { id: string; username: string; fotoPerfil?: string }[];

    const filtrados = encontrados.filter(
      (u) =>
        u.username?.toLowerCase().includes(busqueda.toLowerCase()) &&
        u.id !== user?.uid
    );

    setResultados(
      filtrados.length ? filtrados : [{ id: "no-results", username: "No se encontraron usuarios" }]
    );
  };

  /* ---------- iniciar chat ---------- */
  const iniciarChatCon = async (usuario: any) => {
    if (!user) return;

    // ¿Existe ya un chat 1-a-1?
    const q = query(
      collection(firestore, "chats"),
      where("participantes", "array-contains", user.uid)
    );
    const snap = await getDocs(q);
    const existente = snap.docs.find((d) => {
      const p = d.data().participantes;
      return p.includes(usuario.id) && p.length === 2;
    });

    if (existente) {
      router.push(`./chats/${existente.id}`);         // ✅ ruta absoluta
      return;
    }

    // Nuevo chat
    const chatId = `${user.uid}_${usuario.id}`;
    await setDoc(doc(firestore, "chats", chatId), {
      participantes: [user.uid, usuario.id],
      tipo: "usuario",
      timestamp: new Date(),
      lastMessage: "",
    });

    router.push(`./chats/${chatId}`);                // ✅
  };

  /* ---------- filtros de pestaña ---------- */
  const userChats  = chats.filter((c) => c.tipo === "usuario");
  const groupChats = chats.filter((c) => c.tipo === "grupo");

  const chatsToShow =
    activeTab === "Usuarios"
      ? userChats
      : activeTab === "Comunidades"
      ? groupChats
      : [];

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      {/* pestañas */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => tab === "Torneos" ? null : setActiveTab(tab)}
            disabled={tab === "Torneos"}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
              tab === "Torneos" && { opacity: 0.5 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* búsqueda */}
      <TextInput
        placeholder="Buscar usuarios..."
        style={styles.search}
        value={busqueda}
        onChangeText={(text) => {
          setBusqueda(text);
          if (text.length >= 2) buscarUsuarios();
          else setResultados([]);
        }}
      />

      {/* resultados de búsqueda */}
      {resultados.map((u) => (
        <TouchableOpacity
          key={u.id}
          style={styles.searchItem}
          onPress={() => iniciarChatCon(u)}
          disabled={u.id === "no-results"}
        >
          <Image
            source={{ uri: u.fotoPerfil ?? "https://i.pravatar.cc/150?img=1" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{u.username}</Text>
        </TouchableOpacity>
      ))}

      {/* lista de chats */}
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
                  {chat.nombre}{" "}
                  <Text style={styles.time}>{chat.timestamp}</Text>
                </Text>
                <Text style={styles.message}>{chat.lastMessage}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: { backgroundColor: "#FF66C4" },
  tabText: { color: "#666", fontWeight: "500" },
  activeTabText: { color: "#fff" },
  search: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
  },
  searchItem: {
    flexDirection: "row", alignItems: "center", marginBottom: 10,
  },
  chatItem: { marginBottom: 20 },
  chatRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  chatInfo: { flex: 1 },
  name: { fontWeight: "600", color: "#000", fontSize: 16 },
  message: { color: "#555", marginTop: 2 },
  time: { fontWeight: "400", color: "#888", fontSize: 12 },
});

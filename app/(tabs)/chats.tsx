import FondoLayout from "@/src/components/FondoLayout";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ChatItem from "../../src/components/ChatItem";
import { useAuth } from "../../src/hooks/useAuth";
import { useChats } from "../../src/hooks/useChats";
import { firestore } from "../../src/services/config/firebase-config";
import { buscarUsuarios } from "../../src/utils/buscar-usuarios";

const tabs = ["Usuarios", "Comunidades", "Torneos"];

export default function ChatsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Usuarios");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [modoCrearGrupo, setModoCrearGrupo] = useState(false);
  const [participantesGrupo, setParticipantesGrupo] = useState<string[]>([]);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [avatarGrupo, setAvatarGrupo] = useState<string | null>(null);

  const toggleSeleccionUsuario = (id: string) => {
    setParticipantesGrupo(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const chats = useChats();

  // Función para buscar usuarios
  // Se filtran los usuarios por el texto ingresado y el ID del usuario actual
  const handleBuscarUsuarios = async (text: string) => {
    setBusqueda(text);
    if (text.length >= 2 && user?.uid) {
      const resultadosFiltrados = await buscarUsuarios(text, user.uid);
      setResultados(resultadosFiltrados);
    } else {
      setResultados([]);
    }
  };
  // Función para iniciar un chat con un usuario

  const iniciarChatCon = async (usuario: any) => {
    if (!user) return;

    const usuarioId = usuario.uid || usuario.id;
    if (!usuarioId) return;

    const q = query(collection(firestore, "chats"), where("participantes", "array-contains", user.uid));
    const snap = await getDocs(q);
    const existente = snap.docs.find((d) => {
      const p = d.data().participantes;
      return p.includes(usuarioId) && p.length === 2;
    });

    if (existente) {
      router.push(`/chats/${existente.id}`);
      return;
    }

    const chatId = `${user.uid}_${usuarioId}`;
    await setDoc(doc(firestore, "chats", chatId), {
      participantes: [user.uid, usuarioId],
      tipo: "usuario",
      timestamp: Timestamp.now(),
      lastMessage: "",
    });

    router.push(`/chats/${chatId}`);
  };

  const userChats = chats.filter((c: { tipo: string }) => c.tipo === "usuario");
  const groupChats = chats.filter((c: { tipo: string }) => c.tipo === "grupo");

  const chatsToShow =
    activeTab === "Usuarios" ? userChats :
    activeTab === "Comunidades" ? groupChats :
    [];


  // Función para crear un nuevo grupo
  // Se crea un nuevo chat con los participantes seleccionados
  const crearGrupo = async () => {
    if (!user || participantesGrupo.length < 1) return;

    const nuevoChatRef = await addDoc(collection(firestore, "chats"), {
      participantes: [user.uid, ...participantesGrupo],
      tipo: "grupo",
      timestamp: new Date(),
      lastMessage: "",
      //nombreC: nombreGrupo || "Nuevo Grupo", -- no me funca :(
      //avatarC: avatarGrupo || "https://i.pravatar.cc/150?img=1", -- no me funca :(
    });

    setModoCrearGrupo(false);
    setParticipantesGrupo([]);
    router.push(`/chats/${nuevoChatRef.id}`);
  };

  const handleSeleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarGrupo(result.assets[0].uri);
    }
  };

  return (
    // Renderizado del componente principal
    <FondoLayout>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{t("chats.title")}</Text>

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
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {t(`chats.tabs.${tab.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder={t("chats.search")}
          style={styles.search}
          value={busqueda}
          onChangeText={handleBuscarUsuarios}
        />

        {activeTab === "Comunidades" && (
          <>
            {modoCrearGrupo ? (
              <>
                <TextInput
                  placeholder={t("chats.groupName")}
                  value={nombreGrupo}
                  onChangeText={setNombreGrupo}
                  style={styles.search}
                />
                <TouchableOpacity onPress={handleSeleccionarImagen} style={{ marginBottom: 10 }}>
                  <Text style={{ color: "#42BAFF", textAlign: "center" }}>
                    {t("chats.selectPhoto")}
                  </Text>
                </TouchableOpacity>
                {avatarGrupo && (
                  <Image
                    source={{ uri: avatarGrupo }}
                    style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center", marginBottom: 10 }}
                  />
                )}
                <TouchableOpacity style={{ backgroundColor: "#42BAFF", padding: 10, borderRadius: 8, marginBottom: 10 }} onPress={crearGrupo}>
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {t("chats.confirmGroup", { count: participantesGrupo.length })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setModoCrearGrupo(false);
                  setParticipantesGrupo([]);
                }}>
                  <Text style={{ color: "#888", marginBottom: 10 }}>{t("chats.cancel")}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={{ backgroundColor: "#FF66C4", padding: 10, borderRadius: 8, marginBottom: 10 }} onPress={() => setModoCrearGrupo(true)}>
                <Text style={{ color: "white", textAlign: "center" }}>{t("chats.createGroup")}</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {resultados.map((u) => {
          const seleccionado = participantesGrupo.includes(u.id);
          return (
            <TouchableOpacity
              key={u.id ?? u.username}
              style={[styles.searchItem, { opacity: u.id === "no-results" ? 0.5 : 1 }]}
              onPress={() => modoCrearGrupo ? toggleSeleccionUsuario(u.id) : iniciarChatCon(u)}
              disabled={u.id === "no-results"}
            >
              <Image
                source={{ uri: u.fotoPerfil ?? "https://i.pravatar.https://cdn-icons-png.flaticon.com/512/5234/5234404.png/150?img=1" }}
                style={styles.avatar}
              />
              <Text style={styles.name}>{u.username}</Text>
              {modoCrearGrupo && (
                <Text style={{ marginLeft: 10, color: seleccionado ? "#42BAFF" : "#aaa" }}>
                  {seleccionado ? "✔️" : "➕"}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        <ScrollView>
          {chatsToShow.map((chat) => (
            <ChatItem
              key={chat.id}
              id={chat.id}
              avatar={chat.avatar}
              nombre={chat.nombre}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              onPress={() => router.push(`/chats/${chat.id}`)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </FondoLayout>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
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
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12, borderColor: "#FF66C4", borderWidth: 1 },
  chatInfo: { flex: 1 },
  name: { fontWeight: "600", color: "#000", fontSize: 16 },
  message: { color: "#555", marginTop: 2 },
  time: { fontWeight: "400", color: "#888", fontSize: 12 },
});

/* -------------  PERFIL AJENO  ------------- */
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayRemove, arrayUnion,
  collection, doc,
  onSnapshot,
  orderBy, query, updateDoc, where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions, FlatList, Image, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { firestore } from "../../../config/firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { stylesCommon as C } from "../profile"; // reutilizamos tamaños

const { width } = Dimensions.get("window");
const IMG = C.IMG;

export default function OtherProfile() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [info, setInfo] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const [yoSigo, setYoSigo] = useState(false);
  const [seguidoresCnt, setSeguidoresCnt] = useState(0);

  /* datos del usuario */
  useEffect(() => {
    if (!uid) return;
    const ref = doc(firestore, "usuarios", uid);
    const unsub = onSnapshot(ref, (s) => {
      if (!s.exists()) return;
      setInfo(s.data());
      setYoSigo(s.data().seguidores?.includes(user?.uid));
    });
    return unsub;
  }, [uid, user?.uid]);

  /*  ➜  NUEVO  */
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(firestore, "usuarios"),
      where("siguiendo", "array-contains", uid)   // todos los que siguen a uid
    );

    const unsub = onSnapshot(q, (snap) => {
      setSeguidoresCnt(snap.size);                // número en tiempo real
    });

    return unsub;
  }, [uid]);


  /* sus publicaciones */
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(firestore, "publicaciones"),
      where("userId", "==", uid),
      orderBy("timestamp", "desc")
    );
    return onSnapshot(q, (snap) =>
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [uid]);

  if (!info) return <SafeAreaView style={s.center}><Text>Cargando…</Text></SafeAreaView>;

  /* seguir/dejar de seguir */
  const toggleFollow = async () => {
    if (!user) return;

    const miRef = doc(firestore, "usuarios", user.uid);

    await updateDoc(miRef, {
      siguiendo: yoSigo ? arrayRemove(uid) : arrayUnion(uid)
    });

    // ⇨ nada sobre “suRef”
  };


  const seguidores = seguidoresCnt;
  const siguiendo = info.siguiendo?.length ?? 0;

  return (
    <SafeAreaView style={s.container}>
      {/* ───────────  CABECERA  ─────────── */}
      <View style={s.topPadding} />

      {/* nombre + plataforma, totalmente centrados */}
      <Text style={s.nameTxt}>{info.username}</Text>
      {info.plataformaFav && (
        <Text style={s.platform}>{info.plataformaFav}</Text>
      )}

      {/* avatar + contadores en UNA SOLA FILA */}
      <View style={s.rowCentered}>
        <Image source={{ uri: info.fotoPerfil }} style={s.avatar} />
        <View style={s.statsRow}>
          <Counter n={posts.length} label="Contenido" />
          <Counter n={seguidores} label="Seguidores" />
          <Counter n={siguiendo} label="Seguidos" />
        </View>
      </View>

      {/* géneros y bio */}
      {info.generoFav && <Text style={s.genres}>{info.generoFav}</Text>}
      {info.descripcion && <Text style={s.bio}>{info.descripcion}</Text>}

      {/* BOTONES centrados – mismos anchos */}
      <View style={s.btnRow}>
        <TouchableOpacity
          style={[s.followBtn, yoSigo && s.followed]}
          onPress={toggleFollow}
        >
          <Text style={[s.followTxt, yoSigo && { color: "#fff" }]}>
            {yoSigo ? "Dejar de seguir" : "Seguir"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.msgBtn}
          onPress={() =>
            router.push({ pathname: "/chats", params: { uid } })
          }
        >
          <Feather name="message-circle" size={18} color="#000" />
          <Text style={s.msgTxt}>Mensaje</Text>
        </TouchableOpacity>
      </View>
      {/* grid 2×n */}
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(p) => p.id}
        columnWrapperStyle={{ gap: 4 }}
        contentContainerStyle={{ gap: 4, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/publicacion/[id]", params: { id: item.id } })}
          >
            <Image source={{ uri: item.mediaUrl }} style={s.gridImg} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function Counter({ n, label }: { n: number, label: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontWeight: "700" }}>{n}</Text>
      <Text style={{ fontSize: 12, color: "#555" }}>{label}</Text>
    </View>
  );
}

/* estilos */
const s = StyleSheet.create({
  ...StyleSheet.create({}),                // placeholder para no perder IntelliSense
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  topPadding: { height: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  nameBox: { alignItems: "center", marginBottom: 12 },
  nameTxt: { fontSize: 19, fontWeight: "700", textAlign: "center" },
  platform: { color: "#888", textAlign: "center", marginTop: 2, marginBottom: 14 },
  rowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,     // ⬅️ menos hueco
    gap: 16,              // ⬅️ un poco más compacto
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: { width: C.PHOTO, height: C.PHOTO, borderRadius: C.PHOTO / 2, borderWidth: 1, borderColor: "#FF66C4", },
  genres: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  bio: { color: "#000", marginBottom: 12 },
  gridImg: { width: IMG, height: IMG * 1.2, borderRadius: 10 },
  /* ➜  AÑADE / RECUPERA ESTE  ↓↓↓ */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 26,                 // separa los contadores
  },
  /* BOTONES */
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 18,
  },
  followBtn: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: "#42BAFF",
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  followed: { backgroundColor: "#FF66C4" },
  followTxt: { fontWeight: "600", color: "#fff" },

  msgBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1, borderColor: "#000",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  msgTxt: { fontWeight: "600", color: "#000" },
});
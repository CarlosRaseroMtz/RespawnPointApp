import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection, doc,
  onSnapshot,
  orderBy, query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions, FlatList, Image, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { useAuth } from "../../../src/hooks/useAuth";
import { firestore } from "../../../src/services/config/firebase-config";
import { toggleSeguir } from "../../../src/utils/feed-actions";
import { stylesCommon as C } from "../profile";

const { width } = Dimensions.get("window");
const IMG = C.IMG;

export default function OtherProfile() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [info, setInfo] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const [yoSigo, setYoSigo] = useState(false);
  const [seguidoresCnt, setSeguidoresCnt] = useState(0);

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

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(firestore, "usuarios"),
      where("siguiendo", "array-contains", uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setSeguidoresCnt(snap.size);
    });
    return unsub;
  }, [uid]);

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

  if (!info)
    return (
      <SafeAreaView style={s.center}>
        <Text>{t("profile.loading")}</Text>
      </SafeAreaView>
    );

  const toggleFollow = async () => {
    if (!user || !uid) return;
    await toggleSeguir({ desdeUid: user.uid, haciaUid: uid });
  };

  const seguidores = seguidoresCnt;
  const siguiendo = info.siguiendo?.length ?? 0;

  return (
    <SafeAreaView style={s.container}>
      <View style={s.topPadding} />
      <Text style={s.nameTxt}>{info.username}</Text>
      {info.plataformaFav && (
        <Text style={s.platform}>{info.plataformaFav}</Text>
      )}

      <View style={s.rowCentered}>
        <Image source={{ uri: info.fotoPerfil }} style={s.avatar} />
        <View style={s.statsRow}>
          <Counter n={posts.length} label={t("profile.content")} />
          <Counter n={seguidores} label={t("profile.followers")} />
          <Counter n={siguiendo} label={t("profile.following")} />
        </View>
      </View>

      {info.generoFav && <Text style={s.genres}>{info.generoFav}</Text>}
      {info.descripcion && <Text style={s.bio}>{info.descripcion}</Text>}

      <View style={s.btnRow}>
        <TouchableOpacity
          style={[s.followBtn, yoSigo && s.followed]}
          onPress={toggleFollow}
        >
          <Text style={[s.followTxt, yoSigo && { color: "#fff" }]}>
            {yoSigo ? t("profile.unfollow") : t("profile.follow")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.msgBtn}
          onPress={() =>
            router.push({ pathname: "/chats", params: { uid } })
          }
        >
          <Feather name="message-circle" size={18} color="#000" />
          <Text style={s.msgTxt}>{t("profile.message")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(p) => p.id}
        columnWrapperStyle={{ gap: 4 }}
        contentContainerStyle={{ gap: 4, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({ pathname: "/publicacion/[id]", params: { id: item.id } })
            }
          >
            <Image source={{ uri: item.mediaUrl }} style={s.gridImg} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function Counter({ n, label }: { n: number; label: string }) {
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
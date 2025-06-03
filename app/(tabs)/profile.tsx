import FondoLayout from "@/src/components/FondoLayout";
import { useMiPerfil } from "@/src/hooks/useMiPerfil";
import { useMisPublicaciones } from "@/src/hooks/useMisPublicaciones";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Dimensions, FlatList, Image, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import PostGridItem from "../../src/components/PostGridItem";

const { width } = Dimensions.get("window");
const PHOTO = 80;
const GAP = 18;
const IMG = (width - 36) / 2;

const truncate = (t: string, n = 26) =>
  t.length > n ? t.slice(0, n - 1) + "…" : t;

export default function MyProfile() {
  const router = useRouter();
  const { t } = useTranslation();
  const info = useMiPerfil();
  const posts = useMisPublicaciones();

  if (!info)
    return (
      <SafeAreaView style={styles.center}>
        <Text>{t("mi-profile.loading")}</Text>
      </SafeAreaView>
    );

  const seg = info.seguidores?.length ?? 0;
  const sigo = info.siguiendo?.length ?? 0;

  return (
    <FondoLayout>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/configuracion")}
          style={styles.btnGear}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.username}>{truncate(info.username)}</Text>
          {info.plataformaFav && (
            <Text style={styles.platformTxt}>{info.plataformaFav}</Text>
          )}
        </View>

        <View style={styles.topRow}>
          <Image
            source={{ uri: info.fotoPerfil || "https://i.pravatar.cc/150?u=" + info.username }}
            style={styles.avatar}
          />
          <View style={styles.statsBox}>
            <Counter n={posts.length} label={t("mi-profile.posts")} />
            <Counter n={seg} label={t("mi-profile.followers")} />
            <Counter n={sigo} label={t("mi-profile.following")} />
          </View>
        </View>

        {info.generoFav && <Text style={styles.genre}>{info.generoFav}</Text>}
        {info.descripcion && <Text style={styles.bio}>{info.descripcion}</Text>}

        <FlatList
          data={posts}
          numColumns={2}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ gap: 6 }}
          contentContainerStyle={{ paddingBottom: 100, gap: 6 }}
          renderItem={({ item }) => (
            <PostGridItem id={item.id} mediaUrl={item.mediaUrl} />
          )}
        />
      </SafeAreaView>
    </FondoLayout>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { alignItems: "center", marginBottom: 6, paddingTop: 16 },
  username: { fontSize: 19, fontWeight: "bold", color: "#000", textAlign: "center", paddingTop: 8 },
  platformTxt: { color: "#888", marginTop: 2, fontSize: 14, textAlign: "center" },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  avatar: { width: PHOTO, height: PHOTO, borderRadius: PHOTO / 2, borderColor: "#FF66C4" },
  statsBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 4,
    marginRight: 4,
  },
  btnGear: {
    backgroundColor: "#42BAFF",
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
  },

  genre: { fontWeight: "600", fontSize: 15, marginBottom: 4, textAlign: "center" },
  bio: { color: "#000", marginBottom: 12, textAlign: "center", paddingHorizontal: 16 },

  gridImg: {
    width: IMG,
    height: IMG * 1.2,
    borderRadius: 10,
  },
});

export const stylesCommon = { PHOTO, IMG, GAP };

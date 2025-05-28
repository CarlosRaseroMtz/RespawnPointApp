import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import BottomTabBar from "./comp/bottom-tab-bar";

const { width } = Dimensions.get("window");
const imageSize = (width - 40) / 3;
const router = useRouter();

const publicaciones = [
  require("../assets/images/foto_publi_valo_guia2.jpg"),
  require("../assets/images/foto_publi_valo_guia2.jpg"),
  require("../assets/images/foto_publi_valo_guia2.jpg"),
  require("../assets/images/foto_publi_valo_guia2.jpg"),
  require("../assets/images/foto_publi_valo_guia2.jpg"),
  require("../assets/images/foto_publi_valo_guia2.jpg"),
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require("../assets/images/foto_perfil_isi.jpg")}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.username}>LordCarlosxdd</Text>
            <Text style={styles.platform}>🎮 XBOXONE</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/configuracion")}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>35</Text>
          <Text style={styles.statLabel}>Contenido</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>567</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>191</Text>
          <Text style={styles.statLabel}>Seguidos</Text>
        </View>
      </View>

      <View style={styles.bio}>
        <Text style={styles.genre}>FPS, Shooters y Competitivo</Text>
        <Text style={styles.description}>
          Jugador de PC y Xbox, pseudoretirado, ya solo juego con colegas, en
          busca el resurgimiento gamer
        </Text>
      </View>

      <FlatList
        data={publicaciones}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.gallery}
        renderItem={({ item }) => (
          <Image source={item} style={styles.postImage} />
        )}
      />

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  headerText: {},
  username: { fontSize: 18, fontWeight: "700" },
  platform: { fontSize: 14, color: "#888" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  stat: { alignItems: "center" },
  statNumber: { fontWeight: "700", fontSize: 16 },
  statLabel: { fontSize: 13, color: "#555" },
  bio: { marginBottom: 16 },
  genre: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  description: { color: "#444" },
  gallery: { gap: 4 },
  postImage: {
    width: imageSize,
    height: imageSize,
    margin: 4,
    borderRadius: 8,
  },
});

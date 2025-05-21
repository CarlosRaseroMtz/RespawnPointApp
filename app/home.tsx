import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const tabs = ["Juegos", "Para ti", "Memes"];

const posts = [
  {
    id: "1",
    user: "IsiPateo",
    community: "Valorant",
    time: "hace 3 minutos",
    image: require("../assets/images/foto_publi_valo_guia2.jpg"),
    text: "Si quieres saber más, pregúntame...",
    likes: 21,
    comments: 4,
    avatar: require("../assets/images/foto_perfil_isi.jpg"),
  },
  {
    id: "2",
    user: "SuperRobertxdd",
    community: "R.E.P.O.",
    time: "hace 2 horas",
    text: "Han corregido un bug que permitía curarse gratis al recoger un objeto y pulsar 'E' de nuevo.",
    likes: 15,
    comments: 2,
    avatar: require("../assets/images/foto_perfil_robert.jpg"),
  },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Para ti");

  const renderPost = ({ item }: any) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.postUser}>{item.user} en {item.community}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        <Entypo name="dots-three-horizontal" size={18} color="#555" />
      </View>

      {item.image && (
        <Image source={item.image} style={styles.postImage} resizeMode="cover" />
      )}

      {item.text && <Text style={styles.postText}>{item.text}</Text>}

      <View style={styles.reactions}>
        <TouchableOpacity style={styles.reactionBtn}>
          <AntDesign name="hearto" size={16} color="#555" />
          <Text style={styles.reactionText}>{item.likes} me gusta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn}>
          <Feather name="message-circle" size={16} color="#555" />
          <Text style={styles.reactionText}>{item.comments} comentarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <AntDesign name="home" size={24} color="#000" />
        <AntDesign name="clockcircleo" size={24} color="#000" />
        <AntDesign name="pluscircle" size={40} color="#000" style={{ marginTop: -10 }} />
        <AntDesign name="bells" size={24} color="#000" />
        <Ionicons name="person-circle-outline" size={26} color="#000" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  activeUnderline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 4,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUser: {
    fontWeight: "600",
    color: "#000",
  },
  postTime: {
    fontSize: 12,
    color: "#888",
  },
  postImage: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 12,
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  reactions: {
    flexDirection: "row",
    gap: 20,
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reactionText: {
    fontSize: 13,
    color: "#555",
  },
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});

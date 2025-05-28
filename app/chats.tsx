import React, { useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BottomTabBar from "./comp/bottom-tab-bar";

const tabs = ["Usuarios", "Comunidades", "Torneos"];

const userChats = [
  {
    id: "1",
    name: "Jamato00",
    avatar: require("../assets/images/foto_perfil_isi.jpg"),
    lastMessage: "Illo ruben un smite?",
    time: "9:20",
    unread: true,
  },
  {
    id: "2",
    name: "LDarkPain",
    avatar: require("../assets/images/foto_perfil_robert.jpg"),
    lastMessage: "Te paso el link del Discord",
    time: "18:11",
    unread: false,
  },
];

const groupChats = [
  {
    id: "g1",
    name: "Hunters Team",
    avatar: require("../assets/images/foto_publi_valo_guia2.jpg"),
    lastMessage: "Listos para la raid esta noche?",
    time: "10:55",
    unread: true,
  },
];

export default function ChatsScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");

  const chatsToShow =
    activeTab === "Usuarios" ? userChats :
    activeTab === "Comunidades" ? groupChats :
    [];

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

      <ScrollView>
        {chatsToShow.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem}>
            <View style={styles.chatRow}>
              {chat.unread && <View style={styles.dot} />}
              <Image source={chat.avatar} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <Text style={styles.name}>
                  {chat.name} <Text style={styles.time}>{chat.time}</Text>
                </Text>
                <Text style={styles.message}>{chat.lastMessage}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#42BAFF",
    borderRadius: 5,
    marginRight: 8,
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

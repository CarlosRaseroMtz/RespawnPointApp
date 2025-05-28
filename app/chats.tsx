import React from "react";
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

const chats = [
  {
    id: "1",
    name: "LDarkPain",
    avatar: require("../assets/images/avatar3.png"),
    lastMessage: "Illo ruben un smite?",
    time: "9:20",
  },
  {
    id: "2",
    name: "Daf90",
    avatar: require("../assets/images/avatar1.png"),
    lastMessage: "Te paso el link del Discord",
    time: "18:11",
  },
  {
    id: "3",
    name: "sutisutito",
    avatar: require("../assets/images/avatar2.png"),
    lastMessage: "Sube ya las guías!!",
    time: "Ayer",
  },
];

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chats recientes</Text>
      <ScrollView>
        {chats.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem}>
            <Image source={chat.avatar} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.message}>{chat.lastMessage}</Text>
            </View>
            <Text style={styles.time}>{chat.time}</Text>
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
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    color: "#888",
    fontSize: 12,
  },
});

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

// ... resto del código


const tabs = ["Usuarios", "Comunidades", "Torneos"];

const notifications = [
  {
    id: 1,
    user: "ArruinaNochess",
    message: "Ha empezado a seguirte",
    time: "1d",
    avatar: require("../assets/images/foto_perfil_isi.jpg"),
    action: "seguir",
  },
  {
    id: 2,
    user: "GABICHUELAS00",
    message: "Se ha unido a la comunidad",
    time: "1d",
    avatar: require("../assets/images/foto_perfil_robert.jpg"),
  },
  {
    id: 3,
    user: "LDarkPain",
    message: "Abro streaming chavaleeee!!!!\\ntwitch.tv/ldarkpain",
    time: "2d",
    avatar: require("../assets/images/foto_publi_valo_guia2.jpg"),
  },
];

export default function NotificacionesScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Últimas notificaciones de</Text>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
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

        <ScrollView style={{ flex: 1 }}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.notification}>
              <Image source={item.avatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.user}>
                  {item.user} <Text style={styles.time}>{item.time}</Text>
                </Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              {item.action === "seguir" && (
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followText}>Seguir</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
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
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  user: {
    fontWeight: "600",
    color: "#000",
  },
  time: {
    fontWeight: "400",
    color: "#888",
    fontSize: 12,
  },
  message: {
    color: "#000",
    fontSize: 14,
  },
  followBtn: {
    backgroundColor: "#42BAFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
});
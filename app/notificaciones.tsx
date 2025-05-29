import React, { useEffect, useState } from "react";
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

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth"; // ya lo tienes seguramente

// ...

const [notifications, setNotifications] = useState<any[]>([]);
const { user } = useAuth();

useEffect(() => {
  if (!user) return;

  const q = query(
    collection(firestore, "notificaciones", user.uid, "items"),
    orderBy("timestamp", "desc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotifications(docs);
  });

  return () => unsub();
}, [user]);


export default function NotificacionesScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");
  const [seguidos, setSeguidos] = useState<{ [key: number]: boolean }>({});

  const toggleSeguir = (id: number) => {
    setSeguidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
              <Image
                source={{ uri: item.avatar || "https://i.pravatar.cc/150?img=3" }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.user}>
                  {item.deNombre || "Usuario"}{" "}
                  <Text style={styles.time}>
                    {item.timestamp?.toDate()?.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Text>
                <Text style={styles.message}>{item.contenido}</Text>
              </View>

              {item.tipo === "seguimiento" && (
                <TouchableOpacity
                  style={[styles.followBtn, { backgroundColor: "#FF66C4" }]}
                >
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

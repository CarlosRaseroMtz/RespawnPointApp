import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getAuth } from "firebase/auth";
import { collection, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
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
import { app } from "../config/firebase-config";
import BottomTabBar from "./comp/bottom-tab-bar";

const tabs = ["Usuarios", "Comunidades", "Torneos"];

export default function NotificacionesScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");
  const [seguidos, setSeguidos] = useState<{ [key: string]: boolean }>({});
  const [notifications, setNotifications] = useState<any[]>([]);

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const itemsRef = collection(db, "notificaciones", user.uid, "items");

    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const notifList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            seconds: data.time?.seconds || 0, // extra para ordenación
          };
        })
        .sort((a, b) => b.seconds - a.seconds); // más recientes primero

      setNotifications(notifList);

      // 🔵 Marcar como leídas
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.leida) {
          updateDoc(doc.ref, { leida: true });
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const toggleSeguir = (id: string) => {
    setSeguidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredNotifications = notifications.filter(
    (n) => n.user && n.message && n.time
  );



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Últimas notificaciones de</Text>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => tab !== "Torneos" && setActiveTab(tab)}
              disabled={tab === "Torneos"}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                tab === "Torneos" && { opacity: 0.5 }, // efecto visual de desactivado
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
          {filteredNotifications.length === 0 ? (
            <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
              No hay notificaciones en esta categoría.
            </Text>
          ) : (
            filteredNotifications.map((item) => (
              <View key={item.id} style={[styles.notification, { position: "relative" }]}>
                {!item.leida && (
                  <View style={styles.unreadDot} />
                )}

                <Image
                  source={{ uri: item.avatar }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.user}>
                    {item.user}{" "}
                    <Text style={styles.time}>
                      {item.time?.toDate
                        ? formatDistanceToNow(item.time.toDate(), { locale: es, addSuffix: true })
                        : "sin fecha"}
                    </Text>
                  </Text>

                  <Text style={styles.message}>{item.message}</Text>
                </View>
                {item.action === "seguir" && (
                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      seguidos[item.id] && { backgroundColor: "#FF66C4" },
                    ]}
                    onPress={() => toggleSeguir(item.id)}
                  >
                    <Text style={styles.followText}>
                      {seguidos[item.id] ? "Seguido" : "Seguir"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
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
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#42BAFF", // tu color azul eléctrico
    position: "absolute",
    top: 0,
    right: 0,
  },
});
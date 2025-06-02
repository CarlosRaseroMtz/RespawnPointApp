import FondoLayout from "@/src/components/FondoLayout";
import { useNotificaciones } from "@/src/hooks/useNotificaciones";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import NotificationItem from "../../src/components/NotificacionesItem"; // ajusta el path según tu estructura
import { app } from "../../src/config/firebase-config";

const tabs = ["Usuarios", "Comunidades", "Torneos"];

export default function NotificacionesScreen() {
  const [activeTab, setActiveTab] = useState("Usuarios");
  const [seguidos, setSeguidos] = useState<{ [key: string]: boolean }>({});
  const notifications = useNotificaciones(activeTab);

  const db = getFirestore(app);
  const auth = getAuth(app);


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
    <FondoLayout>
      <SafeAreaView style={{ flex: 1}}>
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
                <NotificationItem
                  key={item.id}
                  id={item.id}
                  user={item.user}
                  avatar={item.avatar}
                  message={item.message}
                  time={item.time}
                  leida={item.leida}
                  action={item.action}
                  seguido={seguidos[item.id]}
                  onToggleSeguir={toggleSeguir} seconds={undefined} tipo={"like"} />
              ))

            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </FondoLayout>
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
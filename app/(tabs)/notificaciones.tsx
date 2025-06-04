import FondoLayout from "@/src/components/FondoLayout";
import { useNotificaciones } from "@/src/hooks/useNotificaciones";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import NotificationItem from "../../src/components/NotificacionesItem";
import { app } from "../../src/services/config/firebase-config";

const tabKeys = ["usuarios", "comunidades", "torneos"];

/**
 * Pantalla de notificaciones
 * Muestra las notificaciones del usuario organizadas por pestañas
 * Utiliza el layout FondoLayout para el fondo y estilo general
 */
export default function NotificacionesScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("usuarios");
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
    //* ——— interfaz principal —— */
    <FondoLayout>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("notifications.title")}</Text>

          <View style={styles.tabs}>
            {tabKeys.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => tab !== "torneos" && setActiveTab(tab)}
                disabled={tab === "torneos"}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                  tab === "torneos" && { opacity: 0.5 },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {t(`notifications.tabs.${tab}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={{ flex: 1 }}>
            {filteredNotifications.length === 0 ? (
              <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
                {t("notifications.empty")}
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
                  onToggleSeguir={toggleSeguir}
                  seconds={undefined}
                  tipo={"like"}
                />
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </FondoLayout>
  );
}

//* ——— estilos ——— */
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
});

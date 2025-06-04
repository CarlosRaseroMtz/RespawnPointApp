import { AntDesign, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnreadCounters } from "../hooks/useUnreadCounters";

/**
 * Componente de barra de navegación inferior para la app.
 * 
 * Muestra iconos para navegación a: Home, Chats, Crear Publicación, Notificaciones y Perfil.
 * 
 * Integra:
 * - Iconos con cambio de color según la ruta activa.
 * - Contadores de mensajes no leídos y notificaciones no vistas.
 * - Padding dinámico basado en el área segura del dispositivo.
 * 
 * @returns {JSX.Element} La barra de navegación inferior.
 */
export default function BottomTabBar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Verifica si la ruta proporcionada es la ruta activa actual.
   * @param route Ruta para verificar.
   * @returns `true` si es la ruta activa.
   */
  const isActive = (route: string): boolean => pathname === route;

  const insets = useSafeAreaInsets();

  // Obtiene los contadores de mensajes y notificaciones no leídas para el usuario actual
  const { unreadNotis, unreadChats } = useUnreadCounters(getAuth().currentUser?.uid);

  return (
    <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom || 10 }]}>
      <TouchableOpacity onPress={() => router.push("../home")}>
        <AntDesign name="home" size={24} color={isActive("/home") ? "#000" : "#999"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../chats")}>
        <View style={{ position: "relative" }}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={isActive("/chats") ? "#000" : "#999"} />
          {unreadChats > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadChats}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../publicacion/create-post")}>
        <AntDesign
          name="pluscircle"
          size={40}
          color={isActive("/create-post") ? "#000" : "#999"}
          style={{ marginTop: -10 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../notificaciones")}>
        <View style={{ position: "relative" }}>
          <AntDesign name="bells" size={24} color={isActive("/notificaciones") ? "#000" : "#999"} />
          {unreadNotis > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotis}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../profile")}>
        <Ionicons name="person-circle-outline" size={26} color={isActive("/profile") ? "#000" : "#999"} />
      </TouchableOpacity>
    </View>
  );
}

// Estilos de la barra inferior y notificaciones
const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#FF66C4",
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Notificacion } from "../types/notificacion";

/**
 * Props del componente NotificationItem.
 * Extiende de la interfaz base `Notificacion` y agrega propiedades opcionales relacionadas con acciones sociales.
 */
interface NotificationItemProps extends Notificacion {
  /** Indica si el usuario ya está seguido. */
  seguido?: boolean;
  /** Función para alternar el estado de seguimiento. */
  onToggleSeguir?: (id: string) => void;
}

/**
 * Componente para mostrar una notificación individual.
 * Muestra avatar, nombre, mensaje, fecha y (si aplica) un botón para seguir/seguir de vuelta.
 *
 * Usa `date-fns` para formatear el tiempo relativo y `i18next` para traducciones.
 *
 * @param {NotificationItemProps} props Propiedades de la notificación.
 * @returns {JSX.Element} Elemento visual representando una notificación.
 */
const NotificationItem = ({
  id,
  user,
  avatar,
  message,
  time,
  leida,
  action,
  seguido,
  onToggleSeguir,
}: NotificationItemProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    //* —— componente de notificación —— */
    <View style={[styles.notification, { position: "relative" }]}>
      {!leida && <View style={styles.unreadDot} />}

      <Image
        source={{ uri: avatar || "https://i.pravatar.cc/150?img=3" }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.user}>
          {user}{" "}
          <Text style={styles.time}>
            {time?.toDate
              ? formatDistanceToNow(time.toDate(), {
                locale: es,
                addSuffix: true,
              })
              : t("notification.noDate")}
          </Text>
        </Text>

        <Text style={styles.message}>{message}</Text>
      </View>

      {action === "seguir" && (
        <TouchableOpacity
          style={[
            styles.followBtn,
            seguido && { backgroundColor: "#FF66C4" },
          ]}
          onPress={() => onToggleSeguir?.(id)}
        >
          <Text style={styles.followText}>
            {seguido ? t("notification.followed") : t("notification.follow")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NotificationItem;

// estilos
const styles = StyleSheet.create({
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
    backgroundColor: "#42BAFF",
    position: "absolute",
    top: 0,
    right: 0,
  },
});

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Notificacion } from "../types/notificacion";

interface NotificationItemProps extends Notificacion {
  seguido?: boolean;
  onToggleSeguir?: (id: string) => void;
}

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
}: NotificationItemProps) => {
  return (
    <View style={[styles.notification, { position: "relative" }]}>
      {!leida && <View style={styles.unreadDot} />}
      <Image source={{ uri: avatar }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.user}>
          {user}{" "}
          <Text style={styles.time}>
            {time?.toDate
              ? formatDistanceToNow(time.toDate(), {
                locale: es,
                addSuffix: true,
              })
              : "sin fecha"}
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
            {seguido ? "Seguido" : "Seguir"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NotificationItem;

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

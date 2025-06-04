import { router } from "expo-router";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Props para el componente ChatItem.
 */
interface ChatItemProps {
  /** ID único del chat. */
  id: string;
  /** URL del avatar del contacto. */
  avatar?: string;
  /** Nombre del contacto. */
  nombre?: string;
  /** Último mensaje enviado o recibido. */
  lastMessage?: string;
  /** Timestamp del último mensaje. */
  timestamp?: string;
  /** Función personalizada al hacer click (opcional). */
  onPress?: () => void;
  /** Avatar alternativo (no usado en este componente). */
  avatarC?: string;
  /** Nombre alternativo (no usado en este componente). */
  nombreC?: string;
}

/**
 * Muestra un ítem de la lista de chats con avatar, nombre, último mensaje y hora.
 * Si no se pasa una función `onPress`, redirige automáticamente a `/chats/{id}`.
 *
 * Usa traducciones `i18next` para mostrar valores predeterminados si faltan datos.
 *
 * @param {ChatItemProps} props Propiedades del componente.
 * @returns {JSX.Element} Elemento renderizado del chat.
 */
const ChatItem = ({
  id,
  avatar,
  nombre,
  lastMessage,
  timestamp,
  onPress,
}: ChatItemProps): JSX.Element => {
  const { t } = useTranslation();

  const defaultAvatar = "https://i.pravatar.cc/150?img=12";
  const displayName = nombre?.trim() || t("chatItem.noName");
  const displayAvatar = avatar?.trim() || defaultAvatar;
  const displayMessage = lastMessage?.trim() || t("chatItem.noMessages");

  return (
    //* —— componente de item de chat —— */
    <TouchableOpacity
      key={id}
      style={styles.chatItem}
      onPress={() => {
        if (onPress) onPress();
        else router.push(`/chats/${id}`);
      }}
    >
      <View style={styles.chatRow}>
        <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{displayName}</Text>
            {timestamp ? <Text style={styles.time}>{timestamp}</Text> : null}
          </View>
          <Text style={styles.message}>{displayMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;


////* —— estilos —— */
const styles = StyleSheet.create({
  chatItem: { marginBottom: 20 },
  chatRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderColor: "#FF66C4",
    borderWidth: 1,
  },
  chatInfo: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontWeight: "600", color: "#000", fontSize: 16 },
  message: { color: "#555", marginTop: 2 },
  time: { fontWeight: "400", color: "#888", fontSize: 12, marginLeft: 8 },
});

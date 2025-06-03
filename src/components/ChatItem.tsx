import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatItemProps {
  id: string;
  avatar?: string;
  nombre?: string;
  lastMessage?: string;
  timestamp?: string;
  onPress?: () => void;
}

const ChatItem = ({
  id,
  avatar,
  nombre,
  lastMessage,
  timestamp,
  onPress,
}: ChatItemProps) => {
  const defaultAvatar = "https://i.pravatar.cc/150?img=12";
  const displayName = nombre?.trim() || "Grupo sin nombre";
  const displayAvatar = avatar?.trim() || defaultAvatar;
  const displayMessage = lastMessage?.trim() || "No hay mensajes aún";

  return (
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

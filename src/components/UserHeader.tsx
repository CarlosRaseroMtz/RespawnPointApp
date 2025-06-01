import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface UserHeaderProps {
  username: string;
  plataforma?: string;
  avatarUrl: string;
}

const UserHeader = ({ username, plataforma, avatarUrl }: UserHeaderProps) => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.platform}>🎮 {plataforma || "Sin plataforma"}</Text>
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  username: { fontSize: 18, fontWeight: "700" },
  platform: { fontSize: 14, color: "#888" },
});

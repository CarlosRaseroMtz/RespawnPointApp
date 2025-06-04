import React, { JSX } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

/**
 * Props para el componente UserHeader.
 */
interface UserHeaderProps {
  /** Nombre de usuario que se mostrará. */
  username: string;
  /** Plataforma del usuario (opcional). */
  plataforma?: string;
  /** URL del avatar del usuario. */
  avatarUrl: string;
}

/**
 * Componente que muestra un encabezado de usuario con su avatar, nombre y plataforma.
 *
 * Útil para pantallas de perfil u otras vistas donde se muestre información del usuario.
 *
 * @param {UserHeaderProps} props Propiedades del componente.
 * @returns {JSX.Element} Encabezado de usuario renderizado.
 */
const UserHeader = ({
  username,
  plataforma,
  avatarUrl,
}: UserHeaderProps): JSX.Element => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.platform}>
          🎮 {plataforma || "Sin plataforma"}
        </Text>
      </View>
    </View>
  );
};

export default UserHeader;

// Estilos para el componente UserHeader
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

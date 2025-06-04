import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

interface PostGridItemProps {
  id: string;
  mediaUrl: string;
}

const PostGridItem = ({ id, mediaUrl }: PostGridItemProps) => {
  const router = useRouter();

  return (
    //* —— componente de item de cuadrícula de post —— */
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/publicacion/[id]",
          params: { id },
        })
      }
    >
      <Image source={{ uri: mediaUrl }} style={styles.gridImg} />
    </TouchableOpacity>
  );
};

// Estilos para el componente PostGridItem
const styles = StyleSheet.create({
  gridImg: {
    width: (Dimensions.get("window").width - 36) / 2,
    height: ((Dimensions.get("window").width - 36) / 2) * 1.2,
    borderRadius: 10,
  },
});

export default PostGridItem;

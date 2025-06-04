import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

/**
 * Props del componente PostGridItem.
 */
interface PostGridItemProps {
  /** ID único del post, usado para navegación. */
  id: string;
  /** URL de la imagen que se mostrará en la cuadrícula. */
  mediaUrl: string;
}

/**
 * Componente visual para mostrar un post dentro de una cuadrícula (grid).
 * Al hacer tap, navega a la pantalla de detalle del post usando `expo-router`.
 *
 * Calcula el tamaño dinámicamente basado en el ancho de pantalla para un diseño responsive.
 *
 * @param {PostGridItemProps} props Propiedades del componente: `id` y `mediaUrl`.
 * @returns {JSX.Element} Imagen del post con comportamiento táctil para navegar.
 */
const PostGridItem = ({ id, mediaUrl }: PostGridItemProps): JSX.Element => {
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

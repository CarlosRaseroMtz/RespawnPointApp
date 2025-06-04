import React, { JSX } from "react";
import { Image, StyleSheet, View } from "react-native";

/**
 * Componente de layout que renderiza un fondo de pantalla completo con una imagen,
 * y coloca los elementos hijos (`children`) encima.
 *
 * Útil para pantallas como splash screens, formularios o pantallas de bienvenida.
 *
 * @param props.children Elementos React que se renderizan sobre el fondo.
 * @returns {JSX.Element} Un layout con fondo de imagen y contenido superpuesto.
 */
export default function FondoLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/fondoSplashScreen.png")}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {children}
      </View>
    </View>
  );
}

// estilos
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
});

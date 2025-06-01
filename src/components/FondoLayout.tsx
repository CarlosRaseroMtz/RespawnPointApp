// components/FondoLayout.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function FondoLayout({ children }: { children: React.ReactNode }) {
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

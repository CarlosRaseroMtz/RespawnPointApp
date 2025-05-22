import { useRootNavigationState, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View
} from "react-native";
import { useAuth } from "../hooks/useAuth"; // ← importar tu hook

const { width, height } = Dimensions.get("window");

export default function Splash() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { user, loading } = useAuth(); // ← usar estado de auth

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  useEffect(() => {
    if (!navState?.key || loading) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navState, loading, user]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/fondoSplashScreen.png")}
        style={styles.background}
        resizeMode="cover"
      />
      <Animated.Image
        source={require("../assets/images/logo.png")}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    width,
    height,
    position: "absolute"
  },
  logo: {
    width: "60%",
    height: "30%",
    alignSelf: "center",
    marginTop: height * 0.35
  }
});
// app/components/BottomTabBar.tsx (si no tienes carpetas, ponlo en app/)
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.bottomTabBar}>
      <TouchableOpacity onPress={() => router.push("../home")}>
        <AntDesign name="home" size={24} color={isActive("/home") ? "#000" : "#999"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../chats")}>
        <AntDesign name="clockcircleo" size={24} color={isActive("/chats") ? "#000" : "#999"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../create-post")}>
        <AntDesign
          name="pluscircle"
          size={40}
          color={isActive("/create-post") ? "#000" : "#999"}
          style={{ marginTop: -10 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../notificaciones")}>
        <AntDesign name="bells" size={24} color={isActive("/notificaciones") ? "#000" : "#999"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../profile")}>
        <Ionicons name="person-circle-outline" size={26} color={isActive("/profile") ? "#000" : "#999"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
});

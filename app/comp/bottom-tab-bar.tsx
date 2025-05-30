// app/components/BottomTabBar.tsx (si no tienes carpetas, ponlo en app/)
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
    const insets = useSafeAreaInsets(); // <- esto añade soporte para padding dinámico

  const isActive = (route: string) => pathname === route;
  const [unreadNotis, setUnreadNotis] = useState(0);
const [unreadChats, setUnreadChats] = useState(0);

useEffect(() => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  if (!user) return;

  // 🔔 Notificaciones
  const notiRef = collection(db, "notificaciones", user.uid, "items");
  const unsubNotis = onSnapshot(notiRef, (snap) => {
    const count = snap.docs.filter((doc) => !doc.data().leida).length;
    setUnreadNotis(count);
  });

  // 💬 Chats
  const chatsRef = collection(db, "chats");
  const unsubChats = onSnapshot(chatsRef, (snap) => {
    let total = 0;

    snap.docs.forEach((chatDoc) => {
      const mensajesRef = collection(chatDoc.ref, "mensajes");
      onSnapshot(mensajesRef, (msgSnap) => {
        msgSnap.docs.forEach((msg) => {
          const data = msg.data();
          if (!data.leidoPor?.includes(user.uid)) {
            total++;
          }
        });
        setUnreadChats(total);
      });
    });
  });

  return () => {
    unsubNotis();
    unsubChats();
  };
}, []);


  return (
    <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom || 10 }]}>
      <TouchableOpacity onPress={() => router.push("../home")}>
        <AntDesign name="home" size={24} color={isActive("/home") ? "#000" : "#999"} />
      </TouchableOpacity>

<TouchableOpacity onPress={() => router.push("../chats")}>
  <View style={{ position: "relative" }}>
    <AntDesign name="clockcircleo" size={24} color={isActive("/chats") ? "#000" : "#999"} />
    {unreadChats > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{unreadChats}</Text>
      </View>
    )}
  </View>
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
  <View style={{ position: "relative" }}>
    <AntDesign name="bells" size={24} color={isActive("/notificaciones") ? "#000" : "#999"} />
    {unreadNotis > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{unreadNotis}</Text>
      </View>
    )}
  </View>
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
  badge: {
  position: "absolute",
  top: -5,
  right: -10,
  backgroundColor: "#FF66C4", // rosa vibrante de tu app
  borderRadius: 8,
  minWidth: 16,
  paddingHorizontal: 4,
  paddingVertical: 1,
  alignItems: "center",
  justifyContent: "center",
},
badgeText: {
  color: "#fff",
  fontSize: 10,
  fontWeight: "bold",
  textAlign: "center",
},

});

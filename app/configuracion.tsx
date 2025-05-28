import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;
      const ref = doc(firestore, "usuarios", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setPerfil(snap.data());
    };
    fetchPerfil();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>
              {perfil?.username || "Cargando..."}
            </Text>
            <Text style={styles.platform}>
              🎮 {perfil?.plataformaFav || "Sin plataforma"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Configuración</Text>
        <TouchableOpacity onPress={() => router.push("/editar-perfil")}>
          <Text style={styles.item}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Accesibilidad e idiomas</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Tu actividad</Text></TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Privacidad</Text>
        <TouchableOpacity><Text style={styles.item}>Suscripciones</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Usuarios bloqueados</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Notificaciones</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Ayuda</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Centro de privacidad</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.item}>Estado de la cuenta</Text></TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Inicio de sesión</Text>
        <TouchableOpacity><Text style={[styles.item, { color: "#42BAFF" }]}>Añadir cuenta</Text></TouchableOpacity>
        <TouchableOpacity><Text style={[styles.item, { color: "red" }]}>Cerrar sesión</Text></TouchableOpacity>
        <TouchableOpacity><Text style={[styles.item, { color: "#FF66C4" }]}>Eliminar cuenta para siempre</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
  },
  platform: {
    fontSize: 14,
    color: "#888",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  },
  item: {
    fontSize: 15,
    paddingVertical: 6,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
});

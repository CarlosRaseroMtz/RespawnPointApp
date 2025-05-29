import { useRouter } from "expo-router";
import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, firestore } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) return;

    let activo = true;
    const ref = doc(firestore, "usuarios", user.uid);

    const cargarPerfil = async () => {
      try {
        const snap = await getDoc(ref);
        if (snap.exists() && activo) {
          setPerfil(snap.data());
        }
      } catch (err) {
        console.error("❌ Error al obtener perfil:", err);
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [user?.uid]);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  const eliminarCuenta = async () => {
    Alert.alert(
      "¿Eliminar cuenta?",
      "Esta acción es irreversible. ¿Seguro que quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const uid = user?.uid;
              if (!uid) return;

              await deleteDoc(doc(firestore, "usuarios", uid));
              if (auth.currentUser) {
                await deleteUser(auth.currentUser);
              } else {
                throw new Error("No hay usuario autenticado para eliminar.");
              }

              Alert.alert("✅ Cuenta eliminada", "Tu cuenta ha sido eliminada.");
              router.replace("/login");
            } catch (error) {
              console.error("❌ Error al eliminar cuenta:", error);
              Alert.alert("Error", "No se pudo eliminar la cuenta.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{perfil?.username || "Cargando..."}</Text>
            <Text style={styles.platform}>🎮 {perfil?.plataformaFav || "Sin plataforma"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Configuración</Text>
        <TouchableOpacity onPress={() => router.push("/editar-perfil")}>
          <Text style={styles.item}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Accesibilidad e idiomas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Tu actividad</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Privacidad</Text>
        <TouchableOpacity>
          <Text style={styles.item}>Suscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Usuarios bloqueados</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Centro de privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Estado de la cuenta</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Inicio de sesión</Text>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Añadir cuenta (próximamente)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cerrarSesion}>
          <Text style={[styles.item, { color: "red" }]}>Cerrar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={eliminarCuenta}>
          <Text style={[styles.item, { color: "#FF66C4" }]}>
            Eliminar cuenta para siempre
          </Text>
        </TouchableOpacity>
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

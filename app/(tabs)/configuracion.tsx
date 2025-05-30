import { useRouter } from "expo-router";
import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
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

/* 👈 nueva ruta (dos niveles arriba desde app/(tabs)/) */
import { auth, firestore } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);

  /* ----------- listener de perfil ----------- */
  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(firestore, "usuarios", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => snap.exists() && setPerfil(snap.data()),
      (e) =>
        e.code === "permission-denied"
          ? console.warn("⛔ Permiso denegado")
          : console.error("❌ Listener:", e)
    );

    return unsub;
  }, [user?.uid]);

  /* ----------- acciones ----------- */
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (e) {
      console.error("❌ Sign-out:", e);
    }
  };

  const eliminarCuenta = async () => {
    Alert.alert(
      "¿Eliminar cuenta?",
      "Esta acción es irreversible.",
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
              if (auth.currentUser) await deleteUser(auth.currentUser);

              Alert.alert("✅ Cuenta eliminada");
              router.replace("/login");
            } catch (e) {
              console.error("❌ Delete account:", e);
              Alert.alert("Error", "No se pudo eliminar la cuenta.");
            }
          },
        },
      ]
    );
  };

  /* ----------- UI ----------- */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* perfil */}
        <View style={styles.header}>
          <Image
            source={{
              uri: perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=12",
            }}
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

        {/* ajustes */}
        <Text style={styles.sectionTitle}>Configuración</Text>
        <TouchableOpacity
          /* 👈 ruta absoluta al nuevo lugar del archivo */
          onPress={() => router.push("/publicacion/editar-perfil")}
        >
          <Text style={styles.item}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Accesibilidad e idiomas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.item}>Tu actividad</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* privacidad */}
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

        {/* sesión */}
        <Text style={styles.sectionTitle}>Inicio de sesión</Text>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>
            Añadir cuenta (próximamente)
          </Text>
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

/* ----------- estilos ----------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
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
  sectionTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  },
  item: { fontSize: 15, paddingVertical: 6, color: "#000" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
});

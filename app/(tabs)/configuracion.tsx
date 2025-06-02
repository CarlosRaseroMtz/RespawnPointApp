import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

/* 👈 nueva ruta (dos niveles arriba desde app/(tabs)/) */
import UserHeader from "../../src/components/UserHeader";
import { useAuth } from "../../src/hooks/useAuth";
import { usePerfilUsuario } from "../../src/hooks/usePerfilUsuario";
import { cerrarSesion, eliminarCuenta } from "../../src/utils/auth-actions";

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { user } = useAuth();

  /* ----------- listener de perfil ----------- */
  const perfil = usePerfilUsuario();

  /* ----------- acciones ----------- */


  /* ----------- UI ----------- */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* perfil */}
        <UserHeader
          username={perfil?.username || "Cargando..."}
          plataforma={perfil?.plataformaFav}
          avatarUrl={perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=12"}
        />

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
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Tu actividad</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* privacidad */}
        <Text style={styles.sectionTitle}>Privacidad</Text>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Suscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Usuarios bloqueados</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Centro de privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>Estado de la cuenta</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* sesión */}
        <Text style={styles.sectionTitle}>Inicio de sesión</Text>
        <TouchableOpacity disabled>
          <Text style={[styles.item, { color: "#ccc" }]}>
            Añadir cuenta (próximamente)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => cerrarSesion(router)}>
          <Text style={[styles.item, { color: "red" }]}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => eliminarCuenta(user?.uid, router)}>
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

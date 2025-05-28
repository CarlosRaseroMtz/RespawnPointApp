import React from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ConfiguracionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/foto_perfil_isi.jpg")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>LordCarlosxdd</Text>
            <Text style={styles.platform}>🎮 XBOXONE</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Configuración</Text>
        <TouchableOpacity><Text style={styles.item}>Personalizar Perfil</Text></TouchableOpacity>
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

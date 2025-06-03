import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useTranslation } from "react-i18next";

import FondoLayout from "@/src/components/FondoLayout";
import UserHeader from "../../src/components/UserHeader";
import { useAuth } from "../../src/hooks/useAuth";
import { usePerfilUsuario } from "../../src/hooks/usePerfilUsuario";
import { cerrarSesion, eliminarCuenta } from "../../src/utils/auth-actions";

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const perfil = usePerfilUsuario();

  return (
    <FondoLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <UserHeader
            username={perfil?.username || t("settings.loading")}
            plataforma={perfil?.plataformaFav}
            avatarUrl={perfil?.fotoPerfil || "https://i.pravatar.cc/150?img=12"}
          />

          {/* ajustes */}
          <Text style={styles.sectionTitle}>{t("settings.general")}</Text>

          <TouchableOpacity onPress={() => router.push("/publicacion/editar-perfil")}>
            <Text style={styles.item}>{t("settings.editProfile")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/lenguaje")}
            className="py-3 border-b border-gray-300"
          >
            <Text style={styles.item}>{t("settings.language")}</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.activity")}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* privacidad */}
          <Text style={styles.sectionTitle}>{t("settings.privacy")}</Text>

          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.subscriptions")}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.blocked")}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.notifications")}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.help")}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.privacyCenter")}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>{t("settings.accountStatus")}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* sesión */}
          <Text style={styles.sectionTitle}>{t("settings.session")}</Text>

          <TouchableOpacity disabled>
            <Text style={[styles.item, { color: "#ccc" }]}>
              {t("settings.addAccount")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => cerrarSesion(router)}>
            <Text style={[styles.item, { color: "red" }]}>
              {t("settings.logout")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => eliminarCuenta(user?.uid, router)}>
            <Text style={[styles.item, { color: "#FF66C4" }]}>
              {t("settings.deleteAccount")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </FondoLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  },
  item: { fontSize: 15, paddingVertical: 6, color: "#000" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
});

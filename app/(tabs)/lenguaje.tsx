import FondoLayout from "@/src/components/FondoLayout";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = [
  { code: "en" },
  { code: "es" },
  { code: "fr" },
  { code: "it" },
  { code: "de" },
];

/**
 * Pantalla de configuración de accesibilidad y preferencias
 * Permite al usuario seleccionar idioma, privacidad y modo oscuro
 * Utiliza el layout FondoLayout para el fondo y estilo general
 */
export default function AccessibilityLanguageScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isPrivate, setIsPrivate] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const loadSettings = async () => {
      const lang = await AsyncStorage.getItem("language");
      const priv = await AsyncStorage.getItem("privacy");
      const dark = await AsyncStorage.getItem("darkmode");

      if (lang) {
        setSelectedLang(lang);
        i18n.changeLanguage(lang);
      }
      if (priv !== null) setIsPrivate(priv === "true");
      if (dark !== null) setDarkMode(dark === "true");
    };

    loadSettings();
  }, []);

  const handleLangChange = async (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    await AsyncStorage.setItem("language", code);
  };

  const handlePrivacyToggle = async () => {
    const newVal = !isPrivate;
    setIsPrivate(newVal);
    await AsyncStorage.setItem("privacy", String(newVal));
  };

  return (
    // —— interfaz principal —— */
    <FondoLayout>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#ffffff" }]}>
        <Text style={[styles.title, { color: isDark ? "#FF66C4" : "#000" }]}>
          {t("adapt.title")}
        </Text>

        {/* Idioma */}
        <View style={styles.title}>
          <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#6b7280" }]}>
            {t("adapt.language.sectionTitle")}
          </Text>
          <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#111827" }]}>
            {t("adapt.language.label")}
          </Text>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => handleLangChange(lang.code)}
            >
              <Text style={[styles.optionText, { color: isDark ? "#FF66C4" : "#000" }]}>
                {t(`adapt.languages.${lang.code}`)}
              </Text>
              {selectedLang === lang.code && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacidad */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#000" }]}>
            {t("adapt.privacy.sectionTitle")}
          </Text>
          <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#000" }]}>
            {t("adapt.privacy.label")}
          </Text>
          <View style={styles.option}>
            <Text style={[styles.description, { color: isDark ? "#FF66C4" : "#000" }]}>
              {isPrivate
                ? t("adapt.privacy.private")
                : t("adapt.privacy.public")}
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={handlePrivacyToggle}
              trackColor={{ true: "#a9dcfa", false: "#ccc" }}
              thumbColor={isDark ? "#42BAFF" : "#f4f4f4"}
            />
          </View>
        </View>

        {/* Modo oscuro */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#000" }]}>
            {t("adapt.theme.sectionTitle")}
          </Text>
          <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#000" }]}>
            {t("adapt.theme.label")}
          </Text>
          <View style={styles.option}>
            <Text style={[styles.description, { color: isDark ? "#FF66C4" : "#000" }]}>
              {darkMode
                ? t("adapt.theme.dark")
                : t("adapt.theme.light")}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ true: "#f4cde5", false: "#ccc" }}
              thumbColor={isDark ? "#FF66C4" : "#f4f4f4"}
            />
          </View>
        </View>
      </ScrollView>
    </FondoLayout>
  );
}

// /* —— estilos —— */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  optionText: {
    fontSize: 16,
    color: "#000000",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    marginRight: 10,
  },
  check: {
    fontSize: 18,
    color: "#FF66C4",
    fontWeight: "bold",
  },
});

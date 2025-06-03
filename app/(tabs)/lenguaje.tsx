import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "de", label: "Deutsch" },
];

export default function AccessibilityLanguageScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isPrivate, setIsPrivate] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const handleDarkModeToggle = async () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    await AsyncStorage.setItem("darkmode", String(newVal));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Idioma y accesibilidad</Text>

      {/* Idioma */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>IDIOMA DE LA APP</Text>
        <Text style={styles.label}>Idioma preferido</Text>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.option}
            onPress={() => handleLangChange(lang.code)}
          >
            <Text style={styles.optionText}>{lang.label}</Text>
            {selectedLang === lang.code && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Privacidad */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>CUENTA</Text>
        <Text style={styles.label}>Privacidad de cuenta</Text>
        <View style={styles.option}>
          <Text style={styles.description}>
            {isPrivate
              ? "Solo tus seguidores podrán ver tus publicaciones."
              : "Cualquiera podrá ver tus publicaciones."}
          </Text>
          <Switch
            value={isPrivate}
            onValueChange={handlePrivacyToggle}
            trackColor={{ false: "#ccc", true: "#42BAFF" }}
            thumbColor={isPrivate ? "#FF66C4" : "#f4f4f4"}
          />
        </View>
      </View>

      {/* Modo oscuro */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>PREFERENCIAS</Text>
        <Text style={styles.label}>Modo claro / oscuro</Text>
        <View style={styles.option}>
          <Text style={styles.description}>
            {darkMode
              ? "Interfaz con colores oscuros para descansar la vista."
              : "Interfaz clara con mejor visibilidad diurna."}
          </Text>
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: "#ccc", true: "#42BAFF" }}
            thumbColor={darkMode ? "#FF66C4" : "#f4f4f4"}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280", // gris medio
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


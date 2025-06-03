import FondoLayout from "@/src/components/FondoLayout";
import { useTheme } from "@/src/context/ThemeContext";
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
        <FondoLayout>
            <ScrollView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#ffffff" }]}>
                <Text style={[styles.title, { color: isDark ? "#FF66C4" : "#000" }]}>Idioma y accesibilidad</Text>

                {/* Idioma */}
                <View style={styles.title}>
                    <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#6b7280" }]}>IDIOMA DE LA APP</Text>
                    <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#111827" }]}>Idioma preferido</Text>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={styles.option}
                            onPress={() => handleLangChange(lang.code)}
                        >
                            <Text style={[styles.optionText, { color: isDark ? "#FF66C4" : "#000" }]}>{lang.label}</Text>
                            {selectedLang === lang.code && <Text style={styles.check}>✓</Text>}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Privacidad */}
                <View style={styles.section}>
                    <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#000" }]}>CUENTA</Text>
                    <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#000" }]}>Privacidad de cuenta</Text>
                    <View style={styles.option}>
                        <Text style={[styles.description, { color: isDark ? "#FF66C4" : "#000" }]}>
                            {isPrivate
                                ? "Solo tus seguidores podrán ver tus publicaciones."
                                : "Cualquiera podrá ver tus publicaciones."}
                        </Text>
                        <Switch
                            value={isPrivate}
                            onValueChange={handlePrivacyToggle}
                            trackColor={{ true: "#a9dcfa", false: "#ccc"}}
                            thumbColor={isDark ? "#42BAFF" : "#f4f4f4"}
                        />
                    </View>
                </View>

                {/* Modo oscuro */}
                <View style={styles.section}>
                    <Text style={[styles.subtitle, { color: isDark ? "#FF66C4" : "#000" }]}>PREFERENCIAS</Text>
                    <Text style={[styles.label, { color: isDark ? "#FF66C4" : "#000" }]}>Modo claro / oscuro</Text>
                    <View style={styles.option}>
                        <Text style={[styles.description, { color: isDark ? "#FF66C4" : "#000" }]}>
                            {darkMode
                                ? "Interfaz con colores oscuros para descansar la vista."
                                : "Interfaz clara con mejor visibilidad diurna."} 
                        </Text>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ true: "#f4cde5", false: "#ccc"}}
                            thumbColor={isDark ? "#FF66C4" : "#f4f4f4"}
                        />

                    </View>
                </View>
            </ScrollView>
        </FondoLayout>
    );
}

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


import i18n from "@/src/i18n"; // adapta según tu estructura
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "de", label: "Deutsch" }
];

export default function AccessibilityLanguageScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");
  const [isPrivate, setIsPrivate] = useState(false); // cargar esto del usuario si se persiste

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-xl font-bold mb-4">🌐 Idioma preferido</Text>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          className="flex-row justify-between items-center py-3 border-b border-gray-200"
          onPress={() => handleLangChange(lang.code)}
        >
          <Text className="text-base">{lang.label}</Text>
          {selectedLang === lang.code && <Text>✅</Text>}
        </TouchableOpacity>
      ))}

      <View className="mt-8">
        <Text className="text-xl font-bold mb-2">🔒 Privacidad de cuenta</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-base flex-1 pr-4">
            {isPrivate
              ? "Tu cuenta es privada. Solo tus seguidores pueden ver tus publicaciones."
              : "Tu cuenta es pública. Cualquiera puede ver tus publicaciones."}
          </Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
          />
        </View>
      </View>
    </ScrollView>
  );
}

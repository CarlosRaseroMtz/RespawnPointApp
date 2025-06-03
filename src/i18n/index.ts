import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";

const deviceLocale = Localization?.locale || "en";

// Detectar idioma según prefijo del locale del dispositivo
let language = "en";
if (deviceLocale.startsWith("es")) language = "es";
else if (deviceLocale.startsWith("fr")) language = "fr";
else if (deviceLocale.startsWith("it")) language = "it";
else if (deviceLocale.startsWith("de")) language = "de";

i18n
  .use(initReactI18next)
  .init({
    lng: language,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
      de: { translation: de },
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => console.log(`✅ i18n initialized with language: ${language}`));

export default i18n;

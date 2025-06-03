import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

const deviceLocale = Localization?.locale || "en";
const language = deviceLocale.startsWith("es") ? "es" : "en";

i18n
  .use(initReactI18next)
  .init({
    lng: language,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false,
    },
  })
    .then(() => console.log("✅ i18n initialized"));

export default i18n;

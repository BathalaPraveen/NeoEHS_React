// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import ta from "./locales/ta/translation.json";

// The starting language here is just a safe first paint - your
// LanguageContext calls i18n.changeLanguage(...) once it knows the real
// selected language (from sessionStorage or the API), so this initial
// value gets overridden immediately and doesn't need to match.
const savedCode = sessionStorage.getItem("selectedLanguageCode") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ta: { translation: ta },
    },
    lng: savedCode,
    fallbackLng: "en", // if a key is missing in the active language, show English instead of a blank/raw key
    interpolation: {
      escapeValue: false, // React already escapes output, so i18next doesn't need to
    },
  });

export default i18n;

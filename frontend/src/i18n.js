// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import ta from "./locales/ta/translation.json";

import enSidebar from "./locales/en/leftmenu.json";
import arSidebar from "./locales/ar/leftmenu.json";
import taSidebar from "./locales/ta/leftmenu.json";

// The starting language here is just a safe first paint - your
// LanguageContext calls i18n.changeLanguage(...) once it knows the real
// selected language (from sessionStorage or the API), so this initial
// value gets overridden immediately and doesn't need to match.
const savedCode = sessionStorage.getItem("selectedLanguageCode") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, sidebar: enSidebar },
      ar: { translation: ar, sidebar: arSidebar },
      ta: { translation: ta, sidebar: taSidebar },
    },
    // "translation" stays the default namespace for header/footer/dashboard/etc.
    // "sidebar" is a separate namespace/file, matched to a separate menu.json-style
    // file per language - this is what keeps it physically split like you wanted,
    // instead of one giant translation.json.
    ns: ["translation", "sidebar"],
    defaultNS: "translation",
    lng: savedCode,
    fallbackLng: "en", // if a key is missing in the active language, show English instead of a blank/raw key
    interpolation: {
      escapeValue: false, // React already escapes output, so i18next doesn't need to
    },
  });

export default i18n;

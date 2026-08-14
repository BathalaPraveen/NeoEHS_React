// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/admin.json";
import ar from "./locales/ar/admin.json";
import ta from "./locales/ta/admin.json";
import hi from "./locales/hi/admin.json";
import fr from "./locales/fr/admin.json";
import ms from "./locales/ms/admin.json";
import enSidebar from "./locales/en/leftmenu.json";
import arSidebar from "./locales/ar/leftmenu.json";
import taSidebar from "./locales/ta/leftmenu.json";
import hiSidebar from "./locales/hi/leftmenu.json";
import frSidebar from "./locales/fr/leftmenu.json";
import msSidebar from "./locales/ms/leftmenu.json";
// The starting language here is just a safe first paint - your
// LanguageContext calls i18n.changeLanguage(...) once it knows the real
// selected language (from sessionStorage or the API), so this initial
// value gets overridden immediately and doesn't need to match.
const savedCode = sessionStorage.getItem("selectedLanguageCode") || "en";
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { admin: en, sidebar: enSidebar },
      ar: { admin: ar, sidebar: arSidebar },
      ta: { admin: ta, sidebar: taSidebar },
      hi: { admin: hi, sidebar: hiSidebar },
      fr: { admin: fr, sidebar: frSidebar },
      ms: { admin: ms, sidebar: msSidebar },
    },
    // "admin" stays the default namespace for header/footer/dashboard/etc.
    // "sidebar" is a separate namespace/file, matched to a separate menu.json-style
    // file per language - this is what keeps it physically split like you wanted,
    // instead of one giant admin.json.
    ns: ["admin", "sidebar"],
    defaultNS: "admin",
    lng: savedCode,
    fallbackLng: "en", // if a key is missing in the active language, show English instead of a blank/raw key
    interpolation: {
      escapeValue: false, // React already escapes output, so i18next doesn't need to
    },
  });
export default i18n;

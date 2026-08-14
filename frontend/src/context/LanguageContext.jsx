// src/context/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import i18n from "../i18n";
const LanguageContext = createContext();
const RTL_LANGUAGES = ["ar", "he", "ur"];
export function LanguageProvider({ children }) {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/languages");
                if (response.data.success) {
                    const languageData = response.data.data;
                    setLanguages(languageData);
                    // Restore whatever the user picked last time (this browser session).
                    // Falls back to English only if nothing was saved yet, or the saved
                    // code no longer exists in the list returned by the API.
                    const savedCode = sessionStorage.getItem("selectedLanguageCode");
                    const savedLanguage = savedCode
                        ? languageData.find(l => l.short_name === savedCode)
                        : null;
                    const defaultLanguage = languageData.find(l => l.short_name === "en");
                    setSelectedLanguage(savedLanguage || defaultLanguage || languageData[0] || null);
                }
            } catch (error) {
                console.error("Failed to fetch languages:", error);
            }
        };
        fetchLanguages();
    }, []);
    useEffect(() => {
        if (!selectedLanguage) return;
        const isRTL = RTL_LANGUAGES.includes(selectedLanguage.short_name);
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        document.documentElement.lang = selectedLanguage.short_name;
        i18n.changeLanguage(selectedLanguage.short_name);
    }, [selectedLanguage]);
    const changeLanguage = (language) => {
        setSelectedLanguage(language);
        if (language?.short_name) {
            sessionStorage.setItem("selectedLanguageCode", language.short_name);
        }
    };
    return (
        <LanguageContext.Provider value={{ languages, selectedLanguage, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}
export function useLanguage() {
    return useContext(LanguageContext);
}
import { useEffect, useState } from "react";
import "../../assets/styles/header.css";

import logo from "../../assets/icons/logo.svg";
import logoShort from "../../assets/icons/logo-short.png";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
function Header({ collapsed, toggleSidebar }) {
    const { darkMode, toggleDarkMode } = useTheme();
    const { languages, selectedLanguage, changeLanguage } = useLanguage();
    const { t } = useTranslation();
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // ==========================================
    // Fullscreen
    // ==========================================

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();

            setIsFullscreen(true);
        } else {
            document.exitFullscreen();

            setIsFullscreen(false);
        }
    };

    return (
        <header className={`app-header ${collapsed ? "collapsed" : ""}`}>
            {/* ======================================
                Logo
            ======================================= */}

            <div className="header-logo">
                <img
                    src={collapsed ? logoShort : logo}
                    alt="NeoEHS"
                    className="header-logo-img"
                />
            </div>

            {/* ======================================
                Header Main
            ======================================= */}

            <div className="header-main">
                {/* ==================================
                    Left
                ================================== */}

                <div className="header-left">
                    <button
                        type="button"
                        className="icon-btn sidebar-toggle"
                        onClick={toggleSidebar}
                        title={
                            collapsed
                                ? t("header.expand_sidebar")
                                : t("header.collapse_sidebar")
                        }
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>

                {/* ==================================
                    Right
                ================================== */}

                <div className="header-right">
                    {/* Language */}

                    {/* Language */}

                    <div className="dropdown">
                        <button
                            type="button"
                            className="icon-btn"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            title={t("header.language")}
                        >
                            <i className="bi bi-globe"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end language-menu">
                            {languages.map((language) => (
                                <li key={language.id}>
                                    <button
                                        type="button"
                                        className={`dropdown-item language-item ${selectedLanguage?.id === language.id ? "active" : ""
                                            }`}
                                        onClick={() => changeLanguage(language)}
                                    >
                                        <span className="language-native">{language.native}</span>

                                        {/* <span className="language-english">
                        {language.english}
                    </span> */}

                                        {selectedLanguage?.id === language.id && (
                                            <i className="bi bi-check2 ms-auto"></i>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dark Mode */}

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleDarkMode}
                        title={darkMode ? t("header.light_mode") : t("header.dark_mode")}
                    >
                        <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"}`}></i>
                    </button>

                    {/* Fullscreen */}

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleFullscreen}
                        title={t("header.fullscreen")}
                    >
                        <i
                            className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"
                                }`}
                        ></i>
                    </button>

                    {/* Notifications */}

                    <button
                        type="button"
                        className="icon-btn notification"
                        title={t("header.notifications")}
                    >
                        <i className="bi bi-bell"></i>

                        <span>5</span>
                    </button>

                    {/* Profile */}

                    <div className="dropdown">
                        <button
                            type="button"
                            className="profile-btn dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src="https://i.pravatar.cc/40" alt="profile" />

                            <div className="profile-info">
                                <h6>Praveen</h6>

                                <small>Administrator</small>
                            </div>
                        </button>

                        {/* Profile Dropdown */}

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item" href="#">
                                    {t("header.my_profile")}
                                </a>
                            </li>

                            <li>
                                <a className="dropdown-item" href="#">
                                    {t("header.settings")}
                                </a>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <a className="dropdown-item text-danger" href="#">
                                    {t("header.logout")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

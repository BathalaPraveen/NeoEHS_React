import { useEffect, useState } from "react";
import "../../assets/styles/header.css";

import logo from "../../assets/icons/logo.svg";
import logoShort from "../../assets/icons/logo-short.png";

import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
function Header({ collapsed, toggleSidebar }) {

    const { darkMode, toggleDarkMode } = useTheme();
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

useEffect(() => {

    const handleFullscreenChange = () => {

        setIsFullscreen(
            Boolean(document.fullscreenElement)
        );

    };

    document.addEventListener(
        "fullscreenchange",
        handleFullscreenChange
    );

    return () => {

        document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

    };

}, []);

useEffect(() => {

    const fetchLanguages = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/admin/languages"
            );

            if (response.data.success) {

                const languageData = response.data.data;

                setLanguages(languageData);

                // Default language: English
                const defaultLanguage = languageData.find(
                    language => language.short_name === "en"
                );

                setSelectedLanguage(
                    defaultLanguage || languageData[0] || null
                );

            }

        } catch (error) {

            console.error(
                "Failed to fetch languages:",
                error
            );

        }

    };

    fetchLanguages();

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

        <header
            className={`app-header ${collapsed ? "collapsed" : ""}`}
        >

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
                                ? "Expand Sidebar"
                                : "Collapse Sidebar"
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
        title="Language"
    >
        <i className="bi bi-globe"></i>
    </button>

    <ul className="dropdown-menu dropdown-menu-end language-menu">

        {languages.map((language) => (

            <li key={language.id}>

                <button
                    type="button"
                    className={`dropdown-item language-item ${
                        selectedLanguage?.id === language.id
                            ? "active"
                            : ""
                    }`}
                    onClick={() => {
                        setSelectedLanguage(language);
                    }}
                >

                    <span className="language-native">
                        {language.native}
                    </span>

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
                        title={
                            darkMode
                                ? "Light Mode"
                                : "Dark Mode"
                        }
                    >

                        <i
                            className={`bi ${
                                darkMode
                                    ? "bi-sun"
                                    : "bi-moon"
                            }`}
                        ></i>

                    </button>


                    {/* Fullscreen */}

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleFullscreen}
                        title="Fullscreen"
                    >

                        <i
                            className={`bi ${
                                isFullscreen
                                    ? "bi-fullscreen-exit"
                                    : "bi-fullscreen"
                            }`}
                        ></i>

                    </button>


                    {/* Notifications */}

                    <button
                        type="button"
                        className="icon-btn notification"
                        title="Notifications"
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

                            <img
                                src="https://i.pravatar.cc/40"
                                alt="profile"
                            />

                            <div className="profile-info">

                                <h6>
                                    Praveen
                                </h6>

                                <small>
                                    Administrator
                                </small>

                            </div>

                        </button>


                        {/* Profile Dropdown */}

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>

                                <a
                                    className="dropdown-item"
                                    href="#"
                                >
                                    My Profile
                                </a>

                            </li>


                            <li>

                                <a
                                    className="dropdown-item"
                                    href="#"
                                >
                                    Settings
                                </a>

                            </li>


                            <li>

                                <hr className="dropdown-divider" />

                            </li>


                            <li>

                                <a
                                    className="dropdown-item text-danger"
                                    href="#"
                                >
                                    Logout
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
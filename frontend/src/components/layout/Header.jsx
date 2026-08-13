import { useEffect, useState } from "react";
import "../../assets/styles/header.css";

import logo from "../../assets/icons/logo.svg";
import logoShort from "../../assets/icons/logo-short.png";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";

import { Link, useNavigate } from "react-router-dom";

function Header({ collapsed, toggleSidebar }) {

    const { darkMode, toggleDarkMode } = useTheme();

    const {
        languages,
        selectedLanguage,
        changeLanguage
    } = useLanguage();

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [user, setUser] = useState(null);
    const [avatarError, setAvatarError] = useState(false);

    // ==========================================
    // Fullscreen Change
    // ==========================================

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


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        // Remove authentication data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user");

        // Tell AppRoutes that authentication has changed
        window.dispatchEvent(
            new Event("authChange")
        );

        // Redirect to login
        navigate("/login", {
            replace: true
        });
    };


    // ==========================================
    // Fullscreen
    // ==========================================

    const toggleFullscreen = () => {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    };
    // ==========================================
    // Logged In User
    // ==========================================

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {

                    setUser(JSON.parse(storedUser));
                    setAvatarError(false);

                } catch (error) {

                    console.error(
                        "Failed to parse user data:",
                        error
                    );

                    setUser(null);
                }

            } else {

                setUser(null);

            }

        };


        // Load initially
        loadUser();


        // Update after login/logout
        window.addEventListener(
            "authChange",
            loadUser
        );


        return () => {

            window.removeEventListener(
                "authChange",
                loadUser
            );

        };

    }, []);

    return (

        <header
            className={`app-header ${collapsed ? "collapsed" : ""
                }`}
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


                    {/* ==================================
                        Language
                    ================================== */}

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
                                        className={`dropdown-item language-item ${selectedLanguage?.id === language.id
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            changeLanguage(language)
                                        }
                                    >

                                        <span className="language-native">
                                            {language.native}
                                        </span>

                                        {selectedLanguage?.id === language.id && (

                                            <i className="bi bi-check2 ms-auto"></i>

                                        )}

                                    </button>

                                </li>

                            ))}

                        </ul>

                    </div>


                    {/* ==================================
                        Dark Mode
                    ================================== */}

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleDarkMode}
                        title={
                            darkMode
                                ? t("header.light_mode")
                                : t("header.dark_mode")
                        }
                    >

                        <i
                            className={`bi ${darkMode
                                ? "bi-sun"
                                : "bi-moon"
                                }`}
                        ></i>

                    </button>


                    {/* ==================================
                        Fullscreen
                    ================================== */}

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleFullscreen}
                        title={t("header.fullscreen")}
                    >

                        <i
                            className={`bi ${isFullscreen
                                ? "bi-fullscreen-exit"
                                : "bi-fullscreen"
                                }`}
                        ></i>

                    </button>


                    {/* ==================================
                        Notifications
                    ================================== */}

                    <button
                        type="button"
                        className="icon-btn notification"
                        title={t("header.notifications")}
                    >

                        <i className="bi bi-bell"></i>

                        <span>5</span>

                    </button>


                    {/* ==================================
                        Profile
                    ================================== */}

                    <div className="dropdown">

                        <button
                            type="button"
                            className="profile-btn dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >

                            {user?.profile_image && !avatarError ? (
                                <img
                                    src={user.profile_image}
                                    alt="profile"
                                    onError={() => setAvatarError(true)}
                                />
                            ) : (
                                <span className="profile-btn-avatar-fallback">
                                    <i className="bi bi-person-fill"></i>
                                </span>
                            )}

                            <div className="profile-info">

                                <h6>
                                    {user?.name || user?.username || user?.email || "User"}
                                </h6>
                            </div>

                        </button>


                        {/* Profile Dropdown */}

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>

                                <Link
                                    className="dropdown-item"
                                    to="/profile"
                                >
                                    {t("header.my_profile")}
                                </Link>

                            </li>


                            <li>

                                <a
                                    className="dropdown-item"
                                    href="#"
                                >
                                    {t("header.settings")}
                                </a>

                            </li>


                            <li>

                                <hr className="dropdown-divider" />

                            </li>


                            <li>

                                <button
                                    type="button"
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    {t("header.logout")}
                                </button>

                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Header;
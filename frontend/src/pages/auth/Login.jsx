import { useState } from "react";
import "../../assets/styles/login.css";

import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";

import logo from "../../assets/icons/logo.svg";

function LoginPage() {

    const { t } = useTranslation();

    const {
        languages,
        selectedLanguage,
        changeLanguage
    } = useLanguage();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        console.log("Login submitted");
    };

    return (
        <div className="login-page">

            {/* LEFT PANEL */}
            <div className="login-brand-panel">

                <div className="brand-content">

                    <div className="brand-logo">
                        <img
                            src={logo}
                            alt="NeoEHS"
                        />
                    </div>

                    <h1>
                        {t("login.building_title")}
                        <br />

                        <span>
                            {t("login.building_title_highlight")}
                        </span>

                        {" "}

                        {t("login.building_title_end")}
                    </h1>

                    <div className="brand-line"></div>

                    <p className="brand-description">
                        {t("login.description")}
                    </p>


                    {/* Ensure Safety */}
                    <div className="brand-feature">

                        <div className="feature-icon safety">
                            <i className="bi bi-shield-check"></i>
                        </div>

                        <div>
                            <h4>
                                {t("login.ensure_safety")}
                            </h4>

                            <p>
                                {t("login.ensure_safety_description")}
                            </p>
                        </div>

                    </div>


                    {/* Go Green */}
                    <div className="brand-feature">

                        <div className="feature-icon green">
                            <i className="bi bi-leaf"></i>
                        </div>

                        <div>
                            <h4>
                                {t("login.go_green")}
                            </h4>

                            <p>
                                {t("login.go_green_description")}
                            </p>
                        </div>

                    </div>


                    {/* Productivity */}
                    <div className="brand-feature">

                        <div className="feature-icon productivity">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>

                        <div>
                            <h4>
                                {t("login.boost_productivity")}
                            </h4>

                            <p>
                                {t("login.boost_productivity_description")}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="brand-overlay"></div>

            </div>


            {/* RIGHT PANEL */}
            <div className="login-form-panel">


                {/* LANGUAGE */}
                <div className="login-language dropdown">

                    <button
                        type="button"
                        className="language-button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title={t("header.language")}
                    >

                        <i className="bi bi-globe"></i>

                        <span>
                            {selectedLanguage?.english || "English"}
                        </span>

                        <i className="bi bi-chevron-down"></i>

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
                                    onClick={() => changeLanguage(language)}
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


                <div className="login-form-container">

                    {/* Login Icon */}
                    <div className="login-icon">
                        <i className="bi bi-lock"></i>
                    </div>


                    <h2>
                        {t("login.welcome_back")}
                    </h2>

                    <p className="login-subtitle">
                        {t("login.sign_in_subtitle")}
                    </p>


                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="form-group">

                            <label htmlFor="email">
                                {t("login.email_address")}
                            </label>

                            <div className="input-wrapper">

                                <i className="bi bi-envelope"></i>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder={t(
                                        "login.email_placeholder"
                                    )}
                                    required
                                />

                            </div>

                        </div>


                        {/* Password */}
                        <div className="form-group">

                            <label htmlFor="password">
                                {t("login.password")}
                            </label>

                            <div className="input-wrapper">

                                <i className="bi bi-lock"></i>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    placeholder={t(
                                        "login.password_placeholder"
                                    )}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    <i
                                        className={`bi ${
                                            showPassword
                                                ? "bi-eye-slash"
                                                : "bi-eye"
                                        }`}
                                    ></i>

                                </button>

                            </div>

                        </div>


                        {/* Options */}
                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    {t("login.remember_me")}
                                </span>

                            </label>


                            <a href="#">
                                {t("login.forgot_password")}
                            </a>

                        </div>


                        {/* Login */}
                        <button
                            type="submit"
                            className="login-button"
                        >

                            <i className="bi bi-box-arrow-in-right"></i>

                            <span>
                                {t("login.login")}
                            </span>

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;
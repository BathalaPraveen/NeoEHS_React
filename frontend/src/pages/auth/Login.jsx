import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/login.css";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import logo from "../../assets/icons/logo.svg";
import LoginBrandPanel from "../../components/auth/LoginBrandPanel";
function LoginPage() {
    const { t } = useTranslation();
    const { languages, selectedLanguage, changeLanguage} = useLanguage();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = {
            email: "",
            password: ""
        };
        setLoginError("");
        if (!email.trim()) {
            newErrors.email = t("login.email_required");
        }
        if (!password.trim()) {
            newErrors.password = t("login.password_required");
        }
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) {
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    login: email.trim(),
                    password: password
                }
            );
            console.log("Login response:", response.data);
            if (response.data.success) {
                // if (response.data.user?.is_twoFactor) {
                //     navigate("/verify-2fa", {
                //         state: {
                //             token: response.data.token,
                //             user: response.data.user
                //         }
                //     });
                //     return;
                // }
                localStorage.setItem(
                    "authToken",
                    response.data.token
                );
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                window.dispatchEvent(
                    new Event("authChange")
                );
                navigate("/dashboard", {
                    replace: true
                });
            } else {
                setLoginError(
                    response.data.message ||
                    "Invalid username/email or password"
                );
            }
        } catch (error) {
            console.error("Login failed:", error);
            setLoginError(
                error.response?.data?.message ||
                "Invalid username/email or password"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="auth-card-body">
                    <LoginBrandPanel />
                    <div className="login-form-panel">
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
                                            className={`dropdown-item language-item ${selectedLanguage?.id === language.id
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
                            <form onSubmit={handleLogin} noValidate>
                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email">
                                        {t("login.email_address")}
                                    </label>
                                    <div
                                        className={`input-wrapper ${errors.email ? "input-error" : ""
                                            }`}
                                    >
                                        <i className="bi bi-envelope"></i>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        email: "",
                                                    }));
                                                }
                                            }}
                                            placeholder={t(
                                                "login.email_placeholder"
                                            )}
                                        />
                                    </div>
                                    {errors.email && (
                                        <span className="field-error">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                {/* Password */}
                                <div className="form-group">
                                    <label htmlFor="password">
                                        {t("login.password")}
                                    </label>
                                    <div
                                        className={`input-wrapper ${errors.password ? "input-error" : ""
                                            }`}
                                    >
                                        <i className="bi bi-lock"></i>
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        password: "",
                                                    }));
                                                }
                                            }}
                                            placeholder={t(
                                                "login.password_placeholder"
                                            )}
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
                                                className={`bi ${showPassword
                                                        ? "bi-eye-slash"
                                                        : "bi-eye"
                                                    }`}
                                            ></i>
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <span className="field-error">
                                            {errors.password}
                                        </span>
                                    )}
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
                                    <Link to="/forgot-password">
                                        {t("login.forgot_password")}
                                    </Link>
                                </div>
                                {/* Login Error */}
                                {loginError && (
                                    <div className="login-error">
                                        <i className="bi bi-exclamation-circle"></i>
                                        <span>
                                            {loginError}
                                        </span>
                                    </div>
                                )}
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
            </div>
        </div>
    );
}
export default LoginPage;

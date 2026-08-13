import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/login.css";

import { useTranslation } from "react-i18next";

import LoginBrandPanel from "../../components/auth/LoginBrandPanel";

function ForgotPasswordPage() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError(t("login.email_required"));
            return;
        }

        setError("");

        console.log("Reset link requested for", email);

        navigate("/verify-otp", {
            state: { email: email.trim() },
        });
    };

    return (
        <div className="login-page">

        <div className="login-card">

            <div className="auth-card-body">

                <LoginBrandPanel />

                {/* RIGHT PANEL */}
                <div className="login-form-panel">

                    <div className="login-form-container">

                        {/* Icon */}
                        <div className="forgot-icon">

                            <i className="bi bi-envelope"></i>

                            <span className="forgot-icon-badge">
                                <i className="bi bi-question-lg"></i>
                            </span>

                            <span className="forgot-icon-lock">
                                <i className="bi bi-lock-fill"></i>
                            </span>

                        </div>


                        <h2>
                            {t("forgot_password.title")}
                        </h2>

                        <p className="login-subtitle">
                            {t("forgot_password.subtitle")}
                        </p>


                        <form onSubmit={handleSubmit} noValidate>

                            {/* Email */}
                            <div className="form-group">

                                <label htmlFor="email">
                                    {t("login.email_address")}
                                </label>

                                <div
                                    className={`input-wrapper ${
                                        error ? "input-error" : ""
                                    }`}
                                >

                                    <i className="bi bi-envelope"></i>

                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);

                                            if (error) {
                                                setError("");
                                            }
                                        }}
                                        placeholder={t(
                                            "login.email_placeholder"
                                        )}
                                    />

                                </div>

                                {error && (
                                    <span className="field-error">
                                        {error}
                                    </span>
                                )}

                            </div>


                            {/* Send Reset Link */}
                            <button
                                type="submit"
                                className="login-button"
                            >

                                <span>
                                    {t("forgot_password.send_reset_link")}
                                </span>

                            </button>

                        </form>


                        {/* Divider */}
                        <div className="login-divider">
                            <span></span>

                            <p>
                                {t("forgot_password.or")}
                            </p>

                            <span></span>
                        </div>


                        {/* Secure & Safe */}
                        <div className="secure-note">

                            <div className="secure-note-icon">
                                <i className="bi bi-shield-check"></i>
                            </div>

                            <div>
                                <h4>
                                    {t("forgot_password.secure_safe_title")}
                                </h4>

                                <p>
                                    {t(
                                        "forgot_password.secure_safe_description"
                                    )}
                                </p>
                            </div>

                        </div>


                        {/* Back to Login */}
                        <Link
                            to="/login"
                            className="back-to-login"
                        >

                            <i className="bi bi-arrow-left"></i>

                            <span>
                                {t("forgot_password.back_to_login")}
                            </span>

                        </Link>

                    </div>

                </div>

            </div>


            {/* FOOTER */}
            {/* <div className="auth-card-footer">

                <span>
                    {t("footer.copyright")}
                </span>

                <span className="auth-footer-divider">|</span>

                <span>
                    {t("footer.version")}
                </span>

            </div> */}

        </div>

        </div>
    );
}

export default ForgotPasswordPage;

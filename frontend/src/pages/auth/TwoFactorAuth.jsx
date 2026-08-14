import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../assets/styles/login.css";
import LoginBrandPanel from "../../components/auth/LoginBrandPanel";
function TwoFactorAuthPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = location.state || {};
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [resentMessage, setResentMessage] = useState("");
    const handleResend = () => {
        console.log("Resending 2FA code to", user?.email || user?.login);
        setResentMessage(t("two_factor.resend_sent"));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError(t("two_factor.code_required"));
            return;
        }
        setError("");
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authChange"));
        navigate("/dashboard", { replace: true });
    };
    if (!token || !user) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="auth-card-body">
                        <LoginBrandPanel />
                        <div className="login-form-panel">
                            <div className="login-form-container">
                                <div className="login-icon warning">
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>
                                <h2>{t("two_factor.session_expired_title")}</h2>
                                <p className="login-subtitle">
                                    {t("two_factor.session_expired_subtitle")}
                                </p>
                                <Link to="/login" className="login-button">
                                    <span>{t("two_factor.back_to_login")}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="auth-card-body">
                    <LoginBrandPanel />
                    <div className="login-form-panel">
                        <div className="login-form-container">
                            <div className="login-icon">
                                <i className="bi bi-shield-lock"></i>
                            </div>
                            <h2>{t("two_factor.title")}</h2>
                            <p className="login-subtitle">
                                {t("two_factor.subtitle")}
                            </p>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="tfa-code">
                                        {t("two_factor.code_label")}
                                    </label>
                                    <div
                                        className={`input-wrapper ${error ? "input-error" : ""}`}
                                    >
                                        <i className="bi bi-key"></i>
                                        <input
                                            type="text"
                                            id="tfa-code"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => {
                                                setCode(e.target.value.replace(/\D/g, ""));
                                                if (error) {
                                                    setError("");
                                                }
                                            }}
                                            placeholder={t("two_factor.code_placeholder")}
                                        />
                                    </div>
                                    {error && (
                                        <span className="field-error">{error}</span>
                                    )}
                                </div>
                                {resentMessage && (
                                    <div className="form-note">
                                        <i className="bi bi-check-circle"></i>
                                        <span>{resentMessage}</span>
                                    </div>
                                )}
                                <button type="submit" className="login-button">
                                    <span>{t("two_factor.verify")}</span>
                                </button>
                            </form>
                            <p className="login-subtitle" style={{ marginTop: 22, marginBottom: 0 }}>
                                {t("two_factor.resend_prompt")}{" "}
                                <button
                                    type="button"
                                    className="otp-resend"
                                    onClick={handleResend}
                                >
                                    {t("two_factor.resend_link")}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TwoFactorAuthPage;

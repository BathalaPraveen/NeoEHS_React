import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../assets/styles/login.css";
import LoginBrandPanel from "../../components/auth/LoginBrandPanel";
function ResetPasswordPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const email = location.state?.email || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });
    const [resetDone, setResetDone] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            password: "",
            confirmPassword: "",
        };
        if (!password.trim()) {
            newErrors.password = t("reset_password.new_password_required");
        } else if (password.trim().length < 8) {
            newErrors.password = t("reset_password.password_min_length");
        }
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = t("reset_password.confirm_password_required");
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = t("reset_password.password_mismatch");
        }
        setErrors(newErrors);
        if (newErrors.password || newErrors.confirmPassword) {
            return;
        }
        console.log("Password reset for", email);
        setResetDone(true);
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="auth-card-body">
                    <LoginBrandPanel />
                    <div className="login-form-panel">
                        <div className="login-form-container">
                            {resetDone ? (
                                <>
                                    <div className="login-icon success">
                                        <i className="bi bi-check-circle"></i>
                                    </div>
                                    <h2>{t("reset_password.success_title")}</h2>
                                    <p className="login-subtitle">
                                        {t("reset_password.success_subtitle")}
                                    </p>
                                    <Link to="/login" className="login-button">
                                        <span>{t("reset_password.continue_to_login")}</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="login-icon">
                                        <i className="bi bi-shield-lock"></i>
                                    </div>
                                    <h2>{t("reset_password.title")}</h2>
                                    <p className="login-subtitle">
                                        {t("reset_password.subtitle")}
                                    </p>
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="form-group">
                                            <label htmlFor="new-password">
                                                {t("reset_password.new_password")}
                                            </label>
                                            <div
                                                className={`input-wrapper ${errors.password ? "input-error" : ""}`}
                                            >
                                                <i className="bi bi-lock"></i>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="new-password"
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
                                                    placeholder={t("reset_password.new_password_placeholder")}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <i
                                                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                                                    ></i>
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <span className="field-error">{errors.password}</span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirm-password">
                                                {t("reset_password.confirm_password")}
                                            </label>
                                            <div
                                                className={`input-wrapper ${errors.confirmPassword ? "input-error" : ""}`}
                                            >
                                                <i className="bi bi-lock"></i>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="confirm-password"
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        if (errors.confirmPassword) {
                                                            setErrors((prev) => ({
                                                                ...prev,
                                                                confirmPassword: "",
                                                            }));
                                                        }
                                                    }}
                                                    placeholder={t("reset_password.confirm_password_placeholder")}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                >
                                                    <i
                                                        className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                                                    ></i>
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <span className="field-error">
                                                    {errors.confirmPassword}
                                                </span>
                                            )}
                                        </div>
                                        <button type="submit" className="login-button">
                                            <span>{t("reset_password.submit")}</span>
                                        </button>
                                    </form>
                                    <Link to="/login" className="back-to-login">
                                        <i className="bi bi-arrow-left"></i>
                                        <span>{t("reset_password.back_to_login")}</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ResetPasswordPage;

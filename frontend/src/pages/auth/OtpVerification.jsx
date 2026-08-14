import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../assets/styles/login.css";
import LoginBrandPanel from "../../components/auth/LoginBrandPanel";
const OTP_DURATION_SECONDS = 600;
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function OtpVerificationPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SECONDS);
    const [resentMessage, setResentMessage] = useState("");
    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);
    const expired = secondsLeft <= 0;
    const handleResend = () => {
        console.log("Resending OTP to", email);
        setSecondsLeft(OTP_DURATION_SECONDS);
        setOtp("");
        setError("");
        setResentMessage(t("otp.resend_sent"));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (expired) {
            setError(t("otp.expired"));
            return;
        }
        if (!otp.trim()) {
            setError(t("otp.otp_required"));
            return;
        }
        if (!/^\d{6}$/.test(otp.trim())) {
            setError(t("otp.otp_invalid"));
            return;
        }
        setError("");
        navigate("/reset-password", {
            state: { email },
        });
    };
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
                            <h2>{t("otp.title")}</h2>
                            <p className="login-subtitle">
                                {t("otp.subtitle")}
                            </p>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="otp-email">
                                        {t("login.email_address")}
                                    </label>
                                    <div className="input-wrapper readonly-field">
                                        <i className="bi bi-envelope"></i>
                                        <input
                                            type="email"
                                            id="otp-email"
                                            value={email}
                                            readOnly
                                            placeholder={t("login.email_placeholder")}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="otp-code">
                                        {t("otp.otp_label")}
                                    </label>
                                    <div
                                        className={`input-wrapper ${error ? "input-error" : ""}`}
                                    >
                                        <i className="bi bi-key"></i>
                                        <input
                                            type="text"
                                            id="otp-code"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value.replace(/\D/g, ""));
                                                if (error) {
                                                    setError("");
                                                }
                                            }}
                                            placeholder={t("otp.otp_placeholder")}
                                        />
                                    </div>
                                    {error && (
                                        <span className="field-error">{error}</span>
                                    )}
                                </div>
                                <div className="otp-meta">
                                    <span className={`otp-timer ${expired ? "expired" : ""}`}>
                                        {expired
                                            ? t("otp.expired")
                                            : `${t("otp.expires_in")} ${formatTime(secondsLeft)}`}
                                    </span>
                                    <button
                                        type="button"
                                        className="otp-resend"
                                        onClick={handleResend}
                                        disabled={!expired}
                                    >
                                        {t("otp.resend")}
                                    </button>
                                </div>
                                {resentMessage && (
                                    <div className="form-note">
                                        <i className="bi bi-check-circle"></i>
                                        <span>{resentMessage}</span>
                                    </div>
                                )}
                                <button type="submit" className="login-button">
                                    <span>{t("otp.verify")}</span>
                                </button>
                            </form>
                            <Link to="/login" className="back-to-login">
                                <i className="bi bi-arrow-left"></i>
                                <span>{t("otp.back_to_login")}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OtpVerificationPage;

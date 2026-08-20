import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "../../assets/styles/profile.css";
function getPasswordStrength(password) {
    if (!password) {
        return { score: 0, label: "", percent: 0 };
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: "", percent: 0 },
        { label: "Weak", percent: 25 },
        { label: "Fair", percent: 50 },
        { label: "Good", percent: 75 },
        { label: "Strong", percent: 100 },
    ];
    return { score, ...levels[score] };
}
const STRENGTH_COLORS = ["#e5e7eb", "#e0483e", "#d68910", "#1799d6", "#25ad4d"];
function Profile() {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    // ==========================================
    // Profile Info
    // ==========================================
    const [editingInfo, setEditingInfo] = useState(false);
    const [infoForm, setInfoForm] = useState({ name: "", phone: "" });
    const [savingInfo, setSavingInfo] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarError, setAvatarError] = useState(false);
    // ==========================================
    // Change Password
    // ==========================================
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        next: "",
        confirm: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        next: false,
        confirm: false,
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [savingPassword, setSavingPassword] = useState(false);
    // ==========================================
    // Two-Factor Authentication
    // ==========================================
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [savingTwoFactor, setSavingTwoFactor] = useState(false);
    // ==========================================
    // Load logged-in user
    // ==========================================
    useEffect(() => {
        const loadUser = () => {
            const stored =
                localStorage.getItem("user") || sessionStorage.getItem("user");
            if (!stored) {
                setUser(null);
                return;
            }
            try {
                const parsed = JSON.parse(stored);
                console.log(parsed);
                setUser(parsed);
                setInfoForm({
                    name: parsed?.name || "",
                    phone: parsed?.phone || "",
                });
                setAvatarPreview(parsed?.profile_image || null);
                setAvatarError(false);
                setTwoFactorEnabled(Boolean(parsed?.is_twoFactor));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                setUser(null);
            }
        };
        loadUser();
        window.addEventListener("authChange", loadUser);
        return () => window.removeEventListener("authChange", loadUser);
    }, []);
    const persistUser = (patch) => {
        const store = localStorage.getItem("user")
            ? localStorage
            : sessionStorage;
        const current = JSON.parse(store.getItem("user") || "{}");
        const updated = { ...current, ...patch };
        store.setItem("user", JSON.stringify(updated));
        window.dispatchEvent(new Event("authChange"));
    };
    const authHeaders = () => {
        const token =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };
    // ==========================================
    // Avatar upload
    // ==========================================
    const handleAvatarClick = () => fileInputRef.current?.click();
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error(t("profile.image_invalid"));
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            toast.error(t("profile.image_too_large"));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            setAvatarPreview(dataUrl);
            setAvatarError(false);
            persistUser({ profile_image: dataUrl });
            toast.success(t("profile.image_updated"));
            api
                .post(
                    "/api/auth/update-profile-image",
                    { profile_image: dataUrl },
                    { headers: authHeaders() }
                )
                .catch((error) => {
                    console.error("Failed to sync profile image:", error);
                });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };
    // ==========================================
    // Profile info save
    // ==========================================
    const handleInfoSave = async (e) => {
        e.preventDefault();
        if (!infoForm.name.trim()) {
            toast.error(t("profile.name_required"));
            return;
        }
        setSavingInfo(true);
        try {
            await api.put(
                "/api/auth/update-profile",
                { name: infoForm.name.trim(), phone: infoForm.phone.trim() },
                { headers: authHeaders() }
            );
        } catch (error) {
            console.error("Failed to sync profile info:", error);
        } finally {
            persistUser({
                name: infoForm.name.trim(),
                phone: infoForm.phone.trim(),
            });
            setSavingInfo(false);
            setEditingInfo(false);
            toast.success(t("profile.info_updated"));
        }
    };
    const cancelInfoEdit = () => {
        setInfoForm({ name: user?.name || "", phone: user?.phone || "" });
        setEditingInfo(false);
    };
    // ==========================================
    // Password change
    // ==========================================
    const strength = getPasswordStrength(passwordForm.next);
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!passwordForm.current) {
            errors.current = t("profile.current_password_required");
        }
        if (!passwordForm.next) {
            errors.next = t("profile.new_password_required");
        } else if (passwordForm.next.length < 8) {
            errors.next = t("profile.password_min_length");
        }
        if (passwordForm.confirm !== passwordForm.next) {
            errors.confirm = t("profile.password_mismatch");
        }
        setPasswordErrors(errors);
        if (Object.keys(errors).length) return;
        setSavingPassword(true);
        try {
            await api.put(
                "/api/auth/change-password",
                {
                    current_password: passwordForm.current,
                    new_password: passwordForm.next,
                },
                { headers: authHeaders() }
            );
            toast.success(t("profile.password_updated"));
            setPasswordForm({ current: "", next: "", confirm: "" });
            setPasswordErrors({});
        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error(
                error.response?.data?.message || t("profile.password_update_failed")
            );
        } finally {
            setSavingPassword(false);
        }
    };
    // ==========================================
    // Two-Factor toggle
    // ==========================================
    const handleTwoFactorToggle = async () => {
        const enabling = !twoFactorEnabled;
        const confirm = await Swal.fire({
            icon: enabling ? "question" : "warning",
            title: enabling
                ? t("profile.enable_2fa_title")
                : t("profile.disable_2fa_title"),
            text: enabling
                ? t("profile.enable_2fa_text")
                : t("profile.disable_2fa_text"),
            showCancelButton: true,
            confirmButtonColor: enabling ? "#25ad4d" : "#e0483e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: enabling
                ? t("profile.enable")
                : t("profile.disable"),
            cancelButtonText: t("profile.cancel"),
        });
        if (!confirm.isConfirmed) return;
        setSavingTwoFactor(true);
        try {
            await api.put(
                "/api/auth/toggle-two-factor",
                { is_twoFactor: enabling },
                { headers: authHeaders() }
            );
            setTwoFactorEnabled(enabling);
            persistUser({ is_twoFactor: enabling });
            toast.success(
                enabling ? t("profile.two_fa_enabled") : t("profile.two_fa_disabled")
            );
        } catch (error) {
            console.error("Failed to toggle two-factor authentication:", error);
            toast.error(t("profile.two_fa_update_failed"));
        } finally {
            setSavingTwoFactor(false);
        }
    };
    const displayName = user?.name || user?.username || user?.email || "User";
    // role/user_type may come back as a numeric id (e.g. role=1) rather than
    // a label - only show the badge when we actually have readable text.
    const roleLabel = [user?.role, user?.user_type].find(
        (value) => typeof value === "string" && value.trim() && !/^\d+$/.test(value.trim())
    );
    return (
        <div className="profile-page">
            {/* ==========================================
                Breadcrumb
            ========================================== */}
            <nav className="profile-breadcrumb">
                <Link to="/dashboard">
                    <i className="bi bi-house-door"></i>
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>{t("profile.breadcrumb_profile")}</span>
                <i className="bi bi-chevron-right"></i>
                <span className="current">{t("profile.breadcrumb_settings")}</span>
            </nav>
            <div className="profile-grid">
                {/* ==========================================
                    Summary Card
                ========================================== */}
                <aside className="profile-card profile-summary-card">
                    <div className="profile-cover"></div>
                    <div className="profile-avatar-wrap">
                        {avatarPreview && !avatarError ? (
                            <img
                                src={avatarPreview}
                                alt={displayName}
                                className="profile-avatar"
                                onError={() => setAvatarError(true)}
                            />
                        ) : (
                            <div className="profile-avatar profile-avatar-fallback">
                                <i className="bi bi-person-fill"></i>
                            </div>
                        )}
                        <button
                            type="button"
                            className="avatar-edit-btn"
                            onClick={handleAvatarClick}
                            title={t("profile.change_image")}
                        >
                            <i className="bi bi-camera-fill"></i>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div className="profile-identity">
                        <h4 className="profile-name">{displayName}</h4>
                        {roleLabel && (
                            <span className="profile-role-badge">{roleLabel}</span>
                        )}
                    </div>
                    <ul className="profile-meta-list">
                        <li>
                            <span className="meta-icon">
                                <i className="bi bi-person-badge"></i>
                            </span>
                            <span className="meta-text">
                                <small>{t("profile.employee_id")}</small>
                                <strong>{user?.emp_id || "—"}</strong>
                            </span>
                        </li>
                        <li>
                            <span className="meta-icon">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <span className="meta-text">
                                <small>{t("profile.email")}</small>
                                <strong className="ellipsis">
                                    {user?.email || "—"}
                                </strong>
                            </span>
                        </li>
                        <li>
                            <span className="meta-icon">
                                <i className="bi bi-telephone"></i>
                            </span>
                            <span className="meta-text">
                                <small>{t("profile.phone")}</small>
                                <strong>{user?.phone || "—"}</strong>
                            </span>
                        </li>
                    </ul>
                    <nav className="profile-tab-nav">
                        <button
                            type="button"
                            className={activeTab === "info" ? "active" : ""}
                            onClick={() => setActiveTab("info")}
                        >
                            <i className="bi bi-person-lines-fill"></i>
                            <span>{t("profile.tab_info")}</span>
                        </button>
                        <button
                            type="button"
                            className={activeTab === "security" ? "active" : ""}
                            onClick={() => setActiveTab("security")}
                        >
                            <i className="bi bi-shield-lock"></i>
                            <span>{t("profile.tab_security")}</span>
                        </button>
                    </nav>
                </aside>
                {/* ==========================================
                    Content
                ========================================== */}
                <section className="profile-content">
                    {activeTab === "info" && (
                        <div className="profile-card profile-content-card">
                            <div className="profile-section-header">
                                <div>
                                    <h5>{t("profile.personal_info_title")}</h5>
                                    <p>{t("profile.personal_info_subtitle")}</p>
                                </div>
                                {!editingInfo ? (
                                    <button
                                        type="button"
                                        className="btn-outline-accent"
                                        onClick={() => setEditingInfo(true)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                        <span>{t("profile.edit")}</span>
                                    </button>
                                ) : (
                                    <div className="header-actions">
                                        <button
                                            type="button"
                                            className="btn-ghost"
                                            onClick={cancelInfoEdit}
                                        >
                                            {t("profile.cancel")}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleInfoSave}>
                                <div className="profile-form-grid">
                                    <div className="profile-field">
                                        <label>{t("profile.full_name")}</label>
                                        {editingInfo ? (
                                            <input
                                                type="text"
                                                className="field-input"
                                                value={infoForm.name}
                                                onChange={(e) =>
                                                    setInfoForm((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                placeholder={t("profile.full_name")}
                                            />
                                        ) : (
                                            <p className="field-value">
                                                {user?.name || "—"}
                                            </p>
                                        )}
                                    </div>
                                    <div className="profile-field">
                                        <label>{t("profile.employee_id")}</label>
                                        <p className="field-value readonly">
                                            {user?.emp_id || "—"}
                                            <i className="bi bi-lock-fill"></i>
                                        </p>
                                    </div>
                                    <div className="profile-field">
                                        <label>{t("profile.email")}</label>
                                        <p className="field-value readonly">
                                            {user?.email || "—"}
                                            <i className="bi bi-lock-fill"></i>
                                        </p>
                                    </div>
                                    <div className="profile-field">
                                        <label>{t("profile.phone")}</label>
                                        {editingInfo ? (
                                            <input
                                                type="tel"
                                                className="field-input"
                                                value={infoForm.phone}
                                                onChange={(e) =>
                                                    setInfoForm((prev) => ({
                                                        ...prev,
                                                        phone: e.target.value,
                                                    }))
                                                }
                                                placeholder={t("profile.phone_placeholder")}
                                            />
                                        ) : (
                                            <p className="field-value">
                                                {user?.phone || "—"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {editingInfo && (
                                    <div className="form-footer-actions">
                                        <button
                                            type="submit"
                                            className="btn-accent"
                                            disabled={savingInfo}
                                        >
                                            {savingInfo ? (
                                                <i className="bi bi-arrow-repeat spin"></i>
                                            ) : (
                                                <i className="bi bi-check2"></i>
                                            )}
                                            <span>{t("profile.save_changes")}</span>
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                    {activeTab === "security" && (
                        <>
                            {/* ==========================================
                                Change Password
                            ========================================== */}
                            <div className="profile-card profile-content-card">
                                <div className="profile-section-header">
                                    <div className="section-title-with-icon">
                                        <span className="section-icon-chip accent">
                                            <i className="bi bi-key-fill"></i>
                                        </span>
                                        <div>
                                            <h5>{t("profile.change_password_title")}</h5>
                                            <p>{t("profile.change_password_subtitle")}</p>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handlePasswordSubmit} noValidate>
                                    <div className="profile-form-grid single">
                                        {[
                                            {
                                                key: "current",
                                                label: t("profile.current_password"),
                                                placeholder: t(
                                                    "profile.current_password_placeholder"
                                                ),
                                            },
                                            {
                                                key: "next",
                                                label: t("profile.new_password"),
                                                placeholder: t(
                                                    "profile.new_password_placeholder"
                                                ),
                                            },
                                            {
                                                key: "confirm",
                                                label: t("profile.confirm_password"),
                                                placeholder: t(
                                                    "profile.confirm_password_placeholder"
                                                ),
                                            },
                                        ].map((field) => (
                                            <div className="profile-field" key={field.key}>
                                                <label>{field.label}</label>
                                                <div
                                                    className={`pw-input-wrap ${
                                                        passwordErrors[field.key]
                                                            ? "has-error"
                                                            : ""
                                                    }`}
                                                >
                                                    <i className="bi bi-lock"></i>
                                                    <input
                                                        type={
                                                            showPassword[field.key]
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={passwordForm[field.key]}
                                                        placeholder={field.placeholder}
                                                        onChange={(e) => {
                                                            setPasswordForm((prev) => ({
                                                                ...prev,
                                                                [field.key]: e.target.value,
                                                            }));
                                                            if (passwordErrors[field.key]) {
                                                                setPasswordErrors((prev) => ({
                                                                    ...prev,
                                                                    [field.key]: "",
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="pw-toggle"
                                                        onClick={() =>
                                                            setShowPassword((prev) => ({
                                                                ...prev,
                                                                [field.key]: !prev[field.key],
                                                            }))
                                                        }
                                                    >
                                                        <i
                                                            className={`bi ${
                                                                showPassword[field.key]
                                                                    ? "bi-eye-slash"
                                                                    : "bi-eye"
                                                            }`}
                                                        ></i>
                                                    </button>
                                                </div>
                                                {field.key === "next" && strength.percent > 0 && (
                                                    <div className="password-strength">
                                                        <div className="strength-bar">
                                                            <span
                                                                style={{
                                                                    width: `${strength.percent}%`,
                                                                    background:
                                                                        STRENGTH_COLORS[strength.score],
                                                                }}
                                                            ></span>
                                                        </div>
                                                        <small
                                                            style={{
                                                                color: STRENGTH_COLORS[strength.score],
                                                            }}
                                                        >
                                                            {strength.label}
                                                        </small>
                                                    </div>
                                                )}
                                                {passwordErrors[field.key] && (
                                                    <span className="field-error">
                                                        {passwordErrors[field.key]}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-footer-actions">
                                        <button
                                            type="submit"
                                            className="btn-accent"
                                            disabled={savingPassword}
                                        >
                                            {savingPassword ? (
                                                <i className="bi bi-arrow-repeat spin"></i>
                                            ) : (
                                                <i className="bi bi-shield-check"></i>
                                            )}
                                            <span>{t("profile.update_password")}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {/* ==========================================
                                Two-Factor Authentication
                            ========================================== */}
                            <div className="profile-card profile-content-card">
                                <div className="twofa-row">
                                    <span className="section-icon-chip success">
                                        <i className="bi bi-shield-lock-fill"></i>
                                    </span>
                                    <div className="twofa-info">
                                        <div className="twofa-title-row">
                                            <h5>{t("profile.two_fa_title")}</h5>
                                            <span
                                                className={`status-badge ${
                                                    twoFactorEnabled ? "on" : "off"
                                                }`}
                                            >
                                                {twoFactorEnabled
                                                    ? t("profile.enabled")
                                                    : t("profile.disabled")}
                                            </span>
                                        </div>
                                        <p>{t("profile.two_fa_description")}</p>
                                        {twoFactorEnabled && (
                                            <div className="form-note">
                                                <i className="bi bi-info-circle"></i>
                                                <span>{t("profile.two_fa_active_note")}</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={twoFactorEnabled}
                                            disabled={savingTwoFactor}
                                            onChange={handleTwoFactorToggle}
                                        />
                                        <span className="switch-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
export default Profile;

// src/components/ui/Button/SubmitButton.jsx
import { useTranslation } from "react-i18next";
import "./FormButtons.css";

function SubmitButton({
    label,
    loadingLabel,
    loading = false,
    disabled = false,
    icon = "bi-check2",
    className = "",
    ...rest
}) {
    const { t } = useTranslation();
    return (
        <button
            type="submit"
            className={`neo-form-btn neo-form-btn-submit ${className}`}
            disabled={loading || disabled}
            {...rest}
        >
            <i className={`bi ${loading ? "bi-arrow-repeat neo-form-btn-spin" : icon}`}></i>
            <span>{loading ? (loadingLabel || t("common.saving")) : (label || t("common.submit"))}</span>
        </button>
    );
}

export default SubmitButton;
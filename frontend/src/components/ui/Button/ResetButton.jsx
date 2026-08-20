// src/components/ui/Button/ResetButton.jsx
import { useTranslation } from "react-i18next";
import "./FormButtons.css";

function ResetButton({
    label,
    onClick,
    disabled = false,
    icon = "bi-arrow-counterclockwise",
    className = "",
    ...rest
}) {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            className={`neo-form-btn neo-form-btn-reset ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            <i className={`bi ${icon}`}></i>
            <span>{label || t("common.reset")}</span>
        </button>
    );
}

export default ResetButton;
// src/components/ui/Button/ResetButton.jsx
import "./FormButtons.css";

function ResetButton({
    label = "Reset",
    onClick,
    disabled = false,
    icon = "bi-arrow-counterclockwise",
    className = "",
    ...rest
}) {
    return (
        <button
            type="button"
            className={`neo-form-btn neo-form-btn-reset ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
        </button>
    );
}

export default ResetButton;
// src/components/ui/Button/SubmitButton.jsx
import "./FormButtons.css";

function SubmitButton({
    label = "Submit",
    loadingLabel = "Saving...",
    loading = false,
    disabled = false,
    icon = "bi-check2",
    className = "",
    ...rest
}) {
    return (
        <button
            type="submit"
            className={`neo-form-btn neo-form-btn-submit ${className}`}
            disabled={loading || disabled}
            {...rest}
        >
            <i className={`bi ${loading ? "bi-arrow-repeat neo-form-btn-spin" : icon}`}></i>
            <span>{loading ? loadingLabel : label}</span>
        </button>
    );
}

export default SubmitButton;
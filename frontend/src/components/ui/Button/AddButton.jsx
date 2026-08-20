import { useTranslation } from "react-i18next";

function AddButton({
    onClick,
    title,
    icon = "bi-plus-lg",
    size = "md",
    className = "",
    disabled = false,
}) {
    const { t } = useTranslation();
    const resolvedTitle = title || t("common.add");
    const sizeClass =
        size === "sm"
            ? "btn-sm"
            : size === "lg"
                ? "btn-lg"
                : "";
    return (
        <button
            type="button"
            className={`btn btn-primary ${sizeClass} ${className}`}
            onClick={onClick}
            title={resolvedTitle}
            aria-label={resolvedTitle}
            disabled={disabled}
        >
            <i className={`bi ${icon}`}></i>
        </button>
    );
}
export default AddButton;
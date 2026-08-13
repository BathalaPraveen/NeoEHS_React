function AddButton({
    onClick,
    title = "Add",
    icon = "bi-plus-lg",
    size = "md",
    className = "",
    disabled = false,
}) {
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
            title={title}
            aria-label={title}
            disabled={disabled}
        >
            <i className={`bi ${icon}`}></i>
        </button>
    );
}

export default AddButton;
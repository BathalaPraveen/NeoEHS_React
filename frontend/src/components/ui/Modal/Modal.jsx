// src/components/ui/Modal/Modal.jsx
import { useEffect } from "react";
import "./Modal.css";

function Modal({
    show,
    onClose,
    title,
    size = "md",
    children,
    footer,
    closeOnBackdrop = true
}) {
    useEffect(() => {
        if (!show) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.body.classList.add("neo-modal-open");
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove("neo-modal-open");
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div
            className="neo-modal-backdrop"
            onMouseDown={(event) => {
                if (closeOnBackdrop && event.target === event.currentTarget) {
                    onClose?.();
                }
            }}
        >
            <div
                className={`neo-modal neo-modal-${size}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="neo-modal-header">
                    <h5 className="neo-modal-title">{title}</h5>
                    <button
                        type="button"
                        className="neo-modal-close"
                        onClick={() => onClose?.()}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="neo-modal-body">{children}</div>
                {footer && <div className="neo-modal-footer">{footer}</div>}
            </div>
        </div>
    );
}

export default Modal;
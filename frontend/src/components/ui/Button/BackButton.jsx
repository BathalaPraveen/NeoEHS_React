import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BackButton({ to, label, onClick }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (to) {
            navigate(to);
            return;
        }
        navigate(-1);
    };

    return (
        <button
            type="button"
            className="neo-btn-back"
            onClick={handleClick}
        >
            <i className="bi bi-arrow-left"></i>
            {label || t("common.back")}
        </button>
    );
}

export default BackButton;
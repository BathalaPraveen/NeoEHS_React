import { useTranslation } from "react-i18next";
import logo from "../../assets/icons/logo.svg";
function LoginBrandPanel() {
    const { t } = useTranslation();
    return (
        <div className="login-brand-panel">
            <div className="brand-content">
                <div className="brand-logo">
                    <img
                        src={logo}
                        alt="NeoEHS"
                    />
                </div>
                <h1>
                    {t("login.building_title")}
                    <br />
                    <span>
                        {t("login.building_title_highlight")}
                    </span>
                    {" "}
                    {t("login.building_title_end")}
                </h1>
                <div className="brand-line"></div>
                <p className="brand-description">
                    {t("login.description")}
                </p>
                {/* Ensure Safety */}
                <div className="brand-feature">
                    <div className="feature-icon safety">
                        <i className="bi bi-shield-check"></i>
                    </div>
                    <div>
                        <h4>
                            {t("login.ensure_safety")}
                        </h4>
                        <p>
                            {t("login.ensure_safety_description")}
                        </p>
                    </div>
                </div>
                {/* Go Green */}
                <div className="brand-feature">
                    <div className="feature-icon green">
                        <i className="bi bi-leaf"></i>
                    </div>
                    <div>
                        <h4>
                            {t("login.go_green")}
                        </h4>
                        <p>
                            {t("login.go_green_description")}
                        </p>
                    </div>
                </div>
                {/* Productivity */}
                <div className="brand-feature">
                    <div className="feature-icon productivity">
                        <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div>
                        <h4>
                            {t("login.boost_productivity")}
                        </h4>
                        <p>
                            {t("login.boost_productivity_description")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="brand-overlay"></div>
        </div>
    );
}
export default LoginBrandPanel;

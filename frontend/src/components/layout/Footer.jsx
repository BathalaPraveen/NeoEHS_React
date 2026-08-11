import { useTranslation } from "react-i18next";

function Footer({ collapsed }) {
    const { t } = useTranslation();

    return (
        <footer className={`footer ${collapsed ? "collapsed" : ""}`}>
            <div className="footer-sidebar">
                {!collapsed && <span>{t("footer.copyright")}</span>}
            </div>

            <div className="footer-version">
                <span>{t("footer.version")}</span>
            </div>
        </footer>
    );
}

export default Footer;

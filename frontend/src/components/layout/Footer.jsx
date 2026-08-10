function Footer({ collapsed }) {

    return (
        <footer className={`footer ${collapsed ? "collapsed" : ""}`}>

            <div className="footer-sidebar">

                {!collapsed && (
                    <span>
                        © NeoEHS 2026
                    </span>
                )}

            </div>

            <div className="footer-version">

                <span>
                    Version 1.0.0
                </span>

            </div>

        </footer>
    );
}

export default Footer;
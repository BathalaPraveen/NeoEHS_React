function Footer({collapsed}){

    return(
        <div className={`footer ${collapsed?"collapsed":""}`}>
            <div className="d-flex justify-content-between h-100 align-items-center px-3">
                <span>
                    © NeoEHS 2026
                </span>
                <span>
                    Version 1.0.0
                </span>
            </div>
        </div>
    );
}
export default Footer;

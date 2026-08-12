import { useTranslation } from "react-i18next";

import logo from "../../assets/icons/logo.svg";

function AuthBrandPanel() {

    const { t } = useTranslation();

    return (
        <div className="auth-brand-panel">

            <div className="auth-brand-dots"></div>

            <div className="auth-brand-content">

                <div className="auth-brand-logo">
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

                    <br />

                    {t("login.building_title_end")}
                </h1>

                <p className="auth-brand-description">
                    {t("login.description")}
                </p>


                {/* Ensure Safety */}
                <div className="auth-brand-feature">

                    <div className="auth-feature-icon">
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
                <div className="auth-brand-feature">

                    <div className="auth-feature-icon">
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
                <div className="auth-brand-feature">

                    <div className="auth-feature-icon">
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


            {/* SCENE ILLUSTRATION */}
            <div className="auth-brand-scene">

                <svg
                    viewBox="0 0 600 150"
                    preserveAspectRatio="xMidYMax slice"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    {/* Clouds */}
                    <g fill="#ffffff" opacity="0.9">
                        <ellipse cx="120" cy="18" rx="28" ry="6" />
                        <ellipse cx="144" cy="15" rx="20" ry="5" />
                        <ellipse cx="96" cy="16" rx="16" ry="4" />

                        <ellipse cx="428" cy="24" rx="24" ry="5" />
                        <ellipse cx="450" cy="21" rx="16" ry="4" />
                    </g>

                    {/* Birds */}
                    <g
                        fill="none"
                        stroke="#8fb79a"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M338 30 q5 -4 10 0 q5 -4 10 0" />
                        <path d="M366 38 q4.5 -3.5 9 0 q4.5 -3.5 9 0" />
                    </g>

                    {/* Wind turbines */}
                    <g stroke="#c9e4d2" strokeWidth="2">
                        <line x1="88" y1="42" x2="88" y2="92" />
                        <line x1="468" y1="34" x2="468" y2="86" />
                    </g>

                    <g
                        fill="none"
                        stroke="#eaf6ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <g transform="translate(88 42)">
                            <line x1="0" y1="0" x2="0" y2="-13" />
                            <line
                                x1="0"
                                y1="0"
                                x2="11"
                                y2="5.5"
                            />
                            <line
                                x1="0"
                                y1="0"
                                x2="-10"
                                y2="7"
                            />
                        </g>

                        <g transform="translate(468 34)">
                            <line x1="0" y1="0" x2="0" y2="-13" />
                            <line
                                x1="0"
                                y1="0"
                                x2="11"
                                y2="5.5"
                            />
                            <line
                                x1="0"
                                y1="0"
                                x2="-10"
                                y2="7"
                            />
                        </g>
                    </g>

                    <circle cx="88" cy="42" r="2" fill="#eaf6ee" />
                    <circle cx="468" cy="34" r="2" fill="#eaf6ee" />

                    {/* Distant hill */}
                    <path
                        d="M0 90 Q150 65 300 82 T600 75 L600 150 L0 150 Z"
                        fill="#bfe3c9"
                    />

                    {/* City skyline */}
                    <g fill="#8fc7a1">
                        <rect x="205" y="65" width="26" height="35" />
                        <rect x="236" y="52" width="22" height="48" />
                        <rect x="263" y="72" width="30" height="28" />
                        <rect x="298" y="60" width="18" height="40" />
                        <rect x="321" y="75" width="24" height="25" />
                    </g>

                    <g fill="#e8f7ec" opacity="0.9">
                        <rect x="211" y="70" width="3.5" height="3.5" />
                        <rect x="220" y="70" width="3.5" height="3.5" />
                        <rect x="211" y="78" width="3.5" height="3.5" />
                        <rect x="220" y="78" width="3.5" height="3.5" />

                        <rect x="242" y="59" width="3.5" height="3.5" />
                        <rect x="251" y="59" width="3.5" height="3.5" />
                        <rect x="242" y="67" width="3.5" height="3.5" />
                        <rect x="251" y="67" width="3.5" height="3.5" />
                        <rect x="242" y="75" width="3.5" height="3.5" />
                        <rect x="251" y="75" width="3.5" height="3.5" />

                        <rect x="270" y="80" width="3.5" height="3.5" />
                        <rect x="280" y="80" width="3.5" height="3.5" />

                        <rect x="304" y="67" width="3.5" height="3.5" />
                        <rect x="304" y="75" width="3.5" height="3.5" />

                        <rect x="328" y="82" width="3.5" height="3.5" />
                        <rect x="337" y="82" width="3.5" height="3.5" />
                    </g>

                    {/* Chimney + smoke */}
                    <rect
                        x="248"
                        y="46"
                        width="5"
                        height="8"
                        fill="#6fae83"
                    />
                    <g fill="#dff2e5" opacity="0.85">
                        <circle cx="251" cy="42" r="2.2" />
                        <circle cx="256" cy="39" r="2.6" />
                        <circle cx="262" cy="36.5" r="2.2" />
                    </g>

                    {/* Front hill */}
                    <path
                        d="M0 103 Q120 83 260 98 Q380 110 600 93 L600 150 L0 150 Z"
                        fill="#4f9d63"
                    />

                    <path
                        d="M0 113 Q140 98 300 110 Q440 120 600 105 L600 150 L0 150 Z"
                        fill="#357a49"
                    />

                    {/* Pine trees */}
                    <g fill="#2f6b41">
                        <g transform="translate(46 95)">
                            <polygon points="0,-33 -18,-4 18,-4" />
                            <polygon points="0,-22 -15,3 15,3" />
                            <polygon points="0,-12 -11,9 11,9" />
                            <rect
                                x="-2.5"
                                y="9"
                                width="5"
                                height="6"
                                fill="#5a3d24"
                            />
                        </g>

                        <g transform="translate(94 106)">
                            <polygon points="0,-26 -14,-3 14,-3" />
                            <polygon points="0,-17 -11,4 11,4" />
                            <rect
                                x="-2"
                                y="4"
                                width="4"
                                height="5"
                                fill="#5a3d24"
                            />
                        </g>

                        <g transform="translate(144 113)">
                            <polygon points="0,-20 -11,-2 11,-2" />
                            <polygon points="0,-13 -8,4 8,4" />
                            <rect
                                x="-1.5"
                                y="4"
                                width="3"
                                height="4.5"
                                fill="#5a3d24"
                            />
                        </g>

                        <g transform="translate(538 111)">
                            <polygon points="0,-22 -12,-2 12,-2" />
                            <polygon points="0,-14 -9,4 9,4" />
                            <rect
                                x="-1.5"
                                y="4"
                                width="3"
                                height="4.5"
                                fill="#5a3d24"
                            />
                        </g>
                    </g>

                </svg>

            </div>

        </div>
    );
}

export default AuthBrandPanel;

import { useState } from "react";
import "../../assets/styles/header.css";

function Header({ collapsed, toggleSidebar }) {

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }

    };

    return (

        <header className={`app-header ${collapsed ? "collapsed" : ""}`}>

            <div className="header-left">

                <button
                    className="icon-btn"
                    onClick={toggleSidebar}
                >
                    <i className="bi bi-list"></i>
                </button>

                <div className="search-box">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

            </div>

            <div className="header-right">

                <button className="icon-btn">

                    <i className="bi bi-globe"></i>

                </button>

                <button className="icon-btn">

                    <i className="bi bi-moon"></i>

                </button>

                <button
                    className="icon-btn"
                    onClick={toggleFullscreen}
                >

                    <i className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`}></i>

                </button>

                <button className="icon-btn notification">

                    <i className="bi bi-bell"></i>

                    <span>5</span>

                </button>

                <div className="dropdown">

                    <button
                        className="profile-btn dropdown-toggle"
                        data-bs-toggle="dropdown"
                    >

                        <img
                            src="https://i.pravatar.cc/40"
                            alt="profile"
                        />

                        <div>

                            <h6>Praveen</h6>

                            <small>Administrator</small>

                        </div>

                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>

                            <a className="dropdown-item" href="#">

                                My Profile

                            </a>

                        </li>

                        <li>

                            <a className="dropdown-item" href="#">

                                Settings

                            </a>

                        </li>

                        <li><hr /></li>

                        <li>

                            <a className="dropdown-item text-danger" href="#">

                                Logout

                            </a>

                        </li>

                    </ul>

                </div>

            </div>

        </header>

    );

}

export default Header;
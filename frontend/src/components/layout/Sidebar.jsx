import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
function Sidebar({ collapsed }) {
    const [menus, setMenus] = useState([]);
    const [openMenus, setOpenMenus] = useState({});
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [popupTop, setPopupTop] = useState(0);
    const location = useLocation();
    const popupRef = useRef(null);
    /* ============================
       FETCH MENU
    ============================ */
    useEffect(() => {
        fetchMenus();
    }, []);
    const fetchMenus = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/menu"
            );
            if (response.data.success) {
                setMenus(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load menu:", error);
        }
    };
    /* ============================
       BUILD MENU TREE
    ============================ */
    const buildTree = (items, parentId = 0) => {
        return items
            .filter(
                item =>
                    Number(item.parent_id) === Number(parentId)
            )
            .sort(
                (a, b) =>
                    Number(a.sort_order) -
                    Number(b.sort_order)
            )
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    };
    const menuTree = buildTree(menus);
    /* ============================
       NORMALIZE URL
    ============================ */
    const normalizePath = (path) => {
        if (!path || path === "#") {
            return "";
        }
        let cleanPath = path;
        // Remove old Laravel application path if it exists
        cleanPath = cleanPath.replace(
            /^.*NeoEHS_Laravel_Complete_Pack\/public\//i,
            ""
        );
        // Remove leading slash
        cleanPath = cleanPath.replace(/^\/+/, "");
        // Remove trailing slash
        cleanPath = cleanPath.replace(/\/+$/, "");
        return cleanPath.toLowerCase();
    };
    /* ============================
       CHECK CURRENT URL
    ============================ */
    const isActive = (link) => {
        const currentPath = location.pathname
            .replace(/^\/+/, "")
            .replace(/\/+$/, "")
            .toLowerCase();
        const menuPath = normalizePath(link);
        if (!menuPath) {
            return false;
        }
        return (
            currentPath === menuPath ||
            currentPath.startsWith(menuPath + "/")
        );
    };
    /* ============================
       CHECK CHILD ACTIVE
    ============================ */
    const hasActiveChild = (item) => {
        if (!item.children?.length) {
            return false;
        }
        return item.children.some(child => {
            return (
                isActive(child.link) ||
                hasActiveChild(child)
            );
        });
    };
    /* ============================
       MENU ACTIVE
    ============================ */
    const isMenuActive = (item) => {
        return (
            isActive(item.link) ||
            hasActiveChild(item)
        );
    };
    /* ============================
       AUTO OPEN ACTIVE PARENTS
    ============================ */
    useEffect(() => {
        if (!menuTree.length) {
            return;
        }
        const activeParents = {};
        const findActiveParents = (items) => {
            items.forEach(item => {
                if (item.children?.length) {
                    if (hasActiveChild(item)) {
                        activeParents[item.id] = true;
                    }
                    findActiveParents(item.children);
                }
            });
        };
        findActiveParents(menuTree);
        setOpenMenus(prev => ({
            ...prev,
            ...activeParents
        }));
    }, [location.pathname, menus]);
    /* ============================
       TOGGLE MENU
    ============================ */
    const toggleMenu = (id) => {
        setOpenMenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    /* ============================
       COLLAPSED HOVER POPUP
    ============================ */
    const handleMouseEnter = (event, item) => {
    if (!collapsed) {
        return;
    }
    if (!item.children?.length) {
        setHoveredMenu(null);
        return;
    }
    const rect =
        event.currentTarget.getBoundingClientRect();
    // Initially place popup at the menu item's position
    setPopupTop(rect.top);
    setHoveredMenu(item.id);
};
useEffect(() => {
    if (!collapsed || !hoveredMenu) {
        return;
    }
    if (!popupRef.current) {
        return;
    }
    const popup =
        popupRef.current.getBoundingClientRect();
    const headerHeight = 65;
    const footerHeight = 40;
    const screenBottom =
        window.innerHeight - footerHeight;
    let newTop = popup.top;
    // Popup is going below the footer
    if (popup.bottom > screenBottom) {
        newTop =
            popup.top -
            (popup.bottom - screenBottom);
    }
    // Popup is going above the header
    if (newTop < headerHeight) {
        newTop = headerHeight;
    }
    setPopupTop(newTop);
}, [
    collapsed,
    hoveredMenu,
    menus,
    openMenus
]);
    const handleMouseLeaveSidebar = () => {
        if (collapsed) {
            setHoveredMenu(null);
        }
    };
    const renderPopupItems = (items) => {
    return items.map(item => {
        const hasChildren = item.children?.length > 0;
        const active = isMenuActive(item);
        return (
            <li
                key={item.id}
                className={`
                    popup-menu-item
                    ${active ? "popup-active" : ""}
                `}
            >
                {hasChildren ? (
                    <div
                        className="sidebar-popup-parent"
                        onClick={() => toggleMenu(item.id)}
                    >
                        <div className="sidebar-popup-link">
                            <i className={item.icon}></i>
                            <span>
                                {item.name}
                            </span>
                            <i
                                className={`fas ${
                                    openMenus[item.id]
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                } popup-arrow`}
                            ></i>
                        </div>
                        {/* NORMAL SUBMENU INSIDE SAME POPUP */}
                        {openMenus[item.id] && (
                            <ul className="popup-normal-submenu">
                                {renderPopupItems(
                                    item.children
                                )}
                            </ul>
                        )}
                    </div>
                ) : (
                    <Link
                        to={`/${normalizePath(item.link)}`}
                        className="sidebar-popup-link"
                        onClick={() => {
                            setHoveredMenu(null);
                        }}
                    >
                        <i className={item.icon}></i>
                        <span>
                            {item.name}
                        </span>
                    </Link>
                )}
            </li>
        );
    });
};
    /* ============================
       RENDER POPUP
    ============================ */
    const renderPopup = () => {
    if (!collapsed || !hoveredMenu) {
        return null;
    }
    const parent = menuTree.find(
        item =>
            Number(item.id) === Number(hoveredMenu)
    );
    if (!parent || !parent.children?.length) {
        return null;
    }
    return (
        <div
            ref={popupRef}
            className="sidebar-popup"
            style={{
                top: `${popupTop}px`
            }}
            onMouseEnter={() => {
                setHoveredMenu(parent.id);
            }}
            onMouseLeave={() => {
                setHoveredMenu(null);
            }}
        >
            {/* MAIN MODULE TITLE */}
            <div className="sidebar-popup-title">
                <i className={parent.icon}></i>
                <span>
                    {parent.name}
                </span>
            </div>
            {/* ALL CHILDREN RECURSIVELY */}
            <ul className="sidebar-popup-menu">
                {renderPopupItems(parent.children)}
            </ul>
        </div>
    );
};
    /* ============================
       RENDER MENU
    ============================ */
    const renderMenu = (items) => {
        return items.map(item => {
            const hasChildren =
                item.children?.length > 0;
            const active =
                isMenuActive(item);
            return (
                <li
                    key={item.id}
                    className={`
                        sidebar-item
                        ${active ? "active" : ""}
                        ${
                            hasChildren &&
                            openMenus[item.id]
                                ? "open"
                                : ""
                        }
                    `}
                    onMouseEnter={(event) =>
                        handleMouseEnter(event, item)
                    }
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            className="sidebar-link"
                            onClick={() =>
                                toggleMenu(item.id)
                            }
                        >
                            <i
                                className={item.icon}
                            ></i>
                            {!collapsed && (
                                <>
                                    <span>
                                        {item.name}
                                    </span>
                                    <i
                                        className={`
                                            fas
                                            ${
                                                openMenus[
                                                    item.id
                                                ]
                                                    ? "fa-chevron-up"
                                                    : "fa-chevron-down"
                                            }
                                            submenu-arrow
                                        `}
                                    ></i>
                                </>
                            )}
                        </button>
                    ) : (
                        <Link
                            to={`/${normalizePath(
                                item.link
                            )}`}
                            className="sidebar-link"
                        >
                            <i
                                className={item.icon}
                            ></i>
                            {!collapsed && (
                                <span>
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    )}
                    {hasChildren &&
                        !collapsed &&
                        openMenus[item.id] && (
                            <ul className="submenu">
                                {renderMenu(
                                    item.children
                                )}
                            </ul>
                        )}
                </li>
            );
        });
    };
    /* ============================
       RETURN
    ============================ */
    return (
        <>
            <aside
                className={`
                    sidebar
                    ${
                        collapsed
                            ? "collapsed"
                            : ""
                    }
                `}
                onMouseLeave={
                    handleMouseLeaveSidebar
                }
            >
                <div className="sidebar-menu">
                    <ul className="menu-list">
                        {renderMenu(menuTree)}
                    </ul>
                </div>
            </aside>
            {renderPopup()}
        </>
    );
}
export default Sidebar;
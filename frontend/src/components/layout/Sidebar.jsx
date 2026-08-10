import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar({ collapsed }) {

    const [menus, setMenus] = useState([]);
    const [openMenus, setOpenMenus] = useState({});

    const location = useLocation();

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

    const buildTree = (items, parentId = 0) => {

        return items
            .filter(item => Number(item.parent_id) === Number(parentId))
            .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));

    };

    const menuTree = buildTree(menus);

    const toggleMenu = (id) => {

        setOpenMenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

    };

    const isActive = (link) => {

        if (!link || link === "#") {
            return false;
        }

        return location.pathname
            .replace(/^\/+/, "")
            .startsWith(link.replace(/^\/+/, ""));

    };

    const renderMenu = (items) => {

        return items.map(item => {

            const hasChildren = item.children?.length > 0;
            const active = isActive(item.link);

            return (
                <li
                    key={item.id}
                    className={`
                        sidebar-item
                        ${active ? "active" : ""}
                        ${hasChildren && openMenus[item.id] ? "open" : ""}
                    `}
                >

                    {hasChildren ? (

                        <button
                            type="button"
                            className="sidebar-link"
                            onClick={() => toggleMenu(item.id)}
                        >

                            <i className={item.icon}></i>

                            {!collapsed && (
                                <>
                                    <span>{item.name}</span>

                                    <i
                                        className={`bi ${
                                            openMenus[item.id]
                                                ? "bi-chevron-up"
                                                : "bi-chevron-down"
                                        } submenu-arrow`}
                                    ></i>
                                </>
                            )}

                        </button>

                    ) : (

                        <Link
                            to={`/${item.link}`}
                            className="sidebar-link"
                        >

                            <i className={item.icon}></i>

                            {!collapsed && (
                                <span>{item.name}</span>
                            )}

                        </Link>

                    )}

                    {hasChildren &&
                        !collapsed &&
                        openMenus[item.id] && (

                            <ul className="submenu">
                                {renderMenu(item.children)}
                            </ul>

                        )}

                </li>
            );

        });

    };

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-menu">

                <ul className="menu-list">

                    {renderMenu(menuTree)}

                </ul>

            </div>

        </aside>

    );

}

export default Sidebar;
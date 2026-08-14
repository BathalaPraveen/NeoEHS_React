import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { MenuProvider } from "../context/MenuContext";
function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <MenuProvider>
            <div className="layout">
                <Header
                    collapsed={collapsed}
                    toggleSidebar={() =>
                        setCollapsed(!collapsed)
                    }
                />
                <Sidebar
                    collapsed={collapsed}
                />
                <div
                    className={`content ${
                        collapsed ? "expanded" : ""
                    }`}
                >
                    <div className="page-content">
                        <Outlet />
                    </div>
                </div>
                <Footer
                    collapsed={collapsed}
                />
            </div>
        </MenuProvider>
    );
}
export default AdminLayout;
import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className="layout">
            <Header collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)}/>
            <Sidebar collapsed={collapsed} />
            <div className={`content ${collapsed ? "expanded" : ""}`}>
                <div className="page-content">
                    {children}
                </div>
            </div>
            <Footer collapsed={collapsed} />
        </div>
    );
}
export default AdminLayout;
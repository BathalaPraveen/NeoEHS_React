import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route
                    path="/"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
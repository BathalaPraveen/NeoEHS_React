import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Application */}
                <Route
                    path="/"
                    element={<AdminLayout />}
                >

                    {/* / */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* /dashboard */}
                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;
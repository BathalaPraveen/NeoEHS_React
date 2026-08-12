import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/auth/Login";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";


function AppRoutes() {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return Boolean(
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")
        );
    });


    useEffect(() => {

        const handleAuthChange = () => {

            const authenticated = Boolean(
                localStorage.getItem("authToken") ||
                sessionStorage.getItem("authToken")
            );

            setIsAuthenticated(authenticated);

        };


        window.addEventListener(
            "authChange",
            handleAuthChange
        );


        return () => {

            window.removeEventListener(
                "authChange",
                handleAuthChange
            );

        };

    }, []);


    return (

        <BrowserRouter>

            <Routes>

                {/* ================================
                    LOGIN
                ================================= */}

                <Route
                    path="/login"
                    element={
                        isAuthenticated
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <LoginPage />
                            )
                    }
                />


                {/* ================================
                    FORGOT PASSWORD
                ================================= */}

                <Route
                    path="/forgot-password"
                    element={
                        <ForgotPasswordPage />
                    }
                />


                {/* ================================
                    PROTECTED APPLICATION
                ================================= */}

                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? (
                                <AdminLayout />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                </Route>


                {/* ================================
                    UNKNOWN URL
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                isAuthenticated
                                    ? "/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
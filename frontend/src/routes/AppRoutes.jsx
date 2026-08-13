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
import CompanyList from "../pages/administration/company/CompanyList";


function AppRoutes() {

    // ==========================================
    // Authentication Check
    // ==========================================

    const checkAuth = () => {

        return Boolean(
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")
        );

    };


    // ==========================================
    // Authentication State
    // ==========================================

    const [
        isAuthenticated,
        setIsAuthenticated
    ] = useState(() => checkAuth());


    // ==========================================
    // Listen For Login / Logout
    // ==========================================

    useEffect(() => {

        const handleAuthChange = () => {

            setIsAuthenticated(
                checkAuth()
            );

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

                {/* =================================
                    LOGIN
                ================================== */}

                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        ) : (
                            <LoginPage />
                        )
                    }
                />


                {/* =================================
                    FORGOT PASSWORD
                ================================== */}

                <Route
                    path="/forgot-password"
                    element={
                        <ForgotPasswordPage />
                    }
                />


                {/* =================================
                    PROTECTED APPLICATION
                ================================== */}

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <AdminLayout />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                >

                    {/* Dashboard */}

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />


                    {/* Company Master */}

                    <Route
                        path="company/list"
                        element={<CompanyList />}
                    />

                </Route>


                {/* =================================
                    UNKNOWN URL
                ================================== */}

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
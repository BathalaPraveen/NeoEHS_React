const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authModel = require("../../models/auth/authModel");

const login = async (req, res) => {

    try {

        const { login, password } = req.body;

        // ==============================
        // Validation
        // ==============================

        if (!login || !password) {

            return res.status(422).json({
                success: false,
                message: "Username/email and password are required"
            });

        }

        // ==============================
        // Find User
        // ==============================

        const user = await authModel.findUserByLogin(login);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });

        }

        // ==============================
        // Check Password
        // ==============================

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {

            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });

        }

        // ==============================
        // Create JWT
        // ==============================

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
                user_type: user.user_type
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        // ==============================
        // Response
        // ==============================

        return res.json({

            success: true,

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                role: user.role,
                user_type: user.user_type,
                emp_id: user.emp_id,
                company_id: user.company_id,
                location_id: user.location_id,
                unit_id: user.unit_id,
                department_id: user.department_id,
                designation_id: user.designation_id,
                profile_image: user.profile_image,
                language: user.language,
                theme: user.theme,
                first_login: user.first_login,
                is_twoFactor: user.is_twoFactor,
                two_factor_type: user.two_factor_type
            }

        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login"
        });

    }
};

module.exports = {
    login
};
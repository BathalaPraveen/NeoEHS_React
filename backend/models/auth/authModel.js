const db = require("../../config/db");

const findUserByLogin = async (login) => {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            name,
            first_name,
            last_name,
            email,
            username,
            password,
            role,
            user_type,
            emp_id,
            company_id,
            location_id,
            unit_id,
            department_id,
            designation_id,
            profile_image,
            language,
            theme,
            first_login,
            is_twoFactor,
            two_factor_type,
            status,
            trash
        FROM users
        WHERE
            (email = ? OR username = ?)
            AND status = 1
            AND trash = 'NO'
        LIMIT 1
        `,
        [login, login]
    );

    return rows[0] || null;
};

module.exports = {
    findUserByLogin
};
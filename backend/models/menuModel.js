const db = require("../config/db");

const getMenus = async () => {
    const [rows] = await db.query(`
        SELECT *
        FROM template_left_menu
        WHERE status = 1
        ORDER BY sort_order ASC
    `);

    return rows;
};

module.exports = {
    getMenus
};
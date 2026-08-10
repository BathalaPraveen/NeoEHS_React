const db = require("../../config/db");
const {
    MENU_TABLE,
    MENU_STATUS,
    MENU_SORT_ORDER
} = require("../../constants/adminConstants");
const getMenus = async () => {

    const query = `
        SELECT
            id,
            parent_id,
            name,
            link,
            icon,
            sort_order,
            is_parent,
            status
        FROM ${MENU_TABLE}
        WHERE status = ?
        ORDER BY ${MENU_SORT_ORDER} ASC
    `;

    const [rows] = await db.query(query, [
        MENU_STATUS.ACTIVE
    ]);

    return rows;
};
module.exports = {
    getMenus
};
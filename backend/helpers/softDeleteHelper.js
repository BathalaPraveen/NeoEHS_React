// backend/helpers/softDeleteHelper.js
const db = require("../config/db");

const softDeleteRecord = async (table, id) => {
    const [result] = await db.query(
        `UPDATE ${table} SET status = 0, trash = 'YES' WHERE id = ? AND trash = 'NO'`,
        [id]
    );
    return result.affectedRows > 0;
};

module.exports = { softDeleteRecord };

// backend/helpers/softDeleteHelper.js
const db = require("../config/db");

/**
 * Generic reusable soft-delete: marks a record inactive + trashed
 * instead of physically removing it. `table` always comes from
 * trusted code (a constant), never user input, so interpolating it
 * into the query is safe here — the same pattern as uniqueChecker.js.
 */
const softDeleteRecord = async (table, id) => {
    const [result] = await db.query(
        `UPDATE ${table} SET status = 0, trash = 'YES' WHERE id = ? AND trash = 'NO'`,
        [id]
    );
    return result.affectedRows > 0;
};

module.exports = { softDeleteRecord };

// backend/helpers/uniqueChecker.js
const db = require("../config/db");

/**
 * Generic reusable "is this value already used" checker.
 * `table` and `column` always come from trusted code (never from
 * user input), so string-building them into the query is safe here.
 */
const isValueTaken = async (table, column, value, excludeId = null) => {
    const query = excludeId
        ? `SELECT id FROM ${table} WHERE ${column} = ? AND id != ? AND trash = 'NO'`
        : `SELECT id FROM ${table} WHERE ${column} = ? AND trash = 'NO'`;
    const params = excludeId ? [value, excludeId] : [value];

    const [rows] = await db.query(query, params);
    return rows.length > 0;
};

module.exports = { isValueTaken };
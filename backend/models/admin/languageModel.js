const db = require("../../config/db");
const {
    LANG
} = require("../../constants/adminConstants");

const getLanguages = async () => {

    const query = `
        SELECT
            id,
            short_name,
            long_name,
            direction,
            english,
            native,
            icon,
            sort_order
        FROM ${LANG}
        WHERE status = 1
          AND trash = 'NO'
        ORDER BY sort_order ASC
    `;

    const [rows] = await db.query(query);

    return rows;
};

module.exports = {
    getLanguages
};
const db = require("../../../config/db");

const {
    COMPANY_MAS
} = require("../../../constants/adminConstants");


const getCompanies = async () => {

    const [rows] = await db.query(`
        SELECT
            id,
            company_id,
            company_name,
            short_name,
            status,
            created_at
        FROM ${COMPANY_MAS}
        WHERE trash = 'NO'
        ORDER BY id DESC
    `);

    return rows;
};


module.exports = {
    getCompanies
};
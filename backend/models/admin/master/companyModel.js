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

const getCompanyById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            id,
            company_id,
            company_name,
            short_name,
            status,
            created_at
        FROM ${COMPANY_MAS}
        WHERE id = ?
          AND trash = 'NO'
    `, [id]);

    return rows[0] || null;
};


module.exports = {
    getCompanies,    
    getCompanyById


};
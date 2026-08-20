// backend/models/admin/master/companyModel.js
const db = require("../../../config/db");
const { isValueTaken } = require("../../../helpers/uniqueChecker");
const { softDeleteRecord } = require("../../../helpers/softDeleteHelper");

const {
    COMPANY_MAS
} = require("../../../constants/adminConstants");

const UNIQUE_FIELD_MAP = {
    company_name: "company_name",
    short_name: "short_name"
};

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
    const [rows] = await db.query(
        `SELECT id, company_id, company_name, short_name, status, created_at
           FROM ${COMPANY_MAS}
          WHERE id = ? AND trash = 'NO'`,
        [id]
    );
    return rows[0] || null;
};

const isFieldTaken = async (field, value, excludeId = null) => {
    const column = UNIQUE_FIELD_MAP[field];
    if (!column) {
        throw new Error(`Unique check not supported for field "${field}"`);
    }
    return isValueTaken(COMPANY_MAS, column, value, excludeId);
};

const createCompany = async ({ company_id, company_name, short_name }) => {
    const [result] = await db.query(
        `INSERT INTO ${COMPANY_MAS}
            (company_id, company_name, short_name, status, trash, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [company_id, company_name, short_name, 1, "NO"]
    );

    return {
        id: result.insertId,
        company_id,
        company_name,
        short_name
    };
};

const updateCompany = async (id, { company_name, short_name }) => {
    await db.query(
        `UPDATE ${COMPANY_MAS}
            SET company_name = ?, short_name = ?
          WHERE id = ? AND trash = 'NO'`,
        [company_name, short_name, id]
    );

    return getCompanyById(id);
};

const deleteCompany = async (id) => {
    return softDeleteRecord(COMPANY_MAS, id);
};

module.exports = {
    getCompanies,
    getCompanyById,
    isFieldTaken,
    createCompany,
    updateCompany,
    deleteCompany
};
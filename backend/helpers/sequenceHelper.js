const db = require("../config/db");
const { COMPANY_MAS } = require("../constants/adminConstants");

const SEQUENCE_CONFIG = {
    company: { table: COMPANY_MAS, prefix: "CMP" }
    // department: { table: DEPARTMENT_MAS, prefix: "DEP" },  <-- add future modules here
};

const pad = (num, size = 5) => String(num).padStart(size, "0");

const getSequence = async (type) => {
    const config = SEQUENCE_CONFIG[type];
    if (!config) {
        throw new Error(`No sequence configuration found for type "${type}"`);
    }
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM ${config.table}`
    );
    const nextNumber = rows[0].total + 1;
    return `${config.prefix}-${pad(nextNumber)}`;
};

module.exports = { getSequence };
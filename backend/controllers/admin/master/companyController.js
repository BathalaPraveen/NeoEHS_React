// backend/controllers/admin/master/companyController.js
const companyModel = require("../../../models/admin/master/companyModel");
const { getSequence } = require("../../../helpers/sequenceHelper");


const getCompanies = async (req, res) => {
    try {
        const companies = await companyModel.getCompanies();
        res.json({ success: true, data: companies });
    } catch (error) {
        console.error("Get companies error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch companies" });
    }
};


const getNextCompanyId = async (req, res) => {
    try {
        const company_id = await getSequence("company");
        res.json({ success: true, data: { company_id } });
    } catch (error) {
        console.error("Get next company id error:", error);
        res.status(500).json({ success: false, message: "Failed to generate company id" });
    }
};


// GET /api/admin/companies/check-unique?field=company_name&value=Acme&excludeId=5
const checkUnique = async (req, res) => {
    try {
        const { field, value, excludeId } = req.query;

        if (!field || !["company_name", "short_name"].includes(field)) {
            return res.status(400).json({ success: false, message: "Invalid field for uniqueness check" });
        }
        if (!value || !String(value).trim()) {
            return res.json({ success: true, data: { isUnique: true } });
        }

        const taken = await companyModel.isFieldTaken(field, String(value).trim(), excludeId || null);
        res.json({ success: true, data: { isUnique: !taken } });
    } catch (error) {
        console.error("Check unique error:", error);
        res.status(500).json({ success: false, message: "Failed to check uniqueness" });
    }
};


const validateCompanyFields = async ({ company_name, short_name, excludeId = null }) => {
    const errors = {};

    if (!company_name) errors.company_name = "Company name is required";
    if (!short_name) errors.short_name = "Short name is required";

    if (company_name && await companyModel.isFieldTaken("company_name", company_name, excludeId)) {
        errors.company_name = "Company name already exists";
    }
    if (short_name && await companyModel.isFieldTaken("short_name", short_name, excludeId)) {
        errors.short_name = "Short name already exists";
    }

    return errors;
};


const createCompany = async (req, res) => {
    try {
        const { company_name, short_name } = req.body;

        const errors = await validateCompanyFields({ company_name, short_name });
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ success: false, message: "Validation failed", errors });
        }

        const company_id = await getSequence("company");
        const company = await companyModel.createCompany({ company_id, company_name, short_name });

        res.status(201).json({ success: true, message: "Company added successfully", data: company });
    } catch (error) {
        console.error("Create company error:", error);
        res.status(500).json({ success: false, message: "Failed to add company" });
    }
};


const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, short_name } = req.body;

        const existing = await companyModel.getCompanyById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        const errors = await validateCompanyFields({ company_name, short_name, excludeId: id });
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ success: false, message: "Validation failed", errors });
        }

        const company = await companyModel.updateCompany(id, { company_name, short_name });
        res.json({ success: true, message: "Company updated successfully", data: company });
    } catch (error) {
        console.error("Update company error:", error);
        res.status(500).json({ success: false, message: "Failed to update company" });
    }
};


const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await companyModel.getCompanyById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        await companyModel.deleteCompany(id);
        res.json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        console.error("Delete company error:", error);
        res.status(500).json({ success: false, message: "Failed to delete company" });
    }
};


module.exports = {
    getCompanies,
    getNextCompanyId,
    checkUnique,
    createCompany,
    updateCompany,
    deleteCompany
};
const companyModel = require("../../../models/admin/master/companyModel");


const getCompanies = async (req, res) => {

    try {

        const companies =
            await companyModel.getCompanies();

        res.json({

            success: true,

            data: companies

        });

    } catch (error) {

        console.error(  
            "Get companies error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to fetch companies"

        });

    }

};

const getCompanyById = async (req, res) => {

    try {

        const { id } = req.params;

        const company =
            await companyModel.getCompanyById(id);

        if (!company) {

            return res.status(404).json({

                success: false,

                message: "Company not found"

            });

        }

        res.json({

            success: true,

            data: company

        });

    } catch (error) {

        console.error(
            "Get company by id error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to fetch company"

        });

    }

};

module.exports = {
    getCompanies,
    getCompanyById
};
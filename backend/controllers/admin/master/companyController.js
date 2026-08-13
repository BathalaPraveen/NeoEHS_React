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


module.exports = {
    getCompanies
};
const menuModel = require("../../models/admin/menuModel");
const languageModel = require("../../models/admin/languageModel");
const getLanguages = async (req, res) => {

    try {

        const languages = await languageModel.getLanguages();

        return res.status(200).json({
            success: true,
            data: languages
        });

    } catch (error) {

        console.error("Get languages error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch languages"
        });

    }
};
const getMenus = async (req, res) => {
    try {

        const menus = await menuModel.getMenus();

        res.status(200).json({
            success: true,
            data: menus
        });

    } catch (error) {

        console.error("Menu API Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch menu",
            error: error.message
        });

    }
};
module.exports = {
    getLanguages,
    getMenus
};
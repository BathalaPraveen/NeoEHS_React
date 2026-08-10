const menuModel = require("../models/menuModel");

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
    getMenus
};
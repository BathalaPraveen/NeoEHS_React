const express = require("express");
const adminController = require("../../controllers/admin/adminController");
const authController = require("../../controllers/auth/authController");
const companyController = require("../../controllers/admin/master/companyController");
const router = express.Router();
router.get(
    "/languages",
    adminController.getLanguages
);
router.get(
    "/menus",
    adminController.getMenus
);
router.post(
    "/login",
    authController.login
);
router.get(
    "/companies",
    companyController.getCompanies
);
module.exports = router;
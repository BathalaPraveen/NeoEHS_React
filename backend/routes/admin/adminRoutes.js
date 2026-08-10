const express = require("express");
const adminController = require("../../controllers/admin/adminController");
const router = express.Router();
router.get(
    "/languages",
    adminController.getLanguages
);
router.get(
    "/menus",
    adminController.getMenus
);
module.exports = router;
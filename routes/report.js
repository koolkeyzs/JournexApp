const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report-controller");
const { isLoggedIn} = require("../middleware");

router.post(
    "/entries/:id/report",
    isLoggedIn,
    reportController.createReport
);


module.exports = router;
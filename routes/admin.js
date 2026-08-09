const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const { isLoggedIn, isAdmin } = require("../middleware");
const catchAsync = require ('../utils/CatchAsync')

router.get('/dashboard' , isLoggedIn, isAdmin , (adminController.dashBoard))
router.get(
    "/reports",
    isLoggedIn,
    isAdmin,
    adminController.getReports
);



router.patch(
    "/reports/:id/review",
    isLoggedIn,
    isAdmin,
    adminController.markReviewed
);


router.patch(
    "/reports/:id/resolve",
    isLoggedIn,
    isAdmin,
    adminController.resolveReport
);

router.get(
    "/entries",
    isLoggedIn,
    isAdmin,
    catchAsync(adminController.getEntries)
);


router.get(
    "/comments",
    isLoggedIn,
    isAdmin,
    catchAsync(adminController.getComments)
);

router.get("/users", isLoggedIn, isAdmin, catchAsync(adminController.getUsers));

module.exports = router;
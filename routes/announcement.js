const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announce-contoller");
const { isLoggedIn, isAdmin } = require("../middleware");
const catchAsync = require("../utils/CatchAsync");

router.get(
  "/",
  isLoggedIn,
  isAdmin,
  catchAsync(announcementController.getAllAnnouncements)
);

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  announcementController.createAnnouncement
);

router.get(
  "/active",
  announcementController.getActiveAnnouncement
);

router.delete(
  "/:announcementId",
  isLoggedIn,
  isAdmin,
  catchAsync(announcementController.deleteAnnouncement)
);

module.exports = router;

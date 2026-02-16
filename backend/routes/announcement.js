const express = require("express");
const announcementController = require("../controllers/announcementController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get announcements - all authenticated users
router.get("/", auth, announcementController.getAnnouncements);
router.get(
  "/:announcementId",
  auth,
  announcementController.getAnnouncementById,
);

// Create announcement - teacher and admin
router.post(
  "/",
  auth,
  authorize("teacher", "admin"),
  announcementController.createAnnouncement,
);

// Update announcement - creator or admin
router.put("/:announcementId", auth, announcementController.updateAnnouncement);

// Delete announcement - creator or admin
router.delete(
  "/:announcementId",
  auth,
  announcementController.deleteAnnouncement,
);

module.exports = router;

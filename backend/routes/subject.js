const express = require("express");
const subjectController = require("../controllers/subjectController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get all subjects - accessible to all authenticated users
router.get("/", auth, subjectController.getAllSubjects);
router.get("/:subjectId", auth, subjectController.getSubjectById);

// Admin only routes
router.post("/", auth, authorize("admin"), subjectController.createSubject);
router.put(
  "/:subjectId",
  auth,
  authorize("admin"),
  subjectController.updateSubject,
);
router.post(
  "/assign-teacher",
  auth,
  authorize("admin"),
  subjectController.assignTeacher,
);

module.exports = router;

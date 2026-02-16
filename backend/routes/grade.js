const express = require("express");
const gradeController = require("../controllers/gradeController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get grades - students can view own, teacher can view class
router.get("/student/:studentId", auth, gradeController.getGrades);
router.get(
  "/subject/:subjectId",
  auth,
  authorize("teacher", "admin"),
  gradeController.getSubjectGrades,
);

// Encode grades - teacher only
router.post(
  "/encode",
  auth,
  authorize("teacher"),
  gradeController.encodeGrades,
);

module.exports = router;

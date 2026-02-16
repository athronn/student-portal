const express = require("express");
const adminController = require("../controllers/adminController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// All admin routes require auth and admin role
router.use(auth, authorize("admin"));

// User Management
router.post("/create-student", adminController.createStudent);
router.post("/create-teacher", adminController.createTeacher);
router.get("/students", adminController.getAllStudents);
router.get("/teachers", adminController.getAllTeachers);

// Account Management
router.put("/deactivate/:userId", adminController.deactivateUser);
router.put("/activate/:userId", adminController.activateUser);
router.post("/reset-password/:userId", adminController.resetPassword);

// Enrollment
router.post("/enroll-student", adminController.enrollStudentInSubject);

module.exports = router;

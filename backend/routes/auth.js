const express = require("express");
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.post("/change-password", auth, authController.changePassword);
router.get("/me", auth, authController.getCurrentUser);
router.put("/profile", auth, authController.updateProfile);

module.exports = router;

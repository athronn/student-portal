const express = require("express");
const paymentController = require("../controllers/paymentController");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get tuition balance - students can view own, admin can view all
router.get("/balance/:studentId", auth, paymentController.getTuitionBalance);

// Get payment records
router.get("/records/:studentId", auth, paymentController.getPaymentRecords);

// Admin only routes
router.get("/", auth, authorize("admin"), paymentController.getAllPayments);
router.post(
  "/create",
  auth,
  authorize("admin"),
  paymentController.createPaymentRecord,
);
router.put(
  "/:paymentId",
  auth,
  authorize("admin"),
  paymentController.updatePaymentRecord,
);

module.exports = router;

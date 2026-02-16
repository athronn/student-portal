const Payment = require("../models/Payment");
const User = require("../models/User");

// Get Payment Records (Admin - all/student, Student - own)
exports.getPaymentRecords = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Students can only view their own payments
    if (userRole === "student" && userId !== studentId) {
      return res
        .status(403)
        .json({ message: "You can only view your own payment records" });
    }

    const payments = await Payment.find({ student: studentId });

    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Payments (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate(
      "student",
      "firstName lastName studentID email",
    );

    res.json(payments);
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Payment Record (Admin only)
exports.createPaymentRecord = async (req, res) => {
  try {
    const { studentId, totalAmount, semester, academicYear, dueDate } =
      req.body;

    // Validation
    if (!studentId || !totalAmount || !semester || !dueDate) {
      return res.status(400).json({
        message: "Student ID, amount, semester, and due date are required",
      });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if payment record already exists for this semester
    const existingPayment = await Payment.findOne({
      student: studentId,
      semester: semester,
      academicYear: academicYear || "2024-2025",
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment record already exists for this semester" });
    }

    const newPayment = new Payment({
      student: studentId,
      totalAmount,
      balance: totalAmount,
      amountPaid: 0,
      status: "Unpaid",
      semester,
      academicYear: academicYear || "2024-2025",
      dueDate: new Date(dueDate),
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment record created successfully",
      payment: await newPayment.populate(
        "student",
        "firstName lastName studentID email",
      ),
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Payment Record (Admin only)
exports.updatePaymentRecord = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amountPaid, remarks } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (amountPaid !== undefined) {
      if (amountPaid < 0 || amountPaid > payment.totalAmount) {
        return res.status(400).json({ message: "Invalid amount paid" });
      }

      await payment.updatePayment(amountPaid);
    }

    if (remarks) payment.remarks = remarks;

    if (amountPaid === undefined) {
      await payment.save();
    }

    res.json({
      message: "Payment record updated successfully",
      payment: await payment.populate(
        "student",
        "firstName lastName studentID email",
      ),
    });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Student's Tuition Balance
exports.getTuitionBalance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Students can only view their own balance
    if (userRole === "student" && userId !== studentId) {
      return res
        .status(403)
        .json({ message: "You can only view your own tuition balance" });
    }

    const payments = await Payment.find({ student: studentId });

    let totalBalance = 0;
    let totalAmount = 0;
    let totalPaid = 0;

    payments.forEach((payment) => {
      totalAmount += payment.totalAmount;
      totalPaid += payment.amountPaid;
      totalBalance += payment.balance;
    });

    res.json({
      totalAmount: totalAmount.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalBalance: totalBalance.toFixed(2),
      paymentsByStatus: {
        paid: payments.filter((p) => p.status === "Paid").length,
        partial: payments.filter((p) => p.status === "Partial").length,
        unpaid: payments.filter((p) => p.status === "Unpaid").length,
      },
      details: payments,
    });
  } catch (error) {
    console.error("Get tuition balance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

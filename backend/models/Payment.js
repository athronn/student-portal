const mongoose = require("mongoose");

// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: "2024-2025",
    },
    semester: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      get: (val) => (val ? val.toFixed(2) : 0),
    },
    amountPaid: {
      type: Number,
      default: 0,
      get: (val) => (val ? val.toFixed(2) : 0),
    },
    balance: {
      type: Number,
      required: true,
      get: (val) => (val ? val.toFixed(2) : 0),
    },
    status: {
      type: String,
      enum: ["Unpaid", "Partial", "Paid"],
      default: "Unpaid",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, getters: true },
);

// Method to update balance and status
paymentSchema.methods.updatePayment = function (amountPaid) {
  this.amountPaid = amountPaid;
  this.balance = this.totalAmount - amountPaid;

  if (this.balance <= 0) {
    this.status = "Paid";
  } else if (amountPaid > 0) {
    this.status = "Partial";
  } else {
    this.status = "Unpaid";
  }

  this.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model("Payment", paymentSchema);

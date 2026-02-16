const mongoose = require("mongoose");

// Grade Schema
const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    midterm: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    finals: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    projects: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    participation: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    finalGrade: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    remarks: {
      type: String,
      default: "",
    },
    encodedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    encodedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Calculate final grade before saving
gradeSchema.pre("save", function (next) {
  if (
    this.midterm !== null ||
    this.finals !== null ||
    this.projects !== null ||
    this.participation !== null
  ) {
    const grades = [];
    if (this.midterm !== null) grades.push(this.midterm * 0.3);
    if (this.finals !== null) grades.push(this.finals * 0.4);
    if (this.projects !== null) grades.push(this.projects * 0.2);
    if (this.participation !== null) grades.push(this.participation * 0.1);

    this.finalGrade = Math.round(grades.reduce((a, b) => a + b, 0));
  }
  next();
});

module.exports = mongoose.model("Grade", gradeSchema);

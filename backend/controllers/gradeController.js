const Grade = require("../models/Grade");
const Subject = require("../models/Subject");
const User = require("../models/User");

// Encode/Update Grades (Teacher only)
exports.encodeGrades = async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      midterm,
      finals,
      projects,
      participation,
      remarks,
    } = req.body;
    const teacherId = req.user.id;

    // Validation
    if (!studentId || !subjectId) {
      return res
        .status(400)
        .json({ message: "Student ID and Subject ID are required" });
    }

    // Check if student and subject exist
    const student = await User.findById(studentId);
    const subject = await Subject.findById(subjectId);

    if (!student || !subject) {
      return res.status(404).json({ message: "Student or subject not found" });
    }

    // Find or create grade record
    let grade = await Grade.findOne({ student: studentId, subject: subjectId });

    if (!grade) {
      grade = new Grade({
        student: studentId,
        subject: subjectId,
        encodedBy: teacherId,
      });
    }

    // Update grades
    if (midterm !== undefined) grade.midterm = midterm;
    if (finals !== undefined) grade.finals = finals;
    if (projects !== undefined) grade.projects = projects;
    if (participation !== undefined) grade.participation = participation;
    if (remarks) grade.remarks = remarks;

    grade.encodedBy = teacherId;
    grade.encodedAt = new Date();

    await grade.save();

    res.json({
      message: "Grades encoded successfully",
      grade: await grade.populate("student", "firstName lastName studentID"),
    });
  } catch (error) {
    console.error("Encode grades error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Grades for Student (Student can view own, Teacher can view class)
exports.getGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Students can only view their own grades
    if (userRole === "student" && userId !== studentId) {
      return res
        .status(403)
        .json({ message: "You can only view your own grades" });
    }

    const grades = await Grade.find({ student: studentId })
      .populate("subject", "code name")
      .populate("encodedBy", "firstName lastName");

    res.json(grades);
  } catch (error) {
    console.error("Get grades error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Grades for a Subject (Teacher)
exports.getSubjectGrades = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const grades = await Grade.find({ subject: subjectId })
      .populate("student", "firstName lastName studentID email")
      .populate("subject", "code name");

    res.json(grades);
  } catch (error) {
    console.error("Get subject grades error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

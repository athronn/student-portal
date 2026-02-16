const User = require("../models/User");
const Subject = require("../models/Subject");
const Payment = require("../models/Payment");
const { generateStudentID, generateToken } = require("./authController");

// Create Student Account (Admin only)
exports.createStudent = async (req, res) => {
  try {
    const { email, firstName, lastName, contact } = req.body;
    const adminId = req.user.id;

    // Validation
    if (!email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Email, first name, and last name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate Student ID
    const studentID = await generateStudentID();

    // Generate default password (first initial + last name + random numbers)
    const defaultPassword =
      firstName.charAt(0).toLowerCase() + lastName.toLowerCase() + "123456";

    // Create new student
    const newStudent = new User({
      studentID,
      email: email.toLowerCase(),
      password: defaultPassword,
      firstName,
      lastName,
      contact: contact || "",
      role: "student",
      isActive: true,
      mustChangePassword: true,
      createdBy: adminId,
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student account created successfully",
      student: {
        studentID: newStudent.studentID,
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        defaultPassword,
        mustChangePassword: true,
      },
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ message: "Server error during student creation" });
  }
};

// Create Teacher Account (Admin only)
exports.createTeacher = async (req, res) => {
  try {
    const { email, firstName, lastName, contact } = req.body;
    const adminId = req.user.id;

    // Validation
    if (!email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Email, first name, and last name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate default password
    const defaultPassword =
      firstName.charAt(0).toLowerCase() + lastName.toLowerCase() + "123456";

    // Create new teacher
    const newTeacher = new User({
      studentID: `TECH-${Date.now()}`, // Teacher ID
      email: email.toLowerCase(),
      password: defaultPassword,
      firstName,
      lastName,
      contact: contact || "",
      role: "teacher",
      isActive: true,
      mustChangePassword: true,
      createdBy: adminId,
    });

    await newTeacher.save();

    res.status(201).json({
      message: "Teacher account created successfully",
      teacher: {
        id: newTeacher._id,
        email: newTeacher.email,
        firstName: newTeacher.firstName,
        lastName: newTeacher.lastName,
        defaultPassword,
        mustChangePassword: true,
      },
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    res.status(500).json({ message: "Server error during teacher creation" });
  }
};

// Get All Students (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .populate("enrolledSubjects");
    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Teachers (Admin only)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate User Account (Admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User account deactivated successfully",
      user,
    });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Activate User Account (Admin only)
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User account activated successfully",
      user,
    });
  } catch (error) {
    console.error("Activate user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset User Password (Admin only)
exports.resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new default password
    const newPassword =
      user.firstName.charAt(0).toLowerCase() +
      user.lastName.toLowerCase() +
      "123456";

    user.password = newPassword;
    user.mustChangePassword = true;
    await user.save();

    res.json({
      message: "Password reset successfully",
      userEmail: user.email,
      newPassword,
      instruction: "User must change password on next login",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enroll Student in Subject (Admin only)
exports.enrollStudentInSubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;

    const student = await User.findById(studentId);
    const subject = await Subject.findById(subjectId);

    if (!student || !subject) {
      return res.status(404).json({ message: "Student or subject not found" });
    }

    // Add subject to student's enrolled subjects
    if (!student.enrolledSubjects.includes(subjectId)) {
      student.enrolledSubjects.push(subjectId);
      await student.save();
    }

    // Add student to subject's enrolled students
    if (!subject.enrolledStudents.includes(studentId)) {
      subject.enrolledStudents.push(studentId);
      await subject.save();
    }

    res.json({
      message: "Student enrolled successfully",
      student: student.toJSON(),
    });
  } catch (error) {
    console.error("Enroll student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

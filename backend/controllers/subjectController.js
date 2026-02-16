const Subject = require("../models/Subject");
const User = require("../models/User");

// Create Subject (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const { code, name, description, units, semester } = req.body;

    // Validation
    if (!code || !name || !semester) {
      return res
        .status(400)
        .json({ message: "Code, name, and semester are required" });
    }

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const newSubject = new Subject({
      code,
      name,
      description: description || "",
      units: units || 3,
      semester,
    });

    await newSubject.save();

    res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("assignedTeacher", "firstName lastName email")
      .populate("enrolledStudents", "firstName lastName studentID email");
    res.json(subjects);
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId)
      .populate("assignedTeacher", "firstName lastName email")
      .populate("enrolledStudents", "firstName lastName studentID email");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (error) {
    console.error("Get subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign Teacher to Subject (Admin only)
exports.assignTeacher = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;

    const subject = await Subject.findById(subjectId);
    const teacher = await User.findById(teacherId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    subject.assignedTeacher = teacherId;
    await subject.save();

    res.json({
      message: "Teacher assigned successfully",
      subject: await subject.populate(
        "assignedTeacher",
        "firstName lastName email",
      ),
    });
  } catch (error) {
    console.error("Assign teacher error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Subject (Admin only)
exports.updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { code, name, description, units, semester } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (code) subject.code = code;
    if (name) subject.name = name;
    if (description) subject.description = description;
    if (units) subject.units = units;
    if (semester) subject.semester = semester;

    await subject.save();

    res.json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error("Update subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

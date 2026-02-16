const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✓ MongoDB connected successfully"))
  .catch((err) => {
    console.error("✗ MongoDB connection error:", err.message);
    process.exit(1);
  });

const User = require("./models/User");

// ===== ONE-TIME SETUP ENDPOINT =====
app.post("/api/setup/create-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({
        message: "Admin account already exists. Setup disabled.",
      });
    }

    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "All fields are required: email, password, firstName, lastName",
      });
    }

    const admin = new User({
      studentID: "ADMIN-001",
      email: email.toLowerCase(),
      password: password,
      firstName,
      lastName,
      role: "admin",
      isActive: true,
      mustChangePassword: true,
      contact: "",
      address: "",
    });

    await admin.save();

    res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        studentID: admin.studentID,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ message: "Server error during setup" });
  }
});

// ===== ROUTES =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/subjects", require("./routes/subject"));
app.use("/api/grades", require("./routes/grade"));
app.use("/api/announcements", require("./routes/announcement"));
app.use("/api/payments", require("./routes/payment"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ===== ERROR HANDLING =====
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  ICC Student Portal Backend - Server Running               ║
║  Port: ${PORT}                                                 ║
║  Environment: ${process.env.NODE_ENV || "development"}                              ║
║  API Base URL: http://localhost:${PORT}                        ║
╚════════════════════════════════════════════════════════════╝
  `);
});

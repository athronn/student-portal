/**
 * SEED DATA SCRIPT
 * Creates default admin account in MongoDB
 * Run once to populate initial data
 *
 * Usage: node seed-data.js
 */

const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function seedData() {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB connected successfully\n");

    // Create default admin user
    const adminExists = await User.findOne({ email: "admin@icc.edu" });

    if (!adminExists) {
      console.log("👤 Creating default admin account...");
      const admin = new User({
        studentID: "ADMIN-001",
        email: "admin@icc.edu",
        password: "admin123456",
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
        isActive: true,
        mustChangePassword: true,
        contact: "+63-123-456-7890",
        address: "Interface Computer College, Inc.",
      });

      await admin.save();
      console.log("✓ Admin account created successfully\n");
      console.log("📋 DEFAULT ADMIN CREDENTIALS:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Email:    admin@icc.edu");
      console.log("Password: admin123456");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n⚠️  Must change password on first login!\n");
    } else {
      console.log("ℹ️  Admin account already exists\n");
    }

    // Create sample teacher (optional)
    const teacherExists = await User.findOne({ email: "teacher1@icc.edu" });
    if (!teacherExists) {
      console.log("👨‍🏫 Creating sample teacher account...");
      const teacher = new User({
        studentID: "TECH-001",
        email: "teacher1@icc.edu",
        password: "teacher123456",
        firstName: "John",
        lastName: "Doe",
        role: "teacher",
        isActive: true,
        mustChangePassword: true,
        contact: "+63-987-654-3210",
      });

      await teacher.save();
      console.log("✓ Teacher account created\n");
      console.log("Teacher Email: teacher1@icc.edu");
      console.log("Teacher Password: teacher123456\n");
    }

    // Create sample student (optional)
    const studentExists = await User.findOne({ email: "student1@icc.edu" });
    if (!studentExists) {
      console.log("🎓 Creating sample student account...");
      const student = new User({
        studentID: "STU-202400001",
        email: "student1@icc.edu",
        password: "student123456",
        firstName: "Juan",
        lastName: "Dela Cruz",
        role: "student",
        isActive: true,
        mustChangePassword: true,
        contact: "+63-555-123-4567",
      });

      await student.save();
      console.log("✓ Student account created\n");
      console.log("Student Email: student1@icc.edu");
      console.log("Student Password: student123456\n");
    }

    console.log("✅ Database seeded successfully!\n");
    console.log("You can now start using the application.\n");
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run seeding
seedData();

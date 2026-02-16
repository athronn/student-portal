const Announcement = require("../models/Announcement");

// Create Announcement (Teacher and Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, target, subjectId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newAnnouncement = new Announcement({
      title,
      content,
      createdBy: userId,
      target: target || "all",
      subject: subjectId || null,
    });

    await newAnnouncement.save();

    res.status(201).json({
      message: "Announcement created successfully",
      announcement: await newAnnouncement.populate(
        "createdBy",
        "firstName lastName email",
      ),
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Announcements (based on user role)
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;

    let query = { isActive: true };

    // Determine which announcements user can see
    if (userRole === "student") {
      query.$or = [{ target: "all" }, { target: "students" }];
    } else if (userRole === "teacher") {
      query.$or = [{ target: "all" }, { target: "teachers" }];
    }
    // Admin sees all announcements

    const announcements = await Announcement.find(query)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId).populate(
      "createdBy",
      "firstName lastName email",
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  } catch (error) {
    console.error("Get announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Announcement (Creator only or Admin)
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content, target } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check authorization
    if (announcement.createdBy.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to update this announcement",
      });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (target) announcement.target = target;

    await announcement.save();

    res.json({
      message: "Announcement updated successfully",
      announcement: await announcement.populate(
        "createdBy",
        "firstName lastName email",
      ),
    });
  } catch (error) {
    console.error("Update announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check authorization
    if (announcement.createdBy.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to delete this announcement",
      });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

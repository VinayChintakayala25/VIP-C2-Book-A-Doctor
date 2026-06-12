const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get pending doctors
router.get("/doctors/pending", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "pending" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending doctors" });
  }
});

// Get all doctors
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Approve doctor
router.put("/doctors/:id/approve", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Doctor approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving doctor" });
  }
});

module.exports = router;

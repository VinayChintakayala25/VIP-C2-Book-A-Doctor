const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get approved doctors (accessible to patients)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Get pending doctors (admin use)
router.get("/doctors/pending", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "pending" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending doctors" });
  }
});

// Approve doctor (admin use)
router.put("/doctors/:id/approve", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Doctor approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving doctor" });
  }
});

module.exports = router;

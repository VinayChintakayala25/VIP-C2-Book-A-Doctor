const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ destructure correctly

const router = express.Router();

// Get approved doctors
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching approved doctors" });
  }
});

// Get pending doctors
router.get("/doctors/pending", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "pending" });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending doctors" });
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

// Reject doctor
router.put("/doctors/:id/reject", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Doctor rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting doctor" });
  }
});

// Manage patients (list all patients)
router.get("/patients", authMiddleware, async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" });
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// Delete patient
router.delete("/patients/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting patient" });
  }
});

// Dashboard stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;

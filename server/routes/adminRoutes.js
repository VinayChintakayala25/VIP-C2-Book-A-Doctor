const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all doctors
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json({ doctors });
  } catch (err) {
    console.error("Fetch doctors error:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Get pending doctors
router.get("/doctors/pending", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      status: "pending",
    }).select("-password");

    res.json({ doctors });
  } catch (err) {
    console.error("Fetch pending doctors error:", err);
    res.status(500).json({ message: "Error fetching pending doctors" });
  }
});

// Approve doctor
router.put("/doctors/:id/approve", authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor approved successfully",
      doctor,
    });
  } catch (err) {
    console.error("Approve doctor error:", err);
    res.status(500).json({ message: "Error approving doctor" });
  }
});

// Reject doctor
router.put("/doctors/:id/reject", authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor rejected successfully",
      doctor,
    });
  } catch (err) {
    console.error("Reject doctor error:", err);
    res.status(500).json({ message: "Error rejecting doctor" });
  }
});

// Delete doctor
router.delete("/doctors/:id", authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ message: "Error deleting doctor" });
  }
});

// Get all patients
router.get("/patients", authMiddleware, async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json({ patients });
  } catch (err) {
    console.error("Fetch patients error:", err);
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// Delete patient
router.delete("/patients/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await User.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("Delete patient error:", err);
    res.status(500).json({ message: "Error deleting patient" });
  }
});

// Get admin dashboard stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue: 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
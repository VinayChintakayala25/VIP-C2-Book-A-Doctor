const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ destructure correctly
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Get approved doctors (for patients to book/search)
router.get("/", async (req, res) => {
  try {
    const { specialization, hospital, name } = req.query;

    const filters = { role: "doctor", status: "approved" };
    if (specialization) filters.specialization = specialization;
    if (hospital) filters.hospital = hospital;
    if (name) filters.name = { $regex: name, $options: "i" };

    const doctors = await User.find(filters);
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Doctor: Get their own appointments
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doctor: Update profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const updates = req.body;
    const doctor = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: "Doctor profile updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: "Error updating doctor profile" });
  }
});

// Doctor: Accept/Reject/Complete appointment
router.put("/appointments/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    res.json({ message: "Appointment status updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error updating appointment status" });
  }
});

// Doctor: Reschedule appointment
router.put("/appointments/:id/reschedule", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { rescheduledDate, rescheduledTimeSlot } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "rescheduled",
        rescheduledDate,
        rescheduledTimeSlot,
      },
      { new: true }
    );
    res.json({ message: "Appointment rescheduled", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error rescheduling appointment" });
  }
});

module.exports = router;

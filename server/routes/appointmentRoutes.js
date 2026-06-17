const express = require("express");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Book appointment
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { patientId, patientName, doctorId, date, timeSlot, reason } = req.body;

    if (!patientId || !patientName || !doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = new Appointment({
      patientId,
      patientName,
      doctorId,
      date,
      timeSlot,
      reason,
      status: "pending",
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    console.error("Book appointment error:", err);
    res.status(500).json({ message: "Error booking appointment" });
  }
});

// Get all appointments - Admin
router.get("/", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email phone medicalHistory reports")
      .populate("doctorId", "name email specialization hospital");

    res.json({ appointments });
  } catch (err) {
    console.error("Get all appointments error:", err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// Get appointments by patient
router.get("/patient/:id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.id,
    }).populate("doctorId", "name specialization hospital");

    res.json({ appointments });
  } catch (err) {
    console.error("Get patient appointments error:", err);
    res.status(500).json({ message: "Error fetching patient appointments" });
  }
});

// Get appointments by doctor
router.get("/doctor/:id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.id,
    }).populate("patientId", "name email phone medicalHistory reports");

    res.json({ appointments });
  } catch (err) {
    console.error("Get doctor appointments error:", err);
    res.status(500).json({ message: "Error fetching doctor appointments" });
  }
});

// Update appointment status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "rescheduled",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (err) {
    console.error("Update appointment status error:", err);
    res.status(500).json({ message: "Error updating appointment status" });
  }
});

// Cancel appointment
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});

// Reschedule appointment
router.put("/:id/reschedule", authMiddleware, async (req, res) => {
  try {
    const { rescheduledDate, rescheduledTimeSlot } = req.body;

    if (!rescheduledDate || !rescheduledTimeSlot) {
      return res.status(400).json({ message: "New date and time slot required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "rescheduled",
        rescheduledDate,
        rescheduledTimeSlot,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (err) {
    console.error("Reschedule appointment error:", err);
    res.status(500).json({ message: "Error rescheduling appointment" });
  }
});

module.exports = router;
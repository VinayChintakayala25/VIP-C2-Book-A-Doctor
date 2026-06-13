const express = require("express");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ destructure correctly

const router = express.Router();

// Book appointment (patient)
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
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment" });
  }
});

// Get appointments by patient
router.get("/patient/:id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching patient appointments" });
  }
});

// Get appointments by doctor
router.get("/doctor/:id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor appointments" });
  }
});

// Update appointment status (doctor actions: approve/reject/complete)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
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

// Cancel appointment (patient)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});

// Reschedule appointment (patient or doctor)
router.put("/:id/reschedule", authMiddleware, async (req, res) => {
  try {
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

// Admin: get all appointments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching all appointments" });
  }
});

module.exports = router;

const express = require("express");
const Appointment = require("../models/Appointment");
const router = express.Router();

// Book appointment (patient)
router.post("/book", async (req, res) => {
  try {
    const { patientId, patientName, doctorId, date, reason } = req.body;

    if (!patientId || !patientName || !doctorId || !date || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = new Appointment({
      patientId,
      patientName,
      doctorId,
      date,
      reason,
      status: "pending"
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment" });
  }
});


// Get appointments by patient
router.get("/patient/:id", async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.params.id });
  res.json({ appointments });
});

// Get appointments by doctor
router.get("/doctor/:id", async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.params.id });
  res.json({ appointments });
});

// Approve/Reject appointment (doctor)
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ message: "Appointment status updated", appointment });
});

// Admin: get all appointments
router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.json({ appointments });
});

module.exports = router;

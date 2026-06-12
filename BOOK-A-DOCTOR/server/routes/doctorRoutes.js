const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

// 🔹 Get pending appointments for a doctor (requires login)
router.get("/appointments/doctor", authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user.id; 
    const appointments = await Appointment.find({ doctorId, status: "approved" });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Get all doctors (list)
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

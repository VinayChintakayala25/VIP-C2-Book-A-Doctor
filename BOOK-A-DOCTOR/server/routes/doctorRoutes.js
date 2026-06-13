const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

// Doctor: Get their own appointments (requires login)
router.get("/appointments/doctor", authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Get approved doctors (for patients to book)
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

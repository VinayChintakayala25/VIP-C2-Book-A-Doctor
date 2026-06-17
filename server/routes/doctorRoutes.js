const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get approved doctors for patient dashboard
router.get("/", async (req, res) => {
  try {
    const { specialization, hospital, name } = req.query;

    const filters = {
      role: "doctor",
      status: "approved",
    };

    if (specialization) {
      filters.specialization = {
        $regex: specialization,
        $options: "i",
      };
    }

    if (hospital) {
      filters.hospital = {
        $regex: hospital,
        $options: "i",
      };
    }

    if (name) {
      filters.name = {
        $regex: name,
        $options: "i",
      };
    }

    const doctors = await User.find(filters).select("-password");

    res.json({ doctors });
  } catch (err) {
    console.error("Fetch doctors error:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Doctor gets own appointments
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({
      doctorId: req.user.id,
    }).populate("patientId", "name email phone medicalHistory reports");

    res.json({ appointments });
  } catch (err) {
    console.error("Doctor appointments error:", err);
    res.status(500).json({ message: "Error fetching doctor appointments" });
  }
});

// Doctor updates appointment status
router.put("/appointments/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, notes } = req.body;

    const allowedStatuses = [
      "approved",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid doctor action status" });
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
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("Doctor update appointment error:", err);
    res.status(500).json({ message: "Error updating appointment" });
  }
});

// Doctor reschedules appointment
router.put("/appointments/:id/reschedule", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { rescheduledDate, rescheduledTimeSlot } = req.body;

    if (!rescheduledDate || !rescheduledTimeSlot) {
      return res.status(400).json({ message: "Date and time slot required" });
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
    console.error("Doctor reschedule error:", err);
    res.status(500).json({ message: "Error rescheduling appointment" });
  }
});

// Doctor updates own profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    delete req.body.password;
    delete req.body.role;
    delete req.body.status;

    const doctor = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.json({
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (err) {
    console.error("Doctor profile update error:", err);
    res.status(500).json({ message: "Error updating doctor profile" });
  }
});

module.exports = router;
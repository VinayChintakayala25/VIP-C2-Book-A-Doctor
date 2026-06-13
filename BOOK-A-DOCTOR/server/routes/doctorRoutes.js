const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { specialization, hospital, name } = req.query;

    const filters = {
      role: "doctor",
      status: "approved",
    };

    if (specialization)
      filters.specialization = specialization;

    if (hospital)
      filters.hospital = hospital;

    if (name)
      filters.name = {
        $regex: name,
        $options: "i",
      };

    const doctors = await User.find(filters)
      .select("-password");

    res.json({ doctors });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching doctors",
    });
  }
});

router.get(
  "/appointments",
  authMiddleware,
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          doctorId: req.user.id,
        });

      res.json({ appointments });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching appointments",
      });
    }
  }
);

router.put(
  "/appointments/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      res.json({
        message: "Status updated",
        appointment,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error updating appointment",
      });
    }
  }
);

router.put(
  "/appointments/:id/reschedule",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        rescheduledDate,
        rescheduledTimeSlot,
      } = req.body;

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          {
            status: "rescheduled",
            rescheduledDate,
            rescheduledTimeSlot,
          },
          { new: true }
        );

      res.json({
        message:
          "Appointment rescheduled",
        appointment,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error rescheduling appointment",
      });
    }
  }
);

module.exports = router;
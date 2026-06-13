const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/doctors",
  authMiddleware,
  async (req, res) => {
    try {
      const doctors =
        await User.find({
          role: "doctor",
        });

      res.json({ doctors });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching doctors",
      });
    }
  }
);

router.get(
  "/doctors/pending",
  authMiddleware,
  async (req, res) => {
    try {
      const doctors =
        await User.find({
          role: "doctor",
          status: "pending",
        });

      res.json({ doctors });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching pending doctors",
      });
    }
  }
);

router.put(
  "/doctors/:id/approve",
  authMiddleware,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",
        }
      );

      res.json({
        message:
          "Doctor approved successfully",
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error approving doctor",
      });
    }
  }
);

router.put(
  "/doctors/:id/reject",
  authMiddleware,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        }
      );

      res.json({
        message:
          "Doctor rejected successfully",
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error rejecting doctor",
      });
    }
  }
);

router.delete(
  "/doctors/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Doctor deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error deleting doctor",
      });
    }
  }
);

router.get(
  "/patients",
  authMiddleware,
  async (req, res) => {
    try {
      const patients =
        await User.find({
          role: "patient",
        });

      res.json({ patients });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching patients",
      });
    }
  }
);

router.delete(
  "/patients/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Patient deleted",
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error deleting patient",
      });
    }
  }
);

router.get(
  "/stats",
  authMiddleware,
  async (req, res) => {
    try {
      const totalDoctors =
        await User.countDocuments({
          role: "doctor",
        });

      const totalPatients =
        await User.countDocuments({
          role: "patient",
        });

      const totalAppointments =
        await Appointment.countDocuments();

      res.json({
        totalDoctors,
        totalPatients,
        totalAppointments,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching stats",
      });
    }
  }
);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/book", authMiddleware, bookAppointment);
router.get("/patient", authMiddleware, getPatientAppointments);
router.get("/doctor", authMiddleware, getDoctorAppointments);
router.put("/update/:id", authMiddleware, updateAppointmentStatus);

module.exports = router;

const Appointment = require("../models/Appointment");

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { patientName, doctorId, date, reason } = req.body;

    const appointment = new Appointment({
      patientId: req.user.id,
      patientName,
      doctorId,
      date,
      reason,
      status: "pending",
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Book error:", err);
    res.status(500).json({ message: "Error booking appointment" });
  }
};

// Patient appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id });
    res.json({ appointments });
  } catch (err) {
    console.error("Patient fetch error:", err);
    res.status(500).json({ message: "Error fetching patient appointments" });
  }
};

// Doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id });
    res.json({ appointments });
  } catch (err) {
    console.error("Doctor fetch error:", err);
    res.status(500).json({ message: "Error fetching doctor appointments" });
  }
};

// Update status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Status updated", appointment });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};

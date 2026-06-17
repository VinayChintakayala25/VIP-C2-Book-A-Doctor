const Doctor = require("../models/Doctor");

// Approve Doctor
const approveDoctorController = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status: "approved" },
      { new: true }
    );
    res.status(200).send({ success: true, message: "Doctor approved", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

// Reject Doctor
const rejectDoctorController = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).send({ success: true, message: "Doctor rejected", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { approveDoctorController, rejectDoctorController };

const Doctor = require("../models/Doctor");

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new Doctor({
      ...req.body,
      status: "pending"
    });
    await newDoctor.save();
    res.status(201).send({ success: true, message: "Doctor account applied successfully", doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { applyDoctorController };

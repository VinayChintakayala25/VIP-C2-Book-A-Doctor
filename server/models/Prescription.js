const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicine: { type: String, required: true },
    dosage: { type: String, required: true },
    instructions: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
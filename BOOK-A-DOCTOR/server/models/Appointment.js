const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String, required: true },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "rescheduled",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    notes: { type: String },

    payment: {
      amount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
      transactionId: { type: String },
    },

    rescheduledDate: { type: Date },
    rescheduledTimeSlot: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
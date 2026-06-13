const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },

    role: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      default: "patient",
    },

    specialization: { type: String },
    hospital: { type: String },
    qualifications: [{ type: String }],
    experience: { type: String },
    consultationFees: { type: Number, default: 0 },

    availability: {
      days: [{ type: String }],
      timeSlots: [{ type: String }],
      leaveDays: [{ type: Date }],
    },

    medicalHistory: [{ type: String }],

    reports: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    profilePicture: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "active", "rejected"],
      default: function () {
        return this.role === "doctor" ? "pending" : "active";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
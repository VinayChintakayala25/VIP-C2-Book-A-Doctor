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

    // ✅ Doctor-specific fields
    specialization: { type: String },
    hospital: { type: String },
    qualifications: [{ type: String }],
    experience: { type: String },
    consultationFees: { type: Number },
    availability: {
      days: [{ type: String }], // e.g. ["Monday", "Wednesday"]
      timeSlots: [{ type: String }], // e.g. ["10:00-12:00", "14:00-16:00"]
      leaveDays: [{ type: Date }],
    },

    // ✅ Patient-specific fields
    medicalHistory: [{ type: String }],
    reports: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ✅ Common fields
    profilePicture: { type: String }, // URL or path
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

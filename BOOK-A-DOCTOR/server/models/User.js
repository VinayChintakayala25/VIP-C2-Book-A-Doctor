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
    specialization: { type: String }, // only for doctors
    status: {
      type: String,
      enum: ["pending", "approved", "active"],
      default: function () {
        return this.role === "doctor" ? "pending" : "active";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

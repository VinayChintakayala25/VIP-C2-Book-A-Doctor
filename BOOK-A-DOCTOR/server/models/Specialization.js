const mongoose = require("mongoose");

const specializationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specialization", specializationSchema);
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullname: { type: String, required: true },
  specialization: { type: String, required: true },
  fees: { type: Number, required: true },
  timings: { type: Object, required: true }, // e.g. { start: "10:00", end: "17:00" }
  status: { type: String, default: 'pending' } // pending, approved, rejected
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);

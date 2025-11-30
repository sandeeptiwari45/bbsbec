const mongoose = require('mongoose');

const registrationCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
    isUsed: { type: Boolean, default: false },
    createdFor: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RegistrationCode', registrationCodeSchema);


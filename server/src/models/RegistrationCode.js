const mongoose = require('mongoose');

const registrationCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdFor: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.model('RegistrationCode', registrationCodeSchema);


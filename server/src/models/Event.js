const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    eventDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, required: true },
    course: { type: String, default: 'All' },
    department: { type: String, default: 'All' },
    year: { type: String, default: 'All' },
    semester: { type: String, default: 'All' },
    section: { type: String, default: 'All' },
    group: { type: String, default: 'All' },
    specificRollNumbers: [{ type: String }],
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

module.exports = mongoose.model('Event', eventSchema);


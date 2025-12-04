const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Exam', 'Holiday', 'Placement', 'Cultural', 'Important'],
      required: true,
    },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedByName: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    eventDate: { type: Date },
    attachments: [{
      name: String,
      url: String,
      type: String, // 'pdf', 'image', 'document'
    }],
    target: {
      courses: [String],
      departments: [String],
      years: [String],
      semesters: [String],
      sections: [String],
    },
    readBy: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
    }],
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

module.exports = mongoose.model('Notice', noticeSchema);


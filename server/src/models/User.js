const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
    designation: String, // e.g., 'Mentor', 'HOD', 'Principal', 'Professor', 'Assistant Professor'
    // Profile
    profileImage: String,
    mobile: String,
    dateOfBirth: Date,
    address: String,
    caste: String,
    shortName: String, // For faculty e.g. JPS
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    // Student specific
    fatherName: String,
    collegeRollNo: String,
    universityRollNo: String,
    course: String,
    department: String,
    year: String,
    semester: String,
    section: String,
    // Faculty specific
    subjects: [String],
    teachingSemesters: [String],
    teachingGroups: [String],
    isApproved: { type: Boolean, default: false },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
    designation: String, // e.g., 'Mentor', 'HOD', 'Principal', 'Professor', 'Assistant Professor'
    // Profile
    profileImage: String,
    mobile: String,
    dateOfBirth: Date,
    address: String,
    caste: String,
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
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);


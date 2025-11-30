const User = require('./models/User');
const Notice = require('./models/Notice');
const RegistrationCode = require('./models/RegistrationCode');
const Event = require('./models/Event');

const seedData = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const [admin, faculty, student] = await User.create([
      {
        fullName: 'Admin User',
        email: 'admin@bbsbec.edu',
        role: 'admin',
        isApproved: true,
      },
      {
        fullName: 'Dr. Sharma',
        email: 'faculty@bbsbec.edu',
        role: 'faculty',
        department: 'CSE',
        isApproved: true,
      },
      {
        fullName: 'Rohan Singh',
        email: 'student@bbsbec.edu',
        role: 'student',
        fatherName: 'Mr. Singh',
        collegeRollNo: '1901001',
        course: 'B.Tech',
        department: 'CSE',
        year: '4th',
        semester: '7',
        section: 'A',
        isApproved: true,
        favourites: [],
      },
    ]);

    await Notice.create([
      {
        title: 'Mid-Semester Exams Datesheet',
        description:
          'The mid-semester examinations for all B.Tech streams will commence from October 15th. Please check the detailed schedule on the notice board.',
        category: 'Exam',
        publishedBy: admin._id,
        publishedByName: admin.fullName,
        isPinned: true,
        eventDate: new Date(Date.now() + 86400000 * 5),
        target: { courses: ['B.Tech'], departments: [], years: [], semesters: [], sections: [] },
      },
      {
        title: 'Diwali Holidays Announcement',
        description: 'The college will remain closed from Nov 1st to Nov 5th on account of Diwali.',
        category: 'Holiday',
        publishedBy: admin._id,
        publishedByName: admin.fullName,
        isPinned: false,
        eventDate: new Date(Date.now() + 86400000 * 20),
        target: { courses: [], departments: [], years: [], semesters: [], sections: [] },
      },
      {
        title: 'Assignment Submission Deadline Extended',
        description: 'The submission deadline for the Advanced Java assignment has been extended by 2 days.',
        category: 'Academic',
        publishedBy: faculty._id,
        publishedByName: faculty.fullName,
        isPinned: false,
        target: { courses: ['B.Tech'], departments: ['CSE'], years: ['4th'], semesters: ['7'], sections: ['A'] },
      },
    ]);

    await RegistrationCode.create([
      { code: 'STD-2025-001', role: 'student', isUsed: false, createdFor: 'New Student' },
      { code: 'FAC-2025-001', role: 'faculty', isUsed: false, createdFor: 'New Faculty' },
      { code: 'ADM-2025-001', role: 'admin', isUsed: false, createdFor: 'New Admin' },
    ]);

    await Event.create([
      {
        title: 'Faculty Meeting',
        description: 'Monthly academic planning meeting.',
        eventDate: new Date(Date.now() + 86400000 * 3),
        createdBy: faculty._id,
        createdByName: faculty.fullName,
      },
      {
        title: 'Parent Teacher Meet',
        description: 'Annual PTM for final year students.',
        eventDate: new Date(Date.now() + 86400000 * 10),
        createdBy: admin._id,
        createdByName: admin.fullName,
      },
    ]);

    console.log('Seed data inserted');
  }
};

module.exports = { seedData };


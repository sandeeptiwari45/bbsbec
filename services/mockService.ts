import { User, Notice, UniqueCode, Role, CalendarEvent } from '../types';

const STORAGE_KEYS = {
  USERS: 'bbsbec_users',
  NOTICES: 'bbsbec_notices',
  CODES: 'bbsbec_codes',
  CURRENT_USER: 'bbsbec_current_user',
  EVENTS: 'bbsbec_events',
};

// --- Initial Seed Data ---
const SEED_CODES: UniqueCode[] = [
  { id: '1', code: 'STD-2025-001', role: 'student', isUsed: false, createdFor: 'New Student' },
  { id: '2', code: 'FAC-2025-001', role: 'faculty', isUsed: false, createdFor: 'New Faculty' },
  { id: '3', code: 'ADM-2025-001', role: 'admin', isUsed: false, createdFor: 'New Admin' },
];

const SEED_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'Admin User',
    email: 'admin@bbsbec.edu',
    role: 'admin',
    designation: 'Principal',
    isApproved: true,
  },
  {
    id: 'u2',
    fullName: 'Dr. Sharma',
    email: 'faculty@bbsbec.edu',
    role: 'faculty',
    department: 'CSE',
    designation: 'HOD',
    isApproved: true,
    subjects: ['Data Structures', 'Algorithms'],
    mobile: '9876543210'
  },
  {
    id: 'u3',
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
    mobile: '9876543211'
  },
  {
    id: 'u4',
    fullName: 'Priya Verma',
    email: 'priya.v@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Verma',
    collegeRollNo: '1901002',
    course: 'B.Tech',
    department: 'CSE',
    year: '4th',
    semester: '7',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543212'
  },
  {
    id: 'u5',
    fullName: 'Amit Kumar',
    email: 'amit.k@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Kumar',
    collegeRollNo: '2001045',
    course: 'BCA',
    department: 'Computer Applications',
    year: '2nd',
    semester: '3',
    section: 'B',
    isApproved: true,
    favourites: [],
    mobile: '9876543213'
  },
  {
    id: 'u6',
    fullName: 'Prof. Anjali Gupta',
    email: 'anjali.g@bbsbec.edu',
    role: 'faculty',
    department: 'ECE',
    designation: 'Assistant Professor',
    isApproved: true,
    subjects: ['Digital Electronics', 'Signals & Systems'],
    mobile: '9876543214'
  },
  {
    id: 'u7',
    fullName: 'Dr. Vikram Singh',
    email: 'vikram.s@bbsbec.edu',
    role: 'faculty',
    department: 'ME',
    designation: 'Associate Professor',
    isApproved: true,
    subjects: ['Thermodynamics', 'Fluid Mechanics'],
    mobile: '9876543215'
  },
  {
    id: 'u8',
    fullName: 'Sandeep Kaur',
    email: 'sandeep.k@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Singh',
    collegeRollNo: '2101005',
    course: 'B.Tech',
    department: 'CSE',
    year: '3rd',
    semester: '5',
    section: 'B',
    isApproved: true,
    favourites: [],
    mobile: '9876543216'
  },
  {
    id: 'u9',
    fullName: 'Rahul Sharma',
    email: 'rahul.s@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Sharma',
    collegeRollNo: '2201010',
    course: 'B.Tech',
    department: 'ECE',
    year: '2nd',
    semester: '3',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543217'
  },
  {
    id: 'u10',
    fullName: 'Neha Gupta',
    email: 'neha.g@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Gupta',
    collegeRollNo: '2301020',
    course: 'B.Tech',
    department: 'Civil',
    year: '1st',
    semester: '1',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543218'
  },
  {
    id: 'u11',
    fullName: 'Arjun Singh',
    email: 'arjun.s@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Singh',
    collegeRollNo: '2101050',
    course: 'B.Tech',
    department: 'ME',
    year: '3rd',
    semester: '5',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543219'
  },
  {
    id: 'u12',
    fullName: 'Prof. Rajesh Kumar',
    email: 'rajesh.k@bbsbec.edu',
    role: 'faculty',
    department: 'Civil',
    designation: 'Professor',
    isApproved: true,
    subjects: ['Structural Analysis', 'Geotechnical Engineering'],
    mobile: '9876543220'
  },
  {
    id: 'u13',
    fullName: 'Dr. Simran Kaur',
    email: 'simran.k@bbsbec.edu',
    role: 'faculty',
    department: 'Applied Sciences',
    designation: 'Assistant Professor',
    isApproved: true,
    subjects: ['Engineering Mathematics', 'Physics'],
    mobile: '9876543221'
  },
  {
    id: 'u14',
    fullName: 'Manish Tiwari',
    email: 'manish.t@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Tiwari',
    collegeRollNo: '2001099',
    course: 'MBA',
    department: 'Management',
    year: '2nd',
    semester: '3',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543222'
  },
  {
    id: 'u15',
    fullName: 'Karan Malhotra',
    email: 'karan.m@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Malhotra',
    collegeRollNo: '2001100',
    course: 'BCA',
    department: 'Computer Applications',
    year: '3rd',
    semester: '5',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543223'
  },
  {
    id: 'u16',
    fullName: 'Divya Bharti',
    email: 'divya.b@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Bharti',
    collegeRollNo: '2101200',
    course: 'MCA',
    department: 'Computer Applications',
    year: '1st',
    semester: '1',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543224'
  },
  {
    id: 'u17',
    fullName: 'Vikram Rathore',
    email: 'vikram.r@bbsbec.edu',
    role: 'student',
    fatherName: 'Mr. Rathore',
    collegeRollNo: '2201300',
    course: 'B.Tech',
    department: 'Civil',
    year: '4th',
    semester: '7',
    section: 'A',
    isApproved: true,
    favourites: [],
    mobile: '9876543225'
  },
  {
    id: 'u18',
    fullName: 'Prof. Meenakshi Sharma',
    email: 'meenakshi.s@bbsbec.edu',
    role: 'faculty',
    department: 'CSE',
    designation: 'Assistant Professor',
    isApproved: true,
    subjects: ['Operating Systems', 'Computer Networks'],
    mobile: '9876543226'
  },
  {
    id: 'u19',
    fullName: 'Dr. Rakesh Gupta',
    email: 'rakesh.g@bbsbec.edu',
    role: 'faculty',
    department: 'Management',
    designation: 'Associate Professor',
    isApproved: true,
    subjects: ['Marketing Management', 'Human Resource Management'],
    mobile: '9876543227'
  }
];

const SEED_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Mid-Semester Exams Datesheet',
    description: 'The mid-semester examinations for all B.Tech streams will commence from October 15th. Please check the detailed schedule on the notice board.',
    category: 'Exam',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    isPinned: true,
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    target: { courses: ['B.Tech'], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n2',
    title: 'Diwali Holidays Announcement',
    description: 'The college will remain closed from Nov 1st to Nov 5th on account of Diwali.',
    category: 'Holiday',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isPinned: false,
    eventDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n3',
    title: 'Assignment Submission Deadline Extended',
    description: 'The submission deadline for the Advanced Java assignment has been extended by 2 days.',
    category: 'Academic',
    publishedBy: 'u2',
    publishedByName: 'Dr. Sharma',
    createdAt: new Date().toISOString(),
    isPinned: false,
    target: { courses: ['B.Tech'], departments: ['CSE'], years: ['4th'], semesters: ['7'], sections: ['A'] }
  },
  {
    id: 'n4',
    title: 'Placement Drive: TCS',
    description: 'TCS will be visiting our campus for recruitment on 25th Nov. Eligible students (CSE/ECE/IT) with >60% aggregate are requested to register.',
    category: 'Placement',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPinned: true,
    target: { courses: ['B.Tech'], departments: ['CSE', 'ECE'], years: ['4th'], semesters: [], sections: [] }
  },
  {
    id: 'n5',
    title: 'Annual Sports Meet Registration',
    description: 'Registration for the Annual Sports Meet is now open. Interested students can register with the Sports Department by 10th Nov.',
    category: 'Cultural',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isPinned: false,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n6',
    title: 'Guest Lecture on AI',
    description: 'A guest lecture on "Future of Artificial Intelligence" by Dr. A.K. Singh from IIT Delhi will be held on 12th Nov in the Main Auditorium.',
    category: 'Academic',
    publishedBy: 'u2',
    publishedByName: 'Dr. Sharma',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isPinned: false,
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    target: { courses: ['B.Tech', 'BCA', 'MCA'], departments: ['CSE'], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n7',
    title: 'Library Book Return Notice',
    description: 'All students are requested to return overdue library books before the commencement of exams to avoid fines.',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isPinned: false,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n8',
    title: 'Scholarship Application Open',
    description: 'Applications for the Merit-cum-Means Scholarship for the academic year 2024-25 are now open. Last date to apply is 30th Nov.',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isPinned: true,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n9',
    title: 'Workshop on IoT',
    description: 'A 2-day workshop on Internet of Things (IoT) will be organized by the ECE department on 18th-19th Nov.',
    category: 'Academic',
    publishedBy: 'u6',
    publishedByName: 'Prof. Anjali Gupta',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isPinned: false,
    eventDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    target: { courses: ['B.Tech'], departments: ['ECE', 'CSE'], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n10',
    title: 'Blood Donation Camp',
    description: 'NSS unit of BBSBEC is organizing a Blood Donation Camp on 14th Nov. Donors will be given certificates.',
    category: 'Cultural',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    isPinned: false,
    eventDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n11',
    title: 'End Semester Exam Results Declared',
    description: 'The results for the End Semester Examinations held in May-June have been declared. Students can check their results on the college portal.',
    category: 'Exam',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    isPinned: false,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n12',
    title: 'Hostel Fee Payment Deadline',
    description: 'The last date for payment of hostel fees for the upcoming semester is 20th Dec. Late fees will be applicable after the due date.',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    isPinned: true,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n13',
    title: 'New Canteen Menu',
    description: 'We are happy to announce a new and improved menu in the college canteen starting next week. Suggestions are welcome!',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    isPinned: false,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n14',
    title: 'Change in Bus Schedule',
    description: 'Due to road construction work, the college bus on Route No. 5 will depart 15 minutes earlier than usual starting tomorrow.',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPinned: false,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  },
  {
    id: 'n15',
    title: 'Fee Payment for Next Semester',
    description: 'The fee payment portal for the next semester is now open. Please pay your fees before the deadline to avoid penalties.',
    category: 'Important',
    publishedBy: 'u1',
    publishedByName: 'Admin User',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    isPinned: true,
    target: { courses: [], departments: [], years: [], semesters: [], sections: [] }
  }
];

const SEED_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Faculty Meeting',
    description: 'Monthly academic planning meeting.',
    eventDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdBy: 'u2',
    createdByName: 'Dr. Sharma',
  },
  {
    id: 'e2',
    title: 'Parent Teacher Meet',
    description: 'Annual PTM for final year students.',
    eventDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e3',
    title: 'Tech Fest 2025',
    description: 'Annual technical festival "Technova".',
    eventDate: new Date(Date.now() + 86400000 * 45).toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e4',
    title: 'Sports Day',
    description: 'Annual Sports Meet.',
    eventDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e5',
    title: 'Alumni Meet',
    description: 'Grand Alumni Meet 2025.',
    eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e6',
    title: 'Republic Day Celebration',
    description: 'Flag hoisting ceremony.',
    eventDate: new Date('2025-01-26').toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e7',
    title: 'Final Year Project Submission',
    description: 'Deadline for submission of final year project reports.',
    eventDate: new Date(Date.now() + 86400000 * 25).toISOString(),
    createdBy: 'u2',
    createdByName: 'Dr. Sharma',
  },
  {
    id: 'e8',
    title: 'Industrial Visit',
    description: 'Industrial visit to Infosys Chandigarh for CSE 3rd year students.',
    eventDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    createdBy: 'u2',
    createdByName: 'Dr. Sharma',
  },
  {
    id: 'e9',
    title: 'Farewell Party',
    description: 'Farewell party for the outgoing batch of 2025.',
    eventDate: new Date(Date.now() + 86400000 * 50).toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e10',
    title: 'Workshop on Cloud Computing',
    description: 'One day workshop on AWS and Azure.',
    eventDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    createdBy: 'u2',
    createdByName: 'Dr. Sharma',
  },
  {
    id: 'e11',
    title: 'Hackathon 2025',
    description: '24-hour coding hackathon organized by the CSE department.',
    eventDate: new Date(Date.now() + 86400000 * 35).toISOString(),
    createdBy: 'u2',
    createdByName: 'Dr. Sharma',
  },
  {
    id: 'e12',
    title: 'International Yoga Day',
    description: 'Yoga session for all students and faculty.',
    eventDate: new Date('2025-06-21').toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  },
  {
    id: 'e13',
    title: 'Independence Day',
    description: 'Flag hoisting and cultural program.',
    eventDate: new Date('2025-08-15').toISOString(),
    createdBy: 'u1',
    createdByName: 'Admin User',
  }
];

// --- Helper Functions ---

const getFromStorage = <T>(key: string, seed: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Service Methods ---

export const MockService = {
  initialize: () => {
    // Helper to merge seed data
    const mergeStorage = <T extends { id: string }>(key: string, seed: T[]) => {
      const stored = localStorage.getItem(key);
      let current: T[] = stored ? JSON.parse(stored) : [];

      let changed = false;
      if (current.length === 0) {
        current = seed;
        changed = true;
      } else {
        // Add missing seed items
        seed.forEach(item => {
          if (!current.find(c => c.id === item.id)) {
            current.push(item);
            changed = true;
          }
        });
      }

      if (changed) {
        localStorage.setItem(key, JSON.stringify(current));
      }
    };

    mergeStorage(STORAGE_KEYS.USERS, SEED_USERS);
    mergeStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    mergeStorage(STORAGE_KEYS.CODES, SEED_CODES);
    mergeStorage(STORAGE_KEYS.EVENTS, SEED_EVENTS);
  },

  // Auth
  login: async (email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 500)); // Simulate network delay
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) throw new Error('User not found');
    if (user.role === 'student' && !user.isApproved) throw new Error('Account waiting for approval');

    return user;
  },

  register: async (userData: any, code: string, allowedRoles: Role[] = ['student', 'faculty', 'admin']): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));

    const codes = getFromStorage<UniqueCode[]>(STORAGE_KEYS.CODES, []);
    const validCode = codes.find(c => c.code === code && !c.isUsed);

    if (!validCode) throw new Error('Invalid or expired registration code');
    if (allowedRoles.length && !allowedRoles.includes(validCode.role)) {
      throw new Error('This registration form only accepts student registration codes provided by faculty.');
    }

    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === userData.email)) throw new Error('Email already registered');

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: validCode.role,
      isApproved: validCode.role === 'student' ? false : true, // Students need approval, others auto-approve for demo
      favourites: []
    };

    // Mark code as used
    const updatedCodes = codes.map(c => c.id === validCode.id ? { ...c, isUsed: true } : c);
    saveToStorage(STORAGE_KEYS.CODES, updatedCodes);

    // Save user
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    return newUser;
  },

  // Notices
  getNotices: async (user: User): Promise<Notice[]> => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const now = new Date();
    let filtered: Notice[] = [];

    if (user.role === 'admin') {
      filtered = notices;
    } else if (user.role === 'faculty') {
      filtered = notices.filter(n => n.publishedBy === user.id);
    } else {
      // Student Filter Logic
      filtered = notices.filter(n => {
        // Filter out scheduled notices that haven't reached their publish time
        if (n.isScheduled && n.scheduledPublishDate) {
          const scheduledDate = new Date(n.scheduledPublishDate);
          if (n.scheduledPublishTime) {
            const [hours, minutes] = n.scheduledPublishTime.split(':');
            scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          }
          if (now < scheduledDate) {
            return false; // Don't show scheduled notices that haven't been published yet
          }
        }

        const t = n.target;
        // Check if notice targets specific roll numbers
        if (t.specificRollNumbers && t.specificRollNumbers.length > 0) {
          if (!user.collegeRollNo || !t.specificRollNumbers.includes(user.collegeRollNo)) {
            return false; // Not targeted to this student's roll number
          }
        }

        // If no target specified, it's for everyone
        const isGlobal = t.courses.length === 0 && t.departments.length === 0 && t.years.length === 0 &&
          t.semesters.length === 0 && t.sections.length === 0 &&
          (!t.groups || t.groups.length === 0) &&
          (!t.specificRollNumbers || t.specificRollNumbers.length === 0);
        if (isGlobal) return true;

        const matchesCourse = t.courses.length === 0 || (user.course && t.courses.includes(user.course));
        const matchesDept = t.departments.length === 0 || (user.department && t.departments.includes(user.department));
        const matchesYear = t.years.length === 0 || (user.year && t.years.includes(user.year));
        const matchesSem = t.semesters.length === 0 || (user.semester && t.semesters.includes(user.semester));
        const matchesSection = t.sections.length === 0 || (user.section && t.sections.includes(user.section));

        // Check groups if specified (assuming user has a group field, or we match by section)
        const matchesGroup = !t.groups || t.groups.length === 0 ||
          (user.section && t.groups.some(g => g.toLowerCase().includes(user.section!.toLowerCase())));

        return matchesCourse && matchesDept && matchesYear && matchesSem && matchesSection && matchesGroup;
      });
    }

    // Add isRead flag for current user
    return filtered.map(n => ({
      ...n,
      isRead: n.readBy?.some(r => r.userId === user.id) ?? false
    }));
  },

  createNotice: async (noticeData: Partial<Notice>): Promise<Notice> => {
    await new Promise(r => setTimeout(r, 500));
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);

    const newNotice: Notice = {
      id: Math.random().toString(36).substr(2, 9),
      title: noticeData.title!,
      description: noticeData.description!,
      category: noticeData.category as any,
      publishedBy: noticeData.publishedBy!,
      publishedByName: noticeData.publishedByName!,
      createdAt: noticeData.createdAt || new Date().toISOString(),
      isPinned: noticeData.isPinned || false,
      eventDate: noticeData.eventDate,
      scheduledPublishDate: noticeData.scheduledPublishDate,
      scheduledPublishTime: noticeData.scheduledPublishTime,
      isScheduled: noticeData.isScheduled || false,
      target: noticeData.target || {
        courses: [],
        departments: [],
        years: [],
        semesters: [],
        sections: [],
        groups: [],
        specificRollNumbers: []
      }
    };

    notices.unshift(newNotice); // Add to top
    saveToStorage(STORAGE_KEYS.NOTICES, notices);
    return newNotice;
  },

  updateNotice: async (id: string, updates: Partial<Notice>): Promise<Notice | null> => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const index = notices.findIndex(n => n.id === id);
    if (index === -1) return null;

    const updatedNotice = { ...notices[index], ...updates };
    notices[index] = updatedNotice;
    saveToStorage(STORAGE_KEYS.NOTICES, notices);
    return updatedNotice;
  },

  deleteNotice: async (id: string) => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const filtered = notices.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTICES, filtered);
  },

  togglePinNotice: async (id: string) => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const updated = notices.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    saveToStorage(STORAGE_KEYS.NOTICES, updated);
    return updated.find(n => n.id === id);
  },

  // Favourites
  toggleFavourite: async (userId: string, noticeId: string) => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const user = users[userIndex];
    const favourites = user.favourites || [];

    if (favourites.includes(noticeId)) {
      user.favourites = favourites.filter(id => id !== noticeId);
    } else {
      user.favourites = [...favourites, noticeId];
    }

    users[userIndex] = user;
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Update current session if it matches
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}');
    if (currentUser.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    return user.favourites;
  },

  // Admin
  getPendingUsers: async () => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.filter(u => u.role === 'student' && !u.isApproved);
  },

  getStudents: async (options: { includePending?: boolean } = {}) => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.filter(u => {
      if (u.role !== 'student') return false;
      if (options.includePending) return true;
      return u.isApproved;
    });
  },

  getFaculty: async () => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.filter(u => u.role === 'faculty');
  },

  updateStudent: async (userId: string, updates: Partial<User>) => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    const updated = updatedUsers.find(u => u.id === userId);
    return updated;
  },

  approveUser: async (userId: string) => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const updated = users.map(u => u.id === userId ? { ...u, isApproved: true } : u);
    saveToStorage(STORAGE_KEYS.USERS, updated);
  },

  getCodes: async () => {
    return getFromStorage<UniqueCode[]>(STORAGE_KEYS.CODES, []);
  },

  generateCode: async (role: Role, desc: string) => {
    const codes = getFromStorage<UniqueCode[]>(STORAGE_KEYS.CODES, []);
    const newCode: UniqueCode = {
      id: Math.random().toString(36).substr(2, 9),
      code: `BBSBEC${Math.floor(100000 + Math.random() * 900000)}`,
      role,
      isUsed: false,
      createdFor: desc
    };
    codes.push(newCode);
    saveToStorage(STORAGE_KEYS.CODES, codes);
    return newCode;
  },

  addUser: async (userData: Partial<User>) => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: userData.fullName || '',
      email: userData.email || '',
      role: userData.role || 'student',
      isApproved: true, // Admin added users are auto-approved
      ...userData
    } as User;

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  deleteCode: async (id: string) => {
    const codes = getFromStorage<UniqueCode[]>(STORAGE_KEYS.CODES, []);
    const filtered = codes.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CODES, filtered);
  },

  // Events / Calendar
  getEvents: async () => {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    return events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  },

  createEvent: async (data: Omit<CalendarEvent, 'id'>) => {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.EVENTS, []);
    const newEvent: CalendarEvent = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    events.push(newEvent);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  updateEvent: async (eventId: string, updates: Partial<CalendarEvent>) => {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.EVENTS, []);
    const updated = events.map(ev => ev.id === eventId ? { ...ev, ...updates } : ev);
    saveToStorage(STORAGE_KEYS.EVENTS, updated);
    return updated.find(ev => ev.id === eventId);
  },

  deleteEvent: async (eventId: string) => {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.EVENTS, []);
    const filtered = events.filter(ev => ev.id !== eventId);
    saveToStorage(STORAGE_KEYS.EVENTS, filtered);
  },

  // User Profile
  getUserProfile: async (userId: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 300));
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Read Receipts
  markNoticeAsRead: async (noticeId: string, userId: string) => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
      if (!notice.readBy) notice.readBy = [];
      if (!notice.readBy.find(r => r.userId === userId)) {
        notice.readBy.push({ userId, readAt: new Date().toISOString() });
        saveToStorage(STORAGE_KEYS.NOTICES, notices);
      }
    }
  },

  // Notifications
  getNotifications: async (userId: string) => {
    await new Promise(r => setTimeout(r, 300));
    // Mock notifications - in real app, fetch from API
    return [];
  },

  markNotificationRead: async (notificationId: string) => {
    // Mock - in real app, update via API
    await new Promise(r => setTimeout(r, 200));
  },

  markAllNotificationsRead: async (userId: string) => {
    // Mock - in real app, update via API
    await new Promise(r => setTimeout(r, 200));
  },

  // Reports
  reportNotice: async (noticeId: string, userId: string, reason: string, description?: string) => {
    await new Promise(r => setTimeout(r, 500));
    // Mock - in real app, save to API
    console.log('Report submitted:', { noticeId, userId, reason, description });
  }
};

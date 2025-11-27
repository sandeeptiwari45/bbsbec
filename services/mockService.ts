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
    isApproved: true,
  },
  {
    id: 'u2',
    fullName: 'Dr. Sharma',
    email: 'faculty@bbsbec.edu',
    role: 'faculty',
    department: 'CSE',
    isApproved: true,
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
    getFromStorage(STORAGE_KEYS.USERS, SEED_USERS);
    getFromStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    getFromStorage(STORAGE_KEYS.CODES, SEED_CODES);
    getFromStorage(STORAGE_KEYS.EVENTS, SEED_EVENTS);
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

  register: async (userData: any, code: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    
    const codes = getFromStorage<UniqueCode[]>(STORAGE_KEYS.CODES, []);
    const validCode = codes.find(c => c.code === code && !c.isUsed);

    if (!validCode) throw new Error('Invalid or expired registration code');

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
    
    if (user.role === 'admin') return notices;
    if (user.role === 'faculty') return notices.filter(n => n.publishedBy === user.id);

    // Student Filter Logic
    return notices.filter(n => {
      const t = n.target;
      // If no target specified, it's for everyone
      const isGlobal = t.courses.length === 0 && t.departments.length === 0 && t.years.length === 0 && t.semesters.length === 0 && t.sections.length === 0;
      if (isGlobal) return true;

      const matchesCourse = t.courses.length === 0 || (user.course && t.courses.includes(user.course));
      const matchesDept = t.departments.length === 0 || (user.department && t.departments.includes(user.department));
      const matchesYear = t.years.length === 0 || (user.year && t.years.includes(user.year));
      const matchesSem = t.semesters.length === 0 || (user.semester && t.semesters.includes(user.semester));
      const matchesSection = t.sections.length === 0 || (user.section && t.sections.includes(user.section));

      return matchesCourse && matchesDept && matchesYear && matchesSem && matchesSection;
    });
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
        createdAt: new Date().toISOString(),
        isPinned: noticeData.isPinned || false,
        eventDate: noticeData.eventDate,
        target: noticeData.target || { courses: [], departments: [], years: [], semesters: [], sections: [] }
    };

    notices.unshift(newNotice); // Add to top
    saveToStorage(STORAGE_KEYS.NOTICES, notices);
    return newNotice;
  },

  deleteNotice: async (id: string) => {
    const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const filtered = notices.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTICES, filtered);
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
         code: `BBSBEC-${role.toUpperCase().slice(0,3)}-${Math.floor(1000 + Math.random() * 9000)}`,
         role,
         isUsed: false,
         createdFor: desc
     };
     codes.push(newCode);
     saveToStorage(STORAGE_KEYS.CODES, codes);
     return newCode;
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
  }
};

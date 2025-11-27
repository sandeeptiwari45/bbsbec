export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  // Student specific fields
  fatherName?: string;
  collegeRollNo?: string;
  universityRollNo?: string;
  course?: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  isApproved?: boolean;
  favourites?: string[]; // Array of notice IDs
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Exam' | 'Holiday' | 'Placement' | 'Cultural' | 'Important';
  publishedBy: string; // User ID
  publishedByName: string;
  createdAt: string; // ISO Date string
  isPinned: boolean;
  eventDate?: string; // ISO Date string for calendar
  target: {
    courses: string[];
    departments: string[];
    years: string[];
    semesters: string[];
    sections: string[];
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  createdBy: string;
  createdByName: string;
}

export interface UniqueCode {
  id: string;
  code: string;
  role: Role;
  isUsed: boolean;
  createdFor?: string; // description
}

export const CATEGORY_COLORS: Record<string, string> = {
  Academic: 'bg-blue-100 text-blue-800 border-blue-200',
  Exam: 'bg-red-100 text-red-800 border-red-200',
  Holiday: 'bg-green-100 text-green-800 border-green-200',
  Placement: 'bg-purple-100 text-purple-800 border-purple-200',
  Cultural: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Important: 'bg-orange-100 text-orange-800 border-orange-200',
};

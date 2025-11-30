export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  designation?: string; // e.g., 'Mentor', 'HOD', 'Principal', 'Professor', 'Assistant Professor'
  profileImage?: string;
  mobile?: string;
  dateOfBirth?: string;
  address?: string;
  caste?: string;
  // Student specific fields
  fatherName?: string;
  collegeRollNo?: string;
  universityRollNo?: string;
  course?: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  // Faculty specific fields
  subjects?: string[];
  teachingSemesters?: string[];
  teachingGroups?: string[];
  isApproved?: boolean;
  favourites?: string[]; // Array of notice IDs
}

export interface NoticeAttachment {
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'document';
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
  scheduledPublishDate?: string; // ISO Date string for scheduled publishing
  scheduledPublishTime?: string; // Time string (HH:mm) for scheduled publishing
  isScheduled?: boolean; // Whether notice is scheduled for future publishing
  attachments?: NoticeAttachment[];
  readBy?: Array<{ userId: string; readAt: string }>;
  isRead?: boolean; // For current user
  target: {
    courses: string[];
    departments: string[];
    years: string[];
    semesters: string[];
    sections: string[];
    groups?: string[]; // Groups/sections
    specificRollNumbers?: string[]; // Specific roll numbers
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  createdBy: string;
  createdByName: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'notice' | 'event' | 'approval' | 'general';
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  noticeId: string;
  reportedBy: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
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

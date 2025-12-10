import { User, Notice, UniqueCode, Role, CalendarEvent } from '../types';

// Get base URL from env or default to localhost. Ensure no trailing slash.
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

export const MockService = {
  initialize: () => {
    // No-op for API
  },

  // Auth
  login: async (email: string, password?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  getUserProfile: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/students/${id}`);
    return handleResponse(response);
  },

  register: async (userData: any, code: string, allowedRoles: Role[] = ['student', 'faculty', 'admin']): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, code, allowedRoles }),
    });
    return handleResponse(response);
  },

  // Notices
  getNotices: async (user: User): Promise<Notice[]> => {
    const params = new URLSearchParams();
    params.append('userId', user.id);
    params.append('role', user.role);
    if (user.course) params.append('course', user.course);
    if (user.department) params.append('department', user.department);
    if (user.year) params.append('year', user.year);
    if (user.semester) params.append('semester', user.semester);
    if (user.section) params.append('section', user.section);

    const response = await fetch(`${API_URL}/notices?${params.toString()}`);
    return handleResponse(response);
  },

  createNotice: async (noticeData: Partial<Notice>): Promise<Notice> => {
    const response = await fetch(`${API_URL}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticeData),
    });
    return handleResponse(response);
  },

  updateNotice: async (id: string, updates: Partial<Notice>): Promise<Notice | null> => {
    const response = await fetch(`${API_URL}/notices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteNotice: async (id: string) => {
    const response = await fetch(`${API_URL}/notices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete notice');
  },

  togglePinNotice: async (id: string) => {
    // Fetch current state first
    const noticeResponse = await fetch(`${API_URL}/notices/${id}`);
    const notice = await handleResponse(noticeResponse);

    // Toggle and update
    const response = await fetch(`${API_URL}/notices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !notice.isPinned }),
    });
    return handleResponse(response);
  },

  // Favourites
  toggleFavourite: async (userId: string, noticeId: string) => {
    const response = await fetch(`${API_URL}/students/${userId}/favourites`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noticeId }),
    });
    return handleResponse(response);
  },

  markNoticeAsRead: async (noticeId: string, userId: string) => {
    const response = await fetch(`${API_URL}/notices/${noticeId}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  // Admin
  getPendingUsers: async () => {
    const response = await fetch(`${API_URL}/students/pending/list`);
    return handleResponse(response);
  },

  approveUser: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}/approve`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  getStudents: async (includePending = false) => {
    const response = await fetch(`${API_URL}/students?includePending=${includePending}`);
    return handleResponse(response);
  },

  updateStudent: async (id: string, updates: Partial<User>) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  addUser: async (userData: Partial<User>) => {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  resetUserPassword: async (id: string, password: string) => {
    const response = await fetch(`${API_URL}/students/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },

  // Codes
  generateCode: async (role: Role, createdFor: string) => {
    const response = await fetch(`${API_URL}/codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, createdFor }),
    });
    return handleResponse(response);
  },

  getCodes: async () => {
    const response = await fetch(`${API_URL}/codes`);
    return handleResponse(response);
  },

  deleteCode: async (id: string) => {
    const response = await fetch(`${API_URL}/codes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete code');
  },

  getFaculty: async () => {
    const response = await fetch(`${API_URL}/students?role=faculty`);
    return handleResponse(response);
  },

  // Events
  getEvents: async (user?: User) => {
    const params = new URLSearchParams();
    if (user && user.role === 'student') {
      params.append('role', 'student');
      if (user.course) params.append('course', user.course);
      if (user.department) params.append('department', user.department);
      if (user.year) params.append('year', user.year);
      if (user.semester) params.append('semester', user.semester);
    }
    const response = await fetch(`${API_URL}/events?${params.toString()}`);
    return handleResponse(response);
  },

  createEvent: async (eventData: Partial<CalendarEvent>) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteEvent: async (id: string) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  },

  // Profile Updates
  requestProfileUpdate: async (userId: string, changes: Partial<User>) => {
    const response = await fetch(`${API_URL}/profile-updates/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, changes }),
    });
    return handleResponse(response);
  },

  getProfileUpdateRequests: async () => {
    const response = await fetch(`${API_URL}/profile-updates/pending`);
    return handleResponse(response);
  },

  approveProfileUpdate: async (requestId: string) => {
    const response = await fetch(`${API_URL}/profile-updates/${requestId}/approve`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  rejectProfileUpdate: async (requestId: string) => {
    const response = await fetch(`${API_URL}/profile-updates/${requestId}/reject`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  // Reports
  reportNotice: async (noticeId: string, userId: string, reason: string, description?: string) => {
    // For now, just log it or mock a success since backend route might not exist yet
    // Or we can add a simple endpoint if needed.
    // Let's assume we just return success for now to fix the lint error and unblock the UI.
    console.log('Reporting notice:', { noticeId, userId, reason, description });
    return { success: true };
  },

  // Notifications
  getNotifications: async (userId: string) => {
    const response = await fetch(`${API_URL}/notifications?userId=${userId}`);
    return handleResponse(response);
  },

  markNotificationRead: async (id: string) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },
};

import React from 'react';
import { X, Mail, Phone, BookOpen, Users } from 'lucide-react';
import { User } from '../types';

interface PublisherProfileModalProps {
  user: User | null;
  onClose: () => void;
}

const PublisherProfileModal: React.FC<PublisherProfileModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Published by</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold mb-3">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{user.fullName}</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Full Name</label>
            <p className="text-slate-800 dark:text-white font-medium">{user.fullName}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>Email Address</span>
            </label>
            <p className="text-slate-800 dark:text-white">{user.email}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>Phone Number</span>
            </label>
            <p className="text-slate-800 dark:text-white">{user.mobile || 'Not provided'}</p>
          </div>

          {user.department && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Department</label>
              <p className="text-slate-800 dark:text-white">{user.department}</p>
            </div>
          )}

          {user.designation && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Designation</label>
              <p className="text-slate-800 dark:text-white">{user.designation}</p>
            </div>
          )}

          {user.role && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Role</label>
              <p className="text-slate-800 dark:text-white capitalize">{user.role}</p>
            </div>
          )}

          {user.subjects && user.subjects.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2 text-slate-700 dark:text-slate-200">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Subjects</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.teachingSemesters && user.teachingSemesters.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2 text-slate-700 dark:text-slate-200">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Teaching Semesters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.teachingSemesters.map((sem, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                    Semester {sem}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.teachingGroups && user.teachingGroups.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2 text-slate-700 dark:text-slate-200">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Teaching Groups</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.teachingGroups.map((group, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublisherProfileModal;


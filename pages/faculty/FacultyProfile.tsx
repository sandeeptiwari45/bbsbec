import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { User } from '../../types';
import { Mail, Phone, MapPin, BookOpen, Users, GraduationCap, Building2 } from 'lucide-react';

const FacultyProfile: React.FC = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    const profile = await MockService.getUserProfile(currentUser.id);
    setUser(profile);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-red-500">Failed to load profile</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">My Profile</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-4xl font-bold">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{user.fullName}</h2>
            {user.designation ? (
              <p className="text-slate-600 dark:text-slate-400 font-medium">{user.designation}</p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 font-medium capitalize">{user.role}</p>
            )}
            {user.mobile && (
              <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center md:justify-start space-x-2 mt-1">
                <Phone className="w-4 h-4" />
                <span>{user.mobile}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Personal Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>Email Address</span>
              </label>
              <p className="text-slate-800 dark:text-white mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Mobile Number</span>
              </label>
              <p className="text-slate-800 dark:text-white mt-1">{user.mobile || 'Not provided'}</p>
            </div>

            {user.address && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Address</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.address}</p>
              </div>
            )}

            {user.designation && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Designation</label>
                <p className="text-slate-800 dark:text-white mt-1">{user.designation}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Role</label>
              <p className="text-slate-800 dark:text-white mt-1 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Professional Information
            </h3>

            {user.department && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                  <Building2 className="w-3 h-3" />
                  <span>Department</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.department}</p>
              </div>
            )}

            {user.subjects && user.subjects.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Subjects</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Teaching Semesters</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Teaching Groups</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.teachingGroups.map((group, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>Status</span>
              </label>
              <p className="text-slate-800 dark:text-white mt-1">
                {user.isApproved ? (
                  <span className="text-green-600 dark:text-green-400">Active / Approved</span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400">Pending Approval</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;


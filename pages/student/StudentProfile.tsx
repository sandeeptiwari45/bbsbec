import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { User } from '../../types';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, BookOpen, Hash, GraduationCap, CheckCircle } from 'lucide-react';

const StudentProfile: React.FC = () => {
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
    return <div className="text-center py-12 text-slate-500">Loading profile...</div>;
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
            <p className="text-slate-600 dark:text-slate-400 capitalize">{user.role}</p>
            {user.course && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {user.course}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Personal Information
            </h3>

            {user.fatherName && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Father's Name</label>
                <p className="text-slate-800 dark:text-white mt-1">{user.fatherName}</p>
              </div>
            )}

            {user.dateOfBirth && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Date of Birth</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}

            {user.address && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Address</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.address}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Mobile Number</span>
              </label>
              <p className="text-slate-800 dark:text-white mt-1">{user.mobile || 'Not provided'}</p>
            </div>

            {user.caste && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Caste / Category</label>
                <p className="text-slate-800 dark:text-white mt-1">{user.caste}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>Email Address</span>
              </label>
              <p className="text-slate-800 dark:text-white mt-1">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Academic Information
            </h3>

            {user.collegeRollNo && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                  <Hash className="w-3 h-3" />
                  <span>College Roll Number</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.collegeRollNo}</p>
              </div>
            )}

            {user.universityRollNo && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                  <Hash className="w-3 h-3" />
                  <span>University Roll Number</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.universityRollNo}</p>
              </div>
            )}

            {user.course && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Program / Course</span>
                </label>
                <p className="text-slate-800 dark:text-white mt-1">{user.course}</p>
              </div>
            )}

            {user.department && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Branch</label>
                <p className="text-slate-800 dark:text-white mt-1">{user.department}</p>
              </div>
            )}

            {user.year && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Year</label>
                <p className="text-slate-800 dark:text-white mt-1">{user.year}</p>
              </div>
            )}

            {user.semester && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Semester</label>
                <p className="text-slate-800 dark:text-white mt-1">Semester {user.semester}</p>
              </div>
            )}

            {user.section && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Group / Section</label>
                <p className="text-slate-800 dark:text-white mt-1">Section {user.section}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>Enrollment Status</span>
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

export default StudentProfile;


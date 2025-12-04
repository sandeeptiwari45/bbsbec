import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { User } from '../../types';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, BookOpen, Hash, GraduationCap, CheckCircle, Edit2, X, AlertCircle } from 'lucide-react';

const StudentProfile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const showNotificationMsg = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    const profile = await MockService.getUserProfile(currentUser.id);
    setUser(profile);
    setEditFormData(profile);
    setLoading(false);
  };

  const handleEditClick = () => {
    if (user) {
      setEditFormData({
        fullName: user.fullName,
        fatherName: user.fatherName,
        mobile: user.mobile,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        caste: user.caste,
        collegeRollNo: user.collegeRollNo,
        universityRollNo: user.universityRollNo,
        course: user.course,
        department: user.department,
        year: user.year,
        semester: user.semester,
        section: user.section,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setRequestStatus('submitting');
    try {
      await MockService.requestProfileUpdate(currentUser.id, editFormData);
      setRequestStatus('success');
      setIsEditModalOpen(false);
      showNotificationMsg('Profile update request submitted successfully!');
      setRequestStatus('idle');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request');
      setRequestStatus('error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12 text-red-500">Failed to load profile</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
        <button
          onClick={handleEditClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitRequest} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {requestStatus === 'error' && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm mb-4">
                  Note: Changes will not be reflected immediately. They must be approved by an administrator.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Details */}
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 border-b pb-1">Personal Details</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      name="fullName"
                      value={editFormData.fullName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Father's Name</label>
                    <input
                      name="fatherName"
                      value={editFormData.fatherName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                    <input
                      name="mobile"
                      value={editFormData.mobile || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editFormData.dateOfBirth ? new Date(editFormData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input
                      name="address"
                      value={editFormData.address || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Academic Details */}
                  <div className="md:col-span-2 mt-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 border-b pb-1">Academic Details</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College Roll No</label>
                    <input
                      name="collegeRollNo"
                      value={editFormData.collegeRollNo || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Uni. Roll No</label>
                    <input
                      name="universityRollNo"
                      value={editFormData.universityRollNo || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                    <select
                      name="course"
                      value={editFormData.course || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Course</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Voc">B.Voc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <select
                      name="department"
                      value={editFormData.department || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="IT">IT</option>
                      <option value="Computer Applications">Computer Applications</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                    <select
                      name="year"
                      value={editFormData.year || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                    <select
                      name="semester"
                      value={editFormData.semester || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <option key={i} value={i}>Semester {i}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
                    <select
                      name="section"
                      value={editFormData.section || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestStatus === 'submitting'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {requestStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-900 text-slate-800 dark:text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Success</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{notification}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

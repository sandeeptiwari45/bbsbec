import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Notice, User } from '../../types';
import { Plus, Trash2, Edit2, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventManager from '../../components/EventManager';

const FacultyDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [myNotices, setMyNotices] = useState<Notice[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    course: '',
    department: '',
    year: '',
    section: '',
    collegeRollNo: '',
    email: '',
  });
  const [savingStudent, setSavingStudent] = useState(false);
  const canManageNotices = user?.role === 'faculty' || user?.role === 'admin';
  const canCreateNotices = user?.role === 'faculty';
  const canEditStudents = user?.role === 'admin'; // Only admin can edit students
  const canManageEvents = user?.role === 'admin'; // Only admin can manage events
  const canViewStudents = user?.role === 'admin'; // Only admin can view student directory

  useEffect(() => {
    if (user) {
      MockService.getNotices(user).then(setMyNotices);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    MockService.getStudents()
      .then(list => {
        if (isMounted) setStudents(list);
      })
      .finally(() => {
        if (isMounted) setLoadingStudents(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!canManageNotices) return;
    if (confirm('Are you sure you want to delete this notice?')) {
      await MockService.deleteNotice(id);
      setMyNotices(myNotices.filter(n => n.id !== id));
    }
  };

  const beginEditStudent = (student: User) => {
    setEditingStudent(student);
    setStudentForm({
      fullName: student.fullName || '',
      course: student.course || '',
      department: student.department || '',
      year: student.year || '',
      section: student.section || '',
      collegeRollNo: student.collegeRollNo || '',
      email: student.email || '',
    });
  };

  const handleStudentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSavingStudent(true);
    const updated = await MockService.updateStudent(editingStudent.id, studentForm);
    if (updated) {
      setStudents(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      setEditingStudent(updated);
    }
    setSavingStudent(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{canManageNotices ? 'My Notices' : 'Faculty Notices'}</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            className={`p-2 rounded-lg border transition-colors ${showFavouritesOnly
              ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-400'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            title={showFavouritesOnly ? "Show All Notices" : "Show Favourites Only"}
          >
            <Star className={`w-5 h-5 ${showFavouritesOnly ? 'fill-current' : ''}`} />
          </button>

          {canCreateNotices && (
            <Link to="/faculty/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap">
              <Plus className="w-5 h-5" />
              <span>Create New</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Title</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Published</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Target</th>
              {canManageNotices && (
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {myNotices
              .filter(notice => {
                const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  notice.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFav = showFavouritesOnly ? user?.favourites?.includes(notice.id) : true;
                return matchesSearch && matchesFav;
              })
              .map(notice => (
                <tr key={notice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-white">{notice.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{notice.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {notice.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {notice.target.courses.length > 0 ? notice.target.courses.join(', ') : 'All'}
                  </td>
                  {canManageNotices && (
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={async () => {
                          if (user) {
                            await MockService.toggleFavourite(user.id, notice.id);
                            // Refresh user data to get updated favourites
                            const updatedUser = await MockService.login(user.email);
                            updateUser(updatedUser);
                          }
                        }}
                        className={`hover:text-yellow-500 transition-colors ${user?.favourites?.includes(notice.id) ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`}
                        title={user?.favourites?.includes(notice.id) ? "Remove from Favourites" : "Add to Favourites"}
                      >
                        <Star className={`w-4 h-4 ${user?.favourites?.includes(notice.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(notice.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  )}
                </tr>
              ))}
            {myNotices.length === 0 && (
              <tr>
                <td colSpan={canManageNotices ? 5 : 4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No notices to display yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canViewStudents && (
        <div className="mt-12 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Student Directory</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{students.length} students</span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {loadingStudents ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No approved students found.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Program</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Roll No.</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Contact</th>
                    {canEditStudents && (
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 dark:text-white">{student.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{student.section ? `Section ${student.section}` : 'General'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {student.course} • {student.department} ({student.year})
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {student.collegeRollNo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{student.email}</td>
                      {canEditStudents && (
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => beginEditStudent(student)} className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {canEditStudents && editingStudent && (
            <form onSubmit={handleStudentSave} className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Edit Student Details</h3>
                  <p className="text-sm text-slate-500">{editingStudent.fullName}</p>
                </div>
                <button type="button" onClick={() => setEditingStudent(null)} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fullName}
                    onChange={e => setStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={e => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Course</label>
                  <input
                    type="text"
                    value={studentForm.course}
                    onChange={e => setStudentForm(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Department</label>
                  <input
                    type="text"
                    value={studentForm.department}
                    onChange={e => setStudentForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Year</label>
                  <input
                    type="text"
                    value={studentForm.year}
                    onChange={e => setStudentForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Section</label>
                  <input
                    type="text"
                    value={studentForm.section}
                    onChange={e => setStudentForm(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">College Roll No.</label>
                  <input
                    type="text"
                    value={studentForm.collegeRollNo}
                    onChange={e => setStudentForm(prev => ({ ...prev, collegeRollNo: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {savingStudent ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {canManageEvents && (
        <div className="mt-12">
          <EventManager
            title="Events Calendar"
            description="Plan faculty and student facing activities."
            canCreate={canManageEvents}
            allowAllActions={user?.role === 'admin'}
          />
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;

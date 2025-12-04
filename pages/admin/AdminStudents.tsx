import React, { useState, useEffect } from 'react';
import { MockService } from '../../services/mockService';
import { User } from '../../types';
import { Search, Filter, Edit2, Trash2, MoreVertical, Eye, X, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminStudents: React.FC = () => {
    const location = useLocation();
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('All');
    const [filterDept, setFilterDept] = useState('All');
    const [filterYear, setFilterYear] = useState('All');

    const [viewStudent, setViewStudent] = useState<User | null>(null);
    const [editStudent, setEditStudent] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<Partial<User>>({
        role: 'student',
        course: 'B.Tech',
        department: 'CSE',
        year: '1st',
        semester: '1',
        section: 'A'
    });

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        if (location.state && (location.state as any).viewUserId && students.length > 0) {
            const userId = (location.state as any).viewUserId;
            const student = students.find(s => s.id === userId);
            if (student) {
                setViewStudent(student);
            }
        }
    }, [location.state, students]);

    const loadStudents = async () => {
        setLoading(true);
        const list = await MockService.getStudents();
        setStudents(list);
        setLoading(false);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.collegeRollNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = filterCourse === 'All' || student.course === filterCourse;
        const matchesDept = filterDept === 'All' || student.department === filterDept;
        const matchesYear = filterYear === 'All' || student.year === filterYear;

        return matchesSearch && matchesCourse && matchesDept && matchesYear;
    });

    const handleEditClick = (student: User) => {
        setEditStudent(student);
        setEditForm({ ...student });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editStudent) return;

        await MockService.updateStudent(editStudent.id, editForm);
        setEditStudent(null);
        loadStudents();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (createForm.password !== (createForm as any).confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        await MockService.addUser(createForm);
        setShowCreateModal(false);
        setCreateForm({
            role: 'student',
            course: 'B.Tech',
            department: 'CSE',
            year: '1st',
            semester: '1',
            section: 'A',
            fullName: '',
            email: '',
            collegeRollNo: '',
            password: '',
            fatherName: '',
            gender: '',
            dateOfBirth: '',
            mobile: '',
            address: ''
        } as any);
        loadStudents();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            await MockService.deleteUser(id);
            loadStudents();
        }
    };

    const [passwordModal, setPasswordModal] = useState<{ show: boolean; userId: string | null; name: string }>({
        show: false,
        userId: null,
        name: ''
    });
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordModal.userId && newPassword) {
            await MockService.resetUserPassword(passwordModal.userId, newPassword);
            setPasswordModal({ show: false, userId: null, name: '' });
            setNewPassword('');
            alert('Password updated successfully');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Directory</h1>
                <div className="flex gap-2">
                    <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Student</button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="All">Course</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                            <option value="MBA">MBA</option>
                        </select>
                    </div>
                    <div className="w-full md:w-32">
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="All">Dept</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="ME">ME</option>
                            <option value="Civil">Civil</option>
                        </select>
                    </div>
                    <div className="w-full md:w-32">
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="All">Year</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">No students found matching your criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Student</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Academic Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs overflow-hidden">
                                                    {student.profileImage ? (
                                                        <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        student.fullName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-white text-sm">{student.fullName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.collegeRollNo || 'No Roll No'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <p>{student.course} - {student.department}</p>
                                            <p className="text-xs text-slate-500">Year {student.year} • Sem {student.semester} • Sec {student.section}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <p>{student.email}</p>
                                            <p className="text-xs text-slate-500">{student.mobile || 'No Mobile'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.isApproved ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button onClick={() => setViewStudent(student)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEditClick(student)} className="p-1 text-slate-400 hover:text-green-600 transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setPasswordModal({ show: true, userId: student.id, name: student.fullName })} className="p-1 text-slate-400 hover:text-yellow-600 transition-colors" title="Change Password">
                                                    <div className="w-4 h-4 font-bold">🔑</div>
                                                </button>
                                                <button onClick={() => handleDelete(student.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {viewStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Student Details</h3>
                            <button onClick={() => setViewStudent(null)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold overflow-hidden">
                                    {viewStudent.profileImage ? (
                                        <img src={viewStudent.profileImage} alt={viewStudent.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        viewStudent.fullName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 dark:text-white">{viewStudent.fullName}</h4>
                                    <p className="text-slate-500 dark:text-slate-400">{viewStudent.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Roll No</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.collegeRollNo}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Course</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.course}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Department</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.department}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Year/Sem</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.year} / Sem {viewStudent.semester}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Father's Name</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.fatherName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Mobile</label>
                                    <p className="text-slate-800 dark:text-white">{viewStudent.mobile || '-'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 text-right">
                            <button onClick={() => setViewStudent(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add New Student</h3>
                            <button onClick={() => setShowCreateModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.fullName || ''}
                                        onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Father's Name</label>
                                    <input
                                        type="text"
                                        value={createForm.fatherName || ''}
                                        onChange={e => setCreateForm({ ...createForm, fatherName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roll No</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.collegeRollNo || ''}
                                        onChange={e => setCreateForm({ ...createForm, collegeRollNo: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.email || ''}
                                        onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                                    <input
                                        type="text"
                                        value={createForm.mobile || ''}
                                        onChange={e => setCreateForm({ ...createForm, mobile: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                    <select
                                        value={createForm.gender || ''}
                                        onChange={e => setCreateForm({ ...createForm, gender: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={createForm.password || ''}
                                        onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={(createForm as any).confirmPassword || ''}
                                        onChange={e => setCreateForm({ ...createForm, confirmPassword: e.target.value } as any)}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={createForm.dateOfBirth ? new Date(createForm.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={e => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                                    <select
                                        value={createForm.course}
                                        onChange={e => setCreateForm({ ...createForm, course: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="BCA">BCA</option>
                                        <option value="MCA">MCA</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                    <select
                                        value={createForm.department}
                                        onChange={e => setCreateForm({ ...createForm, department: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="ME">ME</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                                    <select
                                        value={createForm.year}
                                        onChange={e => setCreateForm({ ...createForm, year: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="1st">1st</option>
                                        <option value="2nd">2nd</option>
                                        <option value="3rd">3rd</option>
                                        <option value="4th">4th</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                                    <input
                                        type="text"
                                        value={createForm.semester || ''}
                                        onChange={e => setCreateForm({ ...createForm, semester: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
                                    <input
                                        type="text"
                                        value={createForm.section || ''}
                                        onChange={e => setCreateForm({ ...createForm, section: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={createForm.address || ''}
                                        onChange={e => setCreateForm({ ...createForm, address: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Image</label>
                                    {createForm.profileImage && (
                                        <div className="mb-2">
                                            <img src={createForm.profileImage} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border border-slate-200" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setCreateForm({ ...createForm, profileImage: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Student</h3>
                            <button onClick={() => setEditStudent(null)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.fullName || ''}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email || ''}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roll No</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.collegeRollNo || ''}
                                        onChange={e => setEditForm({ ...editForm, collegeRollNo: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                                    <select
                                        value={editForm.course}
                                        onChange={e => setEditForm({ ...editForm, course: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="BCA">BCA</option>
                                        <option value="MCA">MCA</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                    <select
                                        value={editForm.department}
                                        onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="ME">ME</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                                    <select
                                        value={editForm.year}
                                        onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="1st">1st</option>
                                        <option value="2nd">2nd</option>
                                        <option value="3rd">3rd</option>
                                        <option value="4th">4th</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                                    <input
                                        type="text"
                                        value={editForm.semester || ''}
                                        onChange={e => setEditForm({ ...editForm, semester: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
                                    <input
                                        type="text"
                                        value={editForm.section || ''}
                                        onChange={e => setEditForm({ ...editForm, section: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Father's Name</label>
                                    <input
                                        type="text"
                                        value={editForm.fatherName || ''}
                                        onChange={e => setEditForm({ ...editForm, fatherName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                                    <input
                                        type="text"
                                        value={editForm.mobile || ''}
                                        onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Image</label>
                                    {editForm.profileImage && (
                                        <div className="mb-2">
                                            <img src={editForm.profileImage} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border border-slate-200" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditForm({ ...editForm, profileImage: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onClick={() => setEditStudent(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {passwordModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Reset Password</h3>
                            <button onClick={() => setPasswordModal({ show: false, userId: null, name: '' })}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
                            <p className="text-slate-600 dark:text-slate-300">Reset password for <strong>{passwordModal.name}</strong></p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setPasswordModal({ show: false, userId: null, name: '' })} className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;

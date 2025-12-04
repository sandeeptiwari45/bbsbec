import React, { useState, useEffect } from 'react';
import { MockService } from '../../services/mockService';
import { User } from '../../types';
import { Search, Edit2, Trash2, Mail, Phone, Building2, BookOpen, X, Save } from 'lucide-react';

import { useLocation } from 'react-router-dom';

const AdminFaculty: React.FC = () => {
    const location = useLocation();
    const [faculty, setFaculty] = useState<User[]>([]);

    useEffect(() => {
        if (location.state && (location.state as any).viewUserId && faculty.length > 0) {
            const userId = (location.state as any).viewUserId;
            const user = faculty.find(f => f.id === userId);
            if (user) {
                setViewFaculty(user);
            }
        }
    }, [location.state, faculty]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterDesignation, setFilterDesignation] = useState('All');

    const [viewFaculty, setViewFaculty] = useState<User | null>(null);
    const [editFaculty, setEditFaculty] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<Partial<User>>({
        role: 'faculty',
        department: 'CSE',
        designation: 'Assistant Professor'
    });

    useEffect(() => {
        loadFaculty();
    }, []);

    const loadFaculty = async () => {
        setLoading(true);
        const list = await MockService.getFaculty();
        setFaculty(list);
        setLoading(false);
    };

    const filteredFaculty = faculty.filter(f => {
        const matchesSearch = f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.department && f.department.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDept = filterDept === 'All' || f.department === filterDept;
        const matchesDesignation = filterDesignation === 'All' || f.designation === filterDesignation;

        return matchesSearch && matchesDept && matchesDesignation;
    });

    const handleEditClick = (f: User) => {
        setEditFaculty(f);
        setEditForm({ ...f });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFaculty) return;

        await MockService.updateStudent(editFaculty.id, editForm); // Reusing updateStudent as it updates User collection
        setEditFaculty(null);
        loadFaculty();
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
            role: 'faculty',
            department: 'CSE',
            designation: 'Assistant Professor',
            fullName: '',
            email: '',
            mobile: '',
            password: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            shortName: ''
        } as any);
        loadFaculty();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
            await MockService.deleteUser(id);
            loadFaculty();
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
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Faculty Directory</h1>
                <div className="flex gap-2">
                    <div className="flex gap-2">
                        <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Faculty</button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="All">Department</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="ME">ME</option>
                            <option value="Civil">Civil</option>
                        </select>
                    </div>
                    <div className="w-full md:w-40">
                        <select
                            value={filterDesignation}
                            onChange={(e) => setFilterDesignation(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="All">Designation</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Professor">Professor</option>
                            <option value="HOD">HOD</option>
                            <option value="Lab Assistant">Lab Assistant</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">Loading faculty...</div>
                ) : filteredFaculty.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">No faculty members found.</div>
                ) : (
                    filteredFaculty.map(f => (
                        <div key={f.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg overflow-hidden">
                                        {f.profileImage ? (
                                            <img src={f.profileImage} alt={f.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            f.fullName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{f.fullName}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{f.designation || 'Faculty'}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button onClick={() => handleEditClick(f)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setPasswordModal({ show: true, userId: f.id, name: f.fullName })} className="p-1 text-slate-400 hover:text-yellow-600 transition-colors" title="Change Password">
                                        <div className="w-4 h-4 font-bold">🔑</div>
                                    </button>
                                    <button onClick={() => handleDelete(f.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="truncate">{f.email}</span>
                                </div>
                                {f.mobile && (
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                        <Phone className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>{f.mobile}</span>
                                    </div>
                                )}
                                {f.department && (
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                        <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>{f.department}</span>
                                    </div>
                                )}
                                {f.subjects && f.subjects.length > 0 && (
                                    <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                                        <BookOpen className="w-4 h-4 mr-2 text-slate-400 mt-0.5" />
                                        <div className="flex flex-wrap gap-1">
                                            {f.subjects.slice(0, 3).map((s, i) => (
                                                <span key={i} className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{s}</span>
                                            ))}
                                            {f.subjects.length > 3 && <span className="text-xs text-slate-400">+{f.subjects.length - 3} more</span>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${f.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {f.isApproved ? 'Active' : 'Pending'}
                                </span>
                                <button onClick={() => setViewFaculty(f)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Profile</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View Modal */}
            {viewFaculty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Faculty Details</h3>
                            <button onClick={() => setViewFaculty(null)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold overflow-hidden">
                                    {viewFaculty.profileImage ? (
                                        <img src={viewFaculty.profileImage} alt={viewFaculty.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        viewFaculty.fullName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 dark:text-white">{viewFaculty.fullName}</h4>
                                    <p className="text-slate-500 dark:text-slate-400">{viewFaculty.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Designation</label>
                                    <p className="text-slate-800 dark:text-white">{viewFaculty.designation || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Department</label>
                                    <p className="text-slate-800 dark:text-white">{viewFaculty.department || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Mobile</label>
                                    <p className="text-slate-800 dark:text-white">{viewFaculty.mobile || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold">Status</label>
                                    <p className={viewFaculty.isApproved ? 'text-green-600' : 'text-yellow-600'}>
                                        {viewFaculty.isApproved ? 'Active' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                            {viewFaculty.subjects && viewFaculty.subjects.length > 0 && (
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-semibold block mb-2">Subjects</label>
                                    <div className="flex flex-wrap gap-2">
                                        {viewFaculty.subjects.map((s, i) => (
                                            <span key={i} className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-700 dark:text-slate-300">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 text-right">
                            <button onClick={() => setViewFaculty(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editFaculty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Faculty</h3>
                            <button onClick={() => setEditFaculty(null)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.fullName || ''}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Name</label>
                                    <input
                                        type="text"
                                        value={editForm.shortName || ''}
                                        onChange={e => setEditForm({ ...editForm, shortName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="e.g. JPS"
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email || ''}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        value={editForm.designation || ''}
                                        onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={editForm.department || ''}
                                        onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={editForm.address || ''}
                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
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
                                <button type="button" onClick={() => setEditFaculty(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add New Faculty</h3>
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={createForm.shortName || ''}
                                        onChange={e => setCreateForm({ ...createForm, shortName: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="e.g. JPS"
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        value={createForm.designation || ''}
                                        onChange={e => setCreateForm({ ...createForm, designation: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={createForm.dateOfBirth ? new Date(createForm.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={e => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
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
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                    <Save className="w-4 h-4 mr-2" /> Create Faculty
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
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Enter new password for <strong>{passwordModal.name}</strong>
                            </p>
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
                                <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFaculty;

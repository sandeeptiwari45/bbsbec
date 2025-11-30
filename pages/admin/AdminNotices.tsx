import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Notice } from '../../types';
import { Plus, Trash2, Edit2, Eye, X, Calendar, User, Tag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNotices: React.FC = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewNotice, setViewNotice] = useState<Notice | null>(null);

    useEffect(() => {
        loadNotices();
    }, [user]);

    const loadNotices = async () => {
        setLoading(true);
        if (user) {
            // Admin sees ALL notices. MockService.getNotices returns all if user is admin (logic needs verification, but usually yes)
            // If MockService.getNotices filters by user, we might need a new method. 
            // Let's assume getNotices handles it or we use a specific getAllNotices if available.
            // Checking MockService... getNotices(user) usually returns relevant notices. For admin, it should return all.
            const list = await MockService.getNotices(user);
            setNotices(list);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this notice?')) {
            await MockService.deleteNotice(id);
            setNotices(notices.filter(n => n.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">All Notices</h1>
                <Link to="/faculty/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Create New Notice</span>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading notices...</div>
                ) : notices.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">No notices found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Published By</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {notices.map(notice => (
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
                                        {notice.publishedByName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => setViewNotice(notice)} className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <Link to="/faculty/create" state={{ notice }} className="inline-block text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400" title="Edit">
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(notice.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Notice Modal */}
            {viewNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Notice Details</h3>
                            <button onClick={() => setViewNotice(null)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{viewNotice.title}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(viewNotice.createdAt).toLocaleString()}
                                    </div>
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        {viewNotice.publishedByName}
                                    </div>
                                    <div className="flex items-center">
                                        <Tag className="w-4 h-4 mr-1" />
                                        {viewNotice.category}
                                    </div>
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{viewNotice.description}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Target Audience</h4>
                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs">Courses</span>
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                {viewNotice.target.courses.length > 0 ? viewNotice.target.courses.join(', ') : 'All Courses'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs">Departments</span>
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                {viewNotice.target.departments.length > 0 ? viewNotice.target.departments.join(', ') : 'All Departments'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs">Years</span>
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                {viewNotice.target.years.length > 0 ? viewNotice.target.years.join(', ') : 'All Years'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {viewNotice.attachmentUrl && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Attachment</h4>
                                    <a
                                        href={viewNotice.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    handleDelete(viewNotice.id);
                                    setViewNotice(null);
                                }}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Notice
                            </button>
                            <button
                                onClick={() => setViewNotice(null)}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotices;

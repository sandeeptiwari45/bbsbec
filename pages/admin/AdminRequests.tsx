import React, { useEffect, useState } from 'react';
import { MockService } from '../../services/mockService';
import { CheckCircle, XCircle, Clock, User, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileRequest {
    id: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        collegeRollNo: string;
    };
    requestedChanges: any;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

import { useLocation } from 'react-router-dom';

const AdminRequests: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'registrations' | 'updates'>('registrations');
    const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
    const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state && (location.state as any).activeTab) {
            setActiveTab((location.state as any).activeTab);
        }
    }, [location]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'updates') {
                const data = await MockService.getProfileUpdateRequests();
                setProfileRequests(data);
            } else {
                const data = await MockService.getPendingUsers();
                setPendingUsers(data);
            }
        } catch (error) {
            console.error('Failed to load requests', error);
        } finally {
            setLoading(false);
        }
    };

    // Profile Update Handlers
    const handleApproveUpdate = async (id: string) => {
        if (window.confirm('Are you sure you want to approve these changes?')) {
            try {
                await MockService.approveProfileUpdate(id);
                loadData();
            } catch (error) {
                alert('Failed to approve request');
            }
        }
    };

    const handleRejectUpdate = async (id: string) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                await MockService.rejectProfileUpdate(id);
                loadData();
            } catch (error) {
                alert('Failed to reject request');
            }
        }
    };

    // Registration Handlers
    const handleRejectUser = async (id: string) => {
        if (window.confirm('Are you sure you want to reject this registration request? This will delete the user account.')) {
            try {
                await MockService.deleteUser(id);
                loadData();
            } catch (error) {
                alert('Failed to reject user');
            }
        }
    };

    const handleApproveUser = async (id: string) => {
        try {
            await MockService.approveUser(id);
            loadData();
        } catch (error) {
            alert('Failed to approve user');
        }
    };

    const formatFieldName = (key: string) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Approvals & Requests</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'registrations'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>New Registrations</span>
                        {pendingUsers.length > 0 && activeTab !== 'registrations' && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{pendingUsers.length}</span>
                        )}
                    </div>
                    {activeTab === 'registrations' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('updates')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'updates'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Profile Updates</span>
                        {profileRequests.length > 0 && activeTab !== 'updates' && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{profileRequests.length}</span>
                        )}
                    </div>
                    {activeTab === 'updates' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading requests...</div>
            ) : (
                <div className="space-y-6">
                    {activeTab === 'registrations' && (
                        <>
                            {pendingUsers.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserPlus className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">No Pending Registrations</h3>
                                    <p className="text-slate-500 dark:text-slate-400">All student registration requests have been processed.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {pendingUsers.map(u => (
                                        <div key={u.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold flex-shrink-0">
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 dark:text-white">{u.fullName}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{u.course}</span>
                                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{u.department}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                                <button
                                                    onClick={() => handleRejectUser(u.id)}
                                                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApproveUser(u.id)}
                                                    className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'updates' && (
                        <>
                            {profileRequests.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">No Pending Profile Updates</h3>
                                    <p className="text-slate-500 dark:text-slate-400">There are no profile update requests to review at this time.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {profileRequests.map((request) => (
                                        <div key={request.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                                                        {request.user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800 dark:text-white">{request.user.fullName}</h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{request.user.email} • {request.user.collegeRollNo}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Requested Changes</h4>
                                                <div className="space-y-3 mb-6">
                                                    {Object.entries(request.requestedChanges).map(([key, value]) => {
                                                        const currentValue = (request.user as any)[key];
                                                        if (currentValue === value) return null;

                                                        return (
                                                            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <div className="md:col-span-2">
                                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{formatFieldName(key)}</span>
                                                                </div>

                                                                <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                                                                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Current Value</span>
                                                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium break-all">
                                                                        {currentValue ? String(currentValue) : <span className="text-slate-300 dark:text-slate-600 italic">Empty</span>}
                                                                    </span>
                                                                </div>

                                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-900/30">
                                                                    <span className="text-xs text-blue-400 dark:text-blue-300 block mb-1">Requested Value</span>
                                                                    <span className="text-sm text-blue-700 dark:text-blue-300 font-bold break-all">
                                                                        {value ? String(value) : <span className="text-blue-300 dark:text-blue-600 italic">Empty</span>}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                                    <button
                                                        onClick={() => handleRejectUpdate(request.id)}
                                                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveUpdate(request.id)}
                                                        className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminRequests;

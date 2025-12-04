import React, { useEffect, useState } from 'react';
import { MockService } from '../../services/mockService';
import { CheckCircle, XCircle, Clock, User, ArrowRight } from 'lucide-react';

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

const AdminProfileRequests: React.FC = () => {
    const [requests, setRequests] = useState<ProfileRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await MockService.getProfileUpdateRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to load requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (window.confirm('Are you sure you want to approve these changes?')) {
            try {
                await MockService.approveProfileUpdate(id);
                loadRequests(); // Reload list
            } catch (error) {
                alert('Failed to approve request');
            }
        }
    };

    const handleReject = async (id: string) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                await MockService.rejectProfileUpdate(id);
                loadRequests(); // Reload list
            } catch (error) {
                alert('Failed to reject request');
            }
        }
    };

    const formatFieldName = (key: string) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    if (loading) {
        return <div className="text-center py-12 text-slate-500">Loading requests...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile Update Requests</h1>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-1">No Pending Requests</h3>
                    <p className="text-slate-500">There are no profile update requests to review at this time.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {request.user.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{request.user.fullName}</h3>
                                        <p className="text-xs text-slate-500">{request.user.email} • {request.user.collegeRollNo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="p-6">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Requested Changes</h4>
                                <div className="space-y-3 mb-6">
                                    {Object.entries(request.requestedChanges).map(([key, value]) => {
                                        const currentValue = (request.user as any)[key];
                                        // Only show if value is actually different (though backend should handle this, good to verify)
                                        if (currentValue === value) return null;

                                        return (
                                            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="md:col-span-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{formatFieldName(key)}</span>
                                                </div>

                                                <div className="bg-white p-3 rounded border border-slate-200">
                                                    <span className="text-xs text-slate-400 block mb-1">Current Value</span>
                                                    <span className="text-sm text-slate-600 font-medium break-all">
                                                        {currentValue ? String(currentValue) : <span className="text-slate-300 italic">Empty</span>}
                                                    </span>
                                                </div>

                                                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                                    <span className="text-xs text-blue-400 block mb-1">Requested Value</span>
                                                    <span className="text-sm text-blue-700 font-bold break-all">
                                                        {value ? String(value) : <span className="text-blue-300 italic">Empty</span>}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(request.id)}
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
        </div>
    );
};

export default AdminProfileRequests;

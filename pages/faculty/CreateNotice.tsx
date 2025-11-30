import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Paperclip, X, File, Image, FileText } from 'lucide-react';
import { NoticeAttachment } from '../../types';

const CreateNotice: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Academic',
        isPinned: false,
        scheduledPublishDate: '',
        scheduledPublishTime: '',
        isScheduled: false,
        courses: [] as string[],
        departments: [] as string[],
        years: [] as string[],
        semesters: [] as string[],
        sections: [] as string[],
        groups: [] as string[],
        specificRollNumbers: [] as string[],
        attachments: [] as NoticeAttachment[],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (location.state?.notice) {
            const n = location.state.notice;
            setEditId(n.id);
            setFormData({
                title: n.title,
                description: n.description,
                category: n.category,
                isPinned: n.isPinned,
                scheduledPublishDate: n.scheduledPublishDate ? n.scheduledPublishDate.substring(0, 10) : '',
                scheduledPublishTime: n.scheduledPublishTime || '',
                isScheduled: n.isScheduled || false,
                courses: n.target.courses || [],
                departments: n.target.departments || [],
                years: n.target.years || [],
                semesters: n.target.semesters || [],
                sections: n.target.sections || [],
                groups: n.target.groups || [],
                specificRollNumbers: n.target.specificRollNumbers || [],
                attachments: n.attachments || [],
            });
        }
    }, [location.state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const noticeData: any = {
            title: formData.title,
            description: formData.description,
            category: formData.category as any,
            isPinned: formData.isPinned,
            publishedBy: user.id,
            publishedByName: user.fullName,
            attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
            target: {
                courses: formData.courses,
                departments: formData.departments,
                years: formData.years,
                semesters: formData.semesters,
                sections: formData.sections,
                groups: formData.groups,
                specificRollNumbers: formData.specificRollNumbers,
            }
        };

        // If scheduled publishing is enabled
        if (formData.isScheduled && formData.scheduledPublishDate) {
            noticeData.scheduledPublishDate = new Date(formData.scheduledPublishDate).toISOString();
            noticeData.scheduledPublishTime = formData.scheduledPublishTime;
            noticeData.isScheduled = true;
            // Set createdAt to scheduled time, but notice won't be visible until that time
            const scheduledDateTime = new Date(formData.scheduledPublishDate);
            if (formData.scheduledPublishTime) {
                const [hours, minutes] = formData.scheduledPublishTime.split(':');
                scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
            noticeData.createdAt = scheduledDateTime.toISOString();
        } else {
            noticeData.createdAt = new Date().toISOString();
        }

        if (editId) {
            await MockService.updateNotice(editId, noticeData);
        } else {
            await MockService.createNotice(noticeData);
        }

        setLoading(false);
        navigate(user.role === 'admin' ? '/admin/notices' : '/faculty');
    };

    const handleMultiSelect = (field: 'courses' | 'departments' | 'years' | 'semesters' | 'sections' | 'groups', value: string) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) return { ...prev, [field]: list.filter(i => i !== value) };
            return { ...prev, [field]: [...list, value] };
        });
    };

    const handleRollNumberAdd = (rollNumber: string) => {
        if (!rollNumber.trim()) return;
        setFormData(prev => {
            if (prev.specificRollNumbers.includes(rollNumber.trim())) return prev;
            return { ...prev, specificRollNumbers: [...prev.specificRollNumbers, rollNumber.trim()] };
        });
    };

    const handleRollNumberRemove = (rollNumber: string) => {
        setFormData(prev => ({
            ...prev,
            specificRollNumbers: prev.specificRollNumbers.filter(r => r !== rollNumber)
        }));
    };

    const getFileType = (fileName: string): 'pdf' | 'image' | 'document' => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'pdf';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
        return 'document';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Create a mock URL for the file (in real app, this would be uploaded to server)
            const fileUrl = URL.createObjectURL(file);
            const attachment: NoticeAttachment = {
                name: file.name,
                url: fileUrl,
                type: getFileType(file.name)
            };

            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, attachment]
            }));
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setFormData(prev => {
            const attachment = prev.attachments[index];
            // Revoke object URL to free memory
            if (attachment.url.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.url);
            }
            return {
                ...prev,
                attachments: prev.attachments.filter((_, i) => i !== index)
            };
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Notice</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="e.g. Mid-Term Examination Schedule"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Enter detailed information..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Exam">Exam</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Placement">Placement</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Important">Important</option>
                        </select>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attachments</label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Add images, PDFs, Excel files, or other documents</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full"
                        >
                            <Paperclip className="w-5 h-5" />
                            <span>Click to attach files</span>
                        </button>

                        {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                                    >
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            {attachment.type === 'image' ? (
                                                <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                            ) : attachment.type === 'pdf' ? (
                                                <FileText className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                            ) : (
                                                <File className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                                            )}
                                            <span className="text-sm text-slate-800 dark:text-white truncate">{attachment.name}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize flex-shrink-0">
                                                ({attachment.type})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(index)}
                                            className="ml-2 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="checkbox"
                                id="scheduled"
                                checked={formData.isScheduled}
                                onChange={e => setFormData({ ...formData, isScheduled: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="scheduled" className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule for later publishing</label>
                        </div>
                        {formData.isScheduled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Publish Date</label>
                                    <input
                                        type="date"
                                        required={formData.isScheduled}
                                        value={formData.scheduledPublishDate}
                                        onChange={e => setFormData({ ...formData, scheduledPublishDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Publish Time</label>
                                    <input
                                        type="time"
                                        required={formData.isScheduled}
                                        value={formData.scheduledPublishTime}
                                        onChange={e => setFormData({ ...formData, scheduledPublishTime: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wide">Target Audience</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Courses</span>
                                <div className="flex flex-wrap gap-2">
                                    {['B.Tech', 'BCA', 'BBA', 'MCA', 'MBA'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('courses', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.courses.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Departments</span>
                                <div className="flex flex-wrap gap-2">
                                    {['CSE', 'ECE', 'ME', 'Civil', 'EE', 'CE'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('departments', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.departments.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Years</span>
                                <div className="flex flex-wrap gap-2">
                                    {['1st', '2nd', '3rd', '4th'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('years', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.years.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Semesters</span>
                                <div className="flex flex-wrap gap-2">
                                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('semesters', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.semesters.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            Sem {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Sections</span>
                                <div className="flex flex-wrap gap-2">
                                    {['A', 'B', 'C', 'D'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('sections', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.sections.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            Section {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Groups</span>
                                <div className="flex flex-wrap gap-2">
                                    {['Group 1', 'Group 2', 'Group 3', 'Group 4'].map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => handleMultiSelect('groups', c)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.groups.includes(c)
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Specific Roll Numbers</span>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Enter roll number (e.g., 1901001)"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleRollNumberAdd((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                            if (input) {
                                                handleRollNumberAdd(input.value);
                                                input.value = '';
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.specificRollNumbers.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.specificRollNumbers.map(roll => (
                                            <span
                                                key={roll}
                                                className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 flex items-center space-x-2"
                                            >
                                                <span>{roll}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRollNumberRemove(roll)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">* Leave filters empty to send to everyone.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="pinned"
                            checked={formData.isPinned}
                            onChange={e => setFormData({ ...formData, isPinned: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="pinned" className="text-sm text-slate-700 dark:text-slate-300">Pin this notice to top</label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center"
                        >
                            <Save className="w-5 h-5 mr-2" /> Publish Notice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNotice;

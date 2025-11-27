import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const CreateNotice: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    isPinned: false,
    eventDate: '',
    courses: [] as string[],
    departments: [] as string[],
    years: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    await MockService.createNotice({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        isPinned: formData.isPinned,
        publishedBy: user.id,
        publishedByName: user.fullName,
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
        target: {
            courses: formData.courses,
            departments: formData.departments,
            years: formData.years,
            semesters: [],
            sections: []
        }
    });

    setLoading(false);
    navigate('/faculty');
  };

  const handleMultiSelect = (field: 'courses' | 'departments' | 'years', value: string) => {
    setFormData(prev => {
        const list = prev[field];
        if (list.includes(value)) return { ...prev, [field]: list.filter(i => i !== value) };
        return { ...prev, [field]: [...list, value] };
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Notice</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Mid-Term Examination Schedule"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter detailed information..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Exam">Exam</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Placement">Placement</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Important">Important</option>
                        </select>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Event Date (Optional)</label>
                         <input 
                            type="date"
                            value={formData.eventDate}
                            onChange={e => setFormData({...formData, eventDate: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Target Audience</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm text-slate-600 mb-2 block">Courses</span>
                            <div className="flex flex-wrap gap-2">
                                {['B.Tech', 'BCA', 'BBA'].map(c => (
                                    <button 
                                        type="button"
                                        key={c}
                                        onClick={() => handleMultiSelect('courses', c)}
                                        className={`px-3 py-1 text-xs rounded-full border ${formData.courses.includes(c) ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-white border-slate-200 text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                         <div>
                            <span className="text-sm text-slate-600 mb-2 block">Departments</span>
                            <div className="flex flex-wrap gap-2">
                                {['CSE', 'ECE', 'ME', 'Civil'].map(c => (
                                    <button 
                                        type="button"
                                        key={c}
                                        onClick={() => handleMultiSelect('departments', c)}
                                        className={`px-3 py-1 text-xs rounded-full border ${formData.departments.includes(c) ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-white border-slate-200 text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">* Leave filters empty to send to everyone.</p>
                </div>

                <div className="flex items-center space-x-2">
                     <input 
                        type="checkbox" 
                        id="pinned" 
                        checked={formData.isPinned}
                        onChange={e => setFormData({...formData, isPinned: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500" 
                    />
                     <label htmlFor="pinned" className="text-sm text-slate-700">Pin this notice to top</label>
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

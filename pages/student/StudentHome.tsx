import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Notice, CATEGORY_COLORS } from '../../types';
import NoticeCard from '../../components/NoticeCard';
import { Filter, Search } from 'lucide-react';
import NotificationPanel from '../../components/NotificationPanel';

const StudentHome: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotices = async () => {
    if (user) {
      setLoading(true);
      const data = await MockService.getNotices(user);
      // Sort pinned first, then by date desc
      data.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotices(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [user]);

  useEffect(() => {
    let res = notices;
    if (filterCategory !== 'All') {
        res = res.filter(n => n.category === filterCategory);
    }
    if (searchTerm) {
        res = res.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredNotices(res);
  }, [notices, filterCategory, searchTerm]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notice Board</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {user?.fullName}</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search notices..." 
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <NotificationPanel />
            {/* Filter Dropdown could go here */}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto pb-4 mb-2 space-x-2 scrollbar-hide">
        {['All', 'Academic', 'Exam', 'Holiday', 'Placement', 'Cultural'].map(cat => (
            <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    filterCategory === cat 
                    ? 'bg-slate-800 dark:bg-blue-600 text-white border-slate-800 dark:border-blue-600' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map(notice => (
                <NoticeCard key={notice.id} notice={notice} onRefresh={fetchNotices} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No notices found</h3>
            <p className="text-slate-400 dark:text-slate-500">Try adjusting your filters or search.</p>
        </div>
      )}
    </div>
  );
};

export default StudentHome;

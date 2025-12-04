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

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    if (user) {
      if (notices.length === 0) setLoading(true);
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
          {/* Filter Dropdown could go here */}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto pb-4 mb-2 space-x-2 scrollbar-hide">
        {['All', 'Academic', 'Exam', 'Holiday', 'Placement', 'Cultural'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filterCategory === cat
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
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} onRefresh={fetchNotices} onClick={() => setSelectedNotice(notice)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No notices found</h3>
          <p className="text-slate-400 dark:text-slate-500">Try adjusting your filters or search.</p>
        </div>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedNotice(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[selectedNotice.category] || 'bg-gray-100 text-gray-800'} mb-2 inline-block`}>
                  {selectedNotice.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedNotice.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Published by {selectedNotice.publishedByName} on {new Date(selectedNotice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{selectedNotice.description}</p>
            </div>

            {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNotice.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>{att.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;

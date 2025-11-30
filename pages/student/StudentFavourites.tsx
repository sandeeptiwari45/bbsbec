import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Notice } from '../../types';
import NoticeCard from '../../components/NoticeCard';
import { Heart } from 'lucide-react';

const StudentFavourites: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    if (user && user.favourites && user.favourites.length > 0) {
      setLoading(true);
      const allNotices = await MockService.getNotices(user);
      const favNotices = allNotices.filter(n => user.favourites?.includes(n.id));
      setNotices(favNotices);
      setLoading(false);
    } else {
      setNotices([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [user]);

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Favourite Notices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">All your starred notices in one place</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} onRefresh={fetchNotices} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No favourite notices yet</h3>
          <p className="text-slate-400 dark:text-slate-500">Star notices you want to save for later.</p>
        </div>
      )}
    </div>
  );
};

export default StudentFavourites;


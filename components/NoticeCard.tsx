import React from 'react';
import { Notice, CATEGORY_COLORS } from '../types';
import { Pin, Calendar, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockService } from '../services/mockService';

interface NoticeCardProps {
  notice: Notice;
  onRefresh?: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onRefresh }) => {
  const { user, updateUser } = useAuth();
  const isFav = user?.favourites?.includes(notice.id);

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const newFavs = await MockService.toggleFavourite(user.id, notice.id);
    if (newFavs) {
        updateUser({ ...user, favourites: newFavs });
        if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[notice.category] || 'bg-gray-100 text-gray-800'}`}>
          {notice.category}
        </span>
        <div className="flex items-center space-x-2">
          {notice.isPinned && <Pin className="w-4 h-4 text-slate-400 rotate-45" />}
          {user?.role === 'student' && (
            <button onClick={toggleFav} className="focus:outline-none transition-transform active:scale-95">
               <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-300 hover:text-slate-500'}`} />
            </button>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-2 leading-tight">{notice.title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{notice.description}</p>
      
      <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span>{notice.publishedByName}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;

import React, { useState, useEffect } from 'react';
import { Notice, CATEGORY_COLORS } from '../types';
import { Pin, Calendar, User, Heart, Paperclip, Eye, EyeOff, Flag, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockService } from '../services/mockService';
import PublisherProfileModal from './PublisherProfileModal';
import AttachmentPreview from './AttachmentPreview';
import ReportNoticeModal from './ReportNoticeModal';

interface NoticeCardProps {
  notice: Notice;
  onRefresh?: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onRefresh }) => {
  const { user, updateUser } = useAuth();
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [showAttachment, setShowAttachment] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [publisher, setPublisher] = useState<any>(null);
  const [publisherDesignation, setPublisherDesignation] = useState<string>('');
  const isFav = user?.favourites?.includes(notice.id);

  useEffect(() => {
    const loadPublisherInfo = async () => {
      try {
        const pub = await MockService.getUserProfile(notice.publishedBy);
        setPublisherDesignation(pub.designation || '');
      } catch (error) {
        console.error('Failed to load publisher info:', error);
      }
    };
    loadPublisherInfo();
  }, [notice.publishedBy]);

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const newFavs = await MockService.toggleFavourite(user.id, notice.id);
    if (newFavs) {
        updateUser({ ...user, favourites: newFavs });
        if (onRefresh) onRefresh();
    }
  };

  const handlePublisherClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const pub = await MockService.getUserProfile(notice.publishedBy);
    setPublisher(pub);
    setShowPublisherModal(true);
  };

  const markAsRead = async () => {
    if (!user || notice.isRead) return;
    await MockService.markNoticeAsRead(notice.id, user.id);
    if (onRefresh) onRefresh();
  };

  React.useEffect(() => {
    if (user && !notice.isRead) {
      markAsRead();
    }
  }, []);

  return (
    <>
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow relative group cursor-pointer"
        onClick={markAsRead}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[notice.category] || 'bg-gray-100 text-gray-800'}`}>
              {notice.category}
            </span>
            {notice.isRead === false && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                New
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {(user?.role === 'admin' || user?.role === 'faculty') && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await MockService.togglePinNotice(notice.id);
                  if (onRefresh) onRefresh();
                }}
                className="focus:outline-none transition-transform active:scale-95"
                title={notice.isPinned ? 'Unpin notice' : 'Pin notice'}
              >
                <Pin className={`w-4 h-4 ${notice.isPinned ? 'fill-yellow-500 text-yellow-500 rotate-45' : 'text-slate-400 hover:text-yellow-500'}`} />
              </button>
            )}
            {notice.isPinned && (user?.role === 'student') && <Pin className="w-4 h-4 text-yellow-500 rotate-45" />}
            {user?.role === 'student' && (
              <>
                <button onClick={toggleFav} className="focus:outline-none transition-transform active:scale-95">
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-300 hover:text-slate-500'}`} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  title="Report notice"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 leading-tight">{notice.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{notice.description}</p>

        {notice.attachments && notice.attachments.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {notice.attachments.map((att, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setShowAttachment(idx); }}
                className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Paperclip className="w-3 h-3" />
                <span>{att.name}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={handlePublisherClick}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <User className="w-3 h-3" />
            <span className="flex items-center space-x-1">
              <span>{notice.publishedByName}</span>
              {publisherDesignation && (
                <span className="text-slate-500 dark:text-slate-400">({publisherDesignation})</span>
              )}
            </span>
          </button>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(notice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            <Clock className="w-3 h-3 ml-2" />
            <span>{new Date(notice.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          </div>
        </div>
      </div>

      {showPublisherModal && publisher && (
        <PublisherProfileModal user={publisher} onClose={() => setShowPublisherModal(false)} />
      )}

      {showAttachment !== null && notice.attachments && (
        <AttachmentPreview 
          attachment={notice.attachments[showAttachment]} 
          onClose={() => setShowAttachment(null)} 
        />
      )}

      {showReportModal && (
        <ReportNoticeModal 
          noticeId={notice.id} 
          onClose={() => setShowReportModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default NoticeCard;

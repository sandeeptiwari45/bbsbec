import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { NoticeAttachment } from '../types';

interface AttachmentPreviewProps {
  attachment: NoticeAttachment;
  onClose: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, onClose }) => {
  const [loading, setLoading] = useState(true);

  const renderPreview = () => {
    if (attachment.type === 'image') {
      return (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-full max-h-[80vh] object-contain"
          onLoad={() => setLoading(false)}
        />
      );
    } else if (attachment.type === 'pdf') {
      return (
        <iframe
          src={attachment.url}
          className="w-full h-[80vh] border-0"
          onLoad={() => setLoading(false)}
          title={attachment.name}
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500 dark:text-slate-400">
          <File className="w-16 h-16 mb-4" />
          <p className="mb-4">{attachment.name}</p>
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {attachment.type === 'image' && <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
            {attachment.type === 'pdf' && <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
            {attachment.type === 'document' && <File className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
            <h3 className="font-semibold text-slate-800 dark:text-white">{attachment.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1 flex items-center justify-center">
          {loading && <div className="text-slate-500 dark:text-slate-400">Loading...</div>}
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default AttachmentPreview;


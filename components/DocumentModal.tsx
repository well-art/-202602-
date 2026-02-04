import React from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle, FileType } from 'lucide-react';
import { DocumentItem, Category } from '../types';

interface DocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const isPlaceholderId = !document.googleDriveId || document.googleDriveId.length < 5;
  const isForm = document.googleDriveId?.startsWith('1FAIp'); // Typical Google Form ID prefix

  // Determine if Word download is allowed (Flowcharts and Forms, excluding Google Forms)
  const showWordDownload = (document.category === Category.FLOWCHARTS || document.category === Category.FORMS) && !isForm && !isPlaceholderId;

  let previewUrl = '';
  let downloadUrl = ''; // PDF Download
  let viewUrl = '';
  let wordDownloadUrl = '';

  if (!isPlaceholderId) {
    if (isForm) {
      // Google Form URLs
      previewUrl = `https://docs.google.com/forms/d/e/${document.googleDriveId}/viewform?embedded=true`;
      viewUrl = `https://docs.google.com/forms/d/e/${document.googleDriveId}/viewform`;
      downloadUrl = viewUrl; 
    } else {
      // Standard Drive/Docs URLs
      previewUrl = `https://drive.google.com/file/d/${document.googleDriveId}/preview`;
      downloadUrl = `https://drive.google.com/u/0/uc?id=${document.googleDriveId}&export=download`;
      viewUrl = `https://drive.google.com/file/d/${document.googleDriveId}/view`;
      // Google Doc export to Word
      wordDownloadUrl = `https://docs.google.com/document/d/${document.googleDriveId}/export?format=docx`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-corp-gray/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-corp-green" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-corp-gray line-clamp-1">{document.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded">{document.category}</span>
                <span>•</span>
                <span className="text-corp-green font-medium">{document.subCategory}</span>
                <span>•</span>
                <span>{document.date}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50 relative">
          {isPlaceholderId ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium text-corp-gray mb-2">無法預覽檔案</p>
              <p className="max-w-md">資料庫尚未連結有效的 Google Drive ID。請等待管理員更新資料庫後再試。</p>
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Document Preview"
              allow="autoplay"
            ></iframe>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xs text-gray-400 hidden sm:block">
            {isForm ? '此為線上表單，請直接填寫。' : '預覽模式僅供參考，格式可能與原始檔案略有差異。'}
          </p>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto justify-end">
            <a 
              href={viewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-corp-green text-corp-green rounded-lg hover:bg-green-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isForm ? '開啟表單' : '線上閱讀'}</span>
            </a>

            {showWordDownload && (
               <a 
               href={wordDownloadUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
             >
               <FileType className="w-4 h-4" />
               <span>下載 Word</span>
             </a>
            )}

            {!isForm && (
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-corp-green text-white rounded-lg hover:bg-[#1f8c3c] transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>下載 PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
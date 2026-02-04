import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import DocumentModal from './components/DocumentModal';
import { Category, DocumentItem, SUB_CATEGORIES } from './types';
import { REGULATIONS_DATA, FLOWCHARTS_DATA, FORMS_DATA, JOB_DESCRIPTIONS_DATA, ALL_DOCUMENTS } from './constants';
import { FileText, FolderOpen, Calendar, ChevronRight } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(Category.REGULATIONS);
  // Store the active sub-category for each main tab to implement "Single Category View"
  const [activeSubTab, setActiveSubTab] = useState<string>(''); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [animating, setAnimating] = useState(false);

  // Initialize active sub-tab when tab changes
  useEffect(() => {
    if (currentTab !== 'search') {
      const firstSub = SUB_CATEGORIES[currentTab as Category]?.[0];
      if (firstSub) {
        setActiveSubTab(firstSub);
      }
    }
  }, [currentTab]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSearchQuery('');
    setCurrentTab(Category.REGULATIONS);
  };

  const handleTabChange = (tab: string) => {
    if (tab === currentTab && tab !== 'search') return;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setAnimating(true);
    setCurrentTab(tab);
    if (tab !== 'search') {
      setSearchQuery('');
    }
    setTimeout(() => setAnimating(false), 300);
  };

  const handleSubTabChange = (subCategory: string) => {
    setAnimating(true);
    setActiveSubTab(subCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAnimating(false), 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      if (currentTab !== 'search') setCurrentTab('search');
    } else {
      // If cleared, go back to default regulation view
      setCurrentTab(Category.REGULATIONS);
    }
  };

  // Filter Documents based on current view
  const documentsToDisplay = useMemo(() => {
    // 1. Search Mode: Show EVERYTHING that matches, regardless of category
    if (currentTab === 'search') {
      if (!searchQuery) return [];
      const lowerQuery = searchQuery.toLowerCase();
      return ALL_DOCUMENTS.filter(doc => 
        doc.title.toLowerCase().includes(lowerQuery) || 
        doc.description.toLowerCase().includes(lowerQuery) ||
        doc.subCategory.toLowerCase().includes(lowerQuery) ||
        doc.category.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Normal Mode: Filter by Main Tab AND Active Sub Tab
    let data: DocumentItem[] = [];
    switch (currentTab) {
      case Category.REGULATIONS:
        data = REGULATIONS_DATA;
        break;
      case Category.FLOWCHARTS:
        data = FLOWCHARTS_DATA;
        break;
      case Category.FORMS:
        data = FORMS_DATA;
        break;
      case Category.JOB_DESCRIPTIONS:
        data = JOB_DESCRIPTIONS_DATA;
        break;
      default:
        data = [];
    }

    // Filter by the selected sub-category
    return data.filter(doc => doc.subCategory === activeSubTab);
  }, [currentTab, searchQuery, activeSubTab]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Check if current tab is Job Descriptions to conditionally hide elements
  const isJobDescription = currentTab === Category.JOB_DESCRIPTIONS;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onLogout={handleLogout}
      />

      {/* Sticky Sub-Category Nav - Only show when not searching */}
      {currentTab !== 'search' && (
        <div className="sticky top-0 md:top-[73px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-3 py-4 overflow-x-auto no-scrollbar">
              {SUB_CATEGORIES[currentTab as Category]?.map((subCategory) => (
                <button
                  key={subCategory}
                  onClick={() => handleSubTabChange(subCategory)}
                  className={`px-5 py-2 rounded-full text-base font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeSubTab === subCategory 
                      ? 'bg-corp-green text-white shadow-md transform scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {subCategory}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header for current section */}
        <div className="mb-10 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-corp-gray flex items-center">
            {currentTab === 'search' ? (
              <>
                <span className="mr-3">🔍</span>
                搜尋結果: "{searchQuery}"
              </>
            ) : (
              <>
                <span className="w-2.5 h-10 bg-corp-green rounded-full mr-5 block"></span>
                {activeSubTab} {/* Display the Sub-Category as the main header */}
              </>
            )}
          </h1>
          <p className="mt-3 text-gray-500 ml-8 text-lg">
            {currentTab === 'search' 
              ? `找到 ${documentsToDisplay.length} 份相關文件` 
              : `以下是 ${currentTab} > ${activeSubTab} 的相關文件`}
          </p>
        </div>

        {/* Content List */}
        <div className={`transition-opacity duration-300 ${animating ? 'opacity-50' : 'opacity-100'}`}>
            {documentsToDisplay.length === 0 ? (
               <div className="text-center py-24 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100 text-xl">
                 沒有找到符合的文件
               </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {documentsToDisplay.map((doc, index) => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="group flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-corp-green/30 transition-all duration-200 cursor-pointer"
                  >
                    {/* Left: Number + Icon + Title + Description */}
                    <div className="flex items-center space-x-5 mb-4 md:mb-0 flex-grow">
                       {/* Numbering - Hide for Job Descriptions */}
                       {!isJobDescription && (
                          <div className="text-gray-300 font-mono font-bold text-xl pt-1 w-8 text-right flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                       )}

                      <div className="pt-1 flex-shrink-0">
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-corp-green group-hover:text-white transition-colors text-corp-green">
                          <FileText className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        {/* Title - Bold & Larger */}
                        <h3 className="font-bold text-corp-gray text-xl group-hover:text-corp-green transition-colors pr-4 mb-1">
                          {doc.title}
                          {/* If in Search mode, show tags to indicate context */}
                          {currentTab === 'search' && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {doc.category} - {doc.subCategory}
                            </span>
                          )}
                        </h3>
                        
                        {/* Description - Hide for Job Descriptions */}
                        {!isJobDescription && (
                          <p className="text-black text-base leading-relaxed mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Date + Action */}
                    <div className="flex items-center justify-between md:justify-end md:space-x-10 pl-14 md:pl-0 min-w-[220px] md:pt-0">
                       {/* Date - Hide for Job Descriptions */}
                      {(doc.date && doc.date !== '-' && !isJobDescription) && (
                        <div className="flex items-center text-base text-gray-500 font-mono whitespace-nowrap">
                          <Calendar className="w-4 h-4 mr-2" />
                          {doc.date}
                        </div>
                      )}
                      
                      <div className="flex items-center text-corp-green font-bold text-base opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity transform md:translate-x-4 md:group-hover:translate-x-0 duration-200 whitespace-nowrap ml-auto">
                        預覽文件
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-base">
          <p>© {new Date().getFullYear()} 智匯中心. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">僅供內部使用，嚴禁未經授權之外流與攜出。</p>
        </div>
      </footer>

      {/* Modal */}
      {selectedDocument && (
        <DocumentModal 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </div>
  );
}

export default App;
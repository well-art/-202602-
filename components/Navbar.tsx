import React from 'react';
import { Search, Book, GitGraph, Table, LogOut, Briefcase } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onSearch, searchQuery, onLogout }) => {
  const navItems = [
    { id: Category.REGULATIONS, icon: Book, label: Category.REGULATIONS },
    { id: Category.FLOWCHARTS, icon: GitGraph, label: Category.FLOWCHARTS },
    { id: Category.FORMS, icon: Table, label: Category.FORMS },
    { id: Category.JOB_DESCRIPTIONS, icon: Briefcase, label: Category.JOB_DESCRIPTIONS },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between h-auto md:h-16 py-3 md:py-0 items-center space-y-3 md:space-y-0">
          
          {/* Logo / Brand */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => onTabChange(Category.REGULATIONS)}>
            <div className="w-9 h-9 bg-corp-green rounded-lg flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white font-bold text-xl">智</span>
            </div>
            <span className="font-bold text-2xl text-corp-gray tracking-tight">智匯中心</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar w-full md:w-auto justify-center md:justify-start">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center px-4 py-2.5 rounded-md text-base font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-green-50 text-corp-green shadow-sm'
                      : 'text-gray-500 hover:text-corp-gray hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-2 ${isActive ? 'text-corp-green' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar & Logout */}
          <div className="flex items-center w-full md:w-auto space-x-3">
            <div className="relative flex-grow md:flex-grow-0 md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-corp-green focus:border-corp-green text-base transition-all"
                placeholder="搜尋文件..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => {
                  if(currentTab !== 'search' && searchQuery) onTabChange('search');
                }}
              />
            </div>
            
            <button
              onClick={onLogout}
              className="p-2.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="登出"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { BookOpen, LayoutDashboard, Award, Github } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'lessons';
  onNavigate: (tab: 'dashboard' | 'lessons') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onNavigate }) => {
  return (
    <nav className="w-20 lg:w-64 h-screen bg-[#0f0f0f] border-r border-[#2d2d2d] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-[#2d2d2d]">
        <div className="w-8 h-8 bg-rose-600 rounded-md flex items-center justify-center text-white font-bold">
          K
        </div>
        <span className="text-xl font-bold hidden lg:block tracking-tight">Academy</span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
            activeTab === 'dashboard' 
              ? 'bg-[#1f1f1f] text-white shadow-lg shadow-rose-900/10' 
              : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-rose-500' : 'text-gray-500 group-hover:text-white'} />
          <span className="font-medium hidden lg:block">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('lessons')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
            activeTab === 'lessons' 
              ? 'bg-[#1f1f1f] text-white shadow-lg shadow-rose-900/10' 
              : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
          }`}
        >
          <BookOpen size={20} className={activeTab === 'lessons' ? 'text-rose-500' : 'text-gray-500 group-hover:text-white'} />
          <span className="font-medium hidden lg:block">Curriculum</span>
        </button>
      </div>

      <div className="p-6 border-t border-[#2d2d2d]">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Github size={16} />
          <span className="hidden lg:block">v1.0.0</span>
        </div>
      </div>
    </nav>
  );
};
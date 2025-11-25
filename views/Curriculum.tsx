import React, { useState } from 'react';
import { CURRICULUM } from '../constants';
import { Lesson, ContentType, UserProgress } from '../types';
import { PlayCircle, FileText, CheckCircle, Lock, Search, Filter, Video, BookOpen } from 'lucide-react';

import { useStore } from '../services/store';

interface CurriculumProps {}

export const Curriculum: React.FC<CurriculumProps> = () => {
  const { progress, handleSelectLesson } = useStore();
  const onSelectLesson = (id: string) => handleSelectLesson(id);
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'BLOG'>('ALL');
  const [search, setSearch] = useState('');

  const filteredLessons = CURRICULUM.filter(lesson => {
    const matchesType = filter === 'ALL' || lesson.type === filter;
    const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase()) || 
                          lesson.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Curriculum & Resources</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Explore the complete library of Andrej Karpathy's lessons, blogs, and essential prerequisites.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 z-10 bg-[#0f0f0f]/95 backdrop-blur-sm py-4 border-b border-[#2d2d2d]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search topics (e.g. 'Backprop', 'GPT', 'Software 2.0')..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === 'ALL' ? 'bg-white text-black shadow-lg' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
          >
            All Content
          </button>
          <button 
            onClick={() => setFilter('VIDEO')}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${filter === 'VIDEO' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
          >
            <Video size={16} /> Videos
          </button>
          <button 
            onClick={() => setFilter('BLOG')}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${filter === 'BLOG' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
          >
            <FileText size={16} /> Blogs
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {filteredLessons.map((lesson, index) => {
           // Find original index to determine locking logic correctly based on overall curriculum
           const originalIndex = CURRICULUM.findIndex(l => l.id === lesson.id);
           const isCompleted = progress.completedLessonIds.includes(lesson.id);
           const isLocked = !isCompleted && (originalIndex > 0 && !progress.completedLessonIds.includes(CURRICULUM[originalIndex - 1].id));

           return (
             <div 
                key={lesson.id}
                onClick={() => !isLocked && onSelectLesson(lesson.id)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 bg-[#161616] ${
                    isLocked ? 'border-[#222] opacity-60' : 'border-[#2d2d2d] hover:border-rose-500/50 hover:-translate-y-1 hover:shadow-xl cursor-pointer'
                }`}
             >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                   <img src={lesson.thumbnail} alt={lesson.title} className={`w-full h-full object-cover transition-transform duration-700 ${!isLocked ? 'group-hover:scale-105' : ''} ${isCompleted ? 'grayscale' : ''}`} />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-60"></div>
                   
                   <div className="absolute top-3 left-3">
                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                       lesson.type === ContentType.VIDEO 
                         ? 'bg-blue-500/20 text-blue-200 border-blue-500/20' 
                         : 'bg-orange-500/20 text-orange-200 border-orange-500/20'
                     }`}>
                       {lesson.type}
                     </span>
                   </div>

                   {isCompleted && (
                     <div className="absolute top-3 right-3 bg-green-500 text-black p-1.5 rounded-full shadow-lg z-10">
                       <CheckCircle size={16} />
                     </div>
                   )}

                    {isLocked && (
                     <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                       <Lock className="text-gray-400" size={32} />
                     </div>
                   )}
                   
                   {!isLocked && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        {lesson.type === ContentType.VIDEO ? <PlayCircle size={48} className="text-white drop-shadow-lg" fill="rgba(0,0,0,0.5)" /> : <BookOpen size={48} className="text-white drop-shadow-lg" />}
                     </div>
                   )}
                   
                   <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono font-bold">
                     {lesson.duration}
                   </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className={`text-lg font-bold mb-2 leading-tight ${isCompleted ? 'text-gray-400' : 'text-white group-hover:text-rose-400 transition-colors'}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {lesson.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {lesson.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-1 bg-[#222] text-gray-400 rounded border border-[#333]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
             </div>
           );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-20">
          <Search className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-500 text-xl">No lessons found matching your search.</p>
        </div>
      )}
    </div>
  );
};
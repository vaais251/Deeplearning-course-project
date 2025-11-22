import React, { useState } from 'react';
import { Lesson, UserProgress, ContentType } from '../types';
import { CURRICULUM } from '../constants';
import { Play, FileText, CheckCircle, Lock, BrainCircuit, Sparkles, ChevronRight, Video, BookOpen, PlayCircle } from 'lucide-react';
import { explainLessonConcept } from '../services/geminiService';

interface DashboardProps {
  progress: UserProgress;
  onSelectLesson: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectLesson }) => {
  const completedCount = progress.completedLessonIds.length;
  const totalCount = CURRICULUM.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  
  const nextLessonIndex = CURRICULUM.findIndex(l => !progress.completedLessonIds.includes(l.id));
  const nextLesson = nextLessonIndex !== -1 ? CURRICULUM[nextLessonIndex] : null;

  const [aiExplanation, setAiExplanation] = useState<{id: string, text: string} | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);

  const handleExplain = async (e: React.MouseEvent, lesson: Lesson) => {
    e.stopPropagation();
    if (aiExplanation?.id === lesson.id) {
        setAiExplanation(null);
        return;
    }
    
    setLoadingExplanation(lesson.id);
    try {
        const explanation = await explainLessonConcept(lesson.title, lesson.description);
        setAiExplanation({ id: lesson.id, text: explanation });
    } finally {
        setLoadingExplanation(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#2d2d2d] pb-8">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-rose-900/20 text-rose-400 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
                <BrainCircuit size={16} />
                <span>Neural Networks: Zero to Hero</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                Karpathy.<span className="text-rose-600">AI</span> Academy
            </h1>
            <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                Master deep learning from first principles. Build Micrograd, Makemore, and GPT-2 from scratch with AI guidance.
            </p>
        </div>
        <div className="text-right mt-8 md:mt-0 w-full md:w-auto">
            <div className="flex items-center justify-between md:justify-end gap-4 mb-3">
                <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Course Progress</span>
                <span className="text-2xl font-bold text-white">{percentage}%</span>
            </div>
            {/* Fancy Progress Bar */}
            <div className="relative h-3 w-full md:w-64 bg-[#1a1a1a] rounded-full overflow-hidden shadow-inner">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-600 to-purple-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                </div>
            </div>
        </div>
      </header>

      {/* Next Lesson Card (Hero Card) */}
      {nextLesson ? (
        <div 
            onClick={() => onSelectLesson(nextLesson.id)}
            className="group relative overflow-hidden rounded-[2rem] bg-[#161616] border border-[#2d2d2d] hover:border-rose-500/50 transition-all duration-500 cursor-pointer shadow-2xl"
        >
            {/* Background Image with Gradient */}
            <div className="absolute inset-0">
                <img src={nextLesson.thumbnail} alt="" className="w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent"></div>
            </div>
            
            <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"/>
                        UP NEXT
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight group-hover:text-rose-50 transition-colors">{nextLesson.title}</h2>
                    <p className="text-gray-300 text-lg line-clamp-2 max-w-2xl">{nextLesson.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button className="bg-white text-black px-8 py-4 rounded-xl font-bold shadow-lg group-hover:bg-rose-50 group-hover:scale-105 transition-all flex items-center gap-3">
                            {nextLesson.type === ContentType.VIDEO ? <PlayCircle fill="currentColor" size={20} /> : <FileText size={20} />}
                            Resume Learning
                        </button>
                        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-lg backdrop-blur-md border border-white/10 text-gray-300 text-sm">
                            <span className="font-mono">{nextLesson.duration}</span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="uppercase tracking-wider text-xs font-bold">{nextLesson.type}</span>
                        </div>
                    </div>
                </div>
                
                {/* Play Button Visual */}
                <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500 group-hover:bg-rose-500 group-hover:border-rose-400">
                    {nextLesson.type === ContentType.VIDEO ? <Play fill="white" className="w-10 h-10 text-white ml-1" /> : <BookOpen className="w-10 h-10 text-white" />}
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 p-16 rounded-[2rem] text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Course Completed!</h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                You have successfully navigated the depths of deep learning. 
                From scalars to Transformers, you are now ready to build the future.
            </p>
        </div>
      )}

      {/* Curriculum Timeline */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpen className="text-rose-500" /> Timeline
             </h3>
             <div className="text-sm text-gray-500 font-mono bg-[#161616] px-3 py-1 rounded-lg border border-[#2d2d2d]">
                {completedCount} / {totalCount} MODULES
             </div>
        </div>

        <div className="grid gap-4">
          {CURRICULUM.map((lesson, index) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);
            const isLocked = !isCompleted && (index > 0 && !progress.completedLessonIds.includes(CURRICULUM[index - 1].id));
            const isActive = nextLesson?.id === lesson.id;
            
            return (
                <div 
                    key={lesson.id} 
                    className={`relative group rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isActive
                            ? 'bg-[#1a1a1a] border-rose-500/40 ring-1 ring-rose-500/20 shadow-lg shadow-rose-900/5' 
                            : isCompleted 
                                ? 'bg-[#161616] border-green-900/20 opacity-70 hover:opacity-100 grayscale hover:grayscale-0' 
                                : isLocked
                                    ? 'bg-[#0a0a0a] border-[#1f1f1f] opacity-40'
                                    : 'bg-[#161616] border-[#2d2d2d] hover:bg-[#1a1a1a]'
                    }`}
                >
                    {/* Locked Overlay */}
                    {isLocked && (
                        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed">
                            <div className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10">
                                <Lock className="text-gray-400" size={24} />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row p-5 gap-6">
                        {/* Thumbnail */}
                        <div 
                            onClick={() => !isLocked && onSelectLesson(lesson.id)}
                            className={`relative w-full md:w-56 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-black shadow-lg ${!isLocked ? 'cursor-pointer' : ''}`}
                        >
                            <img src={lesson.thumbnail} alt={lesson.title} className={`w-full h-full object-cover transition-transform duration-700 ${!isLocked ? 'group-hover:scale-110' : ''}`} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {lesson.type === ContentType.VIDEO ? <PlayCircle fill="white" size={40} className="text-white drop-shadow-lg"/> : <FileText size={32} className="text-white drop-shadow-lg"/>}
                            </div>
                            
                            {/* Status Icon */}
                            {isCompleted && (
                                <div className="absolute top-2 right-2 bg-green-500 text-black p-1 rounded-full shadow-lg">
                                    <CheckCircle size={14} />
                                </div>
                            )}
                            
                            {/* Duration Badge */}
                            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10">
                                {lesson.duration}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                                        lesson.type === ContentType.VIDEO ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                        {lesson.type === ContentType.VIDEO ? <span className="flex items-center gap-1"><Video size={10}/> VIDEO</span> : <span className="flex items-center gap-1"><FileText size={10}/> READING</span>}
                                    </span>
                                    <span className="text-xs text-gray-600 font-mono font-medium">UNIT 0{index + 1}</span>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 
                                            onClick={() => !isLocked && onSelectLesson(lesson.id)}
                                            className={`text-xl font-bold truncate mb-2 transition-colors ${!isLocked ? 'cursor-pointer text-gray-100 group-hover:text-rose-400' : 'text-gray-500'}`}
                                        >
                                            {lesson.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed max-w-3xl">{lesson.description}</p>
                                    </div>
                                    
                                    {/* AI Explain Button */}
                                    {!isLocked && (
                                        <button
                                            onClick={(e) => handleExplain(e, lesson)}
                                            className={`hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-2xl border transition-all duration-300 flex-shrink-0 ${
                                                aiExplanation?.id === lesson.id 
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                                                    : 'bg-[#1f1f1f] border-[#333] text-gray-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-[#252525]'
                                            }`}
                                            title="Explain with AI"
                                        >
                                            {loadingExplanation === lesson.id ? (
                                                <Sparkles className="animate-spin" size={20} />
                                            ) : (
                                                <Sparkles size={20} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                             {/* Footer / Tags */}
                            <div className="flex items-center justify-between mt-4 md:mt-0">
                                <div className="flex flex-wrap gap-2">
                                    {lesson.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 rounded bg-[#222] text-gray-500 font-medium border border-[#333]">#{tag}</span>
                                    ))}
                                </div>
                                
                                {!isLocked && (
                                    <div className="md:hidden">
                                         <button className="text-xs font-bold text-white bg-[#2d2d2d] px-3 py-2 rounded-lg">
                                            {isCompleted ? 'Review' : 'Start'}
                                         </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Explanation Panel */}
                    {aiExplanation?.id === lesson.id && (
                        <div className="bg-indigo-950/30 border-t border-indigo-500/20 p-5 md:mx-5 md:mb-5 rounded-b-xl md:rounded-xl animate-fade-in backdrop-blur-sm">
                            <div className="flex gap-4">
                                <div className="mt-1 p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 h-fit">
                                    <Sparkles size={18} className="text-indigo-400" />
                                </div>
                                <div className="text-sm text-indigo-100 leading-relaxed">
                                    <span className="font-bold text-white block mb-1 text-base">Why this matters:</span>
                                    {aiExplanation.text}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
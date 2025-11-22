import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { Curriculum } from './views/Curriculum';
import { LessonRoom } from './views/LessonRoom';
import { CURRICULUM } from './constants';
import { UserProgress } from './types';
import { Lock, Key } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'curriculum' | 'lesson'>('dashboard');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [apiKeySet, setApiKeySet] = useState(true);
  
  const [progress, setProgress] = useState<UserProgress>({
    completedLessonIds: [],
    currentLessonId: null,
    quizScores: {}
  });

  const handleNavigate = (tab: 'dashboard' | 'lessons') => {
    setCurrentLessonId(null);
    if (tab === 'dashboard') {
      setActiveView('dashboard');
    } else if (tab === 'lessons') {
      setActiveView('curriculum');
    }
  };

  const handleSelectLesson = (id: string) => {
    setCurrentLessonId(id);
    setActiveView('lesson');
  };

  const handleLessonComplete = (score: number) => {
    if (currentLessonId && !progress.completedLessonIds.includes(currentLessonId)) {
      setProgress(prev => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, currentLessonId],
        quizScores: {
            ...prev.quizScores,
            [currentLessonId]: score
        }
      }));
    }
  };

  const currentLesson = CURRICULUM.find(l => l.id === currentLessonId);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex font-sans selection:bg-rose-500 selection:text-white">
      {/* Sidebar visible on Dashboard and Curriculum views */}
      {(activeView === 'dashboard' || activeView === 'curriculum') && (
        <Navigation 
            activeTab={activeView === 'curriculum' ? 'lessons' : 'dashboard'} 
            onNavigate={handleNavigate} 
        />
      )}

      <main className={`flex-1 ${activeView !== 'lesson' ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {activeView === 'dashboard' && (
          <Dashboard progress={progress} onSelectLesson={handleSelectLesson} />
        )}
        {activeView === 'curriculum' && (
          <Curriculum progress={progress} onSelectLesson={handleSelectLesson} />
        )}
        {activeView === 'lesson' && currentLesson && (
          <LessonRoom 
            lesson={currentLesson} 
            onComplete={handleLessonComplete}
            onBack={() => setActiveView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
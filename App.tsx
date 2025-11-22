import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { LessonRoom } from './views/LessonRoom';
import { CURRICULUM } from './constants';
import { UserProgress } from './types';
import { Lock, Key } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'lesson'>('dashboard');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  // Default to true because we have hardcoded the key in geminiService.ts
  // This ensures the app loads immediately without blank screens on deploy
  const [apiKeySet, setApiKeySet] = useState(true);
  
  // Persist progress in a real app, here just state
  const [progress, setProgress] = useState<UserProgress>({
    completedLessonIds: [],
    currentLessonId: null,
    quizScores: {}
  });

  const handleNavigate = (tab: 'dashboard' | 'lessons') => {
    if (tab === 'dashboard') {
      setActiveView('dashboard');
      setCurrentLessonId(null);
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
      {/* Render Sidebar only if on Dashboard or if we want it persistent. 
          Design choice: Hide sidebar inside LessonRoom to focus mode, show on Dashboard. */}
      {activeView === 'dashboard' && (
        <Navigation activeTab="dashboard" onNavigate={handleNavigate} />
      )}

      <main className={`flex-1 ${activeView === 'dashboard' ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {activeView === 'dashboard' && (
          <Dashboard progress={progress} onSelectLesson={handleSelectLesson} />
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
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
  const [apiKeySet, setApiKeySet] = useState(false);
  
  // Persist progress in a real app, here just state
  const [progress, setProgress] = useState<UserProgress>({
    completedLessonIds: [],
    currentLessonId: null,
    quizScores: {}
  });

  useEffect(() => {
    const checkKey = async () => {
        // Check if key is already injected in env OR selected via AI Studio
        if (process.env.API_KEY || (window.aistudio && await window.aistudio.hasSelectedApiKey())) {
            setApiKeySet(true);
        }
    };
    checkKey();
  }, []);

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

  const handleKeySelection = async () => {
      if (window.aistudio) {
          await window.aistudio.openSelectKey();
          // As per guidelines: assume the key selection was successful after triggering openSelectKey()
          // and proceed to the app. Do not add delay to mitigate the race condition.
          setApiKeySet(true);
      }
  };

  if (!apiKeySet) {
      return (
          <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-[#161616] border border-[#2d2d2d] rounded-3xl p-10 text-center shadow-2xl">
                  <div className="w-20 h-20 bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                      <Key className="text-rose-500" size={32} />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Welcome to Academy</h1>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                      To access the AI tutor and generated assignments, please securely select your Gemini API key.
                  </p>
                  <button 
                    onClick={handleKeySelection}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-rose-900/20 flex items-center justify-center gap-3"
                  >
                      <Lock size={18} /> Initialize Academy
                  </button>
                  <p className="mt-6 text-xs text-gray-600">
                      Your key is handled securely by the Google AI Studio environment.
                  </p>
              </div>
          </div>
      );
  }

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
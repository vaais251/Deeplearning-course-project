import React from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { Curriculum } from './views/Curriculum';
import { LessonRoom } from './views/LessonRoom';
import { CURRICULUM } from './constants';
import { useStore } from './services/store';

const App: React.FC = () => {
  const {
    activeView,
    currentLessonId,
    handleNavigate,
    setActiveView,
  } = useStore();

  const currentLesson = CURRICULUM.find((l) => l.id === currentLessonId);

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
          <Dashboard />
        )}
        {activeView === 'curriculum' && (
          <Curriculum />
        )}
        {activeView === 'lesson' && currentLesson && (
          <LessonRoom
            lesson={currentLesson}
            onBack={() => setActiveView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default App;

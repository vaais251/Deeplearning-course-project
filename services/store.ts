import {create} from 'zustand';
import { UserProgress } from '../types';

interface AppState {
  activeView: 'dashboard' | 'curriculum' | 'lesson';
  currentLessonId: string | null;
  progress: UserProgress;
  setActiveView: (view: 'dashboard' | 'curriculum' | 'lesson') => void;
  setCurrentLessonId: (id: string | null) => void;
  handleNavigate: (tab: 'dashboard' | 'lessons') => void;
  handleSelectLesson: (id: string) => void;
  handleLessonComplete: (score: number) => void;
}

export const useStore = create<AppState>((set) => ({
  activeView: 'dashboard',
  currentLessonId: null,
  progress: {
    completedLessonIds: [],
    currentLessonId: null,
    quizScores: {},
    streak: 0,
    lastCompletionDate: null,
  },
  setActiveView: (view) => set({ activeView: view }),
  setCurrentLessonId: (id) => set({ currentLessonId: id }),
  handleNavigate: (tab) => {
    set({ currentLessonId: null });
    if (tab === 'dashboard') {
      set({ activeView: 'dashboard' });
    } else if (tab === 'lessons') {
      set({ activeView: 'curriculum' });
    }
  },
  handleSelectLesson: (id) => {
    set({ currentLessonId: id, activeView: 'lesson' });
  },
  handleLessonComplete: (score) => {
    set((state) => {
      if (state.currentLessonId && !state.progress.completedLessonIds.includes(state.currentLessonId)) {
        const today = new Date();
        const lastCompletion = state.progress.lastCompletionDate ? new Date(state.progress.lastCompletionDate) : null;
        let newStreak = state.progress.streak;

        if (lastCompletion) {
          const diffTime = Math.abs(today.getTime() - lastCompletion.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak++;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        return {
          progress: {
            ...state.progress,
            completedLessonIds: [...state.progress.completedLessonIds, state.currentLessonId],
            quizScores: {
              ...state.progress.quizScores,
              [state.currentLessonId]: score,
            },
            lastCompletionDate: today.toISOString(),
            streak: newStreak,
          },
        };
      }
      return {};
    });
  },
}));

export enum ContentType {
  VIDEO = 'VIDEO',
  BLOG = 'BLOG'
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  url: string; // YouTube ID or Blog URL
  thumbnail: string;
  duration?: string; // e.g., "2h 15m"
  tags: string[];
}

export interface UserProgress {
  completedLessonIds: string[];
  currentLessonId: string | null;
  quizScores: Record<string, number>; // lessonId -> score
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum TabState {
  OVERVIEW = 'OVERVIEW',
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ'
}
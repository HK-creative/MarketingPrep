// Type definitions for GlassPrep

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

export interface MatchingPair {
  metric: string;
  definition: string;
}

export interface Acronym {
  acronym: string;
  expansion: string;
}

export interface CaseStudy {
  id: string;
  scenario: string;
  guidance: string;
}

export interface GameContent {
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  matchingPairs: MatchingPair[];
  acronyms: Acronym[];
  cases: CaseStudy[];
}

export interface GameScore {
  correct: number;
  wrong: number;
  totalTime: number;
  avgResponseTime: number;
  streak?: number;
  attempts?: number;
  completionTime?: number;
  selfScores?: number[];
}

export interface ModuleProgress {
  moduleId: string;
  highScore: number;
  lastPlayed: string;
  totalAttempts: number;
  bestTime?: number;
  scores: GameScore[];
}

export interface UserProgress {
  modules: Record<string, ModuleProgress>;
  lastPlayed: string;
  totalPlayTime: number;
}

export interface GameModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  winCondition: string;
  hasTimer: boolean;
}

export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
} 
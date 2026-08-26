export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningStyle = 'practice' | 'conceptual' | 'fast-track';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskType = 'concept' | 'practice' | 'quiz' | 'revision';
export type MilestoneStatus = 'locked' | 'current' | 'completed' | 'pending' | 'in-progress';

export interface Milestone {
  id: string;
  title: string;
  phaseId: string;
  priority: PriorityLevel;
  estimatedHours: number;
  status: MilestoneStatus;
  progressPercentage?: number; // 0 - 100
  topics: string[];
  tips: string[];
  dayOffset: number; // relative day in the roadmap
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedDays: number;
  milestones: Milestone[];
}

export interface DailyTask {
  id: string;
  title: string;
  topic: string;
  phaseId: string;
  durationMinutes: number;
  priority: PriorityLevel;
  type: TaskType;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  dayNumber: number;
  notes?: string;
}

export interface WeakArea {
  id: string;
  topic: string;
  subject: string;
  accuracyScore: number; // percentage, e.g., 35%
  frequencyMissed: number;
  status: 'critical' | 'improving' | 'mastered';
  lastPracticed: string;
  recommendedAction: string;
  keyConcepts: string[];
  revisionDueDate: string; // for spaced repetition
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  whyCorrect?: string;
  commonMistake?: string;
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  confidence: number; // 1 to 5
}

export interface QuizResult {
  id: string;
  date: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSeconds: number;
  answers: QuizAnswerSubmission[];
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  topic?: string;
  isSavedNote?: boolean;
}

export interface StudyPlan {
  id: string;
  subject: string;
  goal: string;
  examDate: string; // YYYY-MM-DD
  dailyHours: number;
  knowledgeLevel: KnowledgeLevel;
  learningStyle: LearningStyle;
  topics: string[];
  createdAt: string;
  readinessScore: number; // 0 - 100
  streakDays: number;
  totalStudyHours: number;
  completedStudyHours: number;
  currentDay: number;
  totalDays: number;
  phases: RoadmapPhase[];
  dailyTasks: DailyTask[];
  weakAreas: WeakArea[];
  quizHistory: QuizResult[];
}

export type ActiveView = 'landing' | 'onboarding' | 'dashboard' | 'roadmap' | 'quiz' | 'tutor';

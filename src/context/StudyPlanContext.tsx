import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveView,
  DailyTask,
  Milestone,
  MilestoneStatus,
  QuizResult,
  StudyPlan,
  TutorMessage,
  WeakArea
} from '../types';
import { PRESET_STUDY_PLANS } from '../data/presets';
import {
  generateStudyPlanAsync,
  getTutorAnswer,
  rebalanceStudyPlan
} from '../services/aiService';
import confetti from 'canvas-confetti';

interface StudyPlanContextType {
  plan: StudyPlan;
  allPlans: StudyPlan[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  createNewPlan: (
    subject: string,
    topics: string[],
    examDate: string,
    dailyHours: number,
    knowledgeLevel: 'beginner' | 'intermediate' | 'advanced',
    learningStyle: 'practice' | 'conceptual' | 'fast-track',
    goal?: string
  ) => Promise<void>;
  selectPlan: (planId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateMilestoneStatus: (milestoneId: string, status: MilestoneStatus) => void;
  completeMilestone: (milestoneId: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  triggerRebalance: (reason: string) => void;
  tutorMessages: TutorMessage[];
  isTutorTyping: boolean;
  sendTutorMessage: (text: string, activeTopic?: string) => Promise<void>;
  savedNotes: string[];
  saveNote: (note: string) => void;
  resetToPreset: (presetId: string) => void;
  deletePlan: (planId: string) => void;
  updateTaskNotes: (taskId: string, notes: string) => void;
}

const STORAGE_KEY_PLANS = 'edupath_ai_plans_v1';
const STORAGE_KEY_ACTIVE_ID = 'edupath_ai_active_id_v1';
const STORAGE_KEY_API_KEY = 'edupath_ai_gemini_key_v1';
const STORAGE_KEY_NOTES = 'edupath_ai_saved_notes_v1';

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined);

export const StudyPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allPlans, setAllPlans] = useState<StudyPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading plans from localStorage', e);
    }
    return PRESET_STUDY_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved && allPlans.some(p => p.id === saved)) return saved;
    } catch (e) {
      console.warn('Error reading active plan ID', e);
    }
    return PRESET_STUDY_PLANS[0].id;
  });

  const [activeView, setActiveView] = useState<ActiveView>('landing');
  
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  });

  const [savedNotes, setSavedNotes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading notes', e);
    }
    return [
      '⚡ Binary Search Invariant: Use low + (high - low) // 2 to eliminate potential integer overflow.',
      '🎯 Feynman Technique: If you cannot explain an invariant in plain English in 2 minutes, revisit the first-principles foundation.'
    ];
  });

  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### 1. 💡 Simple Explanation
Hello! I am your **EduPath AI Study Coach** 🤖. Think of me as your personal tutor who breaks complex academic concepts into intuitive analogies.

### 2. 🔑 Key Concept
- **Real-Time Integration**: Loaded with your active curriculum, target exam timeline, and weak spots.
- **Pedagogical Structure**: Every explanation gives you intuition, invariant rules, working examples, and exam takeaways.

### 3. 📝 Example
You can ask:
- *"Explain Dijkstra's algorithm with an analogy."*
- *"Give me a mnemonic for USMLE cranial nerves."*
- *"Walk me through 0/1 Knapsack state transitions step-by-step."*

### 4. 📌 Short Takeaway
> **⚡ Action Tip**: Use the quick prompt pills above or type any question below to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTutorTyping, setIsTutorTyping] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(allPlans));
  }, [allPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activePlanId);
  }, [activePlanId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(savedNotes));
  }, [savedNotes]);

  const activePlan = allPlans.find(p => p.id === activePlanId) || allPlans[0] || PRESET_STUDY_PLANS[0];

  const updateCurrentPlan = (updater: (prev: StudyPlan) => StudyPlan) => {
    setAllPlans(prevPlans =>
      prevPlans.map(p => (p.id === activePlan.id ? updater(p) : p))
    );
  };

  const createNewPlan = async (
    subject: string,
    topics: string[],
    examDate: string,
    dailyHours: number,
    knowledgeLevel: 'beginner' | 'intermediate' | 'advanced',
    learningStyle: 'practice' | 'conceptual' | 'fast-track',
    goal: string = 'High Mastery & Exam Confidence'
  ) => {
    const newPlan = await generateStudyPlanAsync(
      subject,
      topics,
      examDate,
      dailyHours,
      knowledgeLevel,
      learningStyle,
      goal,
      apiKey
    );
    setAllPlans(prev => [newPlan, ...prev]);
    setActivePlanId(newPlan.id);
    setActiveView('dashboard');
  };

  const selectPlan = (planId: string) => {
    if (allPlans.some(p => p.id === planId)) {
      setActivePlanId(planId);
    }
  };

  const deletePlan = (planId: string) => {
    if (allPlans.length <= 1) return;
    const remaining = allPlans.filter(p => p.id !== planId);
    setAllPlans(remaining);
    setActivePlanId(remaining[0].id);
  };

  const toggleTaskCompletion = (taskId: string) => {
    updateCurrentPlan(prev => {
      const updatedTasks = prev.dailyTasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      
      const isNowCompleted = updatedTasks.find(t => t.id === taskId)?.completed;
      const scoreDelta = isNowCompleted ? 3 : -3;
      const newReadiness = Math.min(100, Math.max(20, prev.readinessScore + scoreDelta));
      const additionalHours = isNowCompleted ? 0.75 : -0.75;
      const completedHours = Math.max(0, Math.round((prev.completedStudyHours + additionalHours) * 10) / 10);

      return {
        ...prev,
        dailyTasks: updatedTasks,
        readinessScore: newReadiness,
        completedStudyHours: completedHours
      };
    });
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
    updateCurrentPlan(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(t => (t.id === taskId ? { ...t, notes } : t))
    }));
  };

  const updateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    updateCurrentPlan(prev => {
      const updatedPhases = prev.phases.map(phase => ({
        ...phase,
        milestones: phase.milestones.map(m => (m.id === milestoneId ? { ...m, status } : m))
      }));

      let totalMilestones = 0;
      let completedMilestones = 0;
      updatedPhases.forEach(p => {
        p.milestones.forEach(m => {
          totalMilestones++;
          if (m.status === 'completed') completedMilestones++;
        });
      });

      const milestoneCompletionPct = Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100);
      const readiness = Math.min(100, Math.max(30, Math.round(milestoneCompletionPct * 0.7 + prev.streakDays * 3)));

      return {
        ...prev,
        phases: updatedPhases,
        readinessScore: readiness
      };
    });
  };

  const completeMilestone = (milestoneId: string) => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    updateCurrentPlan(prev => {
      let foundCompleted = false;
      let nextUnlocked = false;

      const updatedPhases = prev.phases.map(phase => {
        return {
          ...phase,
          milestones: phase.milestones.map(m => {
            if (m.id === milestoneId) {
              foundCompleted = true;
              return {
                ...m,
                status: 'completed' as MilestoneStatus,
                progressPercentage: 100
              };
            }

            if (foundCompleted && !nextUnlocked && (m.status === 'pending' || m.status === 'locked')) {
              nextUnlocked = true;
              return {
                ...m,
                status: 'current' as MilestoneStatus,
                progressPercentage: 20
              };
            }

            return m;
          })
        };
      });

      let totalMilestones = 0;
      let completedMilestones = 0;
      updatedPhases.forEach(p => {
        p.milestones.forEach(m => {
          totalMilestones++;
          if (m.status === 'completed') completedMilestones++;
        });
      });

      const milestoneCompletionPct = Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100);
      const readiness = Math.min(100, Math.max(30, Math.round(milestoneCompletionPct * 0.65 + prev.streakDays * 3 + 10)));
      const newCompletedHours = Math.min(prev.totalStudyHours, Math.round((prev.completedStudyHours + 3.5) * 10) / 10);

      return {
        ...prev,
        phases: updatedPhases,
        readinessScore: readiness,
        completedStudyHours: newCompletedHours
      };
    });
  };

  const recordQuizResult = (result: QuizResult) => {
    updateCurrentPlan(prev => {
      const updatedHistory = [result, ...prev.quizHistory];
      
      const isWeak = result.percentage < 60;
      let updatedWeakAreas = [...prev.weakAreas];
      const existingWeakIdx = updatedWeakAreas.findIndex(w => w.topic.toLowerCase() === result.topic.toLowerCase());

      if (isWeak) {
        if (existingWeakIdx >= 0) {
          updatedWeakAreas[existingWeakIdx] = {
            ...updatedWeakAreas[existingWeakIdx],
            accuracyScore: Math.round((updatedWeakAreas[existingWeakIdx].accuracyScore + result.percentage) / 2),
            frequencyMissed: updatedWeakAreas[existingWeakIdx].frequencyMissed + 1,
            status: 'critical',
            lastPracticed: 'Just now'
          };
        } else {
          const newWeak: WeakArea = {
            id: `weak-auto-${Date.now()}`,
            topic: result.topic,
            subject: prev.subject,
            accuracyScore: result.percentage,
            frequencyMissed: 1,
            status: 'critical',
            lastPracticed: 'Just now',
            recommendedAction: `Focus on fundamentals and retry 5 practice questions for ${result.topic}.`,
            keyConcepts: ['Formula application', 'Edge condition analysis'],
            revisionDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          updatedWeakAreas.unshift(newWeak);
        }
      } else if (existingWeakIdx >= 0 && result.percentage >= 80) {
        updatedWeakAreas[existingWeakIdx] = {
          ...updatedWeakAreas[existingWeakIdx],
          accuracyScore: Math.min(100, updatedWeakAreas[existingWeakIdx].accuracyScore + 25),
          status: 'mastered',
          lastPracticed: 'Just now'
        };
      }

      const scoreDelta = result.percentage >= 70 ? 4 : -2;
      const newReadiness = Math.min(100, Math.max(20, prev.readinessScore + scoreDelta));

      return {
        ...prev,
        quizHistory: updatedHistory,
        weakAreas: updatedWeakAreas,
        readinessScore: newReadiness
      };
    });
  };

  const triggerRebalance = (reason: string) => {
    updateCurrentPlan(prev => rebalanceStudyPlan(prev, reason));
  };

  const sendTutorMessage = async (text: string, activeTopic?: string) => {
    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: activeTopic || activePlan.topics[0]
    };

    setTutorMessages(prev => [...prev, userMsg]);
    setIsTutorTyping(true);

    try {
      const weakTopics = activePlan.weakAreas.map(w => w.topic);
      const answer = await getTutorAnswer(
        text,
        activePlan.subject,
        activeTopic || activePlan.topics[0] || 'General Syllabus',
        weakTopics,
        apiKey
      );

      const assistantMsg: TutorMessage = {
        id: `msg-res-${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: activeTopic
      };

      setTutorMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Error getting tutor answer', e);
    } finally {
      setIsTutorTyping(false);
    }
  };

  const saveNote = (note: string) => {
    if (!savedNotes.includes(note)) {
      setSavedNotes(prev => [note, ...prev]);
    }
  };

  const resetToPreset = (presetId: string) => {
    const preset = PRESET_STUDY_PLANS.find(p => p.id === presetId);
    if (preset) {
      if (!allPlans.some(p => p.id === presetId)) {
        setAllPlans(prev => [preset, ...prev]);
      }
      setActivePlanId(preset.id);
      setActiveView('dashboard');
    }
  };

  return (
    <StudyPlanContext.Provider
      value={{
        plan: activePlan,
        allPlans,
        activeView,
        setActiveView,
        apiKey,
        setApiKey,
        createNewPlan,
        selectPlan,
        toggleTaskCompletion,
        updateMilestoneStatus,
        completeMilestone,
        recordQuizResult,
        triggerRebalance,
        tutorMessages,
        isTutorTyping,
        sendTutorMessage,
        savedNotes,
        saveNote,
        resetToPreset,
        deletePlan,
        updateTaskNotes
      }}
    >
      {children}
    </StudyPlanContext.Provider>
  );
};

export const useStudyPlan = () => {
  const context = useContext(StudyPlanContext);
  if (!context) {
    throw new Error('useStudyPlan must be used within a StudyPlanProvider');
  }
  return context;
};

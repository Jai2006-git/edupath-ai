import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Check,
  PlusCircle,
  MessageSquare,
  Compass,
  Target,
  Zap,
  Bookmark,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface DashboardViewProps {
  onOpenRebalance: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenRebalance }) => {
  const {
    plan,
    setActiveView,
    toggleTaskCompletion,
    sendTutorMessage,
    completeMilestone
  } = useStudyPlan();

  const [activeTaskFilter, setActiveTaskFilter] = useState<'all' | 'high' | 'practice' | 'quiz' | 'revision'>('all');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleTaskToggle = (taskId: string, isNowCompleted: boolean) => {
    toggleTaskCompletion(taskId);
    if (!isNowCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      setSuccessBanner('Task completed! +3% Exam Readiness score boost 🚀');
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  const handlePracticeWeakArea = (topic: string) => {
    setActiveView('quiz');
  };

  const handleAskTutorAboutWeakArea = (topic: string) => {
    sendTutorMessage(
      `Explain the core mental models and edge cases in ${topic}. Give me 1 mnemonic and 1 standard exam pitfall.`,
      topic
    );
    setActiveView('tutor');
  };

  // Find next recommended milestone
  let nextRecommendedMilestone = plan.phases[0]?.milestones[0];
  for (const phase of plan.phases) {
    const currentOrPending = phase.milestones.find(
      m => m.status === 'current' || m.status === 'in-progress' || m.status === 'pending' || m.status === 'locked'
    );
    if (currentOrPending) {
      nextRecommendedMilestone = currentOrPending;
      break;
    }
  }

  // Filter tasks
  const filteredTasks = plan.dailyTasks.filter(task => {
    if (activeTaskFilter === 'all') return true;
    if (activeTaskFilter === 'high') return task.priority === 'high';
    return task.type === activeTaskFilter;
  });

  const completedTasksCount = plan.dailyTasks.filter(t => t.completed).length;
  const totalTasksCount = plan.dailyTasks.length;
  const taskProgressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Milestone completion statistics
  let totalMilestonesCount = 0;
  let completedMilestonesCount = 0;
  plan.phases.forEach(p => {
    p.milestones.forEach(m => {
      totalMilestonesCount++;
      if (m.status === 'completed') completedMilestonesCount++;
    });
  });
  const overallMilestonePct = totalMilestonesCount > 0 ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) : 0;

  // Weekly study hours chart data
  const weeklyData = [
    { day: 'Mon', actual: 2.5, target: plan.dailyHours },
    { day: 'Tue', actual: 3.5, target: plan.dailyHours },
    { day: 'Wed', actual: 2.0, target: plan.dailyHours },
    { day: 'Thu', actual: 3.0, target: plan.dailyHours },
    { day: 'Fri', actual: 4.0, target: plan.dailyHours },
    { day: 'Sat', actual: 3.5, target: plan.dailyHours },
    { day: 'Sun', actual: plan.completedStudyHours > 0 ? Math.min(plan.dailyHours, 2.5) : 1.5, target: plan.dailyHours },
  ];

  const totalWeeklyHours = weeklyData.reduce((acc, curr) => acc + curr.actual, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* SUCCESS NOTIFICATION TOAST */}
        <AnimatePresence>
          {successBanner && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl shadow-brand-500/25 border border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-accent-200 animate-spin" />
                <span>{successBanner}</span>
              </div>
              <button
                onClick={() => setSuccessBanner(null)}
                className="text-white/80 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. PERSONALIZED WELCOME & SUBJECT BANNER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                AI Active Study Companion
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Target: <strong className="text-slate-200">{plan.goal}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back! Let's master <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-accent-400 bg-clip-text text-transparent">{plan.subject}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              You are currently on <strong>Day {plan.currentDay}</strong> of your {plan.totalDays}-day study timeline. Focus on today's high-yield tasks to maintain momentum!
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setActiveView('roadmap')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              View Full Roadmap
            </button>

            <button
              onClick={() => setActiveView('quiz')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Start AI Quiz
            </button>

            <button
              onClick={onOpenRebalance}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition"
              title="Rebalance study schedule"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
              Rebalance
            </button>
          </div>
        </div>

        {/* 2. CORE KPI CARDS (READINESS, STREAK, COUNTDOWN, TARGET HOURS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Exam Readiness Score */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Readiness</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">{plan.readinessScore}%</span>
              <span className="text-xs font-bold text-emerald-400">
                {plan.readinessScore > 75 ? 'Mastery Tier' : plan.readinessScore > 50 ? 'On Track' : 'Needs Practice'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${plan.readinessScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">Based on task completions & quiz accuracy</p>
            </div>
          </div>

          {/* 2. Current Study Streak */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Study Streak</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">{plan.streakDays} Days</span>
              <span className="text-xs font-bold text-amber-400">🔥 Top 10% Consistency</span>
            </div>
            {/* Streak heat dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'Today'].map((d, idx) => (
                <div
                  key={idx}
                  title={`${d}: Active`}
                  className={`flex-1 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                    idx < 6
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-sm'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Days to Exam Countdown */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Countdown</span>
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {Math.max(1, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
              </span>
              <span className="text-xs font-bold text-slate-300">Days Remaining</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Deadline: <strong className="text-slate-200">{plan.examDate}</strong>
            </p>
          </div>

          {/* 4. Overall Roadmap Completion */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap Milestones</span>
              <div className="w-8 h-8 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-accent-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">{overallMilestonePct}%</span>
              <span className="text-xs font-bold text-accent-300">
                {completedMilestonesCount}/{totalMilestonesCount} Topics
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${overallMilestonePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. NEXT RECOMMENDED TOPIC HERO CARD */}
        {nextRecommendedMilestone && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950/70 via-slate-900 to-indigo-950/80 border border-brand-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 border border-accent-500/30">
                  ⚡ Next Recommended Topic
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    nextRecommendedMilestone.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {nextRecommendedMilestone.priority === 'high' ? '🔥 High Yield' : 'Standard Yield'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white">
                {nextRecommendedMilestone.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  ~{nextRecommendedMilestone.estimatedHours} Hours Required
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  Subtopics: {nextRecommendedMilestone.topics.slice(0, 2).join(', ')}
                </span>
              </div>

              {/* Explainable AI Rationale */}
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-brand-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>
                  <strong>Why Recommended:</strong> Highest examination probability weight in current phase + unlocks dependent subtopics.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => completeMilestone(nextRecommendedMilestone.id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Mark Topic Completed
              </button>

              <button
                onClick={() => {
                  sendTutorMessage(
                    `Give me a 3-minute executive briefing on: "${nextRecommendedMilestone.title}". What are the core theorems and exam traps?`,
                    nextRecommendedMilestone.title
                  );
                  setActiveView('tutor');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-accent-400" /> Ask AI Tutor
              </button>
            </div>
          </div>
        )}

        {/* 4. MAIN 2-COLUMN GRID (LEFT: TODAY'S TASKS & REVISION | RIGHT: WEAK AREAS & CHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: TODAY'S STUDY TASKS & REVISION SCHEDULE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TODAY'S STUDY TASKS */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Today's Actionable Tasks</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Day {plan.currentDay} Checklist
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {completedTasksCount} of {totalTasksCount} tasks completed ({taskProgressPct}%)
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px]">
                  {(['all', 'high', 'practice', 'quiz', 'revision'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveTaskFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        activeTaskFilter === filter
                          ? 'bg-brand-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter === 'high' ? '🔥 High Yield' : filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${taskProgressPct}%` }}
                />
              </div>

              {/* Task Items */}
              <div className="space-y-3 pt-1">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      task.completed
                        ? 'bg-slate-950/40 border-slate-900 opacity-60'
                        : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      
                      {/* Checkbox */}
                      <button
                        onClick={() => handleTaskToggle(task.id, task.completed)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition ${
                          task.completed
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border-2 border-slate-600 hover:border-brand-400 bg-slate-950'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <span
                          className={`text-xs sm:text-sm font-semibold block ${
                            task.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-medium text-slate-300">
                            <BookOpen className="w-3 h-3 text-brand-400" />
                            {task.topic}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.durationMinutes} mins
                          </span>
                          <span>•</span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                              task.priority === 'high'
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {task.priority === 'high' ? 'High Yield' : 'Standard'}
                          </span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400 uppercase">
                            {task.type}
                          </span>
                        </div>

                        {task.notes && (
                          <p className="text-xs text-slate-400 italic bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                            💡 AI Note: {task.notes}
                          </p>
                        )}
                      </div>

                      {/* Quick Action */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {task.type === 'quiz' && !task.completed && (
                          <button
                            onClick={() => setActiveView('quiz')}
                            className="px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white text-xs font-bold transition"
                          >
                            Take Quiz
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sendTutorMessage(`Brief me on "${task.title}" in ${task.topic}.`, task.topic);
                            setActiveView('tutor');
                          }}
                          title="Ask AI Tutor for guidance"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-300 hover:bg-slate-800 transition"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING REVISION (SPACED REPETITION SCHEDULE) */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Upcoming Revision (Ebbinghaus Forgetting Curve)</h3>
                    <p className="text-xs text-slate-400">Scheduled active recall intervals: 1d, 3d, 7d, 14d</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 uppercase">
                  Spaced Retention
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400">
                    Due Today (1-Day Interval)
                  </span>
                  <p className="text-xs font-bold text-white truncate">{plan.topics[0] || 'Foundations'}</p>
                  <p className="text-[11px] text-slate-400">Reinforce before memory decay initiates.</p>
                  <button
                    onClick={() => setActiveView('quiz')}
                    className="text-[11px] font-semibold text-brand-400 hover:underline pt-1 flex items-center gap-1"
                  >
                    Quick Drill <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-400">
                    Due in 2 Days (3-Day Interval)
                  </span>
                  <p className="text-xs font-bold text-white truncate">{plan.topics[1] || 'Core Edge Cases'}</p>
                  <p className="text-[11px] text-slate-400">10-minute diagnostic active recall.</p>
                  <span className="text-[10px] text-slate-500 pt-1 block">Scheduled</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-brand-400">
                    Due in 6 Days (7-Day Interval)
                  </span>
                  <p className="text-xs font-bold text-white truncate">{plan.topics[2] || 'Advanced Patterns'}</p>
                  <p className="text-[11px] text-slate-400">Full-length timed synthesis review.</p>
                  <span className="text-[10px] text-slate-500 pt-1 block">Scheduled</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: WEAK AREAS & WEEKLY ANALYTICS */}
          <div className="space-y-6">
            
            {/* WEAK AREA IDENTIFIER */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Weak-Area Intelligence</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {plan.weakAreas.filter(w => w.status === 'critical').length} Critical
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Concepts flagged by low quiz accuracy or frequent mistakes:
              </p>

              <div className="space-y-3">
                {plan.weakAreas.map(weak => (
                  <div
                    key={weak.id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{weak.topic}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{weak.recommendedAction}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold flex-shrink-0 ${
                          weak.status === 'critical'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : weak.status === 'improving'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {weak.accuracyScore}% Acc
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handlePracticeWeakArea(weak.topic)}
                        className="flex-1 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 text-[11px] font-bold transition text-center"
                      >
                        Practice Now
                      </button>
                      <button
                        onClick={() => handleAskTutorAboutWeakArea(weak.topic)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition text-center"
                      >
                        Ask AI Tutor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WEEKLY STUDY TIME VISUALIZATION (RECHARTS) */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Weekly Progress Visualization</h3>
                  <p className="text-[11px] text-slate-400">Total this week: <strong>{totalWeeklyHours.toFixed(1)} Hours</strong></p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  Target: {plan.dailyHours}h/day
                </span>
              </div>

              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 6]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '11px'
                      }}
                    />
                    <Bar dataKey="actual" radius={[6, 6, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === weeklyData.length - 1 ? '#818cf8' : '#4f46e5'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

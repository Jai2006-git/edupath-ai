import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  HelpCircle,
  RefreshCw,
  Tag,
  ChevronDown,
  ChevronUp,
  Circle,
  Lightbulb,
  BookOpen,
  Filter,
  Check,
  Layers,
  Lock,
  Play,
  RotateCcw,
  AlertCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Milestone, MilestoneStatus, PriorityLevel } from '../types';

interface RoadmapViewProps {
  onOpenRebalance: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onOpenRebalance }) => {
  const {
    plan,
    completeMilestone,
    updateMilestoneStatus,
    setActiveView,
    sendTutorMessage
  } = useStudyPlan();

  const [expandedPhases, setExpandedPhases] = useState<{ [id: string]: boolean }>({
    'phase-1': true,
    'phase-2': true,
    'phase-3': true,
    'phase-4': true
  });

  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'pending'>('all');
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleCompleteTopic = (milestoneId: string, title: string) => {
    completeMilestone(milestoneId);
    setCelebrationMessage(`🎉 "${title}" completed! Next topic unlocked!`);
    setTimeout(() => setCelebrationMessage(null), 3500);
  };

  const handleLaunchQuizForMilestone = (milestone: Milestone) => {
    setActiveView('quiz');
  };

  const handleAskTutorForMilestone = (milestone: Milestone) => {
    sendTutorMessage(
      `Give me an in-depth breakdown of "${milestone.title}". What are the core formulas, edge cases, and exam traps?`,
      milestone.title
    );
    setActiveView('tutor');
  };

  // Calculate overall milestone statistics
  let totalMilestones = 0;
  let completedMilestones = 0;
  let highYieldCount = 0;

  plan.phases.forEach(phase => {
    phase.milestones.forEach(m => {
      totalMilestones++;
      if (m.status === 'completed') completedMilestones++;
      if (m.priority === 'high') highYieldCount++;
    });
  });

  const completionPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* CELEBRATION TOAST */}
        <AnimatePresence>
          {celebrationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl shadow-brand-500/25 border border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-accent-200 animate-spin" />
                <span>{celebrationMessage}</span>
              </div>
              <button
                onClick={() => setCelebrationMessage(null)}
                className="text-white/80 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER & SUMMARY BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Interactive Learning Journey
              </span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {plan.totalDays} Days Structured Curriculum
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalized AI Study Roadmap
            </h1>
            <p className="text-xs text-slate-400">
              Each topic is unlocked progressively as prerequisites are mastered. Mark topics completed to advance!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRebalance}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition hover:scale-[1.02]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              AI Rebalance Schedule
            </button>
          </div>
        </div>

        {/* ROADMAP PROGRESS METRICS */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-semibold">Roadmap Progress</p>
              <p className="text-3xl font-black text-white">{completionPct}%</p>
              <p className="text-[11px] text-emerald-400 font-semibold">
                {completedMilestones} of {totalMilestones} Topics Mastered
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-semibold">Total Study Capacity</p>
              <p className="text-3xl font-black text-brand-400">{plan.totalStudyHours}h</p>
              <p className="text-[11px] text-slate-400">{plan.dailyHours} hours / day commitment</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-semibold">High-Yield Priority Topics</p>
              <p className="text-3xl font-black text-rose-400">{highYieldCount}</p>
              <p className="text-[11px] text-rose-300 font-semibold">Critical 80/20 Examination Weight</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-semibold">Target Exam Deadline</p>
              <p className="text-3xl font-black text-accent-400">{plan.examDate}</p>
              <p className="text-[11px] text-slate-400">
                {Math.max(1, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-300">Filter Topics:</span>
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterPriority('all')}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${
                  filterPriority === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setFilterPriority('high')}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${
                  filterPriority === 'high' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🔥 High-Yield Only
              </button>
              <button
                onClick={() => setFilterPriority('pending')}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${
                  filterPriority === 'pending' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Incomplete Only
              </button>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PHASED TIMELINE */}
        <div className="space-y-8">
          {plan.phases.map((phase, phaseIdx) => {
            const isExpanded = expandedPhases[phase.id] !== false;
            const phaseCompletedCount = phase.milestones.filter(m => m.status === 'completed').length;
            const phaseTotalCount = phase.milestones.length;
            const phasePct = phaseTotalCount > 0 ? Math.round((phaseCompletedCount / phaseTotalCount) * 100) : 0;

            const visibleMilestones = phase.milestones.filter(m => {
              if (filterPriority === 'high') return m.priority === 'high';
              if (filterPriority === 'pending') return m.status !== 'completed';
              return true;
            });

            return (
              <div
                key={phase.id}
                className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl"
              >
                {/* Phase Header Accordion */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-900/40 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center flex-shrink-0 text-base font-black text-white shadow-md">
                      P{phase.phaseNumber}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-base sm:text-lg font-bold text-white">{phase.title}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          ~{phase.estimatedDays} Days
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {phasePct}% Done
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                      {phaseCompletedCount}/{phaseTotalCount} Topics
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Timeline Topics List */}
                {isExpanded && (
                  <div className="p-6 pt-2 space-y-4 border-t border-slate-800/80">
                    {visibleMilestones.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 italic text-center">
                        No topics matching the selected filter.
                      </p>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                        {visibleMilestones.map((milestone, mIdx) => {
                          const isCompleted = milestone.status === 'completed';
                          const isCurrent = milestone.status === 'current' || milestone.status === 'in-progress';
                          const isLocked = milestone.status === 'locked' || milestone.status === 'pending';
                          const progress = milestone.progressPercentage ?? (isCompleted ? 100 : isCurrent ? 35 : 0);

                          return (
                            <div key={milestone.id} className="relative">
                              
                              {/* Timeline Node Icon */}
                              <div
                                className={`absolute -left-[35px] top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                                  isCompleted
                                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                                    : isCurrent
                                    ? 'bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-500/40 animate-pulse'
                                    : 'bg-slate-900 border-slate-700 text-slate-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : isCurrent ? (
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </div>

                              {/* Card Container */}
                              <div
                                className={`p-5 rounded-3xl border transition-all duration-200 ${
                                  isCompleted
                                    ? 'bg-slate-950/40 border-slate-900/80 opacity-75'
                                    : isCurrent
                                    ? 'bg-gradient-to-tr from-brand-950/40 via-slate-900/90 to-indigo-950/40 border-brand-500/50 shadow-xl'
                                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                  
                                  {/* Left: Info */}
                                  <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                      {/* Status Badge */}
                                      <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                          isCompleted
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : isCurrent
                                            ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                      >
                                        {isCompleted ? '✓ Completed' : isCurrent ? '⚡ Current Focus' : '🔒 Next in Queue'}
                                      </span>

                                      {/* Priority Badge */}
                                      <span
                                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                          milestone.priority === 'high'
                                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                      >
                                        {milestone.priority === 'high' ? '🔥 High Yield' : 'Standard Yield'}
                                      </span>

                                      <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                        {milestone.estimatedHours}h Estimated
                                      </span>

                                      <span className="text-xs text-brand-400 font-semibold">
                                        Day ~{milestone.dayOffset}
                                      </span>
                                    </div>

                                    <h3
                                      className={`text-base font-bold ${
                                        isCompleted ? 'line-through text-slate-400' : 'text-white'
                                      }`}
                                    >
                                      {milestone.title}
                                    </h3>

                                    {/* Progress Bar within card */}
                                    <div className="space-y-1 max-w-md">
                                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                                        <span>Mastery Progress</span>
                                        <span>{progress}%</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full transition-all duration-300 ${
                                            isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-brand-500' : 'bg-slate-700'
                                          }`}
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* Subtopics */}
                                    <div className="space-y-1.5 pt-1">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Core Subtopics & Invariants:
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {milestone.topics.map((t, idx) => (
                                          <span
                                            key={idx}
                                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
                                          >
                                            <BookOpen className="w-2.5 h-2.5 text-brand-400" />
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Strategy Tips */}
                                    {milestone.tips && milestone.tips.length > 0 && (
                                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                                          <Lightbulb className="w-3 h-3 text-amber-400" /> AI Examination Strategy Tip:
                                        </span>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          {milestone.tips[0]}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2.5 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                                    
                                    {/* Mark as Completed Button */}
                                    {!isCompleted ? (
                                      <button
                                        onClick={() => handleCompleteTopic(milestone.id, milestone.title)}
                                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Mark Completed
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => updateMilestoneStatus(milestone.id, 'current')}
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                                      >
                                        <RotateCcw className="w-3 h-3" /> Reopen Topic
                                      </button>
                                    )}

                                    {/* Quick Tools */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleLaunchQuizForMilestone(milestone)}
                                        className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center gap-1 border border-brand-500/20 transition"
                                      >
                                        <Award className="w-3 h-3" /> Take Quiz
                                      </button>
                                      <button
                                        onClick={() => handleAskTutorForMilestone(milestone)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
                                      >
                                        <HelpCircle className="w-3 h-3 text-accent-400" /> Ask Tutor
                                      </button>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

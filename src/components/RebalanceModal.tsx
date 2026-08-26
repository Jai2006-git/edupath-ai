import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import {
  X,
  RefreshCw,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RebalanceModal: React.FC<RebalanceModalProps> = ({ isOpen, onClose }) => {
  const { plan, triggerRebalance, activeView, setActiveView } = useStudyPlan();
  const [selectedReason, setSelectedReason] = useState<string>('missed_days');
  const [customNote, setCustomNote] = useState<string>('');
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    {
      id: 'missed_days',
      title: 'I fell behind / missed 1-2 study days',
      desc: 'Compress low-priority items and distribute remaining core topics across the remaining schedule.',
      icon: Clock,
      badge: 'Catch-up Sprint'
    },
    {
      id: 'exam_moved',
      title: 'My exam date or priority changed',
      desc: 'Re-weight phase durations and shift active recall sprints closer to the target deadline.',
      icon: Calendar,
      badge: 'Timeline Shift'
    },
    {
      id: 'topic_struggle',
      title: 'I am struggling with a specific weak area',
      desc: 'Allocate extra daily review blocks and generate active recall recovery drills on weak concepts.',
      icon: AlertTriangle,
      badge: 'Remediation'
    },
    {
      id: 'faster_pace',
      title: 'I want to accelerate my learning velocity',
      desc: 'Expand daily task density and unlock advanced challenge milestones early.',
      icon: Flame,
      badge: 'Fast Track'
    }
  ];

  const handleExecuteRebalance = () => {
    if (isRebalancing || isDone) return;
    setIsRebalancing(true);

    const chosenReasonObj = reasons.find(r => r.id === selectedReason);
    const chosenReason = customNote.trim()
      ? `${chosenReasonObj?.title || 'Schedule Adjustment'} - ${customNote.trim()}`
      : chosenReasonObj?.title || 'Adaptive Schedule Optimization';

    setTimeout(() => {
      triggerRebalance(chosenReason);

      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setIsRebalancing(false);
      setIsDone(true);

      setTimeout(() => {
        setIsDone(false);
        onClose();
        // If on landing or onboarding, route to dashboard
        if (activeView === 'landing' || activeView === 'onboarding') {
          setActiveView('dashboard');
        }
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header (Pinned) */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">AI Schedule Rebalance</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Adaptive AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Dynamically adjust your study timeline to stay on track</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 overscroll-contain">
          <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
            <p className="text-brand-200 leading-relaxed">
              EduPath's adaptive algorithm protects your <strong>High-Yield Core Milestones</strong> while adjusting pacing, so you never have to abandon your study plan before the exam.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Select Adjustment Reason:</span>
              <span className="text-[11px] text-brand-400 lowercase font-normal">click to select</span>
            </label>
            
            <div className="space-y-2.5">
              {reasons.map(r => {
                const isSelected = selectedReason === r.id;
                const Icon = r.icon;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-600/20 to-accent-600/20 border-brand-500 text-white shadow-md shadow-brand-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {r.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 ${
                          isSelected ? 'bg-brand-500/30 text-brand-200' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-300">
              Optional Custom Note to AI Planner:
            </label>
            <input
              type="text"
              placeholder="e.g. Need extra focus on Dynamic Programming, Trees & Graphs..."
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>
        </div>

        {/* Footer (Pinned & Always Visible) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/95 flex items-center justify-between flex-shrink-0 gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            Target: <strong className="text-slate-200">{plan.subject}</strong> ({plan.totalDays}d total)
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecuteRebalance}
              disabled={isRebalancing || isDone}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-brand-500/25 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isRebalancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Optimizing Schedule...</span>
                </>
              ) : isDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Roadmap Rebalanced!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-accent-200" />
                  <span>Apply AI Rebalance</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

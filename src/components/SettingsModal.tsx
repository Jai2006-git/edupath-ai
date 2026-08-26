import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import {
  X,
  Key,
  Database,
  RefreshCw,
  Trash2,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers,
  AlertCircle
} from 'lucide-react';
import { PRESET_STUDY_PLANS } from '../data/presets';
import { sanitizeText } from '../utils/security';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, allPlans, resetToPreset, deletePlan, plan, selectPlan } = useStudyPlan();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const cleanKey = sanitizeText(tempApiKey.trim(), 120);
    setApiKey(cleanKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-white">App Settings & AI Engine</h2>
              <p className="text-xs text-slate-400">Configure AI models, API keys, and demo data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Settings"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">
          
          {/* Gemini Live API Key Option */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Google Gemini Live API Key (Optional)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
                Built-in fallback active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              EduPath AI runs a built-in neural simulation engine offline with instant zero-latency responses. You can optionally paste your free Google Gemini API key to stream live LLM answers during live hackathon judging!
            </p>

            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 shadow-inner"
              />
              <button
                onClick={handleSaveKey}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                {isSaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Key stays strictly in local browser storage
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
              >
                Get free Gemini key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Manage Stored Study Plans */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Active & Saved Study Plans ({allPlans.length})
              </span>
            </div>

            <div className="space-y-2">
              {allPlans.map(p => {
                const isActive = p.id === plan.id;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs transition ${
                      isActive
                        ? 'bg-brand-500/10 border-brand-500/40 text-brand-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate pr-2">
                      <span className="font-semibold text-white truncate">{p.subject}</span>
                      <span className="text-[11px] text-slate-400">
                        {p.dailyHours}h/day • {p.knowledgeLevel} • {p.readinessScore}% readiness
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isActive && (
                        <button
                          onClick={() => selectPlan(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-semibold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                        >
                          Select
                        </button>
                      )}
                      {allPlans.length > 1 && (
                        <button
                          onClick={() => deletePlan(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                          title="Delete plan"
                          aria-label={`Delete study plan for ${p.subject}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preset Demos Quick Loader */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Reload Built-In Hackathon Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_STUDY_PLANS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    resetToPreset(preset.id);
                    onClose();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 text-[11px] text-left text-slate-300 hover:text-white transition flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                >
                  <span className="font-semibold truncate">{preset.subject.split(' ')[0]}...</span>
                  <span className="text-[10px] text-brand-400 mt-1 flex items-center gap-1 font-bold">
                    <RefreshCw className="w-2.5 h-2.5" /> Load Preset
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

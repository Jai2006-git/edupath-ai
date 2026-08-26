import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import {
  Brain,
  Flame,
  LayoutDashboard,
  Map,
  MessageSquare,
  PlusCircle,
  Settings,
  Sparkles,
  Award,
  ChevronDown,
  BookOpen,
  Menu,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ActiveView } from '../types';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { plan, allPlans, activeView, setActiveView, selectPlan, resetToPreset } = useStudyPlan();
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'roadmap', label: 'AI Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'quiz', label: 'AI Quiz', icon: <Award className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Tutor', icon: <MessageSquare className="w-4 h-4" />, badge: 'AI Live' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">EduPath</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 border border-brand-500/30">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">AI Study Companion</p>
              </div>
            </button>

            {/* Active Study Plan Selector */}
            {activeView !== 'landing' && activeView !== 'onboarding' && (
              <div className="relative ml-2 hidden lg:block">
                <button
                  onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:border-slate-700 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  <span className="max-w-[140px] truncate">{plan.subject}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isPlanDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setIsPlanDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Switch Active Study Plan
                    </div>
                    {allPlans.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          selectPlan(p.id);
                          setIsPlanDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                          p.id === plan.id
                            ? 'bg-brand-500/15 text-brand-200 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{p.subject}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {p.readinessScore}%
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsPlanDropdownOpen(false);
                          setActiveView('onboarding');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-brand-400 hover:bg-brand-500/10 flex items-center gap-2 font-semibold"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Create New Study Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          {activeView !== 'landing' && activeView !== 'onboarding' ? (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800/80">
              {navItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span className="ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              <a href="#demo" className="hover:text-white transition">Live Demos</a>
            </div>
          )}

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {activeView !== 'landing' && activeView !== 'onboarding' ? (
              <>
                {/* Streak Badge */}
                <div
                  title={`${plan.streakDays} Day Study Streak`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>{plan.streakDays}d Streak</span>
                </div>

                {/* Readiness Badge */}
                <div
                  title={`Exam Readiness: ${plan.readinessScore}%`}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{plan.readinessScore}% Ready</span>
                </div>

                {/* New Plan Action */}
                <button
                  onClick={() => setActiveView('onboarding')}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 text-xs font-semibold transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brand-400" />
                  New Plan
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => resetToPreset('preset-dsa')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Demo Dashboard
                </button>

                <button
                  onClick={() => setActiveView('onboarding')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Plan
                </button>
              </div>
            )}

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              title="Settings & AI Model"
              aria-label="Settings & AI Model"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition border border-transparent hover:border-slate-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle for Landing Page */}
            {activeView === 'landing' && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown for Landing Page */}
        {activeView === 'landing' && isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3 animate-in fade-in">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              How It Works
            </a>
            <a
              href="#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              Live Demos
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                resetToPreset('preset-dsa');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-400 hover:bg-brand-500/10 flex items-center justify-between"
            >
              <span>Explore Demo Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mobile Sub-Navigation Bar for Dashboard/Roadmap/Quiz/Tutor */}
        {activeView !== 'landing' && activeView !== 'onboarding' && (
          <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-900">
            {navItems.map(item => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                    isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

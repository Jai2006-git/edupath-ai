import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  Award,
  Zap,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
  Flame,
  BookOpen,
  Check,
  MessageSquare,
  RefreshCw,
  Sliders,
  Compass,
  GraduationCap,
  Play,
  RotateCcw,
  Lightbulb,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { PRESET_STUDY_PLANS } from '../data/presets';

export const LandingPage: React.FC = () => {
  const { setActiveView, resetToPreset } = useStudyPlan();
  const [activePreviewTab, setActivePreviewTab] = useState<'roadmap' | 'quiz' | 'tutor' | 'analytics'>('roadmap');

  // Interactive Mini-Quiz State on Landing Page
  const [miniQuizSelected, setMiniQuizSelected] = useState<number | null>(null);
  const [miniQuizSubmitted, setMiniQuizSubmitted] = useState<boolean>(false);

  // Interactive Mini-Tutor State on Landing Page
  const [miniTutorPrompt, setMiniTutorPrompt] = useState<string>('Explain dynamic programming state transitions like I am 5');
  const [miniTutorResponse, setMiniTutorResponse] = useState<string>(
    '💡 **ELI5 Analogy**: Imagine walking up a giant staircase. Instead of recalculating how many steps you climbed every single second, you write your current step count in chalk on the floor. When you reach step 10, you simply look at chalk note on step 9! In computer science, that chalk note is called **memoization**.'
  );
  const [isMiniTutorThinking, setIsMiniTutorThinking] = useState(false);

  const handleMiniTutorAsk = (prompt: string, answer: string) => {
    setMiniTutorPrompt(prompt);
    setIsMiniTutorThinking(true);
    setTimeout(() => {
      setMiniTutorResponse(answer);
      setIsMiniTutorThinking(false);
    }, 400);
  };

  const problemVsSolution = [
    {
      problemTitle: 'Chaotic, Unmanageable Syllabi',
      problemDesc: 'Students receive 40+ topic syllabi without knowing dependencies, priorities, or how many hours each chapter requires.',
      solutionTitle: 'AI Personalized Phased Roadmap',
      solutionDesc: 'Deconstructs raw topics into 4 cognitive phases with exact time allocations and 80/20 High-Yield tagging.'
    },
    {
      problemTitle: 'Rigid Schedules & Panic When Falling Behind',
      problemDesc: 'Missing a single day on a static calendar causes the entire plan to collapse, leading to cramming and anxiety.',
      solutionTitle: '1-Click Adaptive Schedule Rebalancing',
      solutionDesc: 'Intelligently recalibrates milestone pacing, compresses low-yield items, and reorganizes daily tasks so you stay on track.'
    },
    {
      problemTitle: 'Passive Reading & The Illusion of Competence',
      problemDesc: 'Highlighting textbooks creates a false feeling of mastery, leading to unexpected failures on examination day.',
      solutionTitle: 'Active Recall Drills with Distractor Analysis',
      solutionDesc: 'Timed multiple-choice drills with first-principles invariant proofs and common trap explanations to cement long-term memory.'
    },
    {
      problemTitle: 'Blindspots & Unaddressed Weak Areas',
      problemDesc: 'Students repeatedly review what they already know while ignoring critical gaps that cost exam marks.',
      solutionTitle: 'Weak-Area Intelligence Tracker',
      solutionDesc: 'Automatically logs missed concepts, computes topic accuracy, and injects targeted remediation sessions.'
    }
  ];

  const features = [
    {
      icon: <Compass className="w-6 h-6 text-brand-400" />,
      title: 'AI Personalized Study Roadmap',
      badge: 'Adaptive Engine',
      desc: 'Transforms unmanageable syllabi into a prioritized, day-by-day timeline calibrated to your exact exam date and available daily hours.'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: 'Daily Micro-Action Tasks',
      badge: 'Zero Friction',
      desc: 'Eliminates decision fatigue with clear daily tasks categorized by Concept, Practice, Active Recall Quiz, and Spaced Revision.'
    },
    {
      icon: <Target className="w-6 h-6 text-rose-400" />,
      title: 'High-Yield Priority Matrix',
      badge: '80/20 Rule',
      desc: 'Smart algorithms tag Critical High-Yield examination concepts so you capture the majority of test points in the shortest time.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: 'Active Recall Quiz Generator',
      badge: 'Active Retrieval',
      desc: 'Instant diagnostic quizzes featuring real-time timers, distractor breakdowns, cognitive confidence ratings, and streak tracking.'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-accent-400" />,
      title: '24/7 Context-Aware AI Tutor',
      badge: 'Syllabus Synced',
      desc: 'Ask doubts anytime. The AI tutor is synchronized with your specific subject, roadmap phase, and error patterns for tailored intuition.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-400" />,
      title: 'Live Readiness Dashboard',
      badge: 'Real-Time KPIs',
      desc: 'Tracks exam readiness percentage, daily study streaks, time investment analytics, and visual phase completion milestones.'
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      title: 'Weak-Area Identification',
      badge: 'Mistake Diagnostics',
      desc: 'Automatically logs missed quiz questions, computes concept accuracy scores, and generates targeted recovery drills.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      title: 'Spaced Repetition Schedule',
      badge: 'Forgetting Curve',
      desc: 'Implements the Ebbinghaus retention intervals (1d, 3d, 7d, 14d) to cement formulas and invariants into permanent long-term memory.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Input Your Syllabus & Deadlines',
      desc: 'Enter your subject, syllabus topics, target exam date, daily hours commitment, and current knowledge baseline (Beginner to Advanced).'
    },
    {
      number: '02',
      title: 'AI Generates Phased Roadmap',
      desc: 'Our cognitive engine partitions your syllabus into 4 structured phases: Foundations, Core Deep-Dive, High-Yield Mastery, and Mock Sprint.'
    },
    {
      number: '03',
      title: 'Execute Daily Actionable Tasks',
      desc: 'Follow your clear daily study plan. Mark completed tasks, solve practice problems, and earn streak badges as your readiness score climbs.'
    },
    {
      number: '04',
      title: 'Retain Forever with AI Active Recall',
      desc: 'Take timed active-recall quizzes, resolve tough doubts with your 24/7 AI tutor, and conquer flagged weak spots before exam day.'
    }
  ];

  const stats = [
    { value: '100%', label: 'Personalized Adaptive Pacing', sub: 'No rigid static calendars' },
    { value: '4.2x', label: 'Higher Long-Term Retention', sub: 'Backed by Spaced Retrieval' },
    { value: '24/7', label: 'Context-Aware AI Tutor', sub: 'Instant doubt clarification' },
    { value: '80/20', label: 'High-Yield Topic Priority', sub: 'Max points in min time' }
  ];

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
      
      {/* BACKGROUND GRADIENTS & GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-accent-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-96 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-28 space-y-32">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-950/80 via-slate-900/80 to-accent-950/80 border border-brand-500/30 text-xs font-semibold shadow-inner"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-ping" />
            <span className="text-slate-200">EduPath AI 2.0</span>
            <span className="text-brand-400 font-bold">•</span>
            <span className="text-accent-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-400" /> Next-Gen AI Study Companion
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Master Any Syllabus. <br />
            <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-accent-400 bg-clip-text text-transparent">
              Powered by Adaptive AI.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Stop guessing what to study before examinations. EduPath AI transforms messy syllabi into a customized day-by-day roadmap, active recall quizzes, weak-area analytics, and a 24/7 AI tutor.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => setActiveView('onboarding')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-accent-200" />
              Build My AI Study Plan Free
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => resetToPreset('preset-dsa')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-sm font-semibold transition hover:border-slate-600 shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Explore Live Demo Dashboard
            </button>
          </motion.div>

          {/* Metric Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-300">{stat.label}</p>
                <p className="text-[10px] text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </motion.div>

        </section>

        {/* PROBLEM VS SOLUTION SHOWCASE */}
        <section aria-labelledby="problem-solution-title" className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Why Traditional Studying Fails
            </span>
            <h2 id="problem-solution-title" className="text-2xl sm:text-4xl font-extrabold text-white">
              The Examination Crisis & How EduPath AI Solves It
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Students struggle with unorganized syllabi, passive memorization, and panic when falling behind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {problemVsSolution.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-brand-500/40 transition shadow-xl"
              >
                {/* Problem side */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>The Struggle: {item.problemTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-6">{item.problemDesc}</p>
                </div>

                {/* Solution side */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>EduPath AI Solution: {item.solutionTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-6">{item.solutionDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI FOR SOCIAL IMPACT & EDUCATIONAL EQUITY */}
        <section aria-labelledby="social-impact-title" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-950/40 via-slate-900/60 to-purple-950/40 border border-brand-500/30 space-y-8 shadow-2xl">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-300 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI for Social Impact & Educational Equity
            </span>
            <h2 id="social-impact-title" className="text-2xl sm:text-4xl font-extrabold text-white">
              Democratizing World-Class Mentorship for Every Student
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Private 1-on-1 tutoring costs upwards of \$2,500/year, creating an unfair barrier for underserved students. 
              <strong className="text-white"> EduPath AI bridges this academic divide</strong> by providing personalized cognitive roadmaps, active diagnostic quizzes, and 24/7 conceptual tutoring to anyone with a web browser — entirely free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">$0 vs $2,500</span>
              <h3 className="text-sm font-bold text-white">Free Equal Opportunity</h3>
              <p className="text-xs text-slate-400">Replaces expensive private coaching with accessible, high-yield AI mentorship.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-brand-400">4.2x Retention</span>
              <h3 className="text-sm font-bold text-white">Spaced Active Recall</h3>
              <p className="text-xs text-slate-400">Interrupts Ebbinghaus memory decay using automated interval retrieval drills.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-accent-400">100% Adaptive</span>
              <h3 className="text-sm font-bold text-white">Zero Abandonment</h3>
              <p className="text-xs text-slate-400">Dynamic rebalancing adjusts priorities when students fall behind or miss study days.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">24/7 Available</span>
              <h3 className="text-sm font-bold text-white">Instant Doubt Support</h3>
              <p className="text-xs text-slate-400">No student gets stuck alone at midnight with structured, first-principles AI explanations.</p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRODUCT PREVIEW COMPONENT */}
        <section aria-labelledby="product-tour-title" className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Interactive Product Tour
            </span>
            <h2 id="product-tour-title" className="text-2xl sm:text-4xl font-extrabold text-white">
              Experience the EduPath AI Engine Live
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click the tabs below to preview each AI module in action before launching your own curriculum.
            </p>
          </div>

          {/* Interactive Shell */}
          <div className="glass-panel rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden max-w-5xl mx-auto">
            
            {/* Top Tab Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
                  edupath-ai.app/preview
                </span>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'roadmap', label: 'AI Roadmap', icon: <Compass className="w-3.5 h-3.5" /> },
                  { id: 'quiz', label: 'Active Recall Quiz', icon: <Award className="w-3.5 h-3.5" /> },
                  { id: 'tutor', label: '24/7 AI Tutor', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                  { id: 'analytics', label: 'Readiness Metrics', icon: <BarChart3 className="w-3.5 h-3.5" /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePreviewTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                      activePreviewTab === tab.id
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-6 sm:p-8 bg-slate-950/40 min-h-[380px]">
              
              {/* 1. ROADMAP PREVIEW */}
              {activePreviewTab === 'roadmap' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                        Syllabus Phase Breakdown • Data Structures & Algorithms
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Phased Timeline & High-Yield Milestone Graph
                      </h3>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold w-fit">
                      4 Phases Generated
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Phase 1: Foundations
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">100% Mastered</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Arrays, Two Pointers & Invariants</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Core pointer logic, window bounds, and monotonic index operations.
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                        ⚡ 6.0 Hours • Day 1-3
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-950/30 border border-brand-500/40 space-y-2 shadow-lg shadow-brand-500/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          Phase 2: Core Deep Dive
                        </span>
                        <span className="text-xs text-brand-300 font-bold">In Progress (50%)</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Binary Trees & BST Traversals</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Recursive invariants, tree heights, and Lowest Common Ancestor.
                      </p>
                      <div className="text-[11px] font-mono text-brand-300 pt-1 border-t border-slate-800">
                        ⚡ 8.5 Hours • Day 4-7
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 opacity-80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Phase 3: High-Yield
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">Upcoming</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Dynamic Programming (1D & 2D Knapsack)</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        State transitions, overlapping subproblems, and memory space optimization.
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                        ⚡ 12.0 Hours • Day 8-11
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. QUIZ PREVIEW */}
              {activePreviewTab === 'quiz' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        Live Active Recall Simulator • Trees & BST
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Interactive Active Retrieval with Distractor Analysis
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                      Question 1 of 5
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <p className="text-sm font-semibold text-white">
                      What is the time complexity of searching in a balanced BST vs a skewed BST in the worst case?
                    </p>

                    <div className="space-y-2">
                      {[
                        { text: 'O(log N) for balanced, O(N) for skewed', isCorrect: true },
                        { text: 'O(1) for balanced, O(log N) for skewed', isCorrect: false },
                        { text: 'O(N) for balanced, O(N log N) for skewed', isCorrect: false },
                        { text: 'O(log N) for both balanced and skewed', isCorrect: false }
                      ].map((opt, idx) => {
                        const isSelected = miniQuizSelected === idx;
                        let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (miniQuizSubmitted) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isSelected && !opt.isCorrect) {
                            btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                          } else {
                            btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={miniQuizSubmitted}
                            onClick={() => {
                              setMiniQuizSelected(idx);
                              setMiniQuizSubmitted(true);
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${btnStyle}`}
                          >
                            <span>{String.fromCharCode(65 + idx)}. {opt.text}</span>
                            {miniQuizSubmitted && opt.isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {miniQuizSubmitted && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-in fade-in">
                        <span className="font-bold text-brand-300">💡 AI Invariant Explanation:</span>
                        <p className="text-slate-300 leading-relaxed">
                          In a balanced BST, tree height is strictly $H = \lfloor \log_2 N \rfloor$, yielding $O(\log N)$ search operations. If degenerate/skewed, it degenerates to a singly linked list with $O(N)$ comparisons.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. TUTOR PREVIEW */}
              {activePreviewTab === 'tutor' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent-400">
                        24/7 Context-Aware AI Learning Assistant
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Ask Conceptual Doubts & Get 4-Part Structured Answers
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        {
                          q: 'Explain dynamic programming state transitions like I am 5',
                          a: '💡 **ELI5 Analogy**: Imagine walking up a giant staircase. Instead of recalculating how many steps you climbed every single second, you write your current step count in chalk on the floor. When you reach step 10, you simply look at the chalk note on step 9! In computer science, that chalk note is called **memoization**.'
                        },
                        {
                          q: 'Give me a 1-sentence mnemonic for Dijkstra vs Bellman-Ford',
                          a: '💡 **Memory Mnemonic**: "**D**ijkstra is **D**etermined for positive weights (Greedy & Fast); **B**ellman-Ford **B**acks up to handle **B**ad negative cycles (Dynamic & Thorough)."'
                        },
                        {
                          q: 'What is the top trick question on Binary Search BSTs?',
                          a: '💡 **Exam Trap**: Invert condition when target is equal! Many students check `if (arr[mid] == target)` inside the loop and miss duplicate bounds (`lower_bound` vs `upper_bound`). Always verify edge index pointers at $L=0$ and $R=N-1$.'
                        }
                      ].map((promptItem, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleMiniTutorAsk(promptItem.q, promptItem.a)}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none"
                        >
                          💬 "{promptItem.q.slice(0, 45)}..."
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                      {isMiniTutorThinking ? (
                        <div className="flex items-center gap-2 text-brand-400">
                          <Sparkles className="w-4 h-4 animate-spin" /> Thinking...
                        </div>
                      ) : (
                        miniTutorResponse
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ANALYTICS PREVIEW */}
              {activePreviewTab === 'analytics' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        Real-Time Diagnostic Metrics
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Exam Readiness & Spaced Forgetting Curve
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
                      <p className="text-xs text-slate-400 font-semibold">Exam Readiness Score</p>
                      <p className="text-4xl font-black text-emerald-400">68%</p>
                      <p className="text-[11px] text-emerald-300">+14% this week with active recall</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
                      <p className="text-xs text-slate-400 font-semibold">Active Study Streak</p>
                      <p className="text-4xl font-black text-amber-400">4 Days 🔥</p>
                      <p className="text-[11px] text-slate-400">Top 10% Consistency Tier</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
                      <p className="text-xs text-slate-400 font-semibold">Time Saved with AI</p>
                      <p className="text-4xl font-black text-brand-400">18.5 hrs</p>
                      <p className="text-[11px] text-brand-300">Eliminating secondary fluff</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* 1-CLICK INSTANT PRESET DEMOS */}
        <section id="demo" aria-labelledby="demos-title" className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-400">
              Instant Hackathon Demonstrations
            </span>
            <h2 id="demos-title" className="text-2xl sm:text-3xl font-bold text-white">
              Launch Preloaded Curriculums in 1-Click
            </h2>
            <p className="text-xs text-slate-400">
              Explore full working dashboards with preloaded milestones, tasks, quizzes, and weak areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_STUDY_PLANS.map(preset => (
              <article
                key={preset.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-brand-500/50 transition-all duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {preset.knowledgeLevel} • {preset.dailyHours}h/day
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-emerald-400" />
                      {preset.readinessScore}% Ready
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition">
                      {preset.subject}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{preset.goal}</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Key Syllabus Topics:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.topics.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                          {t}
                        </span>
                      ))}
                      {preset.topics.length > 3 && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-500">
                          +{preset.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => resetToPreset(preset.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 hover:border-brand-600 text-xs font-bold transition duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
                  >
                    Launch Study Plan <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 8 CORE FEATURES SHOWCASE */}
        <section id="features" aria-labelledby="features-title" className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Engineered for Cognitive Mastery
            </span>
            <h2 id="features-title" className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Tool You Need to Excel Under Pressure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Traditional study schedules fail because they are rigid and passive. EduPath AI solves every bottleneck in the exam preparation lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <article
                key={idx}
                className="glass-card p-6 rounded-3xl border border-slate-800/90 hover:border-brand-500/40 transition duration-200 space-y-3 flex flex-col justify-start group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS: 4-STEP PIPELINE */}
        <section id="how-it-works" aria-labelledby="how-title" className="space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-400">
              The 4-Step Methodology
            </span>
            <h2 id="how-title" className="text-2xl sm:text-3xl font-bold text-white">How EduPath AI Works</h2>
            <p className="text-xs text-slate-400">
              From raw syllabus text to examination confidence in 4 systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <article
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 relative overflow-hidden"
              >
                <span className="text-3xl font-black text-brand-500/30 font-mono">
                  {step.number}
                </span>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section aria-labelledby="cta-title" className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-brand-950 via-slate-900 to-accent-950 border border-brand-500/30 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-300">
              ⚡ Start Your Personalized Prep Today
            </span>
            <h2 id="cta-title" className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Ace Your Next Examination?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create your personalized, day-by-day AI study plan in less than 60 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('onboarding')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-100 shadow-xl hover:scale-105 transition duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              Build My AI Study Plan Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

import React, { useState } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  GraduationCap,
  BookOpen,
  Target,
  Plus,
  X,
  CheckCircle2,
  ListPlus,
  Loader2,
  Zap,
  HelpCircle,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Compass,
  Flame,
  Check
} from 'lucide-react';
import { KnowledgeLevel, LearningStyle } from '../types';
import { suggestTopicsForSubject } from '../services/aiService';
import { sanitizeText, sanitizeTopicList, validateFutureDate, sanitizeDailyHours } from '../utils/security';

export const OnboardingWizard: React.FC = () => {
  const { createNewPlan, setActiveView } = useStudyPlan();

  // Wizard Step State (1 to 5)
  const [step, setStep] = useState<number>(1);

  // Step 1: Goal & Subject
  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('Score in the Top 5th Percentile with Full Mastery');
  const [selectedCategory, setSelectedCategory] = useState<string>('Computer Science');

  // Step 2: Syllabus & Topics
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState<string[]>([
    'Arrays, Two Pointers & Sliding Window',
    'Binary Search & Sorting Invariants',
    'Binary Trees & Binary Search Trees (BST)',
    'Dynamic Programming & Knapsack State Transitions'
  ]);
  const [bulkInput, setBulkInput] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Step 3: Exam Date
  const defaultDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [examDate, setExamDate] = useState(defaultDate);

  // Step 4: Hours available per day & time preference
  const [dailyHours, setDailyHours] = useState<number>(3.0);
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | 'flexible'>('evening');

  // Step 5: Current Knowledge Level & Learning Style
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('intermediate');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('practice');

  // Form Validation Errors State
  const [validationError, setValidationError] = useState<string | null>(null);

  // Loading animation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);

  const subjectCategories = [
    {
      category: 'Computer Science',
      presets: ['Data Structures & Algorithms', 'Machine Learning & LLM Systems', 'Fullstack System Architecture', 'Operating Systems & Networks']
    },
    {
      category: 'Medicine & Health',
      presets: ['USMLE Step 1 Medical Biochemistry', 'Anatomy & Physiology', 'Pharmacology & Therapeutics', 'NEET PG Clinical Correlates']
    },
    {
      category: 'STEM & Engineering',
      presets: ['AP Physics C Mechanics', 'Multivariable Calculus & Linear Algebra', 'Organic Chemistry Reactions', 'Thermodynamics & Heat Transfer']
    },
    {
      category: 'Business & Finance',
      presets: ['CFA Level 1 Corporate Finance', 'Financial Accounting & Reporting', 'Micro & Macroeconomics', 'Product Management Case Prep']
    }
  ];

  const handleSelectPreset = (presetSubject: string, cat: string) => {
    const cleanSubject = sanitizeText(presetSubject, 100);
    setSubject(cleanSubject);
    setSelectedCategory(cat);
    setValidationError(null);
    const autoTopics = suggestTopicsForSubject(cleanSubject);
    if (autoTopics.length > 0) {
      setTopics(sanitizeTopicList(autoTopics));
    }
  };

  const handleAutoSuggestTopics = () => {
    const suggested = suggestTopicsForSubject(subject || 'General Engineering');
    setTopics(sanitizeTopicList(suggested));
  };

  const handleAddTopic = () => {
    const cleaned = sanitizeText(topicInput, 100);
    if (cleaned) {
      if (!topics.includes(cleaned)) {
        setTopics([...topics, cleaned]);
        setTopicInput('');
        setValidationError(null);
      }
    }
  };

  const handleRemoveTopic = (t: string) => {
    if (topics.length <= 1) {
      setValidationError('Please keep at least 1 syllabus topic for the AI to roadmap.');
      return;
    }
    setTopics(topics.filter(item => item !== t));
  };

  const handleParseBulk = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput
      .split(/[\n,;]+/)
      .map(s => sanitizeText(s.replace(/^\d+[\.\)\-]\s*/, ''), 100))
      .filter(s => s.length > 2);
    
    if (lines.length > 0) {
      const combined = Array.from(new Set([...topics, ...lines]));
      setTopics(sanitizeTopicList(combined));
      setBulkInput('');
      setIsBulkOpen(false);
      setValidationError(null);
    }
  };

  const setDaysFromNow = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExamDate(d.toISOString().split('T')[0]);
    setValidationError(null);
  };

  // Validation handlers per step
  const validateAndProceed = (targetStep: number) => {
    setValidationError(null);

    if (step === 1) {
      const cleanSub = sanitizeText(subject, 100);
      if (!cleanSub) {
        setValidationError('Please enter or select your subject/exam title.');
        return;
      }
    }

    if (step === 2) {
      if (topics.length === 0) {
        setValidationError('Please add at least 1 topic or click Auto-Suggest.');
        return;
      }
    }

    if (step === 3) {
      const dateCheck = validateFutureDate(examDate);
      if (!dateCheck.isValid) {
        setValidationError(dateCheck.error || 'Please select a valid future exam date.');
        return;
      }
    }

    if (step === 4) {
      if (dailyHours < 0.5) {
        setValidationError('Please allocate at least 0.5 hours per day.');
        return;
      }
    }

    setStep(targetStep);
  };

  const handleFinalSubmit = async () => {
    setIsGenerating(true);

    const stepsTimeline = [
      'Deconstructing syllabus & mapping cognitive dependency hierarchy...',
      'Applying Ebbinghaus forgetting curve & spaced revision intervals...',
      'Balancing daily study load against target exam date...',
      'Synthesizing High-Yield Priority Matrix & active recall quizzes...'
    ];

    stepsTimeline.forEach((_, idx) => {
      setTimeout(() => {
        setGenerationPhase(idx + 1);
      }, (idx + 1) * 700);
    });

    try {
      const cleanSubject = sanitizeText(subject.trim() || 'Computer Science & Data Structures', 100);
      const cleanGoal = sanitizeText(goal.trim(), 120);
      const cleanTopics = sanitizeTopicList(topics.length > 0 ? topics : suggestTopicsForSubject(cleanSubject));
      const cleanHours = sanitizeDailyHours(dailyHours);

      await createNewPlan(
        cleanSubject,
        cleanTopics,
        examDate,
        cleanHours,
        knowledgeLevel,
        learningStyle,
        cleanGoal
      );
    } catch (e) {
      console.error('Error generating plan', e);
    }
  };

  // Dynamic Days Calculations
  const calculatedDays = Math.max(1, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const totalCalculatedCapacity = Math.round(calculatedDays * dailyHours * 10) / 10;

  // 1. GENERATION LOADING OVERLAY
  if (isGenerating) {
    const generationSteps = [
      'Analyzing syllabus difficulty & cognitive prerequisites',
      'Computing spaced repetition forgetting curve schedule',
      'Distributing daily cognitive workloads & milestones',
      'Finalizing adaptive AI study roadmap & active quizzes'
    ];

    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div
          role="status"
          aria-live="polite"
          className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-brand-500/30 text-center space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-brand-500/40 animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border-2 border-brand-500/30 animate-spin border-t-transparent" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white">Synthesizing Your AI Study Plan</h2>
            <p className="text-xs text-brand-300 font-medium">{subject || 'Custom Curriculum'}</p>
          </div>

          <div className="space-y-3 text-left pt-2">
            {generationSteps.map((s, idx) => {
              const isDone = generationPhase > idx;
              const isCurrent = generationPhase === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl text-xs transition duration-200 ${
                    isDone
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/40'
                      : isCurrent
                      ? 'bg-brand-950/40 text-brand-200 border border-brand-500/40 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-brand-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-800 flex-shrink-0" />
                  )}
                  <span className={isCurrent ? 'font-bold' : ''}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* HEADER & 5-STEP NUMBERED PROGRESS INDICATOR */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : setActiveView('landing'))}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Step {step} of 5 • {step === 1 ? 'Subject & Goal' : step === 2 ? 'Syllabus Topics' : step === 3 ? 'Exam Date' : step === 4 ? 'Daily Hours' : 'Knowledge Level'}
            </span>
          </div>

          {/* 5-Step Breadcrumb Bar */}
          <nav aria-label="Onboarding Steps" className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: 'Subject' },
              { num: 2, label: 'Topics' },
              { num: 3, label: 'Date' },
              { num: 4, label: 'Hours' },
              { num: 5, label: 'Level' }
            ].map(item => {
              const isPast = step > item.num;
              const isCurrent = step === item.num;
              return (
                <button
                  key={item.num}
                  disabled={item.num > step}
                  onClick={() => setStep(item.num)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`text-left p-2 rounded-xl border transition flex flex-col gap-0.5 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                    isCurrent
                      ? 'bg-brand-600/20 border-brand-500 text-white shadow-sm'
                      : isPast
                      ? 'bg-slate-900 border-slate-800 text-emerald-400 cursor-pointer'
                      : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : `Step ${item.num}`}
                  </span>
                  <span className="text-xs font-semibold truncate hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Continuous Progress Bar */}
          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={5}
            className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-accent-500"
              initial={{ width: `${((step - 1) / 5) * 100}%` }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </header>

        {/* VALIDATION WARNING IF ANY */}
        {validationError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </motion.div>
        )}

        {/* STEP 1: SUBJECT & LEARNING GOAL */}
        {step === 1 && (
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" /> Step 1: Learning Goal & Subject
              </div>
              <h1 className="text-2xl font-extrabold text-white">What subject or examination are you preparing for?</h1>
              <p className="text-xs text-slate-400">
                Enter your course, certification, or board examination title to generate a personalized cognitive study roadmap.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="subject-input" className="text-xs font-semibold text-slate-300">
                  Subject / Examination Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="subject-input"
                  type="text"
                  required
                  aria-required="true"
                  placeholder="e.g. Data Structures & Algorithms, USMLE Step 1, Machine Learning, AP Physics..."
                  value={subject}
                  onChange={e => {
                    setSubject(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
                />
              </div>

              {/* Category preset chips */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Or pick a popular curriculum:
                </label>
                <div className="space-y-2">
                  {subjectCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                        {cat.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.presets.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleSelectPreset(preset, cat.category)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                              subject === preset
                                ? 'bg-brand-600/30 border-brand-500 text-white font-bold'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal tier */}
              <div className="space-y-1.5 pt-2">
                <label htmlFor="goal-input" className="text-xs font-semibold text-slate-300">Target Score / Mastery Outcome</label>
                <input
                  id="goal-input"
                  type="text"
                  placeholder="e.g. Score 90%+ / Pass with Distinction / FAANG Interview Ready"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => validateAndProceed(2)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                Next: Syllabus Topics <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: SYLLABUS & TOPICS */}
        {step === 2 && (
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                  <Target className="w-3.5 h-3.5" /> Step 2: Syllabus & Topics
                </div>
                <h2 className="text-2xl font-extrabold text-white">Enter Your Topics & Chapters</h2>
                <p className="text-xs text-slate-400">
                  Add specific topics to cover. EduPath AI will group them into prioritized cognitive phases.
                </p>
              </div>

              {/* Auto-suggest button */}
              <button
                type="button"
                onClick={handleAutoSuggestTopics}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent-500/15 hover:bg-accent-500/25 text-accent-300 border border-accent-500/30 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Suggest Topics
              </button>
            </div>

            <div className="space-y-4">
              {/* Single Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a topic and press Add (e.g. Graph Traversals, Sliding Window)"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Bulk paste trigger */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{topics.length} topics currently loaded</span>
                <button
                  type="button"
                  onClick={() => setIsBulkOpen(!isBulkOpen)}
                  className="text-brand-400 hover:underline flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  {isBulkOpen ? 'Hide Bulk Paste' : 'Bulk Paste Raw Syllabus'}
                </button>
              </div>

              {/* Bulk Paste Textarea */}
              {isBulkOpen && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in">
                  <label htmlFor="bulk-syllabus" className="text-xs font-semibold text-slate-300">
                    Paste raw text syllabus (separated by lines, commas, or numbers):
                  </label>
                  <textarea
                    id="bulk-syllabus"
                    rows={4}
                    placeholder="1. Introduction to Graph Theory&#10;2. Shortest Path Algorithms&#10;3. Minimum Spanning Trees"
                    value={bulkInput}
                    onChange={e => setBulkInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleParseBulk}
                    className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  >
                    Parse & Add to Syllabus
                  </button>
                </div>
              )}

              {/* Chips container */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium group hover:border-slate-700"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(t)}
                      className="text-slate-500 hover:text-red-400 transition focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded"
                      title={`Remove ${t}`}
                      aria-label={`Remove topic ${t}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => validateAndProceed(3)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                Next: Exam Date <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: EXAM DATE */}
        {step === 3 && (
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" /> Step 3: Target Exam Date
              </div>
              <h2 className="text-2xl font-extrabold text-white">When is your examination?</h2>
              <p className="text-xs text-slate-400">
                The AI calculates the optimal forgetting curve intervals between today and your test deadline.
              </p>
            </div>

            <div className="space-y-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label htmlFor="exam-date-input" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Examination / Deadline Date <span className="text-rose-400">*</span></span>
                  <span className="text-brand-400 text-xs font-bold">
                    {calculatedDays} Days Remaining
                  </span>
                </label>

                <input
                  id="exam-date-input"
                  type="date"
                  required
                  aria-required="true"
                  value={examDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    setExamDate(e.target.value);
                    setValidationError(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { days: 7, label: '7 Days (Crash Sprint)' },
                    { days: 14, label: '14 Days (Standard)' },
                    { days: 30, label: '30 Days (Deep Mastery)' },
                    { days: 60, label: '60 Days (Comprehensive)' },
                    { days: 90, label: '90 Days (Long-term)' }
                  ].map(item => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setDaysFromNow(item.days)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Context Box */}
              <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/20 flex items-start gap-3 text-xs text-brand-200">
                <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <p>
                  With <strong>{calculatedDays} days</strong> until examination, the AI will distribute <strong>{topics.length} syllabus topics</strong> into 4 sequential phases, scheduling active recall reviews at Day 1, Day 3, and Day 7 intervals.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => validateAndProceed(4)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                Next: Daily Study Time <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: HOURS AVAILABLE PER DAY */}
        {step === 4 && (
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" /> Step 4: Hours Available Per Day
              </div>
              <h2 className="text-2xl font-extrabold text-white">How much time can you study each day?</h2>
              <p className="text-xs text-slate-400">
                The AI structures micro-tasks to strictly fit within your daily cognitive budget without burnout.
              </p>
            </div>

            <div className="space-y-6">
              {/* Daily Hours Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="hours-slider" className="text-xs font-semibold text-slate-300">Daily Study Commitment</label>
                  <span className="text-sm font-black text-brand-300 px-3.5 py-1 rounded-xl bg-brand-500/15 border border-brand-500/30">
                    {dailyHours} Hours / Day
                  </span>
                </div>

                <input
                  id="hours-slider"
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={dailyHours}
                  onChange={e => setDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 h-2.5 bg-slate-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.5h (Light Pace)</span>
                  <span>3.5h (Recommended)</span>
                  <span>10.0h (Intensive Bootcamp)</span>
                </div>
              </div>

              {/* Total Calculated Capacity Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-400">Days to Exam</p>
                  <p className="text-2xl font-black text-white mt-0.5">{calculatedDays} Days</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Study Capacity</p>
                  <p className="text-2xl font-black text-brand-400 mt-0.5">{totalCalculatedCapacity} Hours</p>
                </div>
              </div>

              {/* Preferred Study Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Preferred Daily Study Time:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'morning', label: '🌅 Morning', desc: '6 AM - 12 PM' },
                    { id: 'afternoon', label: '☀️ Afternoon', desc: '12 PM - 5 PM' },
                    { id: 'evening', label: '🌙 Evening', desc: '5 PM - 11 PM' },
                    { id: 'flexible', label: '⚡ Flexible', desc: 'As time permits' }
                  ].map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlot(slot.id as any)}
                      className={`p-3 rounded-2xl border text-left text-xs transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                        timeSlot === slot.id
                          ? 'bg-brand-500/20 border-brand-500 text-white font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{slot.label}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{slot.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => validateAndProceed(5)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                Next: Knowledge Baseline <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 5: CURRENT KNOWLEDGE LEVEL */}
        {step === 5 && (
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" /> Step 5: Knowledge Level & Learning Style
              </div>
              <h2 className="text-2xl font-extrabold text-white">What is your current knowledge baseline?</h2>
              <p className="text-xs text-slate-400">
                This dictates the weighting between foundational mental models vs high-yield active recall drills.
              </p>
            </div>

            <div className="space-y-6">
              {/* Knowledge Level Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Your Baseline Level:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'beginner',
                      title: '🟢 Beginner',
                      desc: 'Starting from scratch. Need deep foundation, ELI5 analogies, and mental models before problem solving.'
                    },
                    {
                      id: 'intermediate',
                      title: '🟡 Intermediate',
                      desc: 'Know core definitions. Need systematic edge cases, standard problem patterns, and timed drills.'
                    },
                    {
                      id: 'advanced',
                      title: '🔴 Advanced / High-Yield',
                      desc: 'Comfortable with concepts. Focus strictly on top 1% tricky exam traps, speed optimization, and mock sprints.'
                    }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setKnowledgeLevel(lvl.id as KnowledgeLevel)}
                      className={`p-4 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                        knowledgeLevel === lvl.id
                          ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm">{lvl.title}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Preferred Learning Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'practice', title: '🎯 Practice-Heavy', desc: 'Active quizzes, solving problems & active recall drills.' },
                    { id: 'conceptual', title: '🧠 Conceptual Deep Dive', desc: 'First principles, detailed notes & visual diagrams.' },
                    { id: 'fast-track', title: '⚡ Fast-Track High Yield', desc: 'Focus strictly on highest probability questions.' }
                  ].map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setLearningStyle(style.id as LearningStyle)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-1 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none ${
                        learningStyle === style.id
                          ? 'bg-accent-500/20 border-accent-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">{style.title}</span>
                      <p className="text-[11px] text-slate-400 leading-normal">{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Summary Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-brand-300 uppercase tracking-wider text-[10px]">
                  📋 Configuration Review
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
                  <div><strong>Subject:</strong> {subject}</div>
                  <div><strong>Topics:</strong> {topics.length} loaded</div>
                  <div><strong>Deadline:</strong> {calculatedDays} days</div>
                  <div><strong>Pacing:</strong> {dailyHours}h/day</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-extrabold shadow-xl shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition duration-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-accent-200" />
                Generate Personalized AI Roadmap
              </button>
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

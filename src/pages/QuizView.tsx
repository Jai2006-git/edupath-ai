import React, { useState, useEffect } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Target,
  Flame,
  AlertTriangle,
  Check,
  Zap,
  Filter,
  Layers,
  ArrowUpRight,
  Sliders,
  TrendingUp,
  Loader2,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuizQuestionsAsync } from '../services/aiService';
import { QuizAnswerSubmission, QuizQuestion, QuizResult } from '../types';

export const QuizView: React.FC = () => {
  const {
    plan,
    recordQuizResult,
    setActiveView,
    sendTutorMessage,
    apiKey
  } = useStudyPlan();

  // Quiz setup configuration
  const [selectedTopic, setSelectedTopic] = useState<string>(plan.topics[0] || 'Core Syllabus Foundations');
  const [isCustomTopic, setIsCustomTopic] = useState<boolean>(false);
  const [customTopicText, setCustomTopicText] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Loading state during AI generation
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  // Active quiz runtime state
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(4);
  const [answers, setAnswers] = useState<QuizAnswerSubmission[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [totalTimer, setTotalTimer] = useState<number>(0);

  // Review filter tab in results
  const [resultFilter, setResultFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isQuizActive && !isQuizCompleted) {
      interval = setInterval(() => {
        setTotalTimer(prev => prev + 1);
        setTimeRemaining(prev => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, isQuizCompleted]);

  const activeTopicName = isCustomTopic ? customTopicText.trim() || 'Custom Syllabus Topic' : selectedTopic;

  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);

    try {
      const generated = await generateQuizQuestionsAsync(activeTopicName, questionCount, difficulty, apiKey);
      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAnswers([]);
      setTotalTimer(0);
      setTimeRemaining(60);
      setIsQuizActive(true);
      setIsQuizCompleted(false);
    } catch (e) {
      console.error('Error starting quiz', e);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctAnswer;

    if (isCorrect) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.75 }
        });
      } catch (e) {}
    }

    const submission: QuizAnswerSubmission = {
      questionId: currentQ.id,
      selectedOption: idx,
      isCorrect,
      confidence
    };

    setAnswers(prev => [...prev, submission]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeRemaining(60);
    } else {
      // Quiz finished
      setIsQuizCompleted(true);
      setIsQuizActive(false);

      const correctCount = answers.filter(a => a.isCorrect).length;
      const pct = Math.round((correctCount / questions.length) * 100);

      const result: QuizResult = {
        id: `quiz-res-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        topic: activeTopicName,
        score: correctCount,
        totalQuestions: questions.length,
        percentage: pct,
        durationSeconds: totalTimer,
        answers: answers
      };

      recordQuizResult(result);

      if (pct >= 80) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  const handleAskTutorAboutQuestion = (q: QuizQuestion) => {
    sendTutorMessage(
      `I am stuck on this quiz question about "${q.topic}":\n\n"${q.question}"\n\nCorrect Answer: "${q.options[q.correctAnswer]}".\n\nCan you explain the first-principles derivation and why this option is correct?`,
      q.topic
    );
    setActiveView('tutor');
  };

  const handleAskTutorAboutMissed = () => {
    const missedQuestions = questions.filter(q => {
      const ans = answers.find(a => a.questionId === q.id);
      return ans && !ans.isCorrect;
    });

    const missedText = missedQuestions.map(m => `• ${m.question}`).join('\n');
    sendTutorMessage(
      `I just finished an Active Recall Quiz on "${activeTopicName}" and missed these questions:\n\n${missedText}\n\nCan you give me an intuitive breakdown and a memory mnemonic to avoid these mistakes on the exam?`,
      activeTopicName
    );
    setActiveView('tutor');
  };

  // 1. GENERATING LOADING SCREEN
  if (isGeneratingQuiz) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-brand-500/30 text-center space-y-6 animate-in zoom-in-95 duration-200 shadow-2xl">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-500 flex items-center justify-center shadow-xl shadow-brand-500/40 animate-pulse">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border-2 border-brand-500/30 animate-spin border-t-transparent" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white">Synthesizing Active Recall Questions</h2>
            <p className="text-xs text-brand-300 font-medium">{activeTopicName}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              <span>Generating {questionCount} questions ({difficulty} difficulty)...</span>
            </p>
            <p className="text-[11px] text-slate-500">Injecting mathematical invariants and distractor traps.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. SETUP / LAUNCHER SCREEN
  if (!isQuizActive && !isQuizCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold shadow-inner">
              <Award className="w-3.5 h-3.5" /> AI Active Recall Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Diagnostic Quiz Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Active retrieval interrupts memory decay, boosting long-term examination retention by up to 400%.
            </p>
          </div>

          {/* Configurator Card */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 max-w-2xl mx-auto shadow-2xl">
            
            {/* Step 1: Select Topic */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  1. Select Syllabus Topic or Weak Area:
                </label>
                <button
                  onClick={() => setIsCustomTopic(!isCustomTopic)}
                  className="text-xs font-semibold text-brand-400 hover:underline"
                >
                  {isCustomTopic ? 'Select from Syllabus' : '+ Type Custom Topic'}
                </button>
              </div>

              {!isCustomTopic ? (
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <optgroup label="Syllabus Topics">
                    {plan.topics.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </optgroup>
                  {plan.weakAreas.length > 0 && (
                    <optgroup label="⚠️ Identified Low-Accuracy Weak Areas">
                      {plan.weakAreas.map(w => (
                        <option key={w.id} value={w.topic}>⚠️ {w.topic} ({w.accuracyScore}% Accuracy)</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter any custom topic (e.g. Dynamic Programming, Graph Dijkstra, USMLE Enzyme Kinetics)..."
                  value={customTopicText}
                  onChange={e => setCustomTopicText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              )}
            </div>

            {/* Step 2: Difficulty Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Difficulty Tier:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'easy', title: '🟢 Easy', desc: 'Core definitions & base theorems' },
                  { id: 'medium', title: '🟡 Medium', desc: 'Standard problem patterns & edge cases' },
                  { id: 'hard', title: '🔴 Hard', desc: 'Tricky traps & multi-step invariants' }
                ].map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id as any)}
                    className={`p-3 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-1 ${
                      difficulty === diff.id
                        ? 'bg-brand-500/20 border-brand-500 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold">{diff.title}</span>
                    <p className="text-[10px] text-slate-400 leading-normal">{diff.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Question Count */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Number of Questions:
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { count: 3, label: '3 Qs (2 Min)' },
                  { count: 5, label: '5 Qs (Standard)' },
                  { count: 10, label: '10 Qs (In-depth)' },
                  { count: 15, label: '15 Qs (Mock)' }
                ].map(item => (
                  <button
                    key={item.count}
                    onClick={() => setQuestionCount(item.count)}
                    className={`py-3 rounded-xl border text-xs font-bold text-center transition ${
                      questionCount === item.count
                        ? 'bg-brand-600 border-brand-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-3">
              <button
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-sm font-extrabold shadow-xl shadow-brand-500/30 transition hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-accent-200" />
                Generate AI Active Recall Drill
              </button>
            </div>

          </div>

          {/* Past Quiz History */}
          {plan.quizHistory.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 max-w-2xl mx-auto shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" /> Recent Quiz Results ({plan.quizHistory.length})
              </h3>
              <div className="space-y-2.5">
                {plan.quizHistory.slice(0, 4).map(res => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{res.topic}</span>
                      <p className="text-[11px] text-slate-400">{res.date} • {res.totalQuestions} questions • {res.durationSeconds}s</p>
                    </div>
                    <span
                      className={`font-black px-3 py-1 rounded-xl text-xs ${
                        res.percentage >= 80
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : res.percentage >= 60
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {res.percentage}% ({res.score}/{res.totalQuestions})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 3. RESULTS & WEAK-AREA ANALYSIS SCREEN
  if (isQuizCompleted) {
    const currentScore = answers.filter(a => a.isCorrect).length;
    const totalCount = questions.length;
    const pct = Math.round((currentScore / totalCount) * 100);
    const avgTimePerQuestion = Math.round(totalTimer / Math.max(1, totalCount));

    const missedQuestions = questions.filter(q => {
      const ans = answers.find(a => a.questionId === q.id);
      return ans && !ans.isCorrect;
    });

    const filteredQuestions = questions.filter(q => {
      const userAns = answers.find(a => a.questionId === q.id);
      if (resultFilter === 'correct') return userAns?.isCorrect;
      if (resultFilter === 'incorrect') return !userAns?.isCorrect;
      return true;
    });

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in zoom-in-95 duration-200">
          
          {/* Main Score Card */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 mx-auto flex items-center justify-center shadow-xl shadow-brand-500/30">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-400">
                Active Recall Drill Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeTopicName}</h2>
            </div>

            {/* Score Strip */}
            <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-800 max-w-lg mx-auto">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white">{pct}%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Final Accuracy</p>
              </div>
              <div className="border-x border-slate-800">
                <p className="text-3xl sm:text-4xl font-black text-brand-400">{currentScore}/{totalCount}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Correct Answers</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-accent-400">{avgTimePerQuestion}s</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Avg Time / Q</p>
              </div>
            </div>

            {/* Performance Feedback */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
              {pct >= 80 ? (
                <div className="space-y-1">
                  <p className="text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                    🎉 Outstanding Mastery! Top 5th Percentile Retention.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Your neural recall for this topic is locked in. Scheduled for Day 7 spaced revision.
                  </p>
                </div>
              ) : pct >= 60 ? (
                <div className="space-y-1">
                  <p className="text-amber-300 font-bold flex items-center justify-center gap-1.5">
                    👍 Strong Baseline Retention with Minor Edge Gaps.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Review the distractor explanations below to eliminate recurring exam traps.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-rose-300 font-bold flex items-center justify-center gap-1.5">
                    ⚠️ Weak Area Flagged: Automatically Added to Revision Queue.
                  </p>
                  <p className="text-slate-400 text-xs">
                    This concept requires first-principles reinforcement. Consult the 24/7 AI tutor below.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartQuiz}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition"
              >
                <RotateCcw className="w-4 h-4" /> Retake Drill
              </button>

              {missedQuestions.length > 0 && (
                <button
                  onClick={handleAskTutorAboutMissed}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition"
                >
                  <HelpCircle className="w-4 h-4 text-accent-200" />
                  Review Missed Questions with AI Tutor
                </button>
              )}

              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* WEAK-AREA ANALYSIS BREAKDOWN */}
          {missedQuestions.length > 0 && (
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Weak-Area Analysis ({missedQuestions.length} Concepts Missed)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  Auto-Queued in Spaced Repetition
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The following concepts were answered incorrectly and have been recorded into your <strong>Weak-Area Intelligence</strong> dashboard for targeted remediation:
              </p>
              <div className="space-y-2 pt-1">
                {missedQuestions.map((mq, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="text-white font-semibold truncate pr-2">• {mq.question}</span>
                    <button
                      onClick={() => handleAskTutorAboutQuestion(mq)}
                      className="text-[11px] font-bold text-brand-400 hover:underline flex-shrink-0 flex items-center gap-1"
                    >
                      Ask Tutor <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION REVIEW & PEDAGOGICAL BREAKDOWN */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Detailed Question Review & Invariant Analysis
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setResultFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition font-semibold ${
                    resultFilter === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({questions.length})
                </button>
                <button
                  onClick={() => setResultFilter('correct')}
                  className={`px-2.5 py-1 rounded-lg transition font-semibold ${
                    resultFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✓ Correct ({currentScore})
                </button>
                <button
                  onClick={() => setResultFilter('incorrect')}
                  className={`px-2.5 py-1 rounded-lg transition font-semibold ${
                    resultFilter === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✕ Missed ({missedQuestions.length})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const userAns = answers.find(a => a.questionId === q.id);
                const isCorrect = userAns ? userAns.isCorrect : false;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl border space-y-4 transition ${
                      isCorrect
                        ? 'bg-emerald-950/15 border-emerald-900/40'
                        : 'bg-rose-950/15 border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Question {idx + 1} • {q.topic}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>
                      </div>

                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                          <XCircle className="w-4 h-4" /> Missed
                        </div>
                      )}
                    </div>

                    {/* Options list showing right and wrong */}
                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isThisSelected = userAns?.selectedOption === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isThisCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                                : isThisSelected && !isCorrect
                                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                                : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <span className="text-[10px] font-bold text-emerald-400">Correct Answer</span>}
                            {isThisSelected && !isCorrect && <span className="text-[10px] font-bold text-rose-400">Your Selection</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* In-depth pedagogical breakdown */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                          AI Pedagogical Invariant Breakdown
                        </span>
                        <button
                          onClick={() => handleAskTutorAboutQuestion(q)}
                          className="text-[11px] text-accent-300 hover:underline flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" /> Clarify with AI Tutor
                        </button>
                      </div>

                      <p className="text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>

                      {q.whyCorrect && (
                        <p className="text-emerald-300/90 text-[11px] pt-1">
                          <strong>✓ Invariant Proof:</strong> {q.whyCorrect}
                        </p>
                      )}

                      {q.commonMistake && (
                        <p className="text-rose-300/90 text-[11px]">
                          <strong>⚠️ Common Distractor Trap:</strong> {q.commonMistake}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 4. INTERACTIVE LIVE QUIZ RUNTIME
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Active Recall Session
            </span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-semibold truncate max-w-[200px]">
              {activeTopicName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeRemaining}s</span>
            </div>
            <button
              onClick={() => setIsQuizActive(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
            >
              Exit Quiz
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-brand-300 uppercase tracking-wider text-[10px] font-bold">
              Difficulty: {currentQuestion?.difficulty}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-accent-500"
              initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current Question Card */}
        {currentQuestion && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl animate-in fade-in duration-150">
            
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/25">
                Active Retrieval Drill
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* 4 Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;

                let btnStyles = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-brand-500/50 hover:bg-slate-900';

                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-500/20';
                  } else {
                    btnStyles = 'bg-slate-950/40 border-slate-900 opacity-40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-start gap-3.5 ${btnStyles}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* In-depth Pedagogical Invariant Breakdown */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-slate-800"
              >
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      AI Pedagogical Invariant Breakdown
                    </span>
                    <button
                      onClick={() => handleAskTutorAboutQuestion(currentQuestion)}
                      className="text-[11px] font-semibold text-accent-300 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Ask Tutor
                    </button>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>

                  {currentQuestion.whyCorrect && (
                    <p className="text-emerald-300/90 text-[11px] pt-1">
                      <strong>✓ Why Option is Correct:</strong> {currentQuestion.whyCorrect}
                    </p>
                  )}

                  {currentQuestion.commonMistake && (
                    <p className="text-rose-300/90 text-[11px]">
                      <strong>⚠️ Common Distractor Trap:</strong> {currentQuestion.commonMistake}
                    </p>
                  )}
                </div>

                {/* Confidence Self-Rating */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 font-semibold">How confident were you in this answer?</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setConfidence(rating)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          confidence === rating
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">
                      {confidence === 5 ? 'Certain' : confidence === 1 ? 'Guess' : ''}
                    </span>
                  </div>
                </div>

                {/* Next Question / Scorecard Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition hover:scale-[1.01]"
                  >
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Scorecard'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

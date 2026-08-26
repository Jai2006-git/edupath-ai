import React, { useState, useRef, useEffect } from 'react';
import { useStudyPlan } from '../context/StudyPlanContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  Bookmark,
  Award,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Trash2,
  Copy,
  ChevronRight,
  MessageSquare,
  Zap,
  RotateCcw,
  Target,
  FileText,
  Clock,
  Compass,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TutorView: React.FC = () => {
  const {
    plan,
    tutorMessages,
    isTutorTyping,
    sendTutorMessage,
    savedNotes,
    saveNote,
    setActiveView
  } = useStudyPlan();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>(plan.topics[0] || 'General Syllabus');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, isTutorTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isTutorTyping) return;

    setInputQuery('');
    await sendTutorMessage(text, selectedTopic);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveToNotes = (content: string) => {
    saveNote(content);
    try {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (e) {}
    setSaveSuccessToast('Saved directly to your Study Notes Notebook! 📌');
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Curated Suggested Prompt Pills
  const promptPills = [
    {
      title: '💡 Explain Like I’m 5',
      prompt: `Explain ${selectedTopic} using a simple, intuitive real-world analogy (ELI5 breakdown).`
    },
    {
      title: '🧠 Memory Mnemonic',
      prompt: `Give me a memorable exam mnemonic to easily recall all steps in ${selectedTopic}.`
    },
    {
      title: '⚠️ Top 3 Exam Traps',
      prompt: `What are the 3 most dangerous trick questions or pitfalls examiners test on ${selectedTopic}?`
    },
    {
      title: '📝 3-Minute Cheat Sheet',
      prompt: `Synthesize a 3-minute high-yield cheat sheet with core formulas and boundary invariants for ${selectedTopic}.`
    }
  ];

  // Starter question cards for Empty State
  const starterCards = [
    {
      category: 'Intuitive Mental Model',
      question: `How does ${selectedTopic} work under the hood? Break it down with an analogy.`,
      icon: Lightbulb
    },
    {
      category: 'Exam Pitfall Deconstruction',
      question: `What is the most common mistake students make in ${selectedTopic} on exams?`,
      icon: Target
    },
    {
      category: 'Step-by-Step Problem Solver',
      question: `Walk me through a standard examination problem for ${selectedTopic} from scratch.`,
      icon: Brain
    },
    {
      category: 'Mnemonic & High Retention',
      question: `Create an acronym mnemonic for remembering the core invariant rules of ${selectedTopic}.`,
      icon: Sparkles
    }
  ];

  const isEmptyState = tutorMessages.length <= 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans flex flex-col">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {saveSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 text-white text-xs font-bold shadow-xl shadow-brand-500/25 border border-white/20 flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4 text-emerald-200" />
            <span>{saveSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex-1 flex flex-col space-y-4">
        
        {/* HEADER BAR */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">EduPath 24/7 AI Study Tutor</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">
                Personalized study companion for <strong className="text-brand-300">{plan.subject}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Active Topic Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                <optgroup label="Syllabus Topics">
                  {plan.topics.map((t, idx) => (
                    <option key={idx} value={t} className="bg-slate-900 text-white">{t}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Notes Notebook Button */}
            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes ({savedNotes.length})</span>
            </button>
          </div>
        </div>

        {/* PROMPT PILLS HORIZONTAL BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex-shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-accent-400" /> Quick Prompts:
          </span>
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.prompt)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-brand-600/30 border border-slate-800 hover:border-brand-500/40 text-slate-300 hover:text-white font-medium transition shadow-sm"
            >
              {pill.title}
            </button>
          ))}
        </div>

        {/* MAIN CHAT & MESSAGES CONTAINER */}
        <div className="glass-panel rounded-3xl border border-slate-800 flex-1 flex flex-col min-h-[480px] max-h-[620px] overflow-hidden shadow-2xl relative">
          
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* EMPTY STATE BEFORE CONVERSATION BEGINS */}
            {isEmptyState && (
              <div className="py-8 text-center space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-600 mx-auto flex items-center justify-center shadow-xl shadow-brand-500/30">
                  <Brain className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    Always-On Learning Partner
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    What would you like to master today?
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Ask any doubt, request step-by-step problem walkthroughs, or test your memory with instant analogies.
                  </p>
                </div>

                {/* 4 Starter Question Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                  {starterCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(card.question)}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-left transition group flex flex-col justify-between gap-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                            {card.category}
                          </span>
                          <Icon className="w-4 h-4 text-slate-500 group-hover:text-brand-300 transition" />
                        </div>
                        <p className="text-xs text-slate-200 font-semibold group-hover:text-white leading-relaxed">
                          {card.question}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MESSAGE LIST */}
            {tutorMessages.map(msg => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center flex-shrink-0 text-white shadow-md mt-1">
                      <Brain className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-2xl rounded-3xl p-5 text-xs sm:text-sm transition shadow-lg ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-4'
                    }`}
                  >
                    {/* Header for assistant message */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span className="font-bold text-brand-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-accent-400" />
                          EduPath AI Tutor
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {msg.content}
                    </div>

                    {/* Footer Actions for Assistant Messages */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveToNotes(msg.content)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-medium"
                          >
                            <Bookmark className="w-3 h-3 text-amber-400" />
                            Save Takeaway to Notes
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-medium"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedMessageId === msg.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <button
                          onClick={() => setActiveView('quiz')}
                          className="text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Award className="w-3 h-3" /> Practice in Quiz
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs mt-1">
                      You
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING / THINKING LOADER */}
            {isTutorTyping && (
              <div className="flex items-start gap-3.5 animate-in fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center flex-shrink-0 text-white shadow-md mt-1 animate-pulse">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-3xl bg-slate-900 border border-brand-500/30 rounded-tl-none space-y-2 text-xs text-brand-200">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-spin" />
                    <span>EduPath AI is synthesizing intuitive breakdown & exam takeaways...</span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-1 pt-1">
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE INPUT BOX */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              placeholder={`Ask a question about ${selectedTopic} (e.g. ELI5 analogy, core formula, practice problem)...`}
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isTutorTyping}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/25 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Tutor</span>
            </button>
          </div>

        </div>

      </div>

      {/* PERSISTENT STUDY NOTES NOTEBOOK DRAWER */}
      {showNotesDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Study Notes Notebook</h3>
                </div>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-slate-400">
                All saved takeaways, mnemonics, and cheat sheets for {plan.subject}:
              </p>

              <div className="space-y-3">
                {savedNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-200 space-y-2 relative group"
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{note}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCopyText(`note-${idx}`, note)}
                        className="text-[11px] text-brand-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedMessageId === `note-${idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                Close Notebook
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

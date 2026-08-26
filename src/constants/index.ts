/**
 * Centralized Constants & Cognitive Engine Configuration for EduPath AI
 */

export const APP_CONFIG = {
  NAME: 'EduPath AI',
  VERSION: '2.0.0',
  TAGLINE: 'Democratizing Personalized Education with Adaptive AI',
  STORAGE_KEY_PREFIX: 'edupath_ai_',
  DEFAULT_AI_MODEL: 'gemini-1.5-flash',
  MAX_DAILY_HOURS: 14.0,
  MIN_DAILY_HOURS: 0.5,
  DEFAULT_DAILY_HOURS: 3.0
} as const;

export const SUBJECT_PRESET_CATEGORIES = [
  {
    category: 'Computer Science',
    presets: [
      'Data Structures & Algorithms',
      'Machine Learning & LLM Systems',
      'Fullstack System Architecture',
      'Operating Systems & Networks'
    ]
  },
  {
    category: 'Medicine & Health',
    presets: [
      'USMLE Step 1 Medical Biochemistry',
      'Anatomy & Physiology',
      'Pharmacology & Therapeutics',
      'NEET PG Clinical Correlates'
    ]
  },
  {
    category: 'STEM & Engineering',
    presets: [
      'AP Physics C Mechanics',
      'Multivariable Calculus & Linear Algebra',
      'Organic Chemistry Reactions',
      'Thermodynamics & Heat Transfer'
    ]
  },
  {
    category: 'Business & Finance',
    presets: [
      'CFA Level 1 Corporate Finance',
      'Financial Accounting & Reporting',
      'Micro & Macroeconomics',
      'Product Management Case Prep'
    ]
  }
] as const;

export const KNOWLEDGE_LEVEL_DESCRIPTIONS = {
  beginner: {
    title: '🟢 Beginner Baseline',
    desc: 'Starting from first principles. Focuses heavily on conceptual analogies (ELI5), visual intuition, and foundational definitions.'
  },
  intermediate: {
    title: '🟡 Intermediate Baseline',
    desc: 'Comfortable with core definitions. Emphasizes standard problem patterns, edge cases, and timed active recall drills.'
  },
  advanced: {
    title: '🔴 Advanced / High-Yield',
    desc: 'Deep prior background. Prioritizes tricky 1% examination distractor traps, speed optimization, and full mock sprints.'
  }
} as const;

export const LEARNING_STYLE_DESCRIPTIONS = {
  practice: {
    title: '🎯 Practice-Heavy',
    desc: 'Problem solving, active diagnostic drills, and code/numerical calculation.'
  },
  conceptual: {
    title: '🧠 Conceptual Deep Dive',
    desc: 'First-principles proofs, detailed derivations, and mental model diagrams.'
  },
  'fast-track': {
    title: '⚡ Fast-Track High Yield',
    desc: 'Strictly Pareto 80/20 probability matrix for maximum points in minimum time.'
  }
} as const;

export const EBBINGHAUS_INTERVALS = [
  { days: 1, label: '1-Day Interval', purpose: 'Interrupt initial memory decay' },
  { days: 3, label: '3-Day Interval', purpose: 'Consolidate synaptic retention' },
  { days: 7, label: '7-Day Interval', purpose: 'Cement multi-step problem invariants' },
  { days: 14, label: '14-Day Interval', purpose: 'Permanent long-term memory retrieval' }
] as const;

export const SOCIAL_IMPACT_STATS = [
  {
    metric: '$0 vs $2,500',
    title: 'Free Equal Opportunity',
    desc: 'Replaces expensive private tutoring with free, high-tier 1-on-1 AI mentorship for all students.'
  },
  {
    metric: '4.2x',
    title: 'Retention Multiplier',
    desc: 'Scientifically proven active recall and spaced retrieval interrupts natural forgetting curves.'
  },
  {
    metric: '100% Adaptive',
    title: 'Zero Plan Abandonment',
    desc: 'Dynamic schedule rebalancing prevents students from dropping out when they fall behind.'
  },
  {
    metric: '24/7',
    title: 'Instant Doubt Resolution',
    desc: 'Eliminates late-night study blockers with structured, conceptual answers anytime.'
  }
] as const;

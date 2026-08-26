import {
  DailyTask,
  KnowledgeLevel,
  LearningStyle,
  Milestone,
  MilestoneStatus,
  PriorityLevel,
  QuizQuestion,
  RoadmapPhase,
  StudyPlan,
  TutorMessage,
  WeakArea
} from '../types';
import { callGemini, extractJsonFromText, hasActiveApiKey } from './geminiClient';

/**
 * Auto-suggests relevant syllabus topics based on user's entered subject
 */
export function suggestTopicsForSubject(subject: string): string[] {
  const s = subject.toLowerCase();

  if (s.includes('data structure') || s.includes('dsa') || s.includes('algorithm') || s.includes('coding')) {
    return [
      'Arrays, Two Pointers & Sliding Window',
      'Binary Search & Sorting Invariants',
      'Linked Lists & Fast/Slow Pointers',
      'Binary Trees & Binary Search Trees (BST)',
      'Graph Traversals (BFS, DFS & Topological Sort)',
      'Dynamic Programming (1D, 2D & Knapsack)',
      'Heaps, Priority Queues & Top K Problems',
      'Greedy Algorithms & Backtracking'
    ];
  }

  if (s.includes('machine learning') || s.includes('ml') || s.includes('deep learning') || s.includes('ai')) {
    return [
      'Linear Algebra & Gradient Descent Optimization',
      'Neural Networks & Backpropagation from Scratch',
      'Convolutional Networks (CNNs) & Vision Transformers',
      'Transformer Architecture & Self-Attention Mechanics',
      'Fine-Tuning & Quantization (LoRA, QLoRA, AWQ)',
      'Retrieval-Augmented Generation (RAG) & Vector DBs',
      'Model Evaluation Metrics & Hallucination Mitigation'
    ];
  }

  if (s.includes('bio') || s.includes('med') || s.includes('usmle') || s.includes('anatomy') || s.includes('neet')) {
    return [
      'Enzyme Kinetics & Michaelis-Menten Inhibitors',
      'Carbohydrate Metabolism & Glycogen Storage Diseases',
      'Lipid Catabolism & Familial Hyperlipidemias',
      'Amino Acid Inborn Errors & Urea Cycle',
      'DNA Replication, Mismatch Repair & Genetics',
      'Cellular Signal Transduction & Second Messengers',
      'High-Yield Clinical Case Correlates'
    ];
  }

  if (s.includes('physic') || s.includes('mechanic')) {
    return [
      'Kinematics in 1D & 2D Vectors',
      'Newton’s Laws of Motion & Friction Invariants',
      'Work, Kinetic Energy & Conservation of Energy',
      'Momentum, Impulse & Center of Mass Collisions',
      'Rotational Dynamics & Torque Equilibrium',
      'Simple Harmonic Motion & Wave Interference',
      'Gravitation & Orbital Mechanics'
    ];
  }

  if (s.includes('chem') || s.includes('organic')) {
    return [
      'Stereochemistry, Chirality & Enantiomers',
      'Nucleophilic Substitution (SN1 vs SN2)',
      'Elimination Mechanisms (E1 vs E2)',
      'Electrophilic Aromatic Substitution',
      'Carbonyl Chemistry: Aldehydes & Ketones',
      'Carboxylic Acid Derivatives & Condensation',
      'NMR & IR Spectroscopy Structure Elucidation'
    ];
  }

  if (s.includes('finance') || s.includes('cfa') || s.includes('econ')) {
    return [
      'Time Value of Money & Discounted Cash Flows',
      'Financial Statement Analysis & Ratio Deconstruction',
      'Corporate Finance & Weighted Average Cost of Capital (WACC)',
      'Microeconomics: Elasticity & Market Structures',
      'Macroeconomics: Monetary & Fiscal Policy',
      'Fixed Income Valuation & Yield Curves',
      'Portfolio Management & CAPM Risk-Return'
    ];
  }

  return [
    `Foundational Principles of ${subject}`,
    `Core Theoretical Frameworks & Invariants`,
    `Intermediate Working Methodologies`,
    `Advanced Problem Patterns & Edge Cases`,
    `High-Yield Question Synthesis`,
    `Timed Full-Length Diagnostic Mock Drill`
  ];
}

/**
 * Generates an adaptive, personalized study roadmap
 * Tries live Gemini AI first; seamlessly falls back to cognitive rule engine.
 */
export async function generateStudyPlanAsync(
  subject: string,
  topics: string[],
  examDate: string,
  dailyHours: number,
  knowledgeLevel: KnowledgeLevel,
  learningStyle: LearningStyle,
  goal: string = 'High Mastery & Top Exam Score',
  apiKey?: string
): Promise<StudyPlan> {
  const sanitizedTopics = topics.length > 0 ? topics : suggestTopicsForSubject(subject);
  const today = new Date();
  const target = new Date(examDate);
  const diffTime = Math.max(1, target.getTime() - today.getTime());
  const totalDays = Math.max(3, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalStudyHours = Math.round(totalDays * dailyHours * 10) / 10;

  // Attempt live Gemini call if API key is active
  if (hasActiveApiKey(apiKey)) {
    try {
      const prompt = `You are EduPath AI, an expert instructional designer and cognitive coach.
Generate a comprehensive, personalized study roadmap JSON for a student preparing for an exam.

Inputs:
- Subject: ${subject}
- Syllabus Topics: ${JSON.stringify(sanitizedTopics)}
- Target Exam Date: ${examDate} (${totalDays} days remaining)
- Study Capacity: ${dailyHours} hours/day (Total: ${totalStudyHours} hours)
- Knowledge Baseline: ${knowledgeLevel}
- Learning Style: ${learningStyle}
- Goal: ${goal}

Generate a JSON object strictly matching this schema:
{
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase 1: ...",
      "description": "...",
      "estimatedDays": 4,
      "milestones": [
        {
          "id": "m-1-0",
          "title": "...",
          "priority": "high", // "high", "medium", or "low"
          "estimatedHours": 3.5,
          "status": "current", // first one "current", others "locked"
          "progressPercentage": 25,
          "topics": ["Subtopic 1", "Subtopic 2"],
          "tips": ["Examination strategy tip..."],
          "dayOffset": 1
        }
      ]
    }
  ],
  "dailyTasks": [
    {
      "id": "task-1",
      "title": "...",
      "topic": "...",
      "durationMinutes": 45,
      "priority": "high",
      "type": "concept", // "concept", "practice", "quiz", or "revision"
      "completed": false,
      "dueDate": "${new Date().toISOString().split('T')[0]}",
      "dayNumber": 1,
      "notes": "..."
    }
  ],
  "weakAreas": [
    {
      "id": "weak-1",
      "topic": "...",
      "subject": "${subject}",
      "accuracyScore": 45,
      "frequencyMissed": 2,
      "status": "critical",
      "lastPracticed": "Initial Diagnostic",
      "recommendedAction": "...",
      "keyConcepts": ["..."],
      "revisionDueDate": "${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"
    }
  ]
}

Ensure the roadmap has exactly 4 sequential phases covering foundations, core applications, high-yield mastery, and spaced recall/mock exams. Output ONLY pure valid JSON.`;

      const rawResponse = await callGemini(
        prompt,
        apiKey,
        'You are an expert AI curriculum and roadmap architect. Output ONLY valid JSON without preamble.',
        0.5,
        3000
      );

      const parsed = extractJsonFromText<{
        phases: RoadmapPhase[];
        dailyTasks: DailyTask[];
        weakAreas: WeakArea[];
      }>(rawResponse);

      if (parsed && Array.isArray(parsed.phases) && parsed.phases.length > 0) {
        // Normalize IDs and statuses
        const validatedPhases: RoadmapPhase[] = parsed.phases.map((p, pIdx) => ({
          id: p.id || `phase-${pIdx + 1}`,
          phaseNumber: p.phaseNumber || pIdx + 1,
          title: p.title || `Phase ${pIdx + 1}`,
          description: p.description || '',
          estimatedDays: p.estimatedDays || Math.ceil(totalDays / 4),
          milestones: (p.milestones || []).map((m, mIdx) => ({
            id: m.id || `m-${pIdx + 1}-${mIdx}`,
            phaseId: `phase-${pIdx + 1}`,
            title: m.title || `Topic ${mIdx + 1}`,
            priority: (m.priority === 'high' || m.priority === 'medium' || m.priority === 'low') ? m.priority : 'high',
            estimatedHours: m.estimatedHours || 3,
            status: (pIdx === 0 && mIdx === 0) ? 'current' : 'locked',
            progressPercentage: (pIdx === 0 && mIdx === 0) ? 25 : 0,
            topics: Array.isArray(m.topics) ? m.topics : [m.title],
            tips: Array.isArray(m.tips) && m.tips.length > 0 ? m.tips : ['Focus on invariant rules before memorization.'],
            dayOffset: m.dayOffset || (pIdx * 3 + mIdx + 1)
          }))
        }));

        const validatedTasks: DailyTask[] = (parsed.dailyTasks || []).map((t, idx) => ({
          id: t.id || `task-live-${idx}`,
          title: t.title || `Study Task ${idx + 1}`,
          topic: t.topic || sanitizedTopics[0] || 'Foundations',
          phaseId: 'phase-1',
          durationMinutes: t.durationMinutes || 45,
          priority: t.priority || 'high',
          type: (t.type === 'concept' || t.type === 'practice' || t.type === 'quiz' || t.type === 'revision') ? t.type : 'concept',
          completed: false,
          dueDate: t.dueDate || new Date().toISOString().split('T')[0],
          dayNumber: t.dayNumber || 1,
          notes: t.notes || 'Focus on core definitions and creating summary flashcards.'
        }));

        const validatedWeakAreas: WeakArea[] = (parsed.weakAreas || []).map((w, idx) => ({
          id: w.id || `weak-live-${idx}`,
          topic: w.topic || sanitizedTopics[idx] || 'Core Concept',
          subject: subject,
          accuracyScore: w.accuracyScore || 45,
          frequencyMissed: w.frequencyMissed || 2,
          status: 'critical',
          lastPracticed: 'Initial Assessment',
          recommendedAction: w.recommendedAction || `Complete 10-minute active recall drill on ${w.topic}`,
          keyConcepts: Array.isArray(w.keyConcepts) ? w.keyConcepts : ['Formulas', 'Boundary invariants'],
          revisionDueDate: w.revisionDueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));

        return {
          id: `plan-live-${Date.now()}`,
          subject,
          goal,
          examDate,
          dailyHours,
          knowledgeLevel,
          learningStyle,
          topics: sanitizedTopics,
          createdAt: new Date().toISOString(),
          readinessScore: knowledgeLevel === 'beginner' ? 35 : knowledgeLevel === 'intermediate' ? 55 : 72,
          streakDays: 1,
          totalStudyHours,
          completedStudyHours: 0,
          currentDay: 1,
          totalDays,
          phases: validatedPhases,
          dailyTasks: validatedTasks.length > 0 ? validatedTasks : generateAlgorithmicDailyTasks(sanitizedTopics, dailyHours),
          weakAreas: validatedWeakAreas.length > 0 ? validatedWeakAreas : generateAlgorithmicWeakAreas(sanitizedTopics, subject),
          quizHistory: []
        };
      }
    } catch (e) {
      console.warn('Live Gemini Roadmap call failed, falling back to algorithmic engine:', e);
    }
  }

  // Algorithmic Fallback
  return generateStudyPlan(subject, sanitizedTopics, examDate, dailyHours, knowledgeLevel, learningStyle, goal);
}

/**
 * Synchronous algorithmic study plan generator (used as fallback or offline)
 */
export function generateStudyPlan(
  subject: string,
  topics: string[],
  examDate: string,
  dailyHours: number,
  knowledgeLevel: KnowledgeLevel,
  learningStyle: LearningStyle,
  goal: string = 'High Mastery & Top Exam Score'
): StudyPlan {
  const today = new Date();
  const target = new Date(examDate);
  const diffTime = Math.max(1, target.getTime() - today.getTime());
  const totalDays = Math.max(3, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalStudyHours = Math.round(totalDays * dailyHours * 10) / 10;

  const sanitizedTopics = topics.length > 0
    ? topics
    : suggestTopicsForSubject(subject);

  let phaseWeights = [0.25, 0.35, 0.20, 0.20];
  if (knowledgeLevel === 'beginner') {
    phaseWeights = [0.35, 0.35, 0.15, 0.15];
  } else if (knowledgeLevel === 'advanced') {
    phaseWeights = [0.15, 0.30, 0.30, 0.25];
  }

  const phase1Days = Math.max(1, Math.round(totalDays * phaseWeights[0]));
  const phase2Days = Math.max(1, Math.round(totalDays * phaseWeights[1]));
  const phase3Days = Math.max(1, Math.round(totalDays * phaseWeights[2]));
  const phase4Days = Math.max(1, totalDays - (phase1Days + phase2Days + phase3Days));

  const chunkCount = Math.ceil(sanitizedTopics.length / 3);
  const earlyTopics = sanitizedTopics.slice(0, Math.max(1, chunkCount));
  const midTopics = sanitizedTopics.slice(Math.max(1, chunkCount), Math.max(2, chunkCount * 2));
  const advancedTopics = sanitizedTopics.slice(Math.max(2, chunkCount * 2));
  if (advancedTopics.length === 0 && sanitizedTopics.length > 1) {
    advancedTopics.push(sanitizedTopics[sanitizedTopics.length - 1]);
  }

  const phases: RoadmapPhase[] = [
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Phase 1: Conceptual Foundations & Mental Models',
      description: `Establish bedrock understanding of ${earlyTopics.slice(0, 2).join(', ')} with low cognitive load.`,
      estimatedDays: phase1Days,
      milestones: earlyTopics.map((t, idx) => ({
        id: `m-1-${idx}`,
        phaseId: 'phase-1',
        title: `Core Principles: ${t}`,
        priority: 'high' as PriorityLevel,
        estimatedHours: Math.max(2, Math.round((phase1Days * dailyHours) / earlyTopics.length)),
        status: idx === 0 ? 'current' : 'locked',
        progressPercentage: idx === 0 ? 30 : 0,
        topics: [t, 'Definitions & Core Theorems', 'Standard Working Examples'],
        tips: [
          'Focus on first-principles understanding before memorization.',
          'Draw visual diagrams to reinforce memory retention.'
        ],
        dayOffset: Math.min(phase1Days, idx * 2 + 1)
      }))
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Phase 2: Core Deep-Dive & Methodological Application',
      description: `Deep systematic exploration of ${midTopics.slice(0, 2).join(', ')} with targeted practice.`,
      estimatedDays: phase2Days,
      milestones: (midTopics.length > 0 ? midTopics : ['Intermediate Applications']).map((t, idx) => ({
        id: `m-2-${idx}`,
        phaseId: 'phase-2',
        title: `Mastery Sprint: ${t}`,
        priority: (idx % 2 === 0 ? 'high' : 'medium') as PriorityLevel,
        estimatedHours: Math.max(3, Math.round((phase2Days * dailyHours) / Math.max(1, midTopics.length))),
        status: 'locked',
        progressPercentage: 0,
        topics: [t, 'Edge Cases & Exceptions', 'Multi-step Problem Solving'],
        tips: [
          'Deconstruct standard exam traps related to this concept.',
          'Solve intermediate difficulty problems under timed conditions.'
        ],
        dayOffset: phase1Days + (idx * 2 + 1)
      }))
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Phase 3: High-Yield Synthesis & Problem-Solving',
      description: `Interleaving hard concepts (${advancedTopics.slice(0, 2).join(', ')}) with active synthesis.`,
      estimatedDays: phase3Days,
      milestones: (advancedTopics.length > 0 ? advancedTopics : ['Complex Synthesis & Integration']).map((t, idx) => ({
        id: `m-3-${idx}`,
        phaseId: 'phase-3',
        title: `High-Yield Challenge: ${t}`,
        priority: 'high' as PriorityLevel,
        estimatedHours: Math.max(3, Math.round((phase3Days * dailyHours) / Math.max(1, advancedTopics.length))),
        status: 'locked',
        progressPercentage: 0,
        topics: [t, 'Cross-Domain Integration', 'High Difficulty Exam Questions'],
        tips: [
          'Practice explaining this topic out loud without looking at notes (Feynman Technique).'
        ],
        dayOffset: phase1Days + phase2Days + (idx * 2 + 1)
      }))
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Phase 4: Spaced Recall, Weak Spots & Mock Sprint',
      description: 'Timed full-length exam simulations, active recall intervals, and weak area remediation.',
      estimatedDays: phase4Days,
      milestones: [
        {
          id: 'm-4-1',
          phaseId: 'phase-4',
          title: 'Full-Scope Timed Diagnostic Exam',
          priority: 'high',
          estimatedHours: Math.round(dailyHours * 1.5),
          status: 'locked',
          progressPercentage: 0,
          topics: ['All Syllabus Topics', 'Exam Pacing Strategy', 'Mistake Journaling'],
          tips: ['Replicate exact examination conditions (no aids, strict timer).'],
          dayOffset: totalDays - 2
        },
        {
          id: 'm-4-2',
          phaseId: 'phase-4',
          title: 'Weak Spot Elimination & Cheat Sheet Synthesis',
          priority: 'high',
          estimatedHours: dailyHours,
          status: 'locked',
          progressPercentage: 0,
          topics: ['Identified Low-Accuracy Concepts', 'Formula/Rule Sheets', 'Final Confidence Booster'],
          tips: ['Do not learn new material on the final day; consolidate high-yield memory patterns.'],
          dayOffset: totalDays
        }
      ]
    }
  ];

  const dailyTasks = generateAlgorithmicDailyTasks(sanitizedTopics, dailyHours);
  const weakAreas = generateAlgorithmicWeakAreas(sanitizedTopics, subject);

  return {
    id: `plan-${Date.now()}`,
    subject,
    goal,
    examDate,
    dailyHours,
    knowledgeLevel,
    learningStyle,
    topics: sanitizedTopics,
    createdAt: new Date().toISOString(),
    readinessScore: knowledgeLevel === 'beginner' ? 35 : knowledgeLevel === 'intermediate' ? 55 : 72,
    streakDays: 1,
    totalStudyHours,
    completedStudyHours: 0,
    currentDay: 1,
    totalDays,
    phases,
    dailyTasks,
    weakAreas,
    quizHistory: []
  };
}

function generateAlgorithmicDailyTasks(topics: string[], dailyHours: number): DailyTask[] {
  return [
    {
      id: 'task-gen-1',
      title: `Deep Read & Summary Notes: ${topics[0] || 'Foundations'}`,
      topic: topics[0] || 'Foundations',
      phaseId: 'phase-1',
      durationMinutes: Math.min(60, Math.round(dailyHours * 60 * 0.4)),
      priority: 'high',
      type: 'concept',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dayNumber: 1,
      notes: 'Focus on core definitions and creating a quick reference flashcard.'
    },
    {
      id: 'task-gen-2',
      title: `Practice 5 Fundamental Problems: ${topics[0] || 'Foundations'}`,
      topic: topics[0] || 'Foundations',
      phaseId: 'phase-1',
      durationMinutes: Math.min(45, Math.round(dailyHours * 60 * 0.35)),
      priority: 'high',
      type: 'practice',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dayNumber: 1,
      notes: 'Identify which questions took longer than 5 minutes.'
    },
    {
      id: 'task-gen-3',
      title: `AI Diagnostic Knowledge Quiz on ${topics[0] || 'Core Concepts'}`,
      topic: topics[0] || 'Foundations',
      phaseId: 'phase-1',
      durationMinutes: 20,
      priority: 'medium',
      type: 'quiz',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dayNumber: 1,
      notes: 'This will calibrate your weak-area diagnostic dashboard.'
    },
    {
      id: 'task-gen-4',
      title: `Spaced Repetition Review Checkpoint (1-Day Interval)`,
      topic: topics[0] || 'Foundations',
      phaseId: 'phase-1',
      durationMinutes: 15,
      priority: 'high',
      type: 'revision',
      completed: false,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayNumber: 2,
      notes: 'Active retrieval before Ebbinghaus memory decay.'
    }
  ];
}

function generateAlgorithmicWeakAreas(topics: string[], subject: string): WeakArea[] {
  return topics.slice(0, 2).map((t, idx) => ({
    id: `weak-init-${idx}`,
    topic: t,
    subject: subject,
    accuracyScore: idx === 0 ? 45 : 60,
    frequencyMissed: idx === 0 ? 3 : 2,
    status: idx === 0 ? 'critical' : 'improving',
    lastPracticed: 'Initial Assessment',
    recommendedAction: `Complete 10-minute active recall drill on ${t}.`,
    keyConcepts: ['Fundamental formulas', 'Core problem patterns', 'Common pitfalls'],
    revisionDueDate: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
}

/**
 * Generates active recall quiz questions
 * Tries live Gemini AI first; seamlessly falls back to domain-specific question banks.
 */
export async function generateQuizQuestionsAsync(
  topic: string,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  apiKey?: string
): Promise<QuizQuestion[]> {
  if (hasActiveApiKey(apiKey)) {
    try {
      const prompt = `Generate ${count} high-yield multiple choice active recall questions for the topic: "${topic}" with difficulty level "${difficulty}".

Each question must test conceptual understanding, edge cases, and exam traps.

Generate a JSON array matching this exact schema:
[
  {
    "id": "q-live-1",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "question": "Clear and rigorous question text",
    "options": [
      "Option A text",
      "Option B text",
      "Option C text",
      "Option D text"
    ],
    "correctAnswer": 0, // integer index 0-3
    "explanation": "In-depth pedagogical breakdown explaining why the answer is correct.",
    "whyCorrect": "First-principles theorem or invariant proof.",
    "commonMistake": "Why students commonly fall for the distractor options."
  }
]

Output ONLY pure valid JSON array without markdown formatting.`;

      const raw = await callGemini(
        prompt,
        apiKey,
        'You are an expert examiner and active recall quiz author. Output ONLY valid JSON array.',
        0.6,
        2500
      );

      const parsed = extractJsonFromText<QuizQuestion[]>(raw);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, count).map((q, idx) => ({
          id: q.id || `q-live-${Date.now()}-${idx}`,
          topic: q.topic || topic,
          difficulty: q.difficulty || difficulty,
          question: q.question,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4 ? q.correctAnswer : 0,
          explanation: q.explanation || 'Detailed invariant explanation.',
          whyCorrect: q.whyCorrect || 'Core theoretical proof.',
          commonMistake: q.commonMistake || 'Confusing average case with worst case.'
        }));
      }
    } catch (e) {
      console.warn('Live Gemini Quiz call failed, falling back to algorithmic bank:', e);
    }
  }

  // Algorithmic Fallback
  return generateQuizQuestions(topic, count, difficulty);
}

/**
 * Synchronous algorithmic question generator
 */
export function generateQuizQuestions(
  topic: string,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): QuizQuestion[] {
  const lowerTopic = topic.toLowerCase();

  // 1. Trees & BST Questions
  if (lowerTopic.includes('tree') || lowerTopic.includes('bst') || lowerTopic.includes('binary')) {
    const list: QuizQuestion[] = [
      {
        id: 'q-tree-1',
        topic,
        difficulty: 'medium',
        question: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST) vs a skewed BST in the worst case?',
        options: [
          'O(log N) for balanced, O(N) for skewed',
          'O(1) for balanced, O(log N) for skewed',
          'O(N) for balanced, O(N log N) for skewed',
          'O(log N) for both balanced and skewed'
        ],
        correctAnswer: 0,
        explanation: 'In a balanced BST (like AVL or Red-Black), the tree height is O(log N), giving O(log N) search time. In a completely skewed tree, it degenerates into a linked list of height N, resulting in O(N) worst-case search.',
        whyCorrect: 'Search complexity is directly bounded by tree height h. For balanced trees h = floor(log2(N)), while for skewed trees h = N.',
        commonMistake: 'Assuming all BSTs guarantee logarithmic search without taking balancing factors into account.'
      },
      {
        id: 'q-tree-2',
        topic,
        difficulty: 'medium',
        question: 'Which tree traversal order yields keys in ascending sorted order when applied to a valid Binary Search Tree?',
        options: [
          'Preorder Traversal (Root, Left, Right)',
          'Inorder Traversal (Left, Root, Right)',
          'Postorder Traversal (Left, Right, Root)',
          'Level-order Traversal (BFS)'
        ],
        correctAnswer: 1,
        explanation: 'By BST invariant, all nodes in the left subtree are smaller than the root, and all nodes in the right subtree are larger. Visiting Left -> Root -> Right (Inorder) naturally visits elements in strictly ascending order.',
        whyCorrect: 'Left subtree elements (< Root) are processed before Root, and Root is processed before Right subtree (> Root).',
        commonMistake: 'Confusing Preorder (used for tree cloning/serialization) with Inorder (sorted traversal).'
      },
      {
        id: 'q-tree-3',
        topic,
        difficulty: 'hard',
        question: 'In a binary tree with N nodes, what is the maximum possible number of NULL pointers (leaves + single-child missing branches)?',
        options: [
          'N - 1',
          'N',
          'N + 1',
          '2 * N'
        ],
        correctAnswer: 2,
        explanation: 'Every node in a binary tree has 2 child pointers, giving 2N total pointers. Exactly (N - 1) pointers are used to connect the N nodes from root down. Therefore, unused NULL pointers = 2N - (N - 1) = N + 1.',
        whyCorrect: 'Standard graph theory theorem for trees: A tree with N nodes has exactly N - 1 directed edges. 2N - (N - 1) = N + 1.',
        commonMistake: 'Guessing N or 2N without using the edge counting invariant.'
      },
      {
        id: 'q-tree-4',
        topic,
        difficulty: 'medium',
        question: 'When finding the Lowest Common Ancestor (LCA) of two nodes p and q in a BST, how can you determine if the current node is the LCA?',
        options: [
          'If both p.val and q.val are greater than node.val',
          'If both p.val and q.val are smaller than node.val',
          'If p.val and q.val lie on opposite sides of node.val (or one equals node.val)',
          'If node.val is equal to (p.val + q.val) / 2'
        ],
        correctAnswer: 2,
        explanation: 'The moment the split point occurs (one node is <= root.val and the other >= root.val), the current node is guaranteed to be the Lowest Common Ancestor in a BST.',
        whyCorrect: 'If both were strictly greater, LCA must be in the right subtree. If both smaller, left subtree. The divergence point is the LCA.',
        commonMistake: 'Doing a full O(N) generic binary tree search instead of taking advantage of BST ordering properties in O(h).'
      },
      {
        id: 'q-tree-5',
        topic,
        difficulty: 'easy',
        question: 'What is the maximum number of nodes at level L (where root is level 0) of a binary tree?',
        options: [
          '2^L',
          '2^(L+1)',
          '2*L',
          'L^2'
        ],
        correctAnswer: 0,
        explanation: 'At level 0, max nodes = 2^0 = 1. At level 1 = 2^1 = 2. At level L, max nodes = 2^L.',
        whyCorrect: 'Each node can branch into at most 2 children, compounding exponentially by a factor of 2 at each level.',
        commonMistake: 'Using 1-based indexing formula without verifying level 0 base case.'
      }
    ];
    return list.slice(0, count);
  }

  // 2. Dynamic Programming Questions
  if (lowerTopic.includes('dynamic') || lowerTopic.includes('dp') || lowerTopic.includes('knapsack')) {
    const list: QuizQuestion[] = [
      {
        id: 'q-dp-1',
        topic,
        difficulty: 'medium',
        question: 'What are the two essential properties a problem must possess to be effectively solvable using Dynamic Programming?',
        options: [
          'Greedy choice property and optimal substructure',
          'Optimal substructure and overlapping subproblems',
          'Divide and conquer structure and linear complexity',
          'Recursion depth bound and continuous state space'
        ],
        correctAnswer: 1,
        explanation: 'Dynamic Programming applies when a problem has "Optimal Substructure" (optimal solution is built from optimal subsolutions) and "Overlapping Subproblems" (same subproblems are computed repeatedly).',
        whyCorrect: 'Without overlapping subproblems, standard divide-and-conquer (like Merge Sort) is sufficient. Without optimal substructure, caching subsolutions produces incorrect global answers.',
        commonMistake: 'Confusing Greedy Choice Property (local optimum leads to global optimum) with Optimal Substructure.'
      },
      {
        id: 'q-dp-2',
        topic,
        difficulty: 'hard',
        question: 'In the classic 0/1 Knapsack problem with N items and Capacity W, what is the space complexity if optimized using a 1D array?',
        options: [
          'O(N * W)',
          'O(N)',
          'O(W)',
          'O(1)'
        ],
        correctAnswer: 2,
        explanation: 'By iterating the capacity backwards from W down to item weight, we only need the previous row values, reducing space from O(N * W) to O(W).',
        whyCorrect: 'Traversing backwards ensures that dp[w - weight] references the value from the previous item iteration, preventing multiple inclusions of the same item.',
        commonMistake: 'Iterating capacity forwards in 0/1 knapsack, which accidentally converts it into Unbounded Knapsack.'
      },
      {
        id: 'q-dp-3',
        topic,
        difficulty: 'medium',
        question: 'In Longest Increasing Subsequence (LIS), what is the optimal time complexity achievable using Dynamic Programming combined with Binary Search (Patience Sorting)?',
        options: [
          'O(N^2)',
          'O(N log N)',
          'O(N)',
          'O(2^N)'
        ],
        correctAnswer: 1,
        explanation: 'The standard DP approach is O(N^2), but maintaining the smallest tail of all increasing subsequences of various lengths with binary search reduces runtime to O(N log N).',
        whyCorrect: 'The "tails" array remains strictly sorted, allowing binary search (std::lower_bound or bisect_left) in O(log N) for each of the N elements.',
        commonMistake: 'Thinking O(N^2) double loop is the best achievable time complexity for LIS.'
      }
    ];
    return list.slice(0, count);
  }

  // 3. Graph Algorithms Questions
  if (lowerTopic.includes('graph') || lowerTopic.includes('dijkstra') || lowerTopic.includes('bfs') || lowerTopic.includes('dfs')) {
    const list: QuizQuestion[] = [
      {
        id: 'q-graph-1',
        topic,
        difficulty: 'medium',
        question: 'What data structure is used to implement Dijkstra’s single-source shortest path algorithm efficiently, and what is its time complexity with V vertices and E edges?',
        options: [
          'Min-Priority Queue / Min-Heap, yielding O((V + E) log V)',
          'FIFO Queue, yielding O(V * E)',
          'LIFO Stack, yielding O(V^2)',
          'Disjoint Set Union (DSU), yielding O(E log E)'
        ],
        correctAnswer: 0,
        explanation: 'Dijkstra extracts the minimum distance node using a Min-Heap. With adjacency lists, each vertex is extracted once (O(V log V)) and edges are relaxed (O(E log V)), giving O((V + E) log V).',
        whyCorrect: 'The greedy extraction of the minimum distance invariant guarantees shortest paths provided all edge weights are non-negative.',
        commonMistake: 'Attempting to run Dijkstra on graphs with negative edge weights (which requires Bellman-Ford).'
      },
      {
        id: 'q-graph-2',
        topic,
        difficulty: 'hard',
        question: 'How do you detect a cycle in a DIRECTED graph vs an UNDIRECTED graph?',
        options: [
          'Directed requires checking the active recursion stack (or 3-color states); undirected only requires checking if an adjacent node is visited and not the immediate parent',
          'Both only require a simple boolean visited array',
          'Directed graphs cannot contain cycles by mathematical definition',
          'Topological sort works on directed graphs with cycles'
        ],
        correctAnswer: 0,
        explanation: 'In directed graphs, cross-edges or forward edges to already visited nodes do not imply a cycle. A back-edge to a node currently on the active recursion call stack (or Gray state in 3-color DFS) proves a directed cycle.',
        whyCorrect: 'A back-edge in directed graphs creates a circular dependency chain.',
        commonMistake: 'Treating cross-edges to previously finished branches as cycles in directed graphs.'
      }
    ];
    return list.slice(0, count);
  }

  // 4. Machine Learning & Transformer Questions
  if (lowerTopic.includes('transformer') || lowerTopic.includes('attention') || lowerTopic.includes('machine learning') || lowerTopic.includes('ml')) {
    const list: QuizQuestion[] = [
      {
        id: 'q-ml-1',
        topic,
        difficulty: 'medium',
        question: 'In Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V, why is the dot-product divided by sqrt(d_k)?',
        options: [
          'To prevent the dot products from growing large in magnitude, which causes softmax gradients to vanish into near-zero plateaus',
          'To reduce the floating point memory usage of Q and K by half',
          'To enforce unitary orthogonal rotation of Query vectors',
          'To ensure causality and prevent looking ahead at future tokens'
        ],
        correctAnswer: 0,
        explanation: 'For large vector dimensions d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. Scaling by 1/sqrt(d_k) counteracts this variance growth.',
        whyCorrect: 'Assuming components of Q and K are independent random variables with mean 0 and variance 1, their dot product has mean 0 and variance d_k. Dividing by sqrt(d_k) scales variance back to 1.',
        commonMistake: 'Thinking the scaling is used for causal masking (which is done by adding a negative infinity mask matrix).'
      },
      {
        id: 'q-ml-2',
        topic,
        difficulty: 'hard',
        question: 'What is the core mathematical premise behind Low-Rank Adaptation (LoRA) for parameter-efficient fine-tuning?',
        options: [
          'The weight updates during adaptation have a low intrinsic dimension/rank r << d, allowing delta W to be decomposed into B * A where B is (d x r) and A is (r x k)',
          'All attention heads can be completely removed without accuracy loss',
          'Weight values can be truncated to 1-bit integers without calibration',
          'Feed-forward layers can be replaced with static lookup tables'
        ],
        correctAnswer: 0,
        explanation: 'LoRA freezes pre-trained model weights W_0 and injects trainable rank decomposition matrices A and B (with rank r << min(d, k)). This reduces trainable parameters by up to 99% while preserving full capacity.',
        whyCorrect: 'Pre-trained foundation models already contain broad representations; task-specific adaptation lies in a significantly lower-dimensional subspace.',
        commonMistake: 'Assuming LoRA quantizes the base weights rather than decomposing the delta weight update matrix.'
      }
    ];
    return list.slice(0, count);
  }

  // General high-quality dynamic question generator for any custom topic
  const dynamicList: QuizQuestion[] = [
    {
      id: `q-gen-${Date.now()}-1`,
      topic,
      difficulty: 'easy',
      question: `Which fundamental principle is most central to mastering ${topic}?`,
      options: [
        `Decomposing problems into independent first-order components and verifying invariants`,
        `Relying solely on rote memorization without practical execution`,
        `Ignoring edge cases during initial formulation`,
        `Optimizing runtime before verifying solution correctness`
      ],
      correctAnswer: 0,
      explanation: `Mastery in ${topic} requires structured conceptual decomposition rather than superficial memorization.`,
      whyCorrect: 'Systematic breakdown allows you to apply core theorems reliably across varied examination scenarios.',
      commonMistake: 'Jumping directly into complex optimizations before establishing baseline correctness.'
    },
    {
      id: `q-gen-${Date.now()}-2`,
      topic,
      difficulty: 'medium',
      question: `When dealing with trade-offs in ${topic}, what is typically prioritized in high-stakes problem solving?`,
      options: [
        'Minimizing time complexity while preserving invariants and error handling',
        'Writing minimal lines of code at the expense of readability and maintainability',
        'Maximizing memory allocation to avoid cache misses unconditionally',
        'Using brute-force iterations to guarantee coverage'
      ],
      correctAnswer: 0,
      explanation: `Exam criteria reward rigorous invariant management, computational efficiency, and robust boundary condition handling.`,
      whyCorrect: 'Preserving core invariants prevents subtle edge-case failures under high load.',
      commonMistake: 'Focusing exclusively on micro-optimizations while overlooking structural constraints.'
    },
    {
      id: `q-gen-${Date.now()}-3`,
      topic,
      difficulty: 'hard',
      question: `What is a common pitfall that students frequently encounter when analyzing ${topic}?`,
      options: [
        'Confusing average-case behavior with strict worst-case asymptotic bounds',
        'Applying modular verification to sub-routines',
        'Double-checking boundary conditions for 0, 1, and N',
        'Constructing visual state-transition diagrams'
      ],
      correctAnswer: 0,
      explanation: `A major exam trap is assuming expected/average runtime holds true in adverse worst-case adversarial inputs.`,
      whyCorrect: 'Examiners often test pathological edge cases specifically designed to expose unhandled worst-case complexity.',
      commonMistake: 'Assuming best-case heuristics are universal guarantees.'
    },
    {
      id: `q-gen-${Date.now()}-4`,
      topic,
      difficulty: 'medium',
      question: `How does active recall and spaced repetition optimize retention in ${topic}?`,
      options: [
        'By interrupting the Ebbinghaus forgetting curve at calculated decay intervals',
        'By encouraging passive re-reading of textbooks without self-testing',
        'By eliminating the need for foundational conceptual understanding',
        'By compressing all study hours into a single overnight cram session'
      ],
      correctAnswer: 0,
      explanation: 'Cognitive science shows that actively retrieving information right before memory decay reinforces synaptic plasticity and long-term retention.',
      whyCorrect: 'Active retrieval forces neural pathways to strengthen, reducing future decay rates significantly.',
      commonMistake: 'Believing passive highlighting or re-reading creates durable memory.'
    },
    {
      id: `q-gen-${Date.now()}-5`,
      topic,
      difficulty: 'easy',
      question: `What is the most effective diagnostic step if you score below 60% on a ${topic} assessment?`,
      options: [
        'Catalog mistake patterns in a Weak-Area journal and re-test within 48 hours',
        'Immediately move to unrelated advanced topics and skip the review',
        'Assume the topic is unlearnable and ignore it in the exam',
        'Re-read the entire textbook chapter from scratch without practice'
      ],
      correctAnswer: 0,
      explanation: 'Targeted error analysis with rapid active re-testing converts high-frequency errors into mastery.',
      whyCorrect: 'Focusing directly on failed sub-concepts produces the highest marginal readiness gain per study hour.',
      commonMistake: 'Skipping error analysis due to cognitive discomfort.'
    }
  ];

  return dynamicList.slice(0, count);
}

/**
 * Intelligent context-aware AI tutor response generator with structured 4-part educational format:
 * 1. Simple explanation (ELI5 / Real-world intuition)
 * 2. Key concept (Core invariant, formula, or rule)
 * 3. Example (Step-by-step walkthrough or sample code)
 * 4. Short takeaway (1-sentence quick recall anchor or mnemonic)
 */
export async function getTutorAnswer(
  userQuery: string,
  subject: string,
  currentTopic: string = 'General Syllabus',
  weakAreas: string[] = [],
  apiKey?: string
): Promise<string> {
  // Live Gemini API call if API key is active
  if (hasActiveApiKey(apiKey)) {
    try {
      const prompt = `You are EduPath AI, an empathetic, world-class study tutor and examination coach.
Subject: ${subject}
Current Topic Context: ${currentTopic}
Student's Known Weak Spots: ${weakAreas.join(', ') || 'None identified yet'}

User Question: ${userQuery}

CRITICAL: You MUST format your educational answer strictly using these 4 exact numbered sections:
### 1. 💡 Simple Explanation
(An intuitive real-world analogy or plain-English conceptual breakdown)

### 2. 🔑 Key Concept
(The exact mathematical formula, invariant rule, or core definition)

### 3. 📝 Example
(A concrete step-by-step example, problem walkthrough, or sample code)

### 4. 📌 Short Takeaway
(A memorable 1-sentence exam takeaway or mnemonic anchor)`;

      const text = await callGemini(
        prompt,
        apiKey,
        'You are an empathetic, world-class study tutor. Format responses strictly using the 4 numbered educational sections.',
        0.7,
        1500
      );

      if (text && text.trim().length > 20) {
        return text;
      }
    } catch (e) {
      console.warn('Live Gemini Tutor API call error, using structured fallback engine:', e);
    }
  }

  // Structured Fallback Simulator
  const q = userQuery.toLowerCase();

  if (q.includes('dijkstra') || q.includes('shortest path') || q.includes('graph')) {
    return `### 1. 💡 Simple Explanation
Imagine you are exploring an uncharted subway map with multiple connecting stations. Instead of guessing paths randomly, you always travel to the unvisited station that has the lowest total travel time from your starting point. Because there are no "time-travel negative delays", the first time you reach a station, you are guaranteed to have found the fastest possible route to it.

### 2. 🔑 Key Concept
- **Algorithm**: Dijkstra's Single-Source Shortest Path.
- **Core Invariant**: Greedily extracts the minimum tentative distance node $u \\in V$ from a Min-Priority Queue.
- **Complexity**: $O((V + E) \\log V)$ using an Adjacency List and Min-Heap.
- **Strict Requirement**: All edge weights must be non-negative ($w(u, v) \\ge 0$).

### 3. 📝 Example
Suppose Station A connects to B (weight 4) and C (weight 2), and C connects to B (weight 1):
1. **Initialize**: $\\text{dist}[A]=0, \\text{dist}[B]=\\infty, \\text{dist}[C]=\\infty$.
2. **Step 1**: Min-Heap pops $A$ ($0$). Relaxes neighbors: $\\text{dist}[C]=2, \\text{dist}[B]=4$.
3. **Step 2**: Min-Heap pops $C$ ($2$). Relaxes neighbor $B$: $2 + 1 = 3 < 4$, so $\\text{dist}[B]$ updates to $3$.
4. **Result**: Shortest path to $B$ is via $C$ with total distance $3$.

### 4. 📌 Short Takeaway
> **⚡ Exam Anchor**: Dijkstra is greedy on non-negative weights; if edge weights can be negative, switch immediately to **Bellman-Ford** ($O(V \\times E)$).`;
  }

  if (q.includes('dp') || q.includes('dynamic programming') || q.includes('memoization') || q.includes('knapsack')) {
    return `### 1. 💡 Simple Explanation
Imagine climbing a 100-step staircase. Instead of recalculating how many step combinations exist for step 10 every time you walk by, you write the number down on a sticky note. When you need step 11, you just look at the sticky notes for steps 9 and 10 and add them together! In computer science, that sticky note is called **memoization**.

### 2. 🔑 Key Concept
- **The Two Requirements**: 
  1. **Optimal Substructure**: The optimal solution to the problem contains within it optimal solutions to subproblems.
  2. **Overlapping Subproblems**: The same subproblems are encountered and solved multiple times in a recursion tree.
- **Recurrence Formula (0/1 Knapsack)**:
  $$dp[i][w] = \\max(dp[i-1][w], \\,\\text{value}[i] + dp[i-1][w - \\text{weight}[i]])$$

### 3. 📝 Example
Calculating Fibonacci $F(5)$:
- **Naive Recursion**: Calls $F(3)$ twice and $F(2)$ three times $\\rightarrow O(2^N)$ exponential time.
- **Dynamic Programming**: Stores $F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5$ in an array $\\rightarrow O(N)$ linear time and $O(1)$ space.

### 4. 📌 Short Takeaway
> **🧠 Memory Anchor ("FAST-P")**: Foundations $\\rightarrow$ Allocation $\\rightarrow$ Subproblems $\\rightarrow$ Transitions $\\rightarrow$ Pruning. Always define $dp[i]$ in words before writing code!`;
  }

  if (q.includes('binary search') || q.includes('bst') || q.includes('tree')) {
    return `### 1. 💡 Simple Explanation
Think of guessing a secret number between 1 and 100 where your friend tells you "Higher" or "Lower" after each guess. Guessing 50 instantly eliminates 50 numbers in a single question. Even if the range grows from 100 to 1,000,000, you only need ~20 guesses because the search space gets cut in half on every decision.

### 2. 🔑 Key Concept
- **Core Condition**: The search domain must be **monotonic** (strictly non-decreasing or predictable).
- **Time Complexity**: $O(\\log N)$ time, $O(1)$ auxiliary space.
- **Midpoint Formula to prevent integer overflow**:
  $$\\text{mid} = \\text{low} + \\left\\lfloor \\frac{\\text{high} - \\text{low}}{2} \\right\\rfloor$$

### 3. 📝 Example
Searching for target $7$ in sorted array $[1, 3, 5, 7, 9, 11]$:
1. $\\text{low}=0, \\text{high}=5 \\rightarrow \\text{mid}=2$ (value $5$). Since $5 < 7$, set $\\text{low} = \\text{mid} + 1 = 3$.
2. $\\text{low}=3, \\text{high}=5 \\rightarrow \\text{mid}=4$ (value $9$). Since $9 > 7$, set $\\text{high} = \\text{mid} - 1 = 3$.
3. $\\text{low}=3, \\text{high}=3 \\rightarrow \\text{mid}=3$ (value $7$). Target found in 3 checks!

### 4. 📌 Short Takeaway
> **⚡ Exam Trap**: Always use \`low + (high - low) / 2\` and double check whether your boundary update should be \`mid\` or \`mid + 1\` to avoid infinite loops!`;
  }

  // General Domain-Specific Structured Response
  return `### 1. 💡 Simple Explanation
When breaking down **${userQuery}** in **${subject}** (${currentTopic}), think of it like constructing a multi-layer bridge. Before applying high-speed stress loads, each structural pillar must independently uphold its baseline mathematical invariant so the entire framework remains stable under exam conditions.

### 2. 🔑 Key Concept
- **Core Principle**: Problem decomposition into first-order principles and invariant verification.
- **Asymptotic Bound**: Ensures operational complexity does not exceed $O(N \\log N)$ under worst-case adversarial inputs.
- **Invariant Guarantee**: Each state step preserves correctness across empty ($N=0$), unit ($N=1$), and boundary conditions.

### 3. 📝 Example
Consider breaking down a standard examination question on this topic:
1. **Clarify Constraints**: Check boundary cases (null input, negative bounds, maximum array size).
2. **Select Design Pattern**: Determine whether Two Pointers, Dynamic Programming, or Graph Traversal applies.
3. **Execute Transition**: Compute state change step-by-step and test with a 3-element dry run.

### 4. 📌 Short Takeaway
> **🎯 Exam Rule**: Don't memorize solutions line-by-line; focus on the state transition rule and edge-case invariants.`;
}

/**
 * Rebalances a study plan when a student falls behind, misses days, or changes pace
 */
export function rebalanceStudyPlan(currentPlan: StudyPlan, reason: string): StudyPlan {
  const r = reason.toLowerCase();
  const todayStr = new Date().toISOString().split('T')[0];

  let updatedPhases = currentPlan.phases.map(p => ({
    ...p,
    milestones: p.milestones.map(m => ({ ...m }))
  }));
  let updatedTasks = currentPlan.dailyTasks.map(t => ({ ...t }));
  let scoreDelta = 4;

  if (r.includes('missed') || r.includes('behind')) {
    // Compress low-priority items and refocus tasks
    updatedPhases = updatedPhases.map(phase => ({
      ...phase,
      milestones: phase.milestones.map(m => {
        if (m.priority === 'low' || m.priority === 'medium') {
          return { ...m, estimatedHours: Math.max(1, Math.round(m.estimatedHours * 0.8 * 10) / 10) };
        }
        return m;
      })
    }));

    updatedTasks = updatedTasks.map(t => {
      if (!t.completed) {
        return {
          ...t,
          dueDate: todayStr,
          notes: `[AI Rebalanced: Catch-up Sprint] Priority re-aligned to preserve deadline (${reason}).`
        };
      }
      return t;
    });
    scoreDelta = 5;
  } else if (r.includes('struggle') || r.includes('weak')) {
    // Allocate extra diagnostic review and elevate weak areas
    const topWeak = currentPlan.weakAreas[0]?.topic || currentPlan.topics[0] || 'Core Concepts';
    const recoveryTask: DailyTask = {
      id: `task-rebalance-${Date.now()}`,
      title: `⚡ AI Targeted Weak-Area Recovery Drill: ${topWeak}`,
      topic: topWeak,
      phaseId: 'phase-1',
      durationMinutes: 30,
      priority: 'high',
      type: 'practice',
      completed: false,
      dueDate: todayStr,
      dayNumber: currentPlan.currentDay,
      notes: `[AI Rebalanced] Specially allocated active retrieval session to eliminate mistake patterns.`
    };
    updatedTasks = [recoveryTask, ...updatedTasks];
    scoreDelta = 6;
  } else if (r.includes('accelerate') || r.includes('faster') || r.includes('velocity')) {
    // Unlock next milestone and accelerate pacing
    let unlockedOne = false;
    updatedPhases = updatedPhases.map(phase => ({
      ...phase,
      milestones: phase.milestones.map(m => {
        if (!unlockedOne && (m.status === 'locked' || m.status === 'pending')) {
          unlockedOne = true;
          return { ...m, status: 'current' as MilestoneStatus, progressPercentage: 25 };
        }
        return m;
      })
    }));
    scoreDelta = 8;
  } else {
    // General schedule optimization
    updatedTasks = updatedTasks.map(t => {
      if (!t.completed && t.priority === 'high') {
        return {
          ...t,
          dueDate: todayStr,
          notes: `[AI Rebalanced] Schedule optimized (${reason}).`
        };
      }
      return t;
    });
    scoreDelta = 4;
  }

  return {
    ...currentPlan,
    phases: updatedPhases,
    dailyTasks: updatedTasks,
    readinessScore: Math.min(100, Math.max(20, currentPlan.readinessScore + scoreDelta))
  };
}

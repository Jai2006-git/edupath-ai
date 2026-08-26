import { StudyPlan } from '../types';

export const PRESET_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'preset-dsa',
    subject: 'Data Structures & Algorithms',
    goal: 'Ace FAANG Coding & Technical Interviews',
    examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 3.5,
    knowledgeLevel: 'intermediate',
    learningStyle: 'practice',
    topics: [
      'Arrays & Two Pointers',
      'Sliding Window & Hash Maps',
      'Binary Search & Sorting',
      'Linked Lists & Fast/Slow Pointers',
      'Trees & Binary Search Trees (BST)',
      'Depth First Search & Breadth First Search',
      'Dynamic Programming (1D & 2D)',
      'Heaps & Priority Queues',
      'Graph Algorithms (Dijkstra, Topological Sort)'
    ],
    createdAt: new Date().toISOString(),
    readinessScore: 68,
    streakDays: 4,
    totalStudyHours: 49,
    completedStudyHours: 21,
    currentDay: 5,
    totalDays: 14,
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Foundation & Core Patterns',
        description: 'Master essential linear data structures and time complexity analysis.',
        estimatedDays: 3,
        milestones: [
          {
            id: 'm-1',
            phaseId: 'phase-1',
            title: 'Arrays, Two Pointers & In-Place Manipulations',
            priority: 'high',
            estimatedHours: 4,
            status: 'completed',
            topics: ['Two Pointers', 'Sliding Window', 'Prefix Sums'],
            tips: ['Focus on edge cases: empty arrays and boundary indices.', 'Practice Dutch National Flag algorithm.'],
            dayOffset: 1
          },
          {
            id: 'm-2',
            phaseId: 'phase-1',
            title: 'Hash Maps & Substring Sliding Window',
            priority: 'high',
            estimatedHours: 4.5,
            status: 'completed',
            topics: ['Longest Substring Without Repeating Characters', 'Group Anagrams'],
            tips: ['Understand amortized O(1) lookups vs worst-case hash collisions.'],
            dayOffset: 2
          },
          {
            id: 'm-3',
            phaseId: 'phase-1',
            title: 'Binary Search Mastery on Rotated & Infinite Spaces',
            priority: 'high',
            estimatedHours: 4,
            status: 'completed',
            topics: ['Search in Rotated Sorted Array', 'Binary Search on Answer Space'],
            tips: ['Always write low + (high - low) / 2 to prevent integer overflow.'],
            dayOffset: 3
          }
        ]
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Hierarchical & Graph Structures',
        description: 'Tree traversals, recursion trees, and breadth/depth explorations.',
        estimatedDays: 4,
        milestones: [
          {
            id: 'm-4',
            phaseId: 'phase-2',
            title: 'Binary Trees, BST & Lowest Common Ancestor',
            priority: 'high',
            estimatedHours: 5,
            status: 'in-progress',
            topics: ['Inorder/Preorder/Postorder', 'LCA in BST and Binary Tree', 'Validate BST'],
            tips: ['Think recursively: what does the current node need from left and right children?'],
            dayOffset: 4
          },
          {
            id: 'm-5',
            phaseId: 'phase-2',
            title: 'Graph BFS & DFS (Cycle Detection, Island Problems)',
            priority: 'high',
            estimatedHours: 5.5,
            status: 'pending',
            topics: ['Number of Islands', 'Course Schedule (Topological Sort)', 'Word Ladder'],
            tips: ['Distinguish between directed cycle detection (3-color/recursion stack) and undirected (visited set).'],
            dayOffset: 6
          }
        ]
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Advanced Dynamic Programming & Heaps',
        description: 'Subproblem overlapping, memoization, tabulation and state reduction.',
        estimatedDays: 4,
        milestones: [
          {
            id: 'm-6',
            phaseId: 'phase-3',
            title: '1D & 2D Dynamic Programming (Knapsack & Subsequences)',
            priority: 'high',
            estimatedHours: 7,
            status: 'pending',
            topics: ['0/1 Knapsack', 'Longest Common Subsequence', 'Coin Change', 'Edit Distance'],
            tips: ['Always define dp[i] in words before writing the recurrence relation.'],
            dayOffset: 8
          },
          {
            id: 'm-7',
            phaseId: 'phase-3',
            title: 'Heaps, Priority Queues & Top K Problems',
            priority: 'medium',
            estimatedHours: 4,
            status: 'pending',
            topics: ['Top K Frequent Elements', 'Merge K Sorted Lists', 'Median from Data Stream'],
            tips: ['Min-Heap of size K retains the K largest elements in O(N log K).'],
            dayOffset: 10
          }
        ]
      },
      {
        id: 'phase-4',
        phaseNumber: 4,
        title: 'High-Yield Mock Exams & Spaced Repetition',
        description: 'Timed full-length mock coding tests and weak area reinforcement.',
        estimatedDays: 3,
        milestones: [
          {
            id: 'm-8',
            phaseId: 'phase-4',
            title: 'Speed Coding & System Edge Cases',
            priority: 'high',
            estimatedHours: 5,
            status: 'pending',
            topics: ['Hard LeetCode Patterns', 'Time Constrained Mock Tests'],
            tips: ['Explain thought process out loud before typing code.'],
            dayOffset: 12
          },
          {
            id: 'm-9',
            phaseId: 'phase-4',
            title: 'Final Spaced Recall & Cheat Sheet Review',
            priority: 'medium',
            estimatedHours: 3.5,
            status: 'pending',
            topics: ['Time/Space Complexity Cheat Sheet', 'All DP Recurrences Review'],
            tips: ['Sleep well and review key templates the night before.'],
            dayOffset: 14
          }
        ]
      }
    ],
    dailyTasks: [
      {
        id: 'task-1',
        title: 'Solve "Longest Common Subsequence" with Memoization & Tabulation',
        topic: 'Dynamic Programming',
        phaseId: 'phase-3',
        durationMinutes: 45,
        priority: 'high',
        type: 'practice',
        completed: true,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 5,
        notes: 'Review space optimization from O(M*N) down to O(N).'
      },
      {
        id: 'task-2',
        title: 'Active Recall Quiz: Tree Traversals & BST Invariants',
        topic: 'Trees & BST',
        phaseId: 'phase-2',
        durationMinutes: 20,
        priority: 'high',
        type: 'quiz',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 5,
        notes: 'Targeting identified weak spot from yesterday.'
      },
      {
        id: 'task-3',
        title: 'Deep Dive: Cycle Detection in Directed vs Undirected Graphs',
        topic: 'Graph Algorithms',
        phaseId: 'phase-2',
        durationMinutes: 50,
        priority: 'medium',
        type: 'concept',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 5,
        notes: 'Practice Kahn\'s Algorithm (indegree array).'
      },
      {
        id: 'task-4',
        title: 'Spaced Repetition Review: Sliding Window & Two Pointers (Day 5 Interval)',
        topic: 'Arrays & Two Pointers',
        phaseId: 'phase-1',
        durationMinutes: 30,
        priority: 'high',
        type: 'revision',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 5,
        notes: 'Re-solve Minimum Window Substring in under 15 mins.'
      }
    ],
    weakAreas: [
      {
        id: 'weak-1',
        topic: 'Dynamic Programming State Transitions',
        subject: 'Data Structures & Algorithms',
        accuracyScore: 42,
        frequencyMissed: 5,
        status: 'critical',
        lastPracticed: 'Yesterday',
        recommendedAction: 'Solve 3 grid DP problems without looking at solutions.',
        keyConcepts: ['Memoization table initialization', 'Subproblem overlap', 'Base cases'],
        revisionDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: 'weak-2',
        topic: 'Graph Cycle Detection in Directed Graphs',
        subject: 'Data Structures & Algorithms',
        accuracyScore: 58,
        frequencyMissed: 3,
        status: 'improving',
        lastPracticed: '2 days ago',
        recommendedAction: 'Implement topological sort with Kahn\'s BFS algorithm.',
        keyConcepts: ['In-degree array', 'Visited vs Recursion stack set'],
        revisionDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: 'weak-3',
        topic: 'Binary Search on Answer Range',
        subject: 'Data Structures & Algorithms',
        accuracyScore: 75,
        frequencyMissed: 2,
        status: 'mastered',
        lastPracticed: '3 days ago',
        recommendedAction: 'Practice "Koko Eating Bananas" and "Split Array Largest Sum".',
        keyConcepts: ['Monotonic condition check', 'Feasibility function boolean returns'],
        revisionDueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    quizHistory: [
      {
        id: 'quiz-res-1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        topic: 'Arrays & Two Pointers',
        score: 5,
        totalQuestions: 5,
        percentage: 100,
        durationSeconds: 140,
        answers: []
      },
      {
        id: 'quiz-res-2',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        topic: 'Dynamic Programming Fundamentals',
        score: 2,
        totalQuestions: 5,
        percentage: 40,
        durationSeconds: 210,
        answers: []
      }
    ]
  },
  {
    id: 'preset-medical',
    subject: 'USMLE Medical Biochemistry & Genetics',
    goal: 'Score in Top 5th Percentile on Board Exam',
    examDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 4.0,
    knowledgeLevel: 'intermediate',
    learningStyle: 'conceptual',
    topics: [
      'Enzyme Kinetics & Michaelis-Menten',
      'Glycolysis, Gluconeogenesis & Glycogen Storage Diseases',
      'Citric Acid Cycle & Oxidative Phosphorylation',
      'Lipid Metabolism & Hyperlipidemias',
      'Amino Acid Catabolism & Inborn Errors of Metabolism',
      'DNA Replication, Repair & Chromosomal Aberrations',
      'Vitamin Deficiencies & Clinical Correlates'
    ],
    createdAt: new Date().toISOString(),
    readinessScore: 74,
    streakDays: 6,
    totalStudyHours: 84,
    completedStudyHours: 32,
    currentDay: 8,
    totalDays: 21,
    phases: [
      {
        id: 'p-med-1',
        phaseNumber: 1,
        title: 'Cellular Energetics & Carbohydrate Metabolism',
        description: 'Master rate-limiting enzymes and glycogen storage pathology.',
        estimatedDays: 5,
        milestones: [
          {
            id: 'm-med-1',
            phaseId: 'p-med-1',
            title: 'Enzyme Kinetics, Lineweaver-Burk & Inhibitors',
            priority: 'high',
            estimatedHours: 6,
            status: 'completed',
            topics: ['Km vs Vmax changes', 'Competitive vs Non-competitive inhibition'],
            tips: ['Competitive inhibitors increase Km without changing Vmax.'],
            dayOffset: 2
          },
          {
            id: 'm-med-2',
            phaseId: 'p-med-1',
            title: 'Glycogen Storage Diseases (Von Gierke, Pompe, McArdle)',
            priority: 'high',
            estimatedHours: 7,
            status: 'completed',
            topics: ['Glucose-6-phosphatase deficiency', 'Lysosomal alpha-glucosidase'],
            tips: ['Use mnemonic: Very Poor Carbohydrate Metabolism (Von Gierke, Pompe, Cori, McArdle).'],
            dayOffset: 5
          }
        ]
      },
      {
        id: 'p-med-2',
        phaseNumber: 2,
        title: 'Lipid & Amino Acid Metabolism Pathology',
        description: 'Apolipoproteins, Urea cycle disorders, and PKU / Maple syrup urine disease.',
        estimatedDays: 7,
        milestones: [
          {
            id: 'm-med-3',
            phaseId: 'p-med-2',
            title: 'Familial Dyslipidemias & Apolipoprotein Deficiencies',
            priority: 'high',
            estimatedHours: 8,
            status: 'in-progress',
            topics: ['Type I (Chylomicrons / LPL)', 'Type IIa (LDL Receptor)', 'Xanthomas'],
            tips: ['Memorize associated physical findings: Achilles tendon xanthomas = Type IIa.'],
            dayOffset: 9
          }
        ]
      }
    ],
    dailyTasks: [
      {
        id: 'task-med-1',
        title: 'Review Lineweaver-Burk Plots for Uncompetitive vs Non-competitive Inhibition',
        topic: 'Enzyme Kinetics',
        phaseId: 'p-med-1',
        durationMinutes: 45,
        priority: 'high',
        type: 'concept',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 8
      },
      {
        id: 'task-med-2',
        title: 'Active Recall Quiz: Inborn Errors of Amino Acid Metabolism',
        topic: 'Amino Acid Catabolism',
        phaseId: 'p-med-2',
        durationMinutes: 25,
        priority: 'high',
        type: 'quiz',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 8
      }
    ],
    weakAreas: [
      {
        id: 'weak-med-1',
        topic: 'Glycogen Storage Diseases Differential Diagnoses',
        subject: 'USMLE Medical Biochemistry',
        accuracyScore: 38,
        frequencyMissed: 4,
        status: 'critical',
        lastPracticed: 'Yesterday',
        recommendedAction: 'Construct a side-by-side comparison table of enzyme defects and organomegaly.',
        keyConcepts: ['Cardiomegaly in Pompe', 'Severe fasting hypoglycemia in Von Gierke', 'Muscle cramps in McArdle'],
        revisionDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    quizHistory: []
  },
  {
    id: 'preset-ml',
    subject: 'Machine Learning & Generative AI Systems',
    goal: 'Master Production AI Engineering & LLM Architectures',
    examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 2.5,
    knowledgeLevel: 'intermediate',
    learningStyle: 'practice',
    topics: [
      'Linear Algebra & Gradient Descent Optimization',
      'Neural Networks & Backpropagation from Scratch',
      'CNNs & Vision Transformers (ViT)',
      'Transformer Architecture (Self-Attention & Multi-Head Attention)',
      'RLHF, DPO & Fine-Tuning LLMs (LoRA, QLoRA)',
      'Retrieval-Augmented Generation (RAG) & Vector Databases',
      'LLM Evaluation, Latency Optimization & Quantization (GGML/AWQ)'
    ],
    createdAt: new Date().toISOString(),
    readinessScore: 82,
    streakDays: 9,
    totalStudyHours: 75,
    completedStudyHours: 42,
    currentDay: 12,
    totalDays: 30,
    phases: [
      {
        id: 'p-ml-1',
        phaseNumber: 1,
        title: 'Deep Learning Foundations & Attention Mechanics',
        description: 'Vector calculus, backpropagation, and transformer math.',
        estimatedDays: 10,
        milestones: [
          {
            id: 'm-ml-1',
            phaseId: 'p-ml-1',
            title: 'Scaled Dot-Product Attention & Positional Encodings',
            priority: 'high',
            estimatedHours: 6,
            status: 'completed',
            topics: ['Query/Key/Value Matrix Multiplication', 'RoPE & Sinusoidal Encodings'],
            tips: ['Why scale by sqrt(d_k)? To avoid softmax vanishing gradients in large dimensions.'],
            dayOffset: 5
          }
        ]
      }
    ],
    dailyTasks: [
      {
        id: 'task-ml-1',
        title: 'Implement Multi-Head Attention in PyTorch from Scratch',
        topic: 'Transformer Architecture',
        phaseId: 'p-ml-1',
        durationMinutes: 60,
        priority: 'high',
        type: 'practice',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dayNumber: 12
      }
    ],
    weakAreas: [
      {
        id: 'weak-ml-1',
        topic: 'Low-Rank Adaptation (LoRA) Weight Decomposition Math',
        subject: 'Machine Learning',
        accuracyScore: 50,
        frequencyMissed: 3,
        status: 'improving',
        lastPracticed: '3 days ago',
        recommendedAction: 'Derive delta W = B * A where B is (d x r) and A is (r x k).',
        keyConcepts: ['Intrinsic rank hypothesis', 'Scaling factor alpha / r'],
        revisionDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    quizHistory: []
  }
];

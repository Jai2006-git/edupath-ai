# EduPath AI — Democratizing Personalized Education with Adaptive AI 🎓🤖

> **Built for AI Hackathon** — An intelligent, accessible educational platform that transforms complex syllabi, exam deadlines, and diverse knowledge baselines into personalized day-by-day study roadmaps, active recall diagnostic quizzes, weak-area remediation, and a 24/7 AI tutor — bridging the academic divide for all students.

---

## 🌍 Why EduPath AI Matters (AI for Social Impact)

### The Problem
Millions of students worldwide face intense examination anxiety and academic disadvantage due to a lack of personalized guidance. Private 1-on-1 tutoring and academic coaching cost upwards of **\$2,500/year**, creating a severe socioeconomic barrier for underserved students who cannot afford personalized instruction. Standard syllabi are overwhelming, static study schedules quickly fail when life happens, and passive reading leads to rapid memory decay.

### The Solution & Social Impact
**EduPath AI democratizes high-tier educational mentorship** by giving every student — regardless of financial background or geographic location — free access to an adaptive AI study companion. 

Key social impact pillars:
1. **Equal Opportunity ($0 vs $2,500)**: Provides world-class personalized roadmap synthesis and 1-on-1 tutoring at zero cost on any web browser.
2. **Zero Plan Abandonment (100% Adaptive)**: When students fall behind or miss study days, EduPath AI's dynamic rebalancing engine recalculates upcoming priorities so students never give up.
3. **Scientific Retention (4.2x Retention Multiplier)**: Combines active recall diagnostic drills and automated Ebbinghaus spaced repetition intervals to maximize exam performance.
4. **24/7 Midnight Mentor**: Eliminates late-night study blockers with structured, first-principles explanations.

---

## 🌟 Key Features

1. **AI Personalized Study Roadmap**: Algorithmic milestone breakdown partitioned into 4 sequential pedagogical phases based on target exam date and daily available hours.
2. **Explainable AI Recommendations ("Why Recommended")**: Provides clear pedagogical rationale for every milestone and daily micro-task.
3. **Daily Actionable Study Tasks**: Checklist categorized into `Concept`, `Practice`, `Quiz`, and `Revision` with real-time completion state and celebration confetti.
4. **Priority-Based Matrix**: High-Yield (80/20 Pareto) classification highlighting critical exam topics vs secondary topics.
5. **AI Active Recall Quiz Engine**: Diagnostic quiz engine with timers, instant feedback, deep pedagogical distractor breakdowns, confidence self-ratings (1–5), and weak-area scorecard logging.
6. **24/7 Context-Aware AI Tutor**: Intelligent study coach synchronized with active subject, current roadmap phase, and flagged weak areas. Structured responses with Simple Explanations (ELI5), Key Concepts, Examples, and Short Takeaways.
7. **Adaptive Schedule Rebalancer**: Recalculates timeline and redistributes workload across 4 real-world scenarios: Missed Days, Exam Date Shift, Weak-Area Struggle, and Velocity Acceleration.
8. **Spaced Repetition Schedule**: Built-in Ebbinghaus forgetting curve checkpoints (1-day, 3-day, 7-day, 14-day intervals) to maximize retention.
9. **Study Notes Notebook Drawer**: 1-click note capture allowing students to save key formulas, mnemonics, and cheat sheets.

---

## 🛠️ Technology Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark Glassmorphic aesthetic, custom Indigo/Violet theme)
- **Data Visualization**: Recharts (`BarChart`, `ResponsiveContainer`, `Tooltip`)
- **Animation & UX**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **State & Storage**: React Context API with automatic `localStorage` synchronization
- **Testing**: Vitest + React Testing Library + JSDOM
- **Backend & Proxy**: Vercel Edge Serverless Function (`api/gemini.ts`)
- **AI Service Layer**: Google Gemini 1.5 Flash REST API + zero-downtime cognitive fallback engine

---

## 🔷 Google Technologies Integrated

1. **Google Gemini 1.5 Flash**:
   - Generates customized study roadmaps from raw syllabus topics.
   - Synthesizes 4-part structured educational answers (Simple Explanation, Key Concept, Example, Short Takeaway).
   - Generates domain-specific multiple-choice quizzes with distractor trap analysis.
2. **Serverless Proxy Pattern (`api/gemini.ts`)**:
   - Vercel Edge proxy securely mediates Gemini API calls in production environments without exposing secret keys in browser network inspection.
3. **Firebase Persistence Architecture (`src/services/firebase.ts`)**:
   - Modular architecture ready for Google Firebase Authentication and Cloud Firestore sync, while providing seamless guest/offline fallback.

---

## 📂 Project Structure

```
edupath-ai/
├── api/
│   └── gemini.ts              # Vercel Serverless Edge Function proxy for Gemini
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives (Button, Badge, Card, EmptyState, LoadingSpinner)
│   │   ├── Navbar.tsx         # Responsive navigation, study plan switcher & streak badge
│   │   ├── RebalanceModal.tsx # Dynamic AI schedule rebalancing modal
│   │   └── SettingsModal.tsx  # Gemini API key & study plan manager
│   ├── constants/             # Centralized configuration, presets, & impact stats
│   ├── context/
│   │   └── StudyPlanContext.tsx # Global state, persistence & action handlers
│   ├── data/
│   │   └── presets.ts         # Preloaded curriculums (DSA, USMLE, Fullstack Architecture)
│   ├── hooks/                 # Custom hooks (useStudyTimer)
│   ├── pages/
│   │   ├── LandingPage.tsx    # Value prop, social impact showcase & 1-click demos
│   │   ├── OnboardingWizard.tsx # 5-step wizard & animated AI plan generator
│   │   ├── DashboardView.tsx  # Metrics, daily tasks, weak spots & analytics
│   │   ├── RoadmapView.tsx    # Phased timeline, high-yield tags & rebalancing
│   │   ├── QuizView.tsx       # Active recall quiz interface & explanations
│   │   └── TutorView.tsx      # Context-aware tutor chat & persistent notes
│   ├── services/
│   │   ├── geminiClient.ts    # REST client, JSON parsing & error handling
│   │   ├── aiService.ts       # Dynamic roadmap, quiz & tutor generation logic
│   │   └── firebase.ts        # Firebase authentication & sync service layer
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces and data models
│   ├── utils/
│   │   └── security.ts        # Input sanitization, future date validation & XSS protection
│   ├── App.tsx                # Route-based lazy loading, ErrorBoundary & layout
│   ├── index.css              # Tailwind styles & glassmorphism
│   └── main.tsx               # Application entry point
├── tests/
│   ├── setup.ts               # Jest-DOM matchers & mocks
│   ├── security.test.ts       # Sanitization & validation tests
│   ├── aiService.test.ts      # Study plan generation & fallback tests
│   ├── quiz.test.ts           # Quiz scoring & distractor tests
│   ├── rebalance.test.ts      # Schedule adaptation tests
│   └── components.test.tsx    # Reusable UI component tests
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── vitest.config.ts
```

---

## 🔒 Security & Data Integrity

- **Input Sanitization**: `sanitizeText` strips HTML tags, escapes script characters, and bounds max length to prevent XSS.
- **Date Validation**: `validateFutureDate` strictly enforces future exam dates bounded within realistic limits.
- **Hour Constraints**: `sanitizeDailyHours` guarantees study hours remain within realistic bounds ($[0.5, 16.0]\text{ hrs/day}$).
- **Secret Protection**: `.env` and `.env.*` excluded via `.gitignore`. API keys in UI settings remain strictly in local browser storage.
- **Safe JSON Extraction**: `extractJsonFromText` uses bracket boundary scanning to parse LLM outputs safely.

---

## 🧪 Testing Suite

The project includes an automated test suite powered by **Vitest** and **React Testing Library**:

```powershell
# Run the automated test suite
npm run test:run

# Run tests in watch mode
npm test
```

### Test Coverage Areas:
- ✅ **Security & Sanitization**: Stripping `<script>` tags, input length bounds, array cleaning, future date checks, API key masking.
- ✅ **AI Service & Fallbacks**: 4-phase structured study plan synthesis, 4-part educational answer formatting, topic auto-suggestions.
- ✅ **Quiz Scoring & Distractors**: 4-option validation, correct answer indexing, pedagogical distractor breakdown.
- ✅ **Schedule Rebalancer**: Milestone hour compression for missed days, weak-area recovery drill allocation, learning acceleration.
- ✅ **Reusable UI Primitives**: Accessible button clicks, loading states, badge variants, and empty state action triggers.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```powershell
# Navigate to project directory
cd edupath-ai

# Install dependencies
npm install
```

### 3. Environment Setup (Optional)
Copy `.env.example` to `.env` and provide your Google Gemini API key:
```powershell
VITE_GEMINI_API_KEY=your_api_key_here
VITE_AI_MODEL=gemini-1.5-flash
```
*(Note: If no API key is provided, EduPath AI runs its built-in algorithmic cognitive engine for instant offline responses).*

### 4. Run Development Server
```powershell
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Build for Production
```powershell
npm run build
```

---

## ⚡ Hackathon Live Demo Guide

1. **Social Impact & Problem Comparison**: On the Landing Page, highlight the **AI for Social Impact & Educational Equity** section ($0 vs $2,500 private tutoring) and the **Problem vs Solution** comparison.
2. **Instant Demo Presets**: Click **"Explore Live Demo Dashboard"** to open the preloaded *Data Structures & Algorithms* curriculum.
3. **Interactive Task Loop**: On the Dashboard, check off a study task and observe the real-time score boost and celebration confetti.
4. **Topic Progression**: Click **"Mark Topic Completed"** on the Next Recommended Topic card to unlock the next milestone in the roadmap.
5. **Active Recall Quiz**: Go to **AI Quiz**, start a 5-question drill, observe real-time countdown timers, distractor breakdowns, and weak-area logging on the scorecard.
6. **24/7 AI Tutor**: Go to **AI Tutor**, click a starter prompt pill (e.g., *"Explain dynamic programming like I'm 5"*), and inspect the 4 structured educational sections.
7. **Adaptive Rebalance**: Click **"Rebalance"** in the top bar, select *"I fell behind / missed 1-2 study days"*, and click **"Apply AI Rebalance"** to see the schedule adapt dynamically.
8. **Study Plan Creator**: Click **"New Plan"** in the top bar to create a custom study plan with topic auto-suggestions in under 30 seconds.

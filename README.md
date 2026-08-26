# EduPath AI — Your Personal AI Learning & Study Companion 🎓🤖

> **Built for 7-Hour AI Hackathon** — An adaptive, intelligent exam preparation web application that transforms complex syllabi, varying deadlines, and individual knowledge baselines into personalized day-by-day study roadmaps, active recall quizzes, weak-area remediation, and a 24/7 AI tutor.

---

## 🌟 Key Features

1. **AI Personalized Study Roadmap**: Algorithmic milestone breakdown partitioned into 4 sequential pedagogical phases based on target exam date and daily available hours.
2. **Daily Actionable Study Tasks**: Micro-task checklists categorized into `Concept`, `Practice`, `Quiz`, and `Revision` with real-time completion state and celebration confetti.
3. **Priority-Based Recommendations**: High-Yield (80/20 Pareto) classification highlighting critical exam topics vs secondary topics.
4. **AI Quiz Generator**: Active recall diagnostic quiz engine with timers, instant option feedback, deep pedagogical distractor breakdowns, confidence self-ratings (1–5), and weak-area logging.
5. **24/7 Context-Aware AI Tutor**: Intelligent study coach synchronized with active subject, current roadmap phase, and flagged weak areas. Structured responses with Simple Explanations (ELI5), Key Concepts, Examples, and Short Takeaways.
6. **Progress Dashboard**: Live Exam Readiness Score (%), study streak tracking (🔥), countdown timer, next recommended topic hero card, and interactive daily study hours analytics charts (Recharts).
7. **Weak-Area Identification**: Automatically tracks low-accuracy concepts from quizzes and creates prioritized remediation drills.
8. **Spaced Repetition Schedule**: Built-in Ebbinghaus forgetting curve checkpoints (1-day, 3-day, 7-day, 14-day intervals) to maximize retention.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark Glassmorphic aesthetic, custom gradients)
- **Data Visualization**: Recharts (`BarChart`, `ResponsiveContainer`, `Tooltip`)
- **Animation & UX**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **State & Storage**: React Context API with automatic `localStorage` synchronization
- **AI Service Layer**: Google Gemini 1.5 Flash API client + zero-downtime cognitive fallback engine

---

## 📂 Project Structure

```
edupath-ai/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive navigation, study plan switcher & streak badge
│   │   ├── RebalanceModal.tsx     # Dynamic AI schedule rebalancing modal
│   │   └── SettingsModal.tsx      # Gemini API key & study plan manager
│   ├── context/
│   │   └── StudyPlanContext.tsx   # Global state, persistence & action handlers
│   ├── data/
│   │   └── presets.ts             # Preloaded hackathon demo curriculums (DSA, USMLE, ML)
│   ├── pages/
│   │   ├── LandingPage.tsx        # Value prop, interactive tour & 1-click demos
│   │   ├── OnboardingWizard.tsx   # 5-step wizard & animated AI plan generator
│   │   ├── DashboardView.tsx      # Metrics, daily tasks, weak spots & analytics
│   │   ├── RoadmapView.tsx        # Phased timeline, high-yield tags & rebalancing
│   │   ├── QuizView.tsx           # Active recall quiz interface & explanations
│   │   └── TutorView.tsx          # Context-aware tutor chat & persistent notes
│   ├── services/
│   │   ├── geminiClient.ts        # REST client, JSON parsing & error handling
│   │   └── aiService.ts           # Dynamic roadmap, quiz & tutor generation logic
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces and data models
│   ├── App.tsx                    # Root routing, ErrorBoundary & layout
│   ├── index.css                  # Tailwind styles & glassmorphism
│   └── main.tsx                   # Application entry point
├── .env.example
├── .env
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Getting Started

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
*(Note: If no API key is provided, EduPath AI runs a built-in cognitive simulation engine for instant zero-downtime offline responses).*

### 4. Run Development Server
```powershell
npm run dev
```
The app will be available at `http://localhost:5173/`.

### 5. Build for Production
```powershell
npm run build
```

---

## ⚡ Hackathon Live Demo Guide

1. **Instant Presets**: On the Landing Page, click **"Explore Live Demo Dashboard"** or pick a preset (e.g. *Data Structures & Algorithms*).
2. **Interactive Tasks**: On the Dashboard, check off a study task and observe the real-time score boost and celebration confetti.
3. **Topic Progression**: Click **"Mark Topic Completed"** on the Next Recommended Topic card to unlock the next milestone in the roadmap.
4. **Active Recall Quiz**: Go to **AI Quiz**, start a 5-question drill, observe real-time timers, distractor breakdowns, and weak-area logging on the scorecard.
5. **24/7 AI Tutor**: Go to **AI Tutor**, click a starter prompt pill (e.g., *"Explain dynamic programming like I'm 5"*), and inspect the 4 structured educational sections.
6. **Study Plan Creator**: Click **"New Plan"** in the top bar to create a custom study plan with topic auto-suggestions in under 30 seconds.

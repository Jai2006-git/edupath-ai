import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { StudyPlanProvider, useStudyPlan } from './context/StudyPlanContext';
import { Navbar } from './components/Navbar';
import { SettingsModal } from './components/SettingsModal';
import { RebalanceModal } from './components/RebalanceModal';
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardView } from './pages/DashboardView';
import { RoadmapView } from './pages/RoadmapView';
import { QuizView } from './pages/QuizView';
import { TutorView } from './pages/TutorView';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EduPath AI Runtime boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-rose-400">Something went wrong</h2>
            <p className="text-xs text-slate-400">An unexpected error occurred. Click below to reload the app safely.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const { activeView } = useStudyPlan();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white font-sans">
      {/* Top Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Routed Page */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'onboarding' && <OnboardingWizard />}
        {activeView === 'dashboard' && (
          <DashboardView onOpenRebalance={() => setIsRebalanceOpen(true)} />
        )}
        {activeView === 'roadmap' && (
          <RoadmapView onOpenRebalance={() => setIsRebalanceOpen(true)} />
        )}
        {activeView === 'quiz' && <QuizView />}
        {activeView === 'tutor' && <TutorView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} EduPath AI — Your Personal AI Learning & Study Companion.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Adaptive AI Roadmaps</span>
            <span>•</span>
            <span>Spaced Repetition</span>
            <span>•</span>
            <span>Active Recall Quizzes</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <RebalanceModal
        isOpen={isRebalanceOpen}
        onClose={() => setIsRebalanceOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <StudyPlanProvider>
        <MainContent />
      </StudyPlanProvider>
    </ErrorBoundary>
  );
}

export default App;

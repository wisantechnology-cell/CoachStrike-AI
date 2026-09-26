import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, HeaderTab } from './components/Header';
import { Hero } from './components/Hero';
import { Questionnaire } from './components/Questionnaire';
import { EvaluationResult } from './components/EvaluationResult';
import { DrillsLibrary } from './components/DrillsLibrary';
import { TacticalBoard } from './components/TacticalBoard';
import { AICoachChat } from './components/AICoachChat';
import { SavedProfiles } from './components/SavedProfiles';
import { AcademyDashboard } from './components/AcademyDashboard';
import { PricingCheckoutModal } from './components/PricingCheckoutModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AssessmentResult, PlanType, AcademyStudent } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveEvaluationToCloud, deleteEvaluationFromCloud, subscribeToUserEvaluations } from './lib/firebase';

function AppContent() {
  const { user, plan, isAcademy } = useAuth();
  const [activeTab, setActiveTab] = useState<HeaderTab | 'result'>('hero');
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<AssessmentResult[]>([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [pricingInitialPlan, setPricingInitialPlan] = useState<PlanType>('pro');
  const [evaluatingStudent, setEvaluatingStudent] = useState<AcademyStudent | null>(null);

  const handleOpenPricing = (preferredPlan?: PlanType) => {
    if (preferredPlan) {
      setPricingInitialPlan(preferredPlan);
    } else if (plan === 'pro') {
      // If user already has Pro, prioritize showing Academy plan!
      setPricingInitialPlan('academy');
    } else {
      setPricingInitialPlan('pro');
    }
    setIsPricingModalOpen(true);
  };

  // Load saved profiles from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('coachstrike_profiles');
      if (stored) {
        setSavedProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading saved profiles from localStorage:', e);
    }
  }, []);

  // Sync with Firestore real-time when a user is signed in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserEvaluations(user.uid, (cloudProfiles) => {
      if (cloudProfiles && cloudProfiles.length > 0) {
        // Merge cloud with local, avoiding duplicates
        setSavedProfiles((prev) => {
          const combined = [...cloudProfiles];
          prev.forEach((localItem) => {
            if (!combined.some((c) => c.id === localItem.id)) {
              combined.push(localItem);
            }
          });
          try {
            localStorage.setItem('coachstrike_profiles', JSON.stringify(combined));
          } catch (e) {
            console.error(e);
          }
          return combined;
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Save profile to both Firestore (if logged in) and LocalStorage
  const handleSaveProfile = async (result: AssessmentResult) => {
    const exists = savedProfiles.some((p) => p.id === result.id);
    if (!exists) {
      const updated = [result, ...savedProfiles];
      setSavedProfiles(updated);
      try {
        localStorage.setItem('coachstrike_profiles', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving profile to localStorage:', e);
      }
    }

    if (user) {
      try {
        await saveEvaluationToCloud(user.uid, result);
      } catch (e) {
        console.error('Error syncing profile to Firestore:', e);
      }
    }
  };

  const handleDeleteProfile = async (id: string) => {
    const updated = savedProfiles.filter((p) => p.id !== id);
    setSavedProfiles(updated);
    try {
      localStorage.setItem('coachstrike_profiles', JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting profile from localStorage:', e);
    }

    if (user) {
      try {
        await deleteEvaluationFromCloud(user.uid, id);
      } catch (e) {
        console.error('Error deleting profile from Firestore:', e);
      }
    }
  };

  const handleCompleteTest = (result: AssessmentResult) => {
    setCurrentResult(result);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentSaved = Boolean(
    currentResult && savedProfiles.some((p) => p.id === currentResult.id)
  );

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-volt selection:text-black">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab === 'result' ? 'test' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedProfiles.length}
        savedProfiles={savedProfiles}
        onStartTest={() => {
          setEvaluatingStudent(null);
          setActiveTab('test');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPricing={() => handleOpenPricing()}
      />

      {/* Main Content View with Motion Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'hero' && (
            <motion.div
              key="hero-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero
                onStartTest={() => {
                  setActiveTab('test');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreDrills={() => {
                  setActiveTab('drills');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeTab === 'test' && (
            <motion.div
              key="test-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Questionnaire
                studentContext={evaluatingStudent}
                onComplete={handleCompleteTest}
                onCancel={() => {
                  if (evaluatingStudent) {
                    setActiveTab('academy');
                  } else {
                    setActiveTab('hero');
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'result' && currentResult && (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <EvaluationResult
                result={currentResult}
                onRepeatTest={() => setActiveTab('test')}
                onSaveProfile={handleSaveProfile}
                isSaved={isCurrentSaved}
                onOpenPricing={() => handleOpenPricing(plan === 'pro' ? 'academy' : 'pro')}
              />
            </motion.div>
          )}

          {activeTab === 'academy' && (
            <motion.div
              key="academy-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AcademyDashboard
                onStartStudentExam={(student) => {
                  setEvaluatingStudent(student);
                  setActiveTab('test');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenPricing={(preferred) => handleOpenPricing(preferred || 'academy_basic')}
              />
            </motion.div>
          )}

          {activeTab === 'drills' && (
            <motion.div
              key="drills-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <DrillsLibrary />
            </motion.div>
          )}

          {activeTab === 'tactics' && (
            <motion.div
              key="tactics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TacticalBoard />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AICoachChat playerProfile={currentResult} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <SavedProfiles
                savedProfiles={savedProfiles}
                onSelectProfile={(prof) => {
                  setCurrentResult(prof);
                  setActiveTab('result');
                }}
                onDeleteProfile={handleDeleteProfile}
                onNewTest={() => setActiveTab('test')}
                onAskCoach={(prompt) => {
                  setActiveTab('chat');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white font-['Barlow_Semi_Condensed'] tracking-wider text-sm">
              COACHSTRIKE AI
            </span>
            <span>— Evaluador de ADN Futbolístico & Inteligencia Táctica</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-slate-400 hover:text-volt transition-colors font-mono cursor-pointer underline underline-offset-4"
            >
              Política de Privacidad y Términos (Google Play / App Store)
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">
              Inspirado en metodologías de análisis táctico profesional de la UEFA.
            </span>
          </div>
        </div>
      </footer>

      {/* Pricing & Subscription Modal (Stripe & PayPal) */}
      <PricingCheckoutModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        initialPlan={pricingInitialPlan}
        onPlanActivated={(newPlan) => {
          if (newPlan === 'academy') {
            setActiveTab('academy');
          }
        }}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

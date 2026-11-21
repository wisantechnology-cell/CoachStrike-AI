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
import { AcademyDashboard, INITIAL_STUDENTS } from './components/AcademyDashboard';
import { PlayerPortal } from './components/PlayerPortal';
import { PricingCheckoutModal } from './components/PricingCheckoutModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AssessmentResult, PlanType, AcademyStudent, ClubBrandConfig, AcademyTryoutMeta } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  saveEvaluationToCloud,
  deleteEvaluationFromCloud,
  subscribeToUserEvaluations,
  saveStudentToCloud,
  publishAcademyTryoutSubmission,
  inferCategoryFromInviteCode
} from './lib/firebase';
import { decodeReportFromUrl } from './utils/shareLink';

function AppContent() {
  const { lang, t } = useLanguage();
  const { user, plan, isAcademy } = useAuth();
  const [activeTab, setActiveTab] = useState<HeaderTab | 'result'>('hero');
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<AssessmentResult[]>([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [pricingInitialPlan, setPricingInitialPlan] = useState<PlanType>('pro');
  const [evaluatingStudent, setEvaluatingStudent] = useState<AcademyStudent | null>(null);
  const [initialInviteCode, setInitialInviteCode] = useState<string | null>(null);
  const [lastSyncedInviteCode, setLastSyncedInviteCode] = useState<string | null>(null);
  const [isSharedLinkView, setIsSharedLinkView] = useState<boolean>(false);
  const [portalStudentId, setPortalStudentId] = useState<string | null>(null);
  const [tacticalPromptForAI, setTacticalPromptForAI] = useState<string | null>(null);
  const [academySubTab, setAcademySubTab] = useState<'roster' | 'attendance' | 'classes' | 'lineup' | 'tasks' | 'tactics' | 'portal'>('roster');
  const [academyStudents, setAcademyStudents] = useState<AcademyStudent[]>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_academy_students');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_STUDENTS;
  });
  const [clubBrand, setClubBrand] = useState<ClubBrandConfig | null>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_club_brand');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

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

  // Check URL parameters for shared report or player portal on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const reportToken = params.get('report') || params.get('sharedReport') || params.get('reportData');
        if (reportToken) {
          const parsed = decodeReportFromUrl(reportToken);
          if (parsed) {
            setCurrentResult(parsed);
            setActiveTab('result');
            setIsSharedLinkView(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }

        const playerPortalParam = params.get('player') || params.get('student') || params.get('portal');
        if (playerPortalParam) {
          setPortalStudentId(playerPortalParam);
          setActiveTab('portal');
          setIsSharedLinkView(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const inviteParam = params.get('invite') || params.get('tryout') || params.get('classCode');
        if (inviteParam) {
          setInitialInviteCode(inviteParam.trim().toUpperCase());
          setEvaluatingStudent(null);
          setActiveTab('test');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      console.error('Error parsing URL parameters:', e);
    }
  }, []);

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

  const handleCompleteTest = (result: AssessmentResult, tryoutMeta?: AcademyTryoutMeta) => {
    setCurrentResult(result);
    setIsSharedLinkView(false);
    setLastSyncedInviteCode(null);

    const todayIso = new Date().toISOString().split('T')[0];

    if (evaluatingStudent) {
      const existingHistory = evaluatingStudent.skillHistory && evaluatingStudent.skillHistory.length > 0
        ? evaluatingStudent.skillHistory
        : [
            {
              id: `snap-base-${evaluatingStudent.id}`,
              date: evaluatingStudent.createdAt?.slice(0, 10) || '2026-09-01',
              label: 'Initial',
              skills: evaluatingStudent.skills,
              matchPercentage: evaluatingStudent.matchPercentage,
              primaryPosition: evaluatingStudent.primaryPosition
            }
          ];

      const newSnapshot = {
        id: `snap-${Date.now()}`,
        date: todayIso,
        label: 'Evaluation',
        skills: result.skills,
        matchPercentage: result.primaryPosition.matchPercentage,
        primaryPosition: result.primaryPosition.code
      };

      const updatedStudent: AcademyStudent = {
        ...evaluatingStudent,
        preferredFoot: result.preferredFoot,
        primaryPosition: result.primaryPosition.code,
        secondaryPosition: result.secondaryPositions?.[0]?.code || evaluatingStudent.secondaryPosition,
        matchPercentage: result.primaryPosition.matchPercentage,
        skills: result.skills,
        lastExamDate: todayIso,
        assessmentResultId: result.id,
        skillHistory: [...existingHistory, newSnapshot]
      };

      setEvaluatingStudent(updatedStudent);
      setAcademyStudents((prev) => {
        const nextList = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
        try {
          localStorage.setItem('coachstrike_academy_students', JSON.stringify(nextList));
        } catch (e) {
          console.error('Error updating academy student in localStorage:', e);
        }
        return nextList;
      });

      if (user) {
        saveStudentToCloud(user.uid, updatedStudent).catch((e) =>
          console.error('Error syncing evaluated student to Firestore:', e)
        );
      }
    } else if (tryoutMeta && tryoutMeta.inviteCode.trim()) {
      // Auto-ingest player from Public QR / Invite Code directly into Academy Roster
      const cleanCode = tryoutMeta.inviteCode.trim().toUpperCase();
      setLastSyncedInviteCode(cleanCode);

      // Look up matching category from local classes if available, otherwise infer from code
      let resolvedCategory: AcademyStudent['category'] =
        tryoutMeta.category || inferCategoryFromInviteCode(cleanCode, tryoutMeta.age);
      try {
        const rawClasses = localStorage.getItem('coachstrike_academy_classes');
        if (rawClasses) {
          const parsedClasses = JSON.parse(rawClasses);
          if (Array.isArray(parsedClasses)) {
            const matchedClass = parsedClasses.find(
              (c: any) => String(c.inviteCode || '').toUpperCase() === cleanCode
            );
            if (matchedClass && matchedClass.category) {
              resolvedCategory = matchedClass.category;
            }
            // Increment student count on matched class
            const updatedClasses = parsedClasses.map((c: any) =>
              String(c.inviteCode || '').toUpperCase() === cleanCode
                ? { ...c, studentCount: (Number(c.studentCount) || 0) + 1 }
                : c
            );
            localStorage.setItem('coachstrike_academy_classes', JSON.stringify(updatedClasses));
          }
        }
      } catch {}

      const newTryoutStudent: AcademyStudent = {
        id: `std-tryout-${Date.now()}`,
        name: result.playerName,
        age: Number(tryoutMeta.age) || 16,
        category: resolvedCategory,
        dorsal: Number(tryoutMeta.dorsal) || 10,
        preferredFoot: result.preferredFoot,
        primaryPosition: result.primaryPosition.code,
        secondaryPosition: result.secondaryPositions?.[0]?.code,
        matchPercentage: result.primaryPosition.matchPercentage,
        skills: result.skills,
        classCode: cleanCode,
        lastExamDate: todayIso,
        assessmentResultId: result.id,
        pinCode: '1010',
        skillHistory: [
          {
            id: `snap-tryout-${Date.now()}`,
            date: todayIso,
            label: 'Auto-Diagnóstico QR',
            skills: result.skills,
            matchPercentage: result.primaryPosition.matchPercentage,
            primaryPosition: result.primaryPosition.code
          }
        ],
        coachNotes: `Auto-diagnóstico vinculado por Código/QR (${cleanCode}). Posición detectada: ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}%).`,
        createdAt: new Date().toISOString()
      };

      setAcademyStudents((prev) => {
        const existingIdx = prev.findIndex(
          (s) =>
            s.name.trim().toLowerCase() === newTryoutStudent.name.trim().toLowerCase() &&
            (s.classCode === cleanCode || s.category === resolvedCategory)
        );
        let nextList: AcademyStudent[];
        if (existingIdx >= 0) {
          const existing = prev[existingIdx];
          const mergedStudent: AcademyStudent = {
            ...existing,
            ...newTryoutStudent,
            id: existing.id,
            skillHistory: [...(existing.skillHistory || []), ...(newTryoutStudent.skillHistory || [])]
          };
          nextList = prev.map((s, idx) => (idx === existingIdx ? mergedStudent : s));
        } else {
          nextList = [newTryoutStudent, ...prev];
        }
        try {
          localStorage.setItem('coachstrike_academy_students', JSON.stringify(nextList));
          window.dispatchEvent(new CustomEvent('coachstrike_academy_roster_updated'));
        } catch {}
        return nextList;
      });

      // Publish to cloud tryout submissions (works for both signed-in and guest players)
      publishAcademyTryoutSubmission(newTryoutStudent).catch(() => {});

      if (user) {
        saveStudentToCloud(user.uid, newTryoutStudent).catch(() => {});
      }
    }

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
        onSelectAcademySubTab={(subTab) => setAcademySubTab(subTab)}
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
                initialInviteCode={initialInviteCode}
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
              {lastSyncedInviteCode && (
                <div className="max-w-5xl mx-auto px-4 pt-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="text-xs text-emerald-200">
                      <strong className="text-emerald-400 font-mono uppercase block mb-0.5">
                        {lang === 'en'
                          ? `✅ AUTOMATICALLY SYNCED TO ACADEMY ROSTER (${lastSyncedInviteCode})`
                          : lang === 'pt'
                          ? `✅ SINCRONIZADO AUTOMATICAMENTE NO PLANTEL DA ACADEMIA (${lastSyncedInviteCode})`
                          : `✅ FICHA SINCRONIZADA AUTOMÁTICAMENTE EN LA PLANTILLA DE ACADEMIA (${lastSyncedInviteCode})`}
                      </strong>
                      <span>
                        {lang === 'en'
                          ? 'Your full Tactical DNA profile, radar metrics, and position fit have been added to your coach’s squad.'
                          : lang === 'pt'
                          ? 'O seu perfil de ADN Tático, métricas de radar e posição ideal foram adicionados diretamente ao plantel do treinador.'
                          : 'Tu perfil completo de ADN Táctico, radar de 8 métricas y posición ideal ya aparecen en la plantilla del entrenador.'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAcademySubTab('roster');
                        setActiveTab('academy');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider cursor-pointer shrink-0 transition-all"
                    >
                      {lang === 'en'
                        ? 'View in Academy Roster'
                        : lang === 'pt'
                        ? 'Ver no Plantel da Academia'
                        : 'Ver en Plantilla de Academia'}
                    </button>
                  </div>
                </div>
              )}
              <EvaluationResult
                result={currentResult}
                onRepeatTest={() => {
                  setIsSharedLinkView(false);
                  setEvaluatingStudent(null);
                  setActiveTab('test');
                }}
                onSaveProfile={handleSaveProfile}
                isSaved={isCurrentSaved}
                onOpenPricing={() => handleOpenPricing(plan === 'pro' ? 'academy' : 'pro')}
                isSharedView={isSharedLinkView}
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
                initialSubTab={academySubTab}
                initialStudentId={portalStudentId}
                onStartStudentExam={(student) => {
                  setEvaluatingStudent(student);
                  setActiveTab('test');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenPricing={(preferred) => handleOpenPricing(preferred || 'academy_basic')}
              />
            </motion.div>
          )}

          {activeTab === 'portal' && (
            <motion.div
              key="portal-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PlayerPortal
                students={academyStudents.length > 0 ? academyStudents : INITIAL_STUDENTS}
                initialStudentId={portalStudentId}
                clubBrand={clubBrand}
                isDirectSharedLink={isSharedLinkView}
                onBackToAcademy={() => {
                  setActiveTab('hero');
                  setIsSharedLinkView(false);
                }}
                onUpdateStudentTask={(studentId, taskId, completed) => {
                  setAcademyStudents((prev) => {
                    const updated = prev.map((s) => {
                      if (s.id !== studentId) return s;
                      const updatedTasks = (s.tasks || []).map((t) =>
                        t.id === taskId ? { ...t, status: completed ? ('completed' as const) : ('pending' as const) } : t
                      );
                      return { ...s, tasks: updatedTasks };
                    });
                    try {
                      localStorage.setItem('coachstrike_academy_students', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                }}
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
              <AICoachChat
                playerProfile={currentResult}
                initialPrompt={tacticalPromptForAI}
                onPromptConsumed={() => setTacticalPromptForAI(null)}
              />
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
            <span>
              {lang === 'en' 
                ? '— Football DNA Assessment & Tactical Intelligence'
                : lang === 'pt'
                ? '— Avaliador de ADN do Futebol & Inteligência Tática'
                : '— Evaluador de ADN Futbolístico & Inteligencia Táctica'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-slate-400 hover:text-volt transition-colors font-mono cursor-pointer underline underline-offset-4"
            >
              {lang === 'en'
                ? 'Privacy Policy & Terms (Google Play / App Store)'
                : lang === 'pt'
                ? 'Política de Privacidade e Termos (Google Play / App Store)'
                : 'Política de Privacidad y Términos (Google Play / App Store)'}
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">
              {lang === 'en'
                ? 'Inspired by Strike Pro professional tactical analysis methodologies.'
                : lang === 'pt'
                ? 'Inspirado em metodologias de análise tática profissional Strike Pro.'
                : 'Inspirado en metodologías de análisis táctico profesional Strike Pro.'}
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

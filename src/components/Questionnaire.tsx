import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, User, Footprints, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { FOOTBALL_QUESTIONS } from '../data/questions';
import { AssessmentResult, AcademyStudent } from '../types';
import { calculateAssessment } from '../utils/evaluator';
import { useLanguage } from '../context/LanguageContext';

interface QuestionnaireProps {
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
  studentContext?: AcademyStudent | null;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  onComplete, 
  onCancel,
  studentContext 
}) => {
  const { t } = useLanguage();
  const [playerName, setPlayerName] = useState(studentContext ? studentContext.name : '');
  const [preferredFoot, setPreferredFoot] = useState<'Diestro' | 'Zurdo' | 'Ambidestro'>(
    studentContext ? studentContext.preferredFoot : 'Diestro'
  );
  const [step, setStep] = useState<number>(0); // 0 = Player setup, 1..10 = questions
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (studentContext) {
      setPlayerName(studentContext.name);
      setPreferredFoot(studentContext.preferredFoot);
    }
  }, [studentContext]);

  const totalQuestions = FOOTBALL_QUESTIONS.length;
  const currentQuestion = FOOTBALL_QUESTIONS[step - 1];

  const handleNext = () => {
    if (step === 0) {
      if (!playerName.trim()) {
        setPlayerName('Jugador CoachStrike');
      }
      setStep(1);
    } else if (step < totalQuestions) {
      setStep(step + 1);
    } else {
      const result = calculateAssessment(playerName, preferredFoot, answers);
      onComplete(result);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const isOptionSelected = (optionId: string) => {
    return answers[currentQuestion?.id] === optionId;
  };

  const canProceed = () => {
    if (step === 0) return true;
    return Boolean(answers[currentQuestion?.id]);
  };

  const progressPercentage = step === 0 ? 5 : Math.round((step / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header Progress Bar */}
      <div className="mb-8 bg-slate-900/50 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-volt font-mono-code">
            <Zap className="w-4 h-4 fill-black text-volt" />
            <span>Diagnóstico de ADN</span>
          </span>
          <span className="font-mono-code text-volt font-bold">
            {step === 0 ? 'Fase 00' : `${t.stepLabel} ${step}/${totalQuestions}`} ({progressPercentage}%)
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="bg-volt h-full rounded-full shadow-md shadow-volt/40"
            initial={{ width: '5%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            /* STEP 0: Player Identity Setup */
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                {studentContext ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Evaluando Alumno Cantera: #{studentContext.dorsal} {studentContext.name} ({studentContext.category})</span>
                  </div>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-volt-10 text-volt text-xs font-bold font-mono-code uppercase tracking-widest border border-volt-30">
                    PASO 1: REGISTRO DE FICHA
                  </span>
                )}
                <h2 className="text-3xl font-black italic text-white font-display uppercase tracking-wide">
                  {t.namePromptTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  {t.namePromptSub}
                </p>
              </div>

              {/* Input Player Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider">
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ej: Jude Bellingham, Leo, Dani..."
                    className="w-full bg-black/60 border border-white/10 focus:border-volt focus:ring-1 focus:ring-volt rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-600 outline-hidden text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Foot Dominance */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider">
                  {t.footLabel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Diestro', 'Zurdo', 'Ambidestro'] as const).map((foot) => {
                    const isSelected = preferredFoot === foot;
                    const label = foot === 'Diestro' ? t.footRight : foot === 'Zurdo' ? t.footLeft : t.footBoth;
                    return (
                      <button
                        key={foot}
                        type="button"
                        onClick={() => setPreferredFoot(foot)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-volt text-black border-volt font-black shadow-lg shadow-volt/20'
                            : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Footprints className="w-5 h-5" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            /* QUESTIONS STEPS 1..10 */
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono-code">
                    {t.stepLabel} {step} {t.ofLabel} {totalQuestions}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black italic text-white font-display uppercase tracking-wide">
                  {currentQuestion.title}
                </h2>
                <p className="text-xs text-slate-400">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const selected = isOptionSelected(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer ${
                        selected
                          ? 'bg-slate-900 border-2 border-volt shadow-lg shadow-volt/10'
                          : 'bg-black/40 border-white/10 hover:border-white/30 text-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? 'border-volt bg-volt text-black' : 'border-slate-600'
                      }`}>
                        {selected && <CheckCircle2 className="w-4 h-4 fill-black text-volt" />}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold uppercase italic font-display ${selected ? 'text-volt' : 'text-white'}`}>
                            {opt.label}
                          </h4>
                          {opt.badge && (
                            <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-black/60 border border-white/10 text-slate-400">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-volt" />
            <span>{t.prevQuestion}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-xl font-black italic uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              canProceed()
                ? 'bg-volt text-black hover:bg-white shadow-lg shadow-volt/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>{step === totalQuestions ? t.finishTest : t.nextQuestion}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

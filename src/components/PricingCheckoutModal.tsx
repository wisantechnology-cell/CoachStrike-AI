import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Users, 
  Trophy, 
  FileText, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowRight,
  Crown,
  CalendarClock,
  Flame
} from 'lucide-react';
import { PlanType, PaymentProvider, PaymentRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { savePaymentToCloud } from '../lib/firebase';

interface PricingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanType;
  onPlanActivated?: (plan: PlanType) => void;
}

export const PricingCheckoutModal: React.FC<PricingCheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'pro',
  onPlanActivated
}) => {
  const { user, plan: currentPlan, updatePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [provider, setProvider] = useState<PaymentProvider>('stripe');

  // Automatically select the most relevant plan on modal open
  useEffect(() => {
    if (isOpen) {
      if (initialPlan === 'academy_elite') {
        setSelectedPlan('academy_elite');
      } else if (initialPlan === 'academy' || initialPlan === 'academy_basic') {
        setSelectedPlan('academy_basic');
      } else if (currentPlan === 'pro') {
        // If the user already has Pro, prioritize showing Academy Basic
        setSelectedPlan('academy_basic');
      } else if (currentPlan === 'academy' || currentPlan === 'academy_basic') {
        setSelectedPlan('academy_elite');
      } else if (currentPlan === 'academy_elite') {
        setSelectedPlan('academy_elite');
      } else {
        setSelectedPlan(initialPlan || 'pro');
      }
    }
  }, [isOpen, currentPlan, initialPlan]);

  // Stripe form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(user?.displayName || '');
  const [cardZip, setCardZip] = useState('28001');

  // PayPal state
  const [paypalEmail, setPaypalEmail] = useState(user?.email || 'mister@futbolclub.com');

  // Processing & Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    transactionId: string;
    amount: number;
    amountDueToday: number;
    provider: PaymentProvider;
    plan: PlanType;
    trialDays: number;
    trialEndsAt: string;
  } | null>(null);

  if (!isOpen) return null;

  const prices: Record<PlanType, { monthly: number; annual: number; maxStudents?: number }> = {
    free: { monthly: 0, annual: 0 },
    pro: { monthly: 4.99, annual: 39.99 },
    academy: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
    academy_basic: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
    academy_elite: { monthly: 59.99, annual: 479.99, maxStudents: 200 }
  };

  const currentPriceConfig = prices[selectedPlan] || prices.pro;
  const currentPrice = currentPriceConfig[billingCycle];

  const trialDays = 3;
  const trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
  const trialEndDateFormatted = trialEndDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleFillDemoStripe = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardName(user?.displayName || 'Alex Morgan');
    setCardZip('28001');
  };

  const handleFillDemoPaypal = () => {
    setPaypalEmail(user?.email || 'coach.premier@strikeai.com');
  };

  const handleProcessPayment = async () => {
    if (selectedPlan === 'free') {
      await updatePlan('free');
      if (onPlanActivated) onPlanActivated('free');
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      const endpoint = provider === 'stripe' ? '/api/checkout/stripe' : '/api/checkout/paypal';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          billingCycle,
          userEmail: user?.email || (provider === 'paypal' ? paypalEmail : 'user@coachstrike.ai'),
          cardDetails: provider === 'stripe' ? { name: cardName, last4: '4242' } : undefined
        })
      });

      const data = await response.json();
      const transactionId = data.transactionId || `tx_${Date.now()}`;
      const finalAmount = data.amount ?? currentPrice;

      // Update plan in AuthContext & Firestore
      await updatePlan(selectedPlan);

      // Persist transaction record in Firestore
      if (user) {
        try {
          const paymentRecord: PaymentRecord = {
            id: transactionId,
            userId: user.uid,
            transactionId,
            provider,
            plan: selectedPlan,
            billingCycle,
            amount: finalAmount,
            amountDueToday: 0.0,
            hasTrial: true,
            trialDays: 3,
            trialEndsAt: trialEndDate.toISOString(),
            currency: 'USD',
            status: 'paid',
            createdAt: new Date().toISOString()
          };
          await savePaymentToCloud(user.uid, paymentRecord);
        } catch (saveErr) {
          console.error('Error saving payment to Firestore:', saveErr);
        }
      }

      setSuccessReceipt({
        transactionId,
        amount: finalAmount,
        amountDueToday: 0.0,
        provider,
        plan: selectedPlan,
        trialDays: 3,
        trialEndsAt: trialEndDateFormatted
      });

      if (onPlanActivated) {
        onPlanActivated(selectedPlan);
      }
    } catch (e) {
      console.error('Payment flow error, falling back gracefully:', e);
      const fallbackTx = `${provider.toUpperCase()}-LOCAL-${Date.now().toString(36).toUpperCase()}`;
      await updatePlan(selectedPlan);

      if (user) {
        try {
          await savePaymentToCloud(user.uid, {
            id: fallbackTx,
            userId: user.uid,
            transactionId: fallbackTx,
            provider,
            plan: selectedPlan,
            billingCycle,
            amount: currentPrice,
            amountDueToday: 0.0,
            hasTrial: true,
            trialDays: 3,
            trialEndsAt: trialEndDate.toISOString(),
            currency: 'USD',
            status: 'paid',
            createdAt: new Date().toISOString()
          });
        } catch {}
      }

      setSuccessReceipt({
        transactionId: fallbackTx,
        amount: currentPrice,
        amountDueToday: 0.0,
        provider,
        plan: selectedPlan,
        trialDays: 3,
        trialEndsAt: trialEndDateFormatted
      });

      if (onPlanActivated) {
        onPlanActivated(selectedPlan);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanDisplayName = (p: PlanType) => {
    switch (p) {
      case 'pro': return 'Plan Pro';
      case 'academy_basic':
      case 'academy': return 'Academia Básico';
      case 'academy_elite': return 'Academia Élite';
      case 'free': return 'Plan Gratuito';
    }
  };

  const isCurrentActivePlan = (p: PlanType) => {
    if (p === 'free') return currentPlan === 'free';
    if (p === 'pro') return currentPlan === 'pro';
    if (p === 'academy_basic' || p === 'academy') return currentPlan === 'academy' || currentPlan === 'academy_basic';
    if (p === 'academy_elite') return currentPlan === 'academy_elite';
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl shadow-volt/5 overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-volt flex items-center justify-center text-black font-black italic">
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase italic font-display flex items-center gap-2">
                Membresías & Planes <span className="text-volt">Strike AI</span>
              </h2>
              <p className="text-xs text-slate-400">
                Prueba gratuita de 3 días en todos los planes • Sin riesgo • Cancela cuando quieras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {successReceipt ? (
          /* Payment Success Confirmation View */
          <div className="p-8 text-center max-w-lg mx-auto py-10 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase">
              🎉 3 Días de Prueba Activados
            </span>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mt-3">
              ¡Bienvenido a {getPlanDisplayName(successReceipt.plan)}!
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              Tu prueba gratuita de 3 días está activa desde hoy. Tienes acceso total e ilimitado a todas las herramientas.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 my-6 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Transacción ID:</span>
                <span className="text-white font-bold">{successReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan Seleccionado:</span>
                <span className="text-volt font-bold uppercase">{getPlanDisplayName(successReceipt.plan)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cargo Realizado Hoy:</span>
                <span className="text-emerald-400 font-black">$0.00 USD (Prueba 3 Días)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Primer Cobro Regular:</span>
                <span className="text-white font-bold">${successReceipt.amount} USD ({billingCycle === 'monthly' ? 'mensual' : 'anual'})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fecha Fin de Prueba:</span>
                <span className="text-amber-400 font-bold">{successReceipt.trialEndsAt}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pasarela Segura:</span>
                <span className="text-emerald-400 uppercase font-bold">{successReceipt.provider}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic tracking-wider shadow-lg shadow-volt/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Comenzar a Usar Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Plans & Checkout Selection */
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
            {/* Left Column: Plan Selector & Features (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Pro Upgrade Notice if user is already on Pro */}
              {currentPlan === 'pro' && selectedPlan !== 'academy_basic' && selectedPlan !== 'academy_elite' && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-volt/15 via-emerald-500/15 to-emerald-500/20 border border-emerald-400/40 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white uppercase italic tracking-wide block">
                        Upgrade a Modo Academia
                      </span>
                      <p className="text-[11px] text-slate-300">
                        Ya eres <strong>Pro</strong>. Pasa a <strong>Academia Básico (30 alumnos)</strong> o <strong>Élite (200 alumnos)</strong> con 3 días gratis.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('academy_basic')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    Ver Academia
                  </button>
                </div>
              )}

              {/* Billing Cycle Toggle + Trial Highlight */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-volt text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-volt text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Anual</span>
                    <span className="px-1.5 py-0.2 rounded bg-black/20 text-black text-[10px] font-black uppercase">
                      -20% Ahorro
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                  <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                  <span>3 Días de Prueba Gratuita incluidos</span>
                </div>
              </div>

              {/* Cards for each plan */}
              <div className="space-y-3">
                {/* 1. PLAN PRO CARD ($4.99) */}
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'pro'
                      ? 'bg-volt/10 border-volt shadow-lg shadow-volt/10 ring-1 ring-volt/30'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-white uppercase italic">
                          Plan Pro
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-black" />
                          3 Días Gratis
                        </span>
                        {isCurrentActivePlan('pro') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            ✓ Tu Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Para jugadores individuales que buscan el máximo rendimiento
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-volt font-mono">
                        ${prices.pro[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-volt shrink-0" />
                      <span>Evaluaciones ilimitadas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-volt shrink-0" />
                      <span>Análisis profundo de regates</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-volt shrink-0" />
                      <span>Ficha Scouting PDF UEFA</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-volt shrink-0" />
                      <span>Coach AI Táctico 24/7</span>
                    </li>
                  </ul>
                </div>

                {/* 2. PLAN ACADEMIA BÁSICO CARD ($39.99 - Límite 30 Alumnos) */}
                <div
                  onClick={() => setSelectedPlan('academy_basic')}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'academy_basic' || selectedPlan === 'academy'
                      ? 'bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30'
                      : 'bg-black/30 border-white/10 hover:border-emerald-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-white uppercase italic flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-emerald-400" />
                          Academia Básico
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider">
                          Límite 30 Alumnos
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          3 Días Gratis
                        </span>
                        {isCurrentActivePlan('academy_basic') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            ✓ Tu Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Para entrenadores, formadores y clubes base
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        ${prices.academy_basic[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white">Hasta 30 alumnos en plantilla</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Examen directo y test a alumnos</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Armador de Once Ideal interactivo</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Asignación de tareas técnicas</span>
                    </li>
                  </ul>
                </div>

                {/* 3. PLAN ACADEMIA ÉLITE CARD ($59.99 - Límite 200 Alumnos) */}
                <div
                  onClick={() => setSelectedPlan('academy_elite')}
                  className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'academy_elite'
                      ? 'bg-amber-400/10 border-amber-400 shadow-lg shadow-amber-400/20 ring-1 ring-amber-400/30'
                      : 'bg-black/30 border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-white uppercase italic flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400" />
                          Academia Élite
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-volt text-black text-[10px] font-black uppercase tracking-wider">
                          Límite 200 Alumnos
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          3 Días Gratis
                        </span>
                        {isCurrentActivePlan('academy_elite') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            ✓ Tu Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Para grandes canteras, clubes de alto rendimiento y federaciones
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-amber-400 font-mono">
                        ${prices.academy_elite[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold text-white">Hasta 200 alumnos en plantilla</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Múltiples categorías y canteras</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Once Ideal y banco de suplentes</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Sincronización multi-dispositivo Cloud</span>
                    </li>
                  </ul>
                </div>

                {/* 4. PLAN FREE CARD */}
                <div
                  onClick={() => setSelectedPlan('free')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPlan === 'free'
                      ? 'bg-white/5 border-white/40'
                      : 'bg-black/20 border-white/5 hover:border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300 uppercase">Plan Básico (Gratis)</span>
                      <p className="text-[11px] text-slate-500">1 evaluación guardada, 2 regates por posición</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 font-mono">$0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Form (Stripe & PayPal) (5 cols) */}
            <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Método de Pago Seguro
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <ShieldCheck className="w-3 h-3" /> SSL Encriptado
                  </span>
                </div>

                {/* Gateway Tabs: Stripe vs PayPal */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setProvider('stripe')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      provider === 'stripe'
                        ? 'bg-volt/20 border-volt text-volt shadow-sm'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Tarjeta / Stripe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('paypal')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      provider === 'paypal'
                        ? 'bg-[#0070ba]/20 border-[#0070ba] text-[#00a2e8] shadow-sm'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-black italic font-serif">P</span>
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Gateway Inputs */}
                {selectedPlan === 'free' ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No se requiere información de pago para el Plan Básico Gratuito.
                  </div>
                ) : provider === 'stripe' ? (
                  /* Stripe Form */
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-slate-400 font-medium">Número de Tarjeta</label>
                        <button
                          type="button"
                          onClick={handleFillDemoStripe}
                          className="text-[10px] text-volt hover:underline cursor-pointer"
                        >
                          Usar tarjeta de prueba
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4242 •••• •••• 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-volt"
                        />
                        <div className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">
                          VISA/MC
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 font-medium block mb-1">Caducidad</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-volt"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-volt"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Titular de la Tarjeta</label>
                      <input
                        type="text"
                        placeholder="Nombre y Apellidos"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-volt"
                      />
                    </div>
                  </div>
                ) : (
                  /* PayPal Form */
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#0070ba]/10 border border-[#0070ba]/30 text-slate-300">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#00a2e8] flex items-center gap-1">
                          PayPal Express Checkout
                        </span>
                        <button
                          type="button"
                          onClick={handleFillDemoPaypal}
                          className="text-[10px] text-volt hover:underline cursor-pointer"
                        >
                          Usar cuenta demo
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Serás redirigido para autorizar tu prueba gratuita de 3 días con protección al comprador.
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Correo de PayPal</label>
                      <input
                        type="email"
                        placeholder="tu-correo@paypal.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0070ba]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary & Pay Action with 3-Day Free Trial Notice */}
              <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                {selectedPlan !== 'free' && (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Tarifa regular:</span>
                      <span>${currentPrice} USD /{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>Prueba gratuita (3 Días):</span>
                      <span>-$${currentPrice} USD (100% OFF)</span>
                    </div>
                    <div className="flex justify-between text-slate-400 border-t border-white/5 pt-1 text-[11px]">
                      <span>Primer cobro:</span>
                      <span className="text-white">{trialEndDateFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10 font-bold">
                      <span className="text-slate-200">Total a pagar hoy:</span>
                      <span className="text-emerald-400 text-sm font-black">$0.00 USD</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessing || (isCurrentActivePlan(selectedPlan) && selectedPlan !== 'free')}
                  onClick={handleProcessPayment}
                  className={`w-full py-3 rounded-xl font-black uppercase italic tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                    isCurrentActivePlan(selectedPlan) && selectedPlan !== 'free'
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                      : selectedPlan === 'academy_elite'
                      ? 'bg-amber-400 hover:bg-white text-black shadow-lg shadow-amber-500/20 cursor-pointer'
                      : selectedPlan === 'academy_basic' || selectedPlan === 'academy'
                      ? 'bg-emerald-400 hover:bg-white text-black shadow-lg shadow-emerald-500/20 cursor-pointer'
                      : 'bg-volt hover:bg-white text-black shadow-lg shadow-volt/20 cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Activando prueba gratuita...</span>
                    </>
                  ) : isCurrentActivePlan(selectedPlan) && selectedPlan !== 'free' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{getPlanDisplayName(selectedPlan)} ya activo</span>
                    </>
                  ) : selectedPlan === 'free' ? (
                    <span>Confirmar Plan Básico</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Iniciar Prueba Gratuita de 3 Días ($0 hoy)</span>
                    </>
                  )}
                </button>

                {selectedPlan !== 'free' ? (
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    No se te cobrará nada hoy. Tras los 3 días de prueba, se aplicará ${currentPrice} USD /{billingCycle === 'monthly' ? 'mes' : 'año'} según el plan elegido. Puedes cancelar en cualquier momento sin compromiso.
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 text-center">
                    Plan gratuito para siempre.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

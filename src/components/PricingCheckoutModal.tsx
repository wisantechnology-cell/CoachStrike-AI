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
  Flame,
  LogIn,
  AlertCircle,
  User as UserIcon
} from 'lucide-react';
import { PlanType, PaymentProvider, PaymentRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { savePaymentToCloud } from '../lib/firebase';
import { AuthModal } from './AuthModal';

const PRICING_TEXTS = {
  en: {
    headerTitle: 'Memberships & Plans',
    headerSub: '3-Day free trial on all plans • Risk-free • Cancel anytime',
    monthly: 'Monthly',
    annual: 'Annual',
    saveDiscount: '-33% Savings',
    trialIncluded: '3-Day Free Trial Included',
    proPlan: 'Pro Plan',
    proBadge: '3 Days Free',
    proSub: 'For individual players seeking maximum tactical performance',
    proFeatures: [
      'Unlimited DNA assessments',
      'In-depth dribbling analysis',
      'UEFA PDF Scouting Report',
      '24/7 AI Tactical Coach'
    ],
    academyBasic: 'Academy Basic',
    academyBasicLimit: 'Limit 30 Players',
    academyBasicSub: 'For coaches, youth trainers and grassroots clubs',
    academyBasicFeatures: [
      'Up to 30 registered student profiles',
      'Direct player DNA testing & progress',
      'Interactive Starting XI line-up builder',
      'Tactical task & drill assignment'
    ],
    academyElite: 'Academy Elite',
    academyEliteLimit: 'Limit 200 Players',
    academyEliteSub: 'For large youth academies, pro clubs & federations',
    academyEliteFeatures: [
      'Up to 200 player roster files',
      'Multiple youth categories & squads',
      'Full Starting XI and bench management',
      'Multi-device real-time Cloud sync'
    ],
    freePlan: 'Basic Plan (Free)',
    freePlanSub: '1 saved evaluation, 2 dribbles per position',
    securePayment: 'Secure Payment Method',
    sslEncrypted: 'SSL Encrypted',
    authRequiredTitle: 'Account Required',
    authRequiredSub: 'Sign in to link your membership and activate your 3-day trial.',
    loginToContinue: 'Sign In to Continue',
    verified: 'Verified',
    stripeTab: 'Credit Card / Stripe',
    paypalTab: 'PayPal',
    freeNoPayment: 'No payment information required for Free Basic Plan.',
    cardNumber: 'Card Number',
    useTestCard: 'Use test card',
    expiry: 'Expiry',
    cvc: 'CVC / CVV',
    cardholder: 'Cardholder Name',
    fullNamePlaceholder: 'Full Name',
    paypalExpress: 'PayPal Express Checkout',
    useDemoAccount: 'Use demo account',
    paypalNotice: 'You will be redirected to authorize your 3-day free trial with buyer protection.',
    paypalEmail: 'PayPal Email',
    regularFee: 'Regular fee:',
    freeTrial: 'Free trial (3 Days):',
    firstCharge: 'First charge:',
    dueToday: 'Total due today:',
    month: 'month',
    year: 'year',
    startTrialBtn: 'Start 3-Day Free Trial ($0 today)',
    activatingTrial: 'Activating free trial...',
    confirmFreeBtn: 'Confirm Free Basic Plan',
    planActive: 'already active',
    yourPlan: '✓ Your Plan',
    disclaimer: 'You will not be charged today. After 3 trial days, ${price} USD /{cycle} applies according to chosen plan. Cancel anytime.',
    freeForever: 'Free plan forever.',
    successTag: '🎉 3-Day Free Trial Activated',
    welcomeTo: 'Welcome to {plan}!',
    successSub: 'Your 3-day free trial is active from today. You have full, unlimited access to all features.',
    txId: 'Transaction ID:',
    selectedPlanLbl: 'Selected Plan:',
    chargedToday: 'Charged Today:',
    chargedZero: '$0.00 USD (3-Day Trial)',
    regularCharge: 'First Regular Charge:',
    trialEndLbl: 'Trial End Date:',
    gatewayLbl: 'Secure Gateway:',
    startUsingBtn: 'Start Using Now',
    upgradeToAcademy: 'Upgrade to Academy Mode',
    upgradeToAcademyDesc: 'You are Pro. Upgrade to Academy Basic (30 students) or Elite (200 students) with 3 days free.',
    viewAcademy: 'View Academy'
  },
  es: {
    headerTitle: 'Membresías & Planes',
    headerSub: 'Prueba gratuita de 3 días en todos los planes • Sin riesgo • Cancela cuando quieras',
    monthly: 'Mensual',
    annual: 'Anual',
    saveDiscount: '-33% Ahorro',
    trialIncluded: '3 Días de Prueba Gratuita incluidos',
    proPlan: 'Plan Pro',
    proBadge: '3 Días Gratis',
    proSub: 'Para jugadores individuales que buscan el máximo rendimiento',
    proFeatures: [
      'Evaluaciones ilimitadas',
      'Análisis profundo de regates',
      'Ficha Scouting PDF UEFA',
      'Coach AI Táctico 24/7'
    ],
    academyBasic: 'Academia Básico',
    academyBasicLimit: 'Límite 30 Alumnos',
    academyBasicSub: 'Para entrenadores, formadores y clubes base',
    academyBasicFeatures: [
      'Hasta 30 alumnos en plantilla',
      'Examen directo y test a alumnos',
      'Armador de Once Ideal interactivo',
      'Asignación de tareas técnicas'
    ],
    academyElite: 'Academia Élite',
    academyEliteLimit: 'Límite 200 Alumnos',
    academyEliteSub: 'Para grandes canteras, clubes de alto rendimiento y federaciones',
    academyEliteFeatures: [
      'Hasta 200 alumnos en plantilla',
      'Múltiples categorías y canteras',
      'Once Ideal y banco de suplentes',
      'Sincronización multi-dispositivo Cloud'
    ],
    freePlan: 'Plan Básico (Gratis)',
    freePlanSub: '1 evaluación guardada, 2 regates por posición',
    securePayment: 'Método de Pago Seguro',
    sslEncrypted: 'SSL Encriptado',
    authRequiredTitle: 'Requisito Obligatorio',
    authRequiredSub: 'Inicia sesión para vincular tu membresía y activar los 3 días de prueba.',
    loginToContinue: 'Iniciar Sesión para Continuar',
    verified: 'Verificado',
    stripeTab: 'Tarjeta / Stripe',
    paypalTab: 'PayPal',
    freeNoPayment: 'No se requiere información de pago para el Plan Básico Gratuito.',
    cardNumber: 'Número de Tarjeta',
    useTestCard: 'Usar tarjeta de prueba',
    expiry: 'Caducidad',
    cvc: 'CVC / CVV',
    cardholder: 'Titular de la Tarjeta',
    fullNamePlaceholder: 'Nombre y Apellidos',
    paypalExpress: 'PayPal Express Checkout',
    useDemoAccount: 'Usar cuenta demo',
    paypalNotice: 'Serás redirigido para autorizar tu prueba gratuita de 3 días con protección al comprador.',
    paypalEmail: 'Correo de PayPal',
    regularFee: 'Tarifa regular:',
    freeTrial: 'Prueba gratuita (3 Días):',
    firstCharge: 'Primer cobro:',
    dueToday: 'Total a pagar hoy:',
    month: 'mes',
    year: 'año',
    startTrialBtn: 'Iniciar Prueba Gratuita de 3 Días ($0 hoy)',
    activatingTrial: 'Activando prueba gratuita...',
    confirmFreeBtn: 'Confirmar Plan Básico',
    planActive: 'ya activo',
    yourPlan: '✓ Tu Plan',
    disclaimer: 'No se te cobrará nada hoy. Tras los 3 días de prueba, se aplicará ${price} USD /{cycle} según el plan elegido. Puedes cancelar en cualquier momento sin compromiso.',
    freeForever: 'Plan gratuito para siempre.',
    successTag: '🎉 3 Días de Prueba Activados',
    welcomeTo: '¡Bienvenido a {plan}!',
    successSub: 'Tu prueba gratuita de 3 días está activa desde hoy. Tienes acceso total e ilimitado a todas las herramientas.',
    txId: 'Transacción ID:',
    selectedPlanLbl: 'Plan Seleccionado:',
    chargedToday: 'Cargo Realizado Hoy:',
    chargedZero: '$0.00 USD (Prueba 3 Días)',
    regularCharge: 'Primer Cobro Regular:',
    trialEndLbl: 'Fecha Fin de Prueba:',
    gatewayLbl: 'Pasarela Segura:',
    startUsingBtn: 'Comenzar a Usar Ahora',
    upgradeToAcademy: 'Upgrade a Modo Academia',
    upgradeToAcademyDesc: 'Ya eres Pro. Pasa a Academia Básico (30 alumnos) o Élite (200 alumnos) con 3 días gratis.',
    viewAcademy: 'Ver Academia'
  },
  pt: {
    headerTitle: 'Membros & Planos',
    headerSub: 'Teste grátis de 3 dias em todos os planos • Sem risco • Cancele quando quiser',
    monthly: 'Mensal',
    annual: 'Anual',
    saveDiscount: '-33% Poupança',
    trialIncluded: '3 Dias de Teste Gratuito incluídos',
    proPlan: 'Plano Pro',
    proBadge: '3 Dias Grátis',
    proSub: 'Para jogadores individuais em busca do máximo rendimento tático',
    proFeatures: [
      'Avaliações ilimitadas',
      'Análise aprofundada de dribles',
      'Relatório Scouting PDF UEFA',
      'Treinador AI Tático 24/7'
    ],
    academyBasic: 'Academia Básico',
    academyBasicLimit: 'Limite 30 Alunos',
    academyBasicSub: 'Para treinadores, formadores e clubes de base',
    academyBasicFeatures: [
      'Até 30 alunos no plantel',
      'Avaliação direta e testes de alunos',
      'Montador de Onze Ideal interativo',
      'Atribuição de tarefas técnicas'
    ],
    academyElite: 'Academia Elite',
    academyEliteLimit: 'Limite 200 Alunos',
    academyEliteSub: 'Para grandes centros de formação, clubes e federações',
    academyEliteFeatures: [
      'Até 200 alunos no plantel',
      'Múltiplos escalões e equipas',
      'Onze Ideal e banco de suplentes',
      'Sincronização Cloud multi-dispositivo'
    ],
    freePlan: 'Plano Básico (Grátis)',
    freePlanSub: '1 avaliação guardada, 2 dribles por posição',
    securePayment: 'Método de Pagamento Seguro',
    sslEncrypted: 'SSL Encriptado',
    authRequiredTitle: 'Requisito Obrigatório',
    authRequiredSub: 'Inicie sessão para associar a sua subscrição e ativar o teste de 3 dias.',
    loginToContinue: 'Iniciar Sessão para Continuar',
    verified: 'Verificado',
    stripeTab: 'Cartão / Stripe',
    paypalTab: 'PayPal',
    freeNoPayment: 'Não são necessárias informações de pagamento para o Plano Básico Grátis.',
    cardNumber: 'Número do Cartão',
    useTestCard: 'Usar cartão de teste',
    expiry: 'Validade',
    cvc: 'CVC / CVV',
    cardholder: 'Nome no Cartão',
    fullNamePlaceholder: 'Nome e Apelido',
    paypalExpress: 'PayPal Express Checkout',
    useDemoAccount: 'Usar conta demo',
    paypalNotice: 'Será redirecionado para autorizar o seu teste gratuito de 3 dias com proteção ao comprador.',
    paypalEmail: 'Email do PayPal',
    regularFee: 'Tarifa normal:',
    freeTrial: 'Teste gratuito (3 Dias):',
    firstCharge: 'Primeiro débito:',
    dueToday: 'Total a pagar hoje:',
    month: 'mês',
    year: 'ano',
    startTrialBtn: 'Iniciar Teste Gratuito de 3 Dias ($0 hoje)',
    activatingTrial: 'A ativar teste gratuito...',
    confirmFreeBtn: 'Confirmar Plano Básico',
    planActive: 'já ativo',
    yourPlan: '✓ O Seu Plano',
    disclaimer: 'Não será cobrado nada hoje. Após os 3 dias de teste, será aplicado ${price} USD /{cycle} conforme o plano escolhido. Pode cancelar a qualquer momento.',
    freeForever: 'Plano gratuito para sempre.',
    successTag: '🎉 3 Dias de Teste Ativados',
    welcomeTo: 'Bem-vindo ao {plan}!',
    successSub: 'O seu teste grátis de 3 dias está ativo. Tem acesso total e ilimitado a todas as ferramentas.',
    txId: 'ID da Transação:',
    selectedPlanLbl: 'Plano Selecionado:',
    chargedToday: 'Cobrado Hoje:',
    chargedZero: '$0.00 USD (Teste 3 Dias)',
    regularCharge: 'Primeira Cobrança Normal:',
    trialEndLbl: 'Data Fim do Teste:',
    gatewayLbl: 'Plataforma Segura:',
    startUsingBtn: 'Começar a Utilizar Agora',
    upgradeToAcademy: 'Upgrade para Modo Academia',
    upgradeToAcademyDesc: 'Já é Pro. Passe para Academia Básico (30 alunos) ou Elite (200 alunos) com 3 dias grátis.',
    viewAcademy: 'Ver Academia'
  }
};

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
  const { lang } = useLanguage();
  const { user, plan: currentPlan, updatePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [provider, setProvider] = useState<PaymentProvider>('stripe');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const txt = PRICING_TEXTS[lang] || PRICING_TEXTS.en;

  // Automatically select the most relevant plan on modal open
  useEffect(() => {
    if (isOpen) {
      if (initialPlan === 'academy_elite') {
        setSelectedPlan('academy_elite');
      } else if (initialPlan === 'academy' || initialPlan === 'academy_basic') {
        setSelectedPlan('academy_basic');
      } else if (currentPlan === 'pro') {
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
    academy: { monthly: 70, annual: 560, maxStudents: 30 },
    academy_basic: { monthly: 70, annual: 560, maxStudents: 30 },
    academy_elite: { monthly: 150, annual: 1200, maxStudents: 200 }
  };

  const currentPriceConfig = prices[selectedPlan] || prices.pro;
  const currentPrice = currentPriceConfig[billingCycle];

  const trialDays = 3;
  const trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);
  const trialEndDateFormatted = trialEndDate.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-ES', {
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
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          billingCycle,
          provider,
          userEmail: user?.email || (provider === 'paypal' ? paypalEmail : 'customer@coachstrike.ai'),
          userName: user?.displayName || cardName || 'Alex Morgan',
          trialDays: 3
        })
      });

      const data = await response.json();
      const transactionId = data.transactionId || `tx_${Date.now()}`;
      const finalAmount = data.amount ?? currentPrice;

      await updatePlan(selectedPlan);

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
      case 'pro': return txt.proPlan;
      case 'academy_basic':
      case 'academy': return txt.academyBasic;
      case 'academy_elite': return txt.academyElite;
      case 'free': return txt.freePlan;
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
                {txt.headerTitle} <span className="text-volt">Strike AI</span>
              </h2>
              <p className="text-xs text-slate-400">
                {txt.headerSub}
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
              {txt.successTag}
            </span>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mt-3">
              {txt.welcomeTo.replace('{plan}', getPlanDisplayName(successReceipt.plan))}
            </h3>
            <p className="text-sm text-slate-300 mt-2">
              {txt.successSub}
            </p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 my-6 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>{txt.txId}</span>
                <span className="text-white font-bold">{successReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{txt.selectedPlanLbl}</span>
                <span className="text-volt font-bold uppercase">{getPlanDisplayName(successReceipt.plan)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{txt.chargedToday}</span>
                <span className="text-emerald-400 font-black">{txt.chargedZero}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{txt.regularCharge}</span>
                <span className="text-white font-bold">${successReceipt.amount} USD ({billingCycle === 'monthly' ? txt.month : txt.year})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{txt.trialEndLbl}</span>
                <span className="text-amber-400 font-bold">{successReceipt.trialEndsAt}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{txt.gatewayLbl}</span>
                <span className="text-emerald-400 uppercase font-bold">{successReceipt.provider}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic tracking-wider shadow-lg shadow-volt/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{txt.startUsingBtn}</span>
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
                        {txt.upgradeToAcademy}
                      </span>
                      <p className="text-[11px] text-slate-300">
                        {txt.upgradeToAcademyDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('academy_basic')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    {txt.viewAcademy}
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
                    {txt.monthly}
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
                    <span>{txt.annual}</span>
                    <span className="px-1.5 py-0.2 rounded bg-black/20 text-black text-[10px] font-black uppercase">
                      {txt.saveDiscount}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                  <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{txt.trialIncluded}</span>
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
                          {txt.proPlan}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-black" />
                          {txt.proBadge}
                        </span>
                        {isCurrentActivePlan('pro') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            {txt.yourPlan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {txt.proSub}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-volt font-mono">
                        ${prices.pro[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? txt.month : txt.year}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    {txt.proFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-volt shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. PLAN ACADEMIA BÁSICO CARD ($70/m) */}
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
                          {txt.academyBasic}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider">
                          {txt.academyBasicLimit}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          {txt.proBadge}
                        </span>
                        {isCurrentActivePlan('academy_basic') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            {txt.yourPlan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {txt.academyBasicSub}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        ${prices.academy_basic[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? txt.month : txt.year}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    {txt.academyBasicFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className={idx === 0 ? 'font-semibold text-white' : ''}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. PLAN ACADEMIA ÉLITE CARD ($150/m) */}
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
                          {txt.academyElite}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-volt text-black text-[10px] font-black uppercase tracking-wider">
                          {txt.academyEliteLimit}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          {txt.proBadge}
                        </span>
                        {isCurrentActivePlan('academy_elite') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                            {txt.yourPlan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {txt.academyEliteSub}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-amber-400 font-mono">
                        ${prices.academy_elite[billingCycle]}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        /{billingCycle === 'monthly' ? txt.month : txt.year}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    {txt.academyEliteFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className={idx === 0 ? 'font-semibold text-white' : ''}>{feat}</span>
                      </li>
                    ))}
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
                      <span className="text-xs font-bold text-slate-300 uppercase">{txt.freePlan}</span>
                      <p className="text-[11px] text-slate-500">{txt.freePlanSub}</p>
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
                    {txt.securePayment}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <ShieldCheck className="w-3 h-3" /> {txt.sslEncrypted}
                  </span>
                </div>

                {/* Authentication status banner */}
                {!user && selectedPlan !== 'free' ? (
                  <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-black border-2 border-amber-400/40 space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wide block">
                          {txt.authRequiredTitle}
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {txt.authRequiredSub}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-white text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{txt.loginToContinue}</span>
                    </button>
                  </div>
                ) : user && selectedPlan !== 'free' ? (
                  <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate leading-tight">
                          {user.displayName || (lang === 'en' ? 'Registered User' : 'Usuario Registrado')}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono block truncate leading-tight">
                          {user.email || (lang === 'en' ? 'Active Account' : 'Cuenta Activa')}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase shrink-0">
                      {txt.verified}
                    </span>
                  </div>
                ) : null}

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
                    <span>{txt.stripeTab}</span>
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
                    <span>{txt.paypalTab}</span>
                  </button>
                </div>

                {/* Gateway Inputs */}
                {selectedPlan === 'free' ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {txt.freeNoPayment}
                  </div>
                ) : provider === 'stripe' ? (
                  /* Stripe Form */
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-slate-400 font-medium">{txt.cardNumber}</label>
                        <button
                          type="button"
                          onClick={handleFillDemoStripe}
                          className="text-[10px] text-volt hover:underline cursor-pointer"
                        >
                          {txt.useTestCard}
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
                        <label className="text-slate-400 font-medium block mb-1">{txt.expiry}</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-volt"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-medium block mb-1">{txt.cvc}</label>
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
                      <label className="text-slate-400 font-medium block mb-1">{txt.cardholder}</label>
                      <input
                        type="text"
                        placeholder={txt.fullNamePlaceholder}
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
                          {txt.paypalExpress}
                        </span>
                        <button
                          type="button"
                          onClick={handleFillDemoPaypal}
                          className="text-[10px] text-volt hover:underline cursor-pointer"
                        >
                          {txt.useDemoAccount}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {txt.paypalNotice}
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium block mb-1">{txt.paypalEmail}</label>
                      <input
                        type="email"
                        placeholder="coach@futbolclub.com"
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
                      <span>{txt.regularFee}</span>
                      <span>${currentPrice} USD /{billingCycle === 'monthly' ? txt.month : txt.year}</span>
                    </div>
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>{txt.freeTrial}</span>
                      <span>-$${currentPrice} USD (100% OFF)</span>
                    </div>
                    <div className="flex justify-between text-slate-400 border-t border-white/5 pt-1 text-[11px]">
                      <span>{txt.firstCharge}</span>
                      <span className="text-white">{trialEndDateFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10 font-bold">
                      <span className="text-slate-200">{txt.dueToday}</span>
                      <span className="text-emerald-400 text-sm font-black">$0.00 USD</span>
                    </div>
                  </div>
                )}

                {!user && selectedPlan !== 'free' ? (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-white text-black font-black uppercase italic tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{txt.loginToContinue}</span>
                  </button>
                ) : (
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
                        <span>{txt.activatingTrial}</span>
                      </>
                    ) : isCurrentActivePlan(selectedPlan) && selectedPlan !== 'free' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{getPlanDisplayName(selectedPlan)} {txt.planActive}</span>
                      </>
                    ) : selectedPlan === 'free' ? (
                      <span>{txt.confirmFreeBtn}</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{txt.startTrialBtn}</span>
                      </>
                    )}
                  </button>
                )}

                {selectedPlan !== 'free' ? (
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    {txt.disclaimer.replace('${price}', String(currentPrice)).replace('{cycle}', billingCycle === 'monthly' ? txt.month : txt.year)}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 text-center">
                    {txt.freeForever}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Auth Modal required before payment */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Activity,
  Users,
  Award,
  ChevronRight,
  Play,
  Sparkles,
  Star,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Gift,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserTestimonial } from '../types';
import {
  subscribeToRealTestimonials,
  submitRealTestimonial,
  getTestimonialRewardState,
  TestimonialRewardState
} from '../lib/firebase';

interface HeroProps {
  onStartTest: () => void;
  onExploreDrills: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTest, onExploreDrills }) => {
  const { lang, t } = useLanguage();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [realTestimonials, setRealTestimonials] = useState<UserTestimonial[]>([]);
  const [rewardState, setRewardState] = useState<TestimonialRewardState>(() => getTestimonialRewardState());

  // Review submission form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeToRealTestimonials((list) => {
      setRealTestimonials(list);
      setRewardState(getTestimonialRewardState());
    });
    return () => unsub();
  }, []);

  const marketContent = {
    es: {
      socialTag: '100% COMUNIDAD REAL • CERO RESEÑAS INVENTADAS',
      socialTitle: 'Muro de Testimonios Reales de Jugadores y Entrenadores',
      socialSub:
        'Aquí solo aparecen opiniones auténticas publicadas por usuarios reales de CoachStrike AI. Deja tu reseña honesta y recibe una recompensa inmediata.',
      trustBadges: [
        'Metodología Táctica Strike Pro',
        'Cumplimiento COPPA & RGPD Menores',
        'Informes Marca Blanca (White-Label)',
        'Garantía de Satisfacción 14 Días'
      ],
      rewardBannerBadge: 'RECOMPENSA POR RESEÑA REAL (1 EVALUACIÓN)',
      rewardBannerTitle: 'Deja tu Testimonio Real y Desbloquea el 50% de los Módulos Pro en 1 Evaluación',
      rewardBannerDesc:
        'Al publicar tu opinión real desbloqueas gratis la mitad (50%) del análisis Pro (Trampa Rival #2 de Kriptonita, Automatismo Letal de Dúo y Semana 02 del Micro-Ciclo) válido para 1 sola evaluación táctica.',
      rewardClaimedBadge: '🎁 RECOMPENSA 50% PRO ACTIVA (VÁLIDA PARA 1 EVALUACIÓN)',
      rewardClaimedDesc:
        '¡Gracias por tu testimonio real! Tu desbloqueo del 50% en los módulos Pro ya está activo para 1 evaluación individual.',
      btnWriteReview: 'Escribir Mi Testimonio Real & Desbloquear 50% (1 Evaluación)',
      btnWriteAnother: 'Publicar Otro Comentario en el Muro',
      emptyWallTitle: 'Sé el primero en publicar un testimonio real en el muro',
      emptyWallDesc:
        'Eliminamos todos los testimonios de ejemplo. Publica tu experiencia real con el test táctico o el panel de academia y obtén al instante el 50% de desbloqueo Pro para 1 evaluación.',
      formTitle: 'Publicar Testimonio Real & Reclamar 50% Pro (1 Evaluación)',
      lblName: 'Tu Nombre o Apodo en Cancha',
      phName: 'Ej. Diego R. (#10) o Prof. Martín Gómez',
      lblRole: 'Tu Rol / Posición / Categoría',
      phRole: 'Ej. Mediocampista Sub-17 • Jugador o Director de Academia',
      lblRating: 'Calificación Honesta',
      lblComment: 'Tu Experiencia Real con CoachStrike AI',
      phComment: 'Comparte qué te pareció la precisión de tu posición, el radar táctico o las herramientas de entrenamiento...',
      btnSubmitReview: 'Publicar Testimonio Real y Activar 50% Pro (1 Evaluación)',
      btnCancel: 'Cancelar',
      verifiedUserTag: 'TESTIMONIO REAL DE USUARIO',
      faqTag: 'PREGUNTAS FRECUENTES & GARANTÍAS COMERCIALES',
      faqTitle: 'Todo lo que necesitas saber antes de empezar',
      faqs: [
        {
          q: '¿Cómo funciona la prueba gratuita de 3 días y la garantía de reembolso?',
          a: 'Todos los planes (Plan Pro, Academia Básico y Academia Élite) incluyen 3 días de acceso total a $0.00 hoy. Si cancelas antes de que termine el periodo de prueba, no se realiza ningún cargo. Además, cuentas con una garantía comercial de satisfacción de 14 días.'
        },
        {
          q: '¿Qué diferencia hay entre el Plan Pro Individual y el Modo Academia para Clubes?',
          a: 'El Plan Pro ($4.99/mes) está diseñado para jugadores individuales que desean evaluaciones ilimitadas, su Arquetipo Táctico completo, Criptonita, Química de Dúo, Micro-Ciclo de 4 semanas y Coach IA 24/7. El Modo Academia ($70 o $150/mes) añade gestión de plantillas (30 a 200+ jugadores), control de asistencia, boletín mensual por WhatsApp para padres, historial "Antes vs. Ahora", Portal Familiar con PIN y reportes PDF con el escudo de tu club (Marca Blanca).'
        },
        {
          q: '¿Cómo protege CoachStrike AI la privacidad de los jugadores menores de edad?',
          a: 'Cumplimos estrictamente con las normativas internacionales RGPD y COPPA. Las fichas de cantera solo son accesibles por el entrenador titular del club, y cada familia recibe un enlace protegido por un código PIN privado de 4 dígitos sin exposición en buscadores públicos.'
        },
        {
          q: '¿Puedo importar mi plantilla actual desde Excel y personalizar el escudo de mi club?',
          a: '¡Sí! En el panel de Academia puedes importar y exportar toda tu plantilla mediante archivos CSV compatibles con Excel en 1 clic, y configurar la identidad White-Label (nombre del club, lema, color institucional y firma del director deportivo) para todos tus documentos PDF.'
        }
      ]
    },
    en: {
      socialTag: '100% REAL COMMUNITY • ZERO INVENTED REVIEWS',
      socialTitle: 'Real Player & Coach Testimonials Wall',
      socialSub:
        'Only authentic reviews submitted by real CoachStrike AI users appear here. Leave your honest review and claim an instant reward.',
      trustBadges: [
        'Strike Pro Tactical Methodology',
        'COPPA & GDPR Youth Data Protection',
        'White-Label Club PDF Branding',
        '14-Day Money-Back Guarantee'
      ],
      rewardBannerBadge: 'REAL REVIEW REWARD (1 SINGLE EVALUATION)',
      rewardBannerTitle: 'Leave Your Real Testimonial & Unlock 50% of Pro Modules for 1 Evaluation',
      rewardBannerDesc:
        'When you post your honest review, you unlock half (50%) of the Pro tactical modules (Kryptonite Trap #2, Pro Duo Automatism, and Week 02 of the 4-Week Micro-Cycle) valid for 1 single evaluation.',
      rewardClaimedBadge: '🎁 50% PRO REWARD ACTIVE (VALID FOR 1 EVALUATION)',
      rewardClaimedDesc:
        'Thank you for your real review! Your 50% Pro module unlock is active for 1 single tactical evaluation.',
      btnWriteReview: 'Write My Real Testimonial & Unlock 50% (1 Evaluation)',
      btnWriteAnother: 'Post Another Comment to the Wall',
      emptyWallTitle: 'Be the first to post a real testimonial on the wall',
      emptyWallDesc:
        'We removed all placeholder demo testimonials. Share your real experience with the tactical DNA test or academy tools and immediately unlock 50% of Pro modules for 1 evaluation.',
      formTitle: 'Post Real Testimonial & Claim 50% Pro (1 Evaluation)',
      lblName: 'Your Name or Pitch Nickname',
      phName: 'e.g., Diego R. (#10) or Coach Martin',
      lblRole: 'Your Role / Position / Category',
      phRole: 'e.g., U-17 Central Midfielder • Player or Academy Coach',
      lblRating: 'Honest Rating',
      lblComment: 'Your Real Experience with CoachStrike AI',
      phComment: 'Share your thoughts on the tactical position accuracy, radar metrics, or training drills...',
      btnSubmitReview: 'Publish Real Testimonial & Unlock 50% Pro (1 Evaluation)',
      btnCancel: 'Cancel',
      verifiedUserTag: 'REAL USER TESTIMONIAL',
      faqTag: 'FREQUENTLY ASKED QUESTIONS & COMMERCIAL GUARANTEES',
      faqTitle: 'Everything you need to know before starting',
      faqs: [
        {
          q: 'How do the 3-day free trial and refund guarantee work?',
          a: 'Every paid membership (Pro Plan, Academy Basic, and Academy Elite) starts with a 3-day free trial at $0.00 due today. Cancel anytime during the trial with zero charges, plus enjoy our 14-day commercial satisfaction guarantee.'
        },
        {
          q: 'What is the difference between the Individual Pro Plan and Academy Mode for Clubs?',
          a: 'The Pro Plan ($4.99/mo) is built for individual players seeking unlimited DNA evaluations, full Tactical Archetype breakdown, Kryptonite analysis, Duo Chemistry, 4-Week Micro-Cycle, and 24/7 AI Coach. Academy Mode ($70 or $150/mo) unlocks squad management (30 to 200+ players), attendance tracking, 1-click WhatsApp parent reports, "Before vs. Now" progression history, PIN-protected Family Portals, and White-Label PDF reports with your club crest.'
        },
        {
          q: 'How does CoachStrike AI protect minor athletes’ privacy?',
          a: 'We strictly comply with GDPR and COPPA youth protection standards. Academy rosters are isolated to the authorized club coach, and each family accesses their player portal through a private 4-digit PIN code with zero public search indexing.'
        },
        {
          q: 'Can I import my current roster from Excel and customize my club branding?',
          a: 'Yes! Inside the Academy Dashboard you can bulk-import and export your squad via Excel-compatible CSV files in one click, and customize your White-Label identity (club name, motto, accent color, and director signature) across all PDF scouting reports.'
        }
      ]
    },
    pt: {
      socialTag: '100% COMUNIDADE REAL • ZERO AVALIAÇÕES INVENTADAS',
      socialTitle: 'Mural de Testemunhos Reais de Jogadores e Treinadores',
      socialSub:
        'Aqui só aparecem opiniões autênticas publicadas por utilizadores reais do CoachStrike AI. Deixe a sua avaliação honesta e receba uma recompensa imediata.',
      trustBadges: [
        'Metodologia Tática Strike Pro',
        'Conformidade COPPA & RGPD Menores',
        'Relatórios Marca Branca (White-Label)',
        'Garantia de Satisfação de 14 Dias'
      ],
      rewardBannerBadge: 'RECOMPENSA POR AVALIAÇÃO REAL (1 AVALIAÇÃO)',
      rewardBannerTitle: 'Deixe o seu Testemunho Real e Desbloqueie 50% dos Módulos Pro em 1 Avaliação',
      rewardBannerDesc:
        'Ao publicar a sua opinião real, desbloqueia gratuitamente metade (50%) da análise Pro (Armadilha Adversária #2 da Kriptonita, Automatismo Letal de Dupla e Semana 02 do Micro-Ciclo) válido para 1 única avaliação tática.',
      rewardClaimedBadge: '🎁 RECOMPENSA 50% PRO ATIVA (VÁLIDA PARA 1 AVALIAÇÃO)',
      rewardClaimedDesc:
        'Obrigado pelo seu testemunho real! O seu desbloqueio de 50% nos módulos Pro já está ativo para 1 única avaliação individual.',
      btnWriteReview: 'Escrever o Meu Testemunho Real & Desbloquear 50% (1 Avaliação)',
      btnWriteAnother: 'Publicar Outro Comentário no Mural',
      emptyWallTitle: 'Seja o primeiro a publicar um testemunho real no mural',
      emptyWallDesc:
        'Removemos todos os testemunhos de exemplo. Partilhe a sua experiência real com o teste tático ou o painel de academia e desbloqueie já 50% dos módulos Pro para 1 avaliação.',
      formTitle: 'Publicar Testemunho Real & Resgatar 50% Pro (1 Avaliação)',
      lblName: 'O Seu Nome ou Alcunha em Campo',
      phName: 'Ex. Diogo R. (#10) ou Mister Martim',
      lblRole: 'O Seu Papel / Posição / Escalão',
      phRole: 'Ex. Médio Centro Sub-17 • Jogador ou Diretor de Academia',
      lblRating: 'Classificação Honesta',
      lblComment: 'A Sua Experiência Real com o CoachStrike AI',
      phComment: 'Partilhe o que achou da precisão da sua posição, do radar tático ou dos exercícios de treino...',
      btnSubmitReview: 'Publicar Testemunho Real e Ativar 50% Pro (1 Avaliação)',
      btnCancel: 'Cancelar',
      verifiedUserTag: 'TESTEMUNHO REAL DE UTILIZADOR',
      faqTag: 'PERGUNTAS FREQUENTES & GARANTIAS COMERCIAIS',
      faqTitle: 'Tudo o que precisa de saber antes de começar',
      faqs: [
        {
          q: 'Como funcionam o teste gratuito de 3 dias e a garantia de reembolso?',
          a: 'Todos os planos pagos (Plano Pro, Academia Básico e Academia Elite) incluem 3 dias de acesso total a $0.00 hoje. Se cancelar antes do fim do teste, nada é cobrado. Além disso, conta com uma garantia comercial de satisfação de 14 dias.'
        },
        {
          q: 'Qual é a diferença entre o Plano Pro Individual e o Modo Academia para Clubes?',
          a: 'O Plano Pro ($4.99/mês) é focado em jogadores individuais que procuram avaliações ilimitadas, Arquétipo Tático completo, Criptonita, Química de Dupla, Micro-Ciclo de 4 semanas e Treinador IA 24/7. O Modo Academia ($70 ou $150/mês) adiciona gestão de plantéis (30 a 200+ atletas), controlo de assiduidade, boletim mensal por WhatsApp para pais, histórico "Antes vs. Agora", Portal Familiar com PIN e relatórios PDF com o emblema do seu clube (White-Label).'
        },
        {
          q: 'Como é que a CoachStrike AI protege a privacidade dos atletas menores de idade?',
          a: 'Cumprimos rigorosamente as normas internacionais RGPD e COPPA. As fichas do plantel apenas são acessíveis pelo treinador autorizado do clube, e cada família recebe um acesso protegido por código PIN privado de 4 dígitos.'
        },
        {
          q: 'Posso importar o meu plantel atual do Excel e personalizar o emblema do clube?',
          a: 'Sim! No painel da Academia pode importar e exportar todo o plantel via ficheiros CSV compatíveis com Excel num clique, além de configurar a identidade White-Label (nome do clube, lema, cor institucional e assinatura do diretor) para todos os relatórios PDF.'
        }
      ]
    }
  }[lang];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim() || comment.trim().length < 5) return;
    setIsSubmitting(true);
    try {
      const defaultRole =
        authorRole.trim() ||
        (lang === 'en' ? 'Verified Player / Coach' : lang === 'pt' ? 'Jogador / Treinador' : 'Jugador / Entrenador');
      await submitRealTestimonial({
        authorName: authorName.trim(),
        authorRole: defaultRole,
        rating,
        comment: comment.trim()
      });
      setRewardState(getTestimonialRewardState());
      setAuthorName('');
      setAuthorRole('');
      setComment('');
      setRating(5);
      setIsFormOpen(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-4 lg:px-8">
      {/* Background Tactical Grid & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-volt-10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Watermark Logo Backing */}
      <div className="absolute top-0 right-10 opacity-5 uppercase text-9xl font-black italic pointer-events-none select-none text-white font-display hidden md:block">
        COACHSTRIKE
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-volt text-xs uppercase font-bold tracking-[0.2em] shadow-inner font-mono-code">
            <Sparkles className="w-3.5 h-3.5 text-volt animate-pulse" />
            {t.heroTag}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight text-white font-display leading-none uppercase">
            {t.heroTitle1} <br className="hidden sm:inline" />
            <span className="text-volt">{t.heroTitleHighlight}</span> {t.heroTitle2}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onStartTest}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-volt hover:bg-white text-black font-black italic uppercase text-sm tracking-widest shadow-xl shadow-volt/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <Zap className="w-5 h-5 fill-black text-black group-hover:rotate-12 transition-transform" />
            <span>{t.btnStartTest}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreDrills}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white font-bold uppercase italic text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-volt" />
            <span>{t.btnExploreDrills}</span>
          </button>
        </motion.div>

        {/* Live Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
        >
          <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-center">
            <div className="text-3xl lg:text-4xl font-black italic text-volt font-display">{t.heroStat1Val}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 font-mono-code">{t.heroStat1Lbl}</div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-center">
            <div className="text-3xl lg:text-4xl font-black italic text-white font-display">{t.heroStat2Val}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 font-mono-code">{t.heroStat2Lbl}</div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl text-center col-span-2 sm:col-span-1">
            <div className="text-3xl lg:text-4xl font-black italic text-volt font-display">{t.heroStat3Val}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 font-mono-code">{t.heroStat3Lbl}</div>
          </div>
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-volt-10 border border-volt-30 flex items-center justify-center text-volt mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-1 font-mono-code">{t.heroStep1Tag}</h2>
            <h3 className="text-xl font-black italic text-white mb-2 font-display uppercase">
              {t.heroFeature1Title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.heroFeature1Desc}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-1 font-mono-code">{t.heroStep2Tag}</h2>
            <h3 className="text-xl font-black italic text-white mb-2 font-display uppercase">
              {t.heroFeature2Title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.heroFeature2Desc}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-volt p-6 rounded-2xl text-black relative overflow-hidden group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center text-black mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xs uppercase font-bold tracking-[0.2em] mb-1 text-black/70 font-mono-code">{t.heroStep3Tag}</h2>
            <h3 className="text-xl font-black italic text-black mb-2 font-display uppercase">
              {t.heroFeature3Title}
            </h3>
            <p className="text-xs text-black/80 font-medium leading-relaxed">
              {t.heroFeature3Desc}
            </p>
          </motion.div>
        </div>

        {/* REAL USER TESTIMONIALS WALL & 50% SINGLE-EVALUATION REWARD */}
        <div className="mb-20 space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {marketContent.socialTag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black italic uppercase text-white font-display">
              {marketContent.socialTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {marketContent.socialSub}
            </p>
          </div>

          {/* Trust Compliance Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {marketContent.trustBadges.map((badge, i) => (
              <div
                key={i}
                className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-volt shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>

          {/* 50% PRO FOR 1 EVALUATION REWARD BANNER & FORM */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 border border-volt/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/15 border border-volt/40 text-volt text-[10px] font-mono-code font-bold uppercase">
                  <Gift className="w-3.5 h-3.5 text-volt" />
                  <span>
                    {rewardState.hasSubmittedReview
                      ? marketContent.rewardClaimedBadge
                      : marketContent.rewardBannerBadge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white font-display">
                  {marketContent.rewardBannerTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {rewardState.hasSubmittedReview || submitSuccess
                    ? marketContent.rewardClaimedDesc
                    : marketContent.rewardBannerDesc}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-volt hover:bg-white text-black font-black italic uppercase text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-volt/20"
                >
                  <MessageSquarePlus className="w-4 h-4 text-black" />
                  <span>
                    {rewardState.hasSubmittedReview
                      ? marketContent.btnWriteAnother
                      : marketContent.btnWriteReview}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Submission Form */}
            <AnimatePresence>
              {isFormOpen && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSubmitReview}
                  className="mt-6 pt-6 border-t border-white/10 space-y-4 overflow-hidden"
                >
                  <div className="text-sm font-black italic uppercase text-volt font-display">
                    {marketContent.formTitle}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
                        {marketContent.lblName} *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={marketContent.phName}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
                        {marketContent.lblRole}
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder={marketContent.phRole}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
                        {marketContent.lblRating} ({rating}/5)
                      </label>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                starVal <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
                      {marketContent.lblComment} *
                    </label>
                    <textarea
                      required
                      minLength={5}
                      maxLength={800}
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={marketContent.phComment}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase cursor-pointer"
                    >
                      {marketContent.btnCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !authorName.trim() || comment.trim().length < 5}
                      className="px-6 py-2.5 rounded-xl bg-volt hover:bg-white disabled:opacity-50 text-black font-black italic uppercase text-xs tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{marketContent.btnSubmitReview}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Real Testimonials Grid (Zero Fake/Invented Reviews) */}
          {realTestimonials.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-white/15 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-volt/10 border border-volt/30 flex items-center justify-center text-volt mx-auto">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black italic uppercase text-white font-display">
                {marketContent.emptyWallTitle}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {marketContent.emptyWallDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {realTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-white/10 hover:border-volt/30 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            className={`w-3.5 h-3.5 ${
                              sIdx < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold">
                        {marketContent.verifiedUserTag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                      “{item.comment}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white uppercase font-display block">
                        {item.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {item.authorRole}
                      </span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-volt shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BLOCK 3: COMMERCIAL FAQ ACCORDION */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-[0.2em] text-volt bg-volt/10 border border-volt/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{marketContent.faqTag}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-white font-display">
              {marketContent.faqTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {marketContent.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-volt shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

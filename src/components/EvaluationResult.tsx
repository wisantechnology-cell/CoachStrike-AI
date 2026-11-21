import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Sparkles, UserCheck, ShieldCheck, Flame, ChevronRight, 
  RotateCcw, Bookmark, Share2, BookOpen, AlertCircle, CheckCircle2,
  Zap, Award, Play, Users, FileDown, Download, Link2, Check, Globe,
  Lock, ShieldAlert, Target, Calendar, Camera, Gift, Star, MessageSquarePlus, Send
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { getLocalizedDrills } from '../data/drills';
import { RadarChart } from './RadarChart';
import { TacticalPitch } from './TacticalPitch';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TacticalTerm } from './TacticalTerm';
import { PositionDeepDiveModal } from './PositionDeepDiveModal';
import { ShareReportModal } from './ShareReportModal';
import { generatePdfReport } from '../utils/pdfGenerator';
import { copyReportLinkToClipboard, buildReportShareUrl } from '../utils/shareLink';
import {
  getTestimonialRewardState,
  bindPendingRewardToEvaluation,
  submitRealTestimonial,
  TestimonialRewardState
} from '../lib/firebase';

interface EvaluationResultProps {
  result: AssessmentResult;
  onRepeatTest: () => void;
  onSaveProfile: (result: AssessmentResult) => void;
  isSaved?: boolean;
  onOpenPricing?: () => void;
  isSharedView?: boolean;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  result,
  onRepeatTest,
  onSaveProfile,
  isSaved = false,
  onOpenPricing,
  isSharedView = false
}) => {
  const { lang, t } = useLanguage();
  const { isPro, isAcademy, plan } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // 50% Single-Evaluation Review Reward State
  const [rewardState, setRewardState] = useState<TestimonialRewardState>(() => getTestimonialRewardState());
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState(result.playerName || '');
  const [reviewRole, setReviewRole] = useState(
    `${result.primaryPosition.title} (${result.primaryPosition.code})`
  );
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    // If user submitted a review on the home page before taking an evaluation ('PENDING_NEXT_EVAL'),
    // bind that reward strictly to THIS single evaluation ID so it works for 1 evaluation only
    const bound = bindPendingRewardToEvaluation(result.id);
    setRewardState(bound);

    const handleSync = () => setRewardState(getTestimonialRewardState());
    if (typeof window !== 'undefined') {
      window.addEventListener('coachstrike_testimonial_updated', handleSync);
      return () => window.removeEventListener('coachstrike_testimonial_updated', handleSync);
    }
  }, [result.id]);

  const handleClaimHalfProViaReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || reviewComment.trim().length < 5) return;
    setIsSubmittingReview(true);
    try {
      await submitRealTestimonial(
        {
          authorName: reviewName.trim(),
          authorRole: reviewRole.trim() || `${result.primaryPosition.title} (${result.primaryPosition.code})`,
          rating: reviewRating,
          comment: reviewComment.trim()
        },
        result.id // Bind strictly to THIS single evaluation ID
      );
      setRewardState(getTestimonialRewardState());
      setIsReviewFormOpen(false);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatFoot = (foot?: string) => {
    if (!foot) return '--';
    const f = foot.toLowerCase();
    if (f.includes('die') || f.includes('righ') || f.includes('dest')) {
      return lang === 'en' ? 'Right' : lang === 'pt' ? 'Destro' : 'Diestro';
    }
    if (f.includes('zur') || f.includes('left') || f.includes('canh')) {
      return lang === 'en' ? 'Left' : lang === 'pt' ? 'Canhoto' : 'Zurdo';
    }
    if (f.includes('ambi') || f.includes('both')) {
      return lang === 'en' ? 'Both' : lang === 'pt' ? 'Ambidestro' : 'Ambidestro';
    }
    return foot;
  };

  const getShareContent = () => {
    const shareUrl = buildReportShareUrl(result);
    const title = `${result.playerName} - ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}%) | CoachStrike AI`;
    const text = lang === 'en'
      ? `⚡ My Football Tactical DNA Scouting Report on CoachStrike AI:\n⚽ Position: ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}% Match)\n🌟 Pro Benchmark: ${result.proComparison.player.name}\nCheck out the full interactive dossier:`
      : lang === 'pt'
      ? `⚡ O meu Relatório Oficial de Scouting e ADN Tático no CoachStrike AI:\n⚽ Posição: ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}% Compatibilidade)\n🌟 Comparativa Pro: ${result.proComparison.player.name}\nVeja o dossier completo interativo:`
      : `⚡ Mi Informe Oficial de Scouting y ADN Táctico en CoachStrike AI:\n⚽ Posición Ideal: ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}% Compatibilidad)\n🌟 Comparativa Pro: ${result.proComparison.player.name}\nDescubre mi dossier técnico completo:`;
    return { shareUrl, title, text };
  };

  const handleNativeWebShare = async () => {
    const { shareUrl, title, text } = getShareContent();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${text}\n${shareUrl}`,
          url: shareUrl
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          await handleCopyDirectLink();
        }
      }
    } else {
      await handleCopyDirectLink();
    }
  };

  const handleShareWhatsApp = () => {
    const { shareUrl, text } = getShareContent();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareX = () => {
    const { shareUrl, text } = getShareContent();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=CoachStrikeAI,FootballScouting,TacticalDNA`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const { shareUrl } = getShareContent();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDirectLink = async () => {
    await copyReportLinkToClipboard(result);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 3000);
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generatePdfReport(result, lang);
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 800);
    }
  };

  const handleGenerateAIReport = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/evaluate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: result.playerName,
          preferredFoot: result.preferredFoot,
          primaryPosition: result.primaryPosition,
          skills: result.skills,
          answersSummary: result.answers,
          lang
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      } else {
        setAiError(
          lang === 'en'
            ? 'Could not connect to AI engine. Local backup assessment loaded.'
            : lang === 'pt'
            ? 'Não foi possível ligar ao motor de IA. Foi carregada a avaliação local de segurança.'
            : 'No se pudo establecer conexión con el motor IA. Se ha generado la evaluación local de respaldo.'
        );
      }
    } catch (err: any) {
      console.error(err);
      setAiError(
        lang === 'en'
          ? 'AI Service in maintenance. Local data is fully accurate.'
          : lang === 'pt'
          ? 'Serviço de IA em manutenção. Os dados locais são totalmente precisos.'
          : 'Servicio de IA en mantenimiento. Los datos locales son completamente precisos.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Shared Report Top Notification Banner if opened via public link */}
      {isSharedView && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-volt/20 via-sky-500/15 to-transparent border border-volt/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-volt flex items-center justify-center text-black shrink-0 font-bold">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-volt uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                {lang === 'en' ? 'SHARED SCOUTING REPORT (PUBLIC VIEW)' : lang === 'pt' ? 'RELATÓRIO DE SCOUTING PARTILHADO (VISUALIZAÇÃO PÚBLICA)' : 'INFORME DE SCOUTING COMPARTIDO (VISTA PÚBLICA)'}
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                {lang === 'en'
                  ? `Viewing complete tactical dossier of ${result.playerName} • Archetype: ${result.primaryPosition.title}`
                  : lang === 'pt'
                  ? `A visualizar o dossier tático completo de ${result.playerName} • Arquétipo: ${result.primaryPosition.title}`
                  : `Visualizando el dossier táctico completo de ${result.playerName} • Arquetipo: ${result.primaryPosition.title}`}
              </p>
            </div>
          </div>
          <button
            onClick={onRepeatTest}
            className="px-4 py-2 rounded-xl bg-volt hover:bg-white text-black font-black italic uppercase text-xs tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md shadow-volt/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{lang === 'en' ? 'Take Free Test' : lang === 'pt' ? 'Fazer Teste Grátis' : 'Hacer Mi Propio Test'}</span>
          </button>
        </motion.div>
      )}

      {/* Top Banner & Header Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 uppercase text-6xl font-black italic -rotate-12 pointer-events-none select-none text-white font-display">
          CORE
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-volt font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono-code">
                <Trophy className="w-3.5 h-3.5 text-volt" />
                {t.resultHeaderTag} #STK-{result.id.slice(-4)}
              </span>
              <span className="text-xs text-slate-500 font-mono-code">{result.createdAt}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black italic text-white font-display tracking-tight uppercase">
              {result.playerName}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>{t.footLabel} <strong className="text-volt">{formatFoot(result.preferredFoot)}</strong></span>
            </div>
          </div>

          {/* Action Bar - Organized Horizontally in a Single Row */}
          <div className="flex flex-row items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar flex-nowrap py-1">
            {/* 1. Save Profile / Guardar Reporte (Primer Botón) */}
            <button
              onClick={() => onSaveProfile(result)}
              disabled={isSaved}
              className={`px-3.5 py-2.5 rounded-xl font-black italic uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-md ${
                isSaved
                  ? 'bg-white/10 text-slate-300 border border-white/10 shadow-none'
                  : 'bg-volt hover:bg-white text-black shadow-volt/20'
              }`}
              title={isSaved ? t.btnSaved : t.btnSaveReport}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'text-volt' : 'text-black'}`} />
              <span>{isSaved ? t.btnSaved : t.btnSaveReport}</span>
            </button>

            {/* 2. Tarjeta Stories / 16Personalities DNA Card */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-volt/20 hover:from-sky-500/30 hover:to-volt/30 border border-volt/40 text-volt font-black italic text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              title={lang === 'en' ? 'Open Stories Card & 16Personalities DNA' : lang === 'pt' ? 'Abrir Cartão Stories & ADN' : 'Abrir Tarjeta Stories (9:16) & ADN'}
            >
              <Camera className="w-4 h-4 text-volt" />
              <span>{lang === 'en' ? 'Stories Card' : lang === 'pt' ? 'Cartão Stories' : 'Tarjeta Stories'}</span>
            </button>

            {/* 3. Native Web Share Button */}
            <button
              onClick={handleNativeWebShare}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-white/30 whitespace-nowrap shrink-0"
              title={lang === 'en' ? 'Share report with Web Share API' : lang === 'pt' ? 'Partilhar com Web Share' : 'Compartir informe con Web Share'}
            >
              <Share2 className="w-4 h-4 text-volt" />
              <span>{lang === 'en' ? 'Share' : lang === 'pt' ? 'Partilhar' : 'Compartir'}</span>
            </button>

            {/* 3. Direct Copy Link Button */}
            <button
              onClick={handleCopyDirectLink}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-volt/50 whitespace-nowrap shrink-0"
              title={lang === 'en' ? 'Copy link to view entire report directly' : lang === 'pt' ? 'Copiar link para ver relatório completo' : 'Copiar enlace para ver el informe completo'}
            >
              {isLinkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-volt" />}
              <span>
                {isLinkCopied 
                  ? (lang === 'en' ? 'Link Copied!' : lang === 'pt' ? 'Link Copiado!' : '¡Enlace Copiado!')
                  : (lang === 'en' ? 'Copy Link' : lang === 'pt' ? 'Copiar Link' : 'Copiar Link Informe')}
              </span>
            </button>

            {/* 4. Download Official PDF Report */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-white/30 whitespace-nowrap shrink-0"
              title={lang === 'en' ? 'Download Official Strike Pro PDF Scouting Report' : lang === 'pt' ? 'Descarregar Relatório Oficial PDF' : 'Descargar Informe Oficial PDF Strike Pro'}
            >
              <FileDown className={`w-4 h-4 text-volt ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPdf ? (lang === 'en' ? 'Creating PDF...' : lang === 'pt' ? 'A gerar PDF...' : 'Generando PDF...') : (lang === 'en' ? 'PDF Report' : lang === 'pt' ? 'Ficha PDF' : 'Informe PDF')}</span>
            </button>

            {/* 5. Repeat Assessment */}
            <button
              onClick={onRepeatTest}
              className="px-3 py-2.5 rounded-xl bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-volt" />
              <span>{t.btnRepeatTest}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Bar with Direct Token Sharing */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 -mx-6 sm:-mx-10 px-6 sm:px-10 py-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
            <span>{lang === 'en' ? 'Direct Social Share:' : lang === 'pt' ? 'Partilha Direta:' : 'Compartir Directo:'}</span>
          </div>

          <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap w-full sm:w-auto py-0.5">
            {/* WhatsApp Direct Share */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 whitespace-nowrap shrink-0"
              title="Share report to WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* X Direct Share */}
            <button
              onClick={handleShareX}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 whitespace-nowrap shrink-0"
              title="Share report to X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X</span>
            </button>

            {/* LinkedIn Direct Share */}
            <button
              onClick={handleShareLinkedIn}
              className="px-3 py-1.5 rounded-lg bg-[#0077B5]/15 hover:bg-[#0077B5]/25 border border-[#0077B5]/40 text-[#0077B5] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 whitespace-nowrap shrink-0"
              title="Share report to LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </button>

            {/* Web Share Native / More Options */}
            <button
              onClick={handleNativeWebShare}
              className="px-3 py-1.5 rounded-lg bg-volt/15 hover:bg-volt/25 border border-volt/40 text-volt text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 whitespace-nowrap shrink-0"
              title="Web Share API / More platforms"
            >
              <Share2 className="w-3.5 h-3.5 text-volt" />
              <span>Web Share</span>
            </button>
          </div>
        </div>

        {/* Primary Position Match Highlight */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs uppercase font-bold text-volt tracking-[0.2em] font-mono-code">
              {lang === 'en' ? 'Primary Ideal Position' : lang === 'pt' ? 'Posição Ideal Principal' : 'Posición Ideal Principal'}
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-black italic text-white font-display uppercase leading-none">
                {result.primaryPosition.title}
              </h2>
              <span className="px-3 py-1 bg-volt text-black text-xs font-black uppercase font-mono-code rounded">
                {result.primaryPosition.matchPercentage}% {t.matchScore}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {result.primaryPosition.roleDescription}
            </p>
          </div>

          {/* Secondary positions pills */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono-code">
              {lang === 'en' ? 'Secondary Positions' : lang === 'pt' ? 'Posições Secundárias' : 'Posiciones Secundarias'}
            </div>
            <div className="space-y-2">
              {result.secondaryPositions.map((sec, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-white/5">
                  <span className="font-bold text-slate-200 uppercase italic">{sec.title}</span>
                  <span className="text-volt font-mono-code font-bold">{sec.matchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Radar Chart, Pro Player Matchup, & Improvement Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Component */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
              <Zap className="w-4 h-4 text-volt" />
              {t.radarTitle} (8D)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono-code bg-black/40 px-2 py-1 rounded">
              {lang === 'en' ? 'RANGE 0-99' : lang === 'pt' ? 'INTERVALO 0-99' : 'RANGO 0-99'}
            </span>
          </div>

          <RadarChart
            playerScores={result.skills}
            proScores={result.proComparison.player.stats}
            proPlayerName={result.proComparison.player.name}
          />

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'en' ? 'PAC / Pace' : 'PAC / Vel'}</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.speed}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'en' ? 'TEC / Skill' : 'TEC / Téc'}</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.technique}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'en' ? 'PAS / Vision' : lang === 'pt' ? 'PAS / Visão' : 'PAS / Vis'}</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.passing}</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'en' ? 'TAC / IQ' : 'TAC / IQ'}</div>
              <div className="text-lg font-black italic text-volt font-display">{result.skills.tacticalIQ}</div>
            </div>
          </div>
        </div>

        {/* Pro Player Match & Improvement Focus Cards */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Elite Matchup */}
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-4 font-mono-code">
              {t.proComparisonTitle}
            </h2>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
              <img
                src={result.proComparison.player.avatarUrl}
                alt={result.proComparison.player.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-volt shrink-0"
              />
              <div>
                <div className="text-lg font-black uppercase italic font-display">{result.proComparison.player.name}</div>
                <div className="text-xs text-slate-400 uppercase font-semibold">{result.proComparison.player.club}</div>
                <div className="mt-1.5 inline-block px-2 py-0.5 bg-volt text-black text-[10px] font-bold rounded font-mono-code">
                  {result.proComparison.matchPercentage}% {lang === 'en' ? 'AFFINITY' : lang === 'pt' ? 'AFINIDADE' : 'AFINIDAD'}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-3">
              {result.proComparison.matchReason}
            </p>
          </div>

          {/* Immersive UI Focus Box */}
          <div className="bg-volt p-6 rounded-2xl text-black">
            <h2 className="text-xs uppercase font-black tracking-widest mb-4 text-black/80 font-mono-code">
              {t.areasToImprove}
            </h2>
            <ul className="space-y-3">
              {result.areasToImprove.slice(0, 3).map((area, idx) => (
                <li key={idx} className="flex justify-between items-center border-b border-black/10 pb-2">
                  <span className="font-extrabold uppercase text-xs italic font-display">{area}</span>
                  <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-mono-code font-bold">
                    +{10 + idx * 4}% REQ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Position Dribbles & Pro Inspiration Deep Dive Banner */}
      <div className="bg-slate-900/60 border border-volt/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-volt flex items-center justify-center text-black font-black text-xl font-display transform -skew-x-6 shadow-md shadow-volt/20 shrink-0">
            <Flame className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-volt font-mono-code flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'en' ? 'DEEP DIVE & 1V1 TACTICAL DRIBBLES' : lang === 'pt' ? 'ANÁLISE PROFUNDA & RECURSOS 1V1' : 'ANÁLISIS PROFUNDO & RECURSOS 1V1'}
              </span>
            </div>
            <h3 className="text-xl font-black italic text-white font-display uppercase tracking-tight">
              {lang === 'en'
                ? 'Most Effective Dribbles & What to Learn From the Pros'
                : lang === 'pt'
                ? 'Dribles Mais Eficazes & O que Copiar dos Pros'
                : 'Regates Más Eficaces & En Qué Copiar a los Pros'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {lang === 'en'
                ? `Discover high-efficiency 1v1 moves for your position of ${result.primaryPosition.title} and the exact habits and movements to study from top world stars.`
                : lang === 'pt'
                ? `Descubra os movimentos técnicos com maior taxa de sucesso para a sua posição de ${result.primaryPosition.title} e o guia de hábitos a copiar dos craques mundiais.`
                : `Descubre los movimientos técnicos con mayor porcentaje de efectividad para tu posición de ${result.primaryPosition.title} y la guía exacta de hábitos y gestos para copiar de estrellas de élite.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDeepDiveOpen(true)}
          className="px-6 py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer font-display shrink-0 shadow-lg shadow-volt/20"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>{lang === 'en' ? 'Open Dribble & Pro Analysis' : lang === 'pt' ? 'Abrir Análise de Dribles & Pro' : 'Abrir Análisis de Regates & Pro'}</span>
        </button>
      </div>

      {/* Pro / Academy Membership Banner */}
      {onOpenPricing && (
        <>
          {plan === 'free' && (
            <div className="bg-gradient-to-r from-amber-500/15 via-volt/10 to-emerald-500/15 border border-volt/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-volt/20 border border-volt/40 flex items-center justify-center text-volt shrink-0">
                  <Award className="w-5 h-5 text-volt" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase italic font-display">
                    {lang === 'en'
                      ? 'Want Full Scouting Reports & Academy Mode?'
                      : lang === 'pt'
                      ? 'Deseja Relatórios de Scouting Completos e Modo Academia?'
                      : '¿Quieres la Ficha Scouting Completa y Modo Academia?'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {lang === 'en'
                      ? 'Upgrade to Pro Plan or Academy Mode with Stripe or PayPal for unlimited evaluations and squad management.'
                      : lang === 'pt'
                      ? 'Passe para o Plano Pro ou Modo Academia com Stripe ou PayPal para avaliações ilimitadas e gestão de plantel.'
                      : 'Pasa al Plan Pro o Modo Academia con Stripe o PayPal para desbloquear evaluaciones ilimitadas y gestión de alumnos.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenPricing}
                className="px-4 py-2 rounded-xl bg-volt hover:bg-white text-black text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-volt/20"
              >
                {lang === 'en' ? 'View Plans & Activate' : lang === 'pt' ? 'Ver Planos & Ativar' : 'Ver Planes & Activar'}
              </button>
            </div>
          )}

          {plan === 'pro' && !isAcademy && (
            <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-volt text-black text-[10px] font-black uppercase tracking-wider font-mono">
                      {lang === 'en' ? 'PRO PLAN ACTIVE' : lang === 'pt' ? 'PLANO PRO ATIVO' : 'PLAN PRO ACTIVO'}
                    </span>
                    <h4 className="text-sm font-black text-white uppercase italic font-display">
                      {lang === 'en'
                        ? 'Coaching a Team or Youth Academy? Upgrade to Academy Mode'
                        : lang === 'pt'
                        ? 'Treina uma Equipa ou Academia? Passe para o Modo Academia'
                        : '¿Diriges un Equipo o Cantera? Pasa a Modo Academia'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {lang === 'en'
                      ? 'Add student profiles, run DNA tests for every player, build your Starting XI, and assign tactical tasks.'
                      : lang === 'pt'
                      ? 'Adicione alunos, faça testes de ADN táticos a cada um, monte o Onze Ideal e atribua tarefas técnicas.'
                      : 'Agrega perfiles de alumnos, realiza exámenes tácticos a cada uno, diseña tu Once Ideal interactivo y asígnales deberes y técnicas.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenPricing}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{lang === 'en' ? 'Upgrade to Academy Mode' : lang === 'pt' ? 'Passar para Modo Academia' : 'Mejorar a Modo Academia'}</span>
              </button>
            </div>
          )}

          {isAcademy && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-200">
                  {lang === 'en'
                    ? 'Strike Pro Academy Membership active. Full access to roster files and Starting XI line-up builder.'
                    : lang === 'pt'
                    ? 'Subscrição Modo Academia Strike Pro ativa. Acesso total a fichas de alunos e Onze Ideal.'
                    : 'Membresía Modo Academia Strike Pro activa. Acceso total a cantera y armado de once.'}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tactical Pitch & Heatmap Section */}
      <TacticalPitch
        zones={result.tacticalZones}
        positionTitle={result.primaryPosition.title}
      />

      {/* Strengths and Improvements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <CheckCircle2 className="w-4 h-4 text-volt" />
            {t.keyStrengths}
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="w-2 h-2 rounded-full bg-volt mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs uppercase font-bold text-white tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <AlertCircle className="w-4 h-4 text-volt" />
            {t.areasToImprove}
          </h3>
          <ul className="space-y-2.5">
            {result.areasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* =====================================================================
          BLOCK 1: 16PERSONALITIES-STYLE TACTICAL IDENTITY & FOMO PRO SECTIONS
          (Strictly using existing position names & fully localized es/en/pt)
         ===================================================================== */}
      {(() => {
        const posCode = result.primaryPosition.code;
        const hasProAccess = isPro || isAcademy;

        // Polar personality scales derived from existing 8D skills
        const scaleVerticality = Math.min(94, Math.max(18, Math.round(result.skills.speed * 0.55 + result.skills.finishing * 0.45)));
        const scaleCreativity = Math.min(94, Math.max(18, Math.round(result.skills.technique * 0.65 + result.skills.tacticalIQ * 0.35)));
        const scalePressing = Math.min(94, Math.max(18, Math.round(result.skills.defending * 0.55 + result.skills.physical * 0.45)));
        const scalePower = Math.min(94, Math.max(18, Math.round(result.skills.physical * 0.6 + result.skills.mental * 0.4)));

        type PosMeta = {
          rarity: string;
          motto: string;
          freeKryptonite: string;
          proKryptonite1: string;
          proKryptonite2: string;
          proAntidote: string;
          bestDuoPartner: string;
          bestDuoReason: string;
          proDuoSecret: string;
          bestFormation: string;
          altFormation: string;
          worstFormation: string;
          week1Focus: string[];
          week2Focus: string[];
          week3Focus: string[];
          week4Focus: string[];
        };

        const tacticalMetaByLang: Record<'es' | 'en' | 'pt', Record<string, PosMeta>> = {
          es: {
            POR: {
              rarity: '6.8% de los jugadores evaluados',
              motto: '"Seguridad bajo los tres palos y primer pase limpio para iniciar el ataque."',
              freeKryptonite: 'Balones cruzados al segundo palo tras pérdida en salida corta cuando la defensa está abierta.',
              proKryptonite1: 'Presión alta al pie menos hábil: los delanteros rivales cierran la línea con el central derecho para forzarte a despejar dividido.',
              proKryptonite2: 'Duelos 1v1 en diagonal donde el atacante amaga al primer palo: tendencia a vencer el peso corporal 0.3s antes del remate.',
              proAntidote: 'Escaneo previo de apoyo con el Mediocentro Defensivo (MCD) antes de controlar y paso de ajuste corto al achicar.',
              bestDuoPartner: 'Defensa Central (DEC) & Mediocentro Defensivo (MCD)',
              bestDuoReason: 'Triángulo de salida limpia para atraer la presión rival y saltar líneas con superioridad numérica.',
              proDuoSecret: 'Clave Pro: Cuando el MCD desciende entre centrales, tu pase tenso al Lateral (LAT) libre rompe 2 líneas de presión.',
              bestFormation: '4-3-3 Salida Lavolpiana (96% Afinidad)',
              altFormation: '4-2-3-1 Doble Pivote (91% Afinidad)',
              worstFormation: '5-4-1 Bloque Hundido sin salida limpia (62% Afinidad - limita tu juego de pies)',
              week1Focus: ['Reactividad de pies y postura base de bloqueo', 'Controles orientados bajo presión de 2 segundos', 'Comunicación de mando con línea defensiva'],
              week2Focus: ['Pase tenso raso a zona de MCD entre líneas', 'Lectura de centros cerrados y despeje en tráfico', 'Achique 1v1 con bloqueo en cruz'],
              week3Focus: ['Golpeo de media distancia a carriles exteriores', 'Cobertura de espalda a 25 metros del arco', 'Reacción doble tras rebote corto'],
              week4Focus: ['Simulación de partido bajo presión alta', 'Liderazgo en balón parado defensivo', 'Rutina mental de concentración en minutos 80-90']
            },
            DEC: {
              rarity: '14.2% de los jugadores evaluados',
              motto: '"Jerarquía en el duelo, lectura anticipada y salida firme desde el fondo."',
              freeKryptonite: 'Transiciones rápidas a tu espalda cuando el equipo adelanta la línea a mitad de cancha.',
              proKryptonite1: 'Delanteros que te atraen hacia mediocampo para girar de espaldas y habilitar al Extremo (EXT) en diagonal al espacio vacío.',
              proKryptonite2: 'Cambios de orientación rápidos al carril débil cuando quedas perfilado hacia una sola banda.',
              proAntidote: 'Perfilación lateral de 45° antes del pase rival + regla de 2 metros de margen al anticipar sin ir al suelo.',
              bestDuoPartner: 'Mediocentro Defensivo (MCD)',
              bestDuoReason: 'El MCD protege la zona frontal mientras tú anticipas o conduces para dividir la primera línea rival.',
              proDuoSecret: 'Clave Pro: Si conduces 8 metros con balón dominado hasta fijar al interior rival, liberas automáticamente a tu Mediocentro (MC).',
              bestFormation: '4-3-3 Línea Alta (95% Afinidad)',
              altFormation: '3-5-2 Líbero / Central (92% Afinidad)',
              worstFormation: '4-4-2 Estático con líneas separadas (64% Afinidad - te deja expuesto en 1v1 abiertos)',
              week1Focus: ['Perfilación corporal de 45° en retroceso', 'Pase vertical raso rompiendo primera línea', 'Temporización 1v1 en banda sin cometer falta'],
              week2Focus: ['Defensa de espacio a la espalda (sprint en diagonal)', 'Juego aéreo ofensivo y defensivo con timing', 'Salida bajo presión hacia lateral proyectado'],
              week3Focus: ['Coberturas cruzadas con el Lateral (LAT)', 'Cambio de orientación de 35m al extremo opuesto', 'Control de área en centros laterales'],
              week4Focus: ['Lectura de fuera de juego coordinado', 'Duelos de alta intensidad en fatiga', 'Mando táctico y basculación de bloque']
            },
            LAT: {
              rarity: '13.5% de los jugadores evaluados',
              motto: '"Ida y vuelta incansable, amplitud ofensiva y cerrojo en los duelos de banda."',
              freeKryptonite: 'Balones filtrados a tu espalda justo después de proyectarte al ataque en superioridad.',
              proKryptonite1: 'Extremos rivales a pierna cambiada que te fijan en conducción interior cuando tu Mediocentro (MC) no cierra la ayuda.',
              proKryptonite2: 'Pérdida de precisión en el centro final por llegar al último tercio al 100% de velocidad sin pausa previa.',
              proAntidote: 'Frenado de ajuste en el último paso antes de centrar y carrera de retorno hacia el eje central (embudo defensivo).',
              bestDuoPartner: 'Extremo / Invertido (EXT)',
              bestDuoReason: 'Cuando el Extremo fija por dentro, todo el carril exterior queda libre para tu desdoblamiento al espacio.',
              proDuoSecret: 'Clave Pro: Alterna 2 desdoblamientos por fuera con 1 ruptura interior para volver impredecible tu banda.',
              bestFormation: '4-3-3 con Carriles Profundos (96% Afinidad)',
              altFormation: '3-5-2 Carrilero Total (93% Afinidad)',
              worstFormation: '4-4-2 Bloque Bajo sin proyección (65% Afinidad - desperdicia tu recorrido ofensivo)',
              week1Focus: ['Freno de desaceleración antes del centro en carrera', 'Perfilación defensiva ante extremos a pierna cambiada', 'Paredes cortas en banda con interior o extremo'],
              week2Focus: ['Centros tensos al segundo palo y pase atrás', 'Transición defensiva en diagonal hacia el área', 'Control orientado hacia adelante en línea de cal'],
              week3Focus: ['Incursión interior hacia zona de remate', 'Duelo 1v1 defensivo en espacio abierto', 'Resistencia a esfuerzos repetidos de alta velocidad'],
              week4Focus: ['Toma de decisión en último tercio bajo fatiga', 'Sincronización de relevos con Extremo (EXT)', 'Cierre del segundo palo en centros del lado opuesto']
            },
            MCD: {
              rarity: '11.4% de los jugadores evaluados',
              motto: '"El equilibrio invisible: recuperación inteligente, coberturas y brújula de distribución."',
              freeKryptonite: 'Recibir de espaldas sin escanear cuando el rival activa presión en rombo sobre tu zona.',
              proKryptonite1: 'Mediapuntas (MPO) que se posicionan detrás de tu hombro débil para obligarte a girar hacia la banda congestionada.',
              proKryptonite2: 'Quedar hundido entre los centrales demasiado pronto, dejando un vacío de 15 metros en la frontal del área.',
              proAntidote: 'Doble escaneo de hombros cada 3 segundos antes del pase y recepción perfilada sobre el pie más lejano del marcador.',
              bestDuoPartner: 'Mediocentro Mixto / Box-to-Box (MC)',
              bestDuoReason: 'Tú aseguras el anclaje y primer pase limpio para que el MC rompa líneas con total libertad.',
              proDuoSecret: 'Clave Pro: Jugar a 1-2 toques tras recuperar atrae a 2 rivales y habilita el pase filtrado directo al Mediapunta (MPO).',
              bestFormation: '4-3-3 Pivote Único (97% Afinidad)',
              altFormation: '4-2-3-1 Doble Pivote Asociativo (93% Afinidad)',
              worstFormation: 'Juego directo de pelotazo largo (61% Afinidad - anula tu influencia en el circuito)',
              week1Focus: ['Escaneo de 360° antes de recibir de los centrales', 'Control orientado con pierna alejada de la presión', 'Intercepción de líneas de pase interiores'],
              week2Focus: ['Giro rápido para cambiar de orientación en 2 toques', 'Posicionamiento de vigilancia tras pérdida ofensiva', 'Pase vertical raso que rompe línea de volantes'],
              week3Focus: ['Coberturas a espaldas de los Laterales (LAT)', 'Falta táctica inteligente e intensidad en duelos', 'Temporización ante contraataques en inferioridad'],
              week4Focus: ['Control del ritmo del partido (pausa vs aceleración)', 'Distribución bajo presión extrema en bloque alto', 'Liderazgo táctico del eje central']
            },
            MC: {
              rarity: '16.0% de los jugadores evaluados',
              motto: '"Motor de área a área: dinámica, llegada desde segunda línea y control de tiempos."',
              freeKryptonite: 'Desgaste energético por correr detrás del balón sin cerrar primero los pasillos interiores.',
              proKryptonite1: 'Quedar a mitad de camino en transiciones cuando el rival filtra rápido a espaldas de tu línea de volantes.',
              proKryptonite2: 'Precipitar el último pase en conducción cuando el Delantero Centro (DC) aún no ha completado su desmarque.',
              proAntidote: 'Pausa activa de medio segundo al cruzar tres cuartos de cancha y ataque al espacio libre cuando el DC arrastra marca.',
              bestDuoPartner: 'Mediocentro Defensivo (MCD) & Mediapunta / Creador (MPO)',
              bestDuoReason: 'Con el MCD cuidando tu espalda y el MPO atrayendo marcas, tus llegadas desde segunda línea son indetectables.',
              proDuoSecret: 'Clave Pro: Llegar al borde del área 1.5 segundos después del centro lateral te da un 78% más de opciones de remate libre.',
              bestFormation: '4-3-3 Interior Box-to-Box (96% Afinidad)',
              altFormation: '4-2-3-1 Mixto Dinámico (92% Afinidad)',
              worstFormation: '5-3-2 Ultra Defensivo sin posesión (66% Afinidad - reduce tu llegada a área rival)',
              week1Focus: ['Conducción progresiva para fijar y soltar en ventaja', 'Llegada escalonada a zona de rebote en frontal', 'Presión tras pérdida en los primeros 4 segundos'],
              week2Focus: ['Cambio de ritmo en recepción orientada entre líneas', 'Remate de primera intención desde borde del área', 'Asociación triangular en banda con LAT y EXT'],
              week3Focus: ['Gestión de esfuerzos de alta intensidad', 'Pases filtrados en diagonal hacia los extremos', 'Cierre de carril interior en repliegue'],
              week4Focus: ['Dominio del ritmo en partidos de ida y vuelta', 'Rupturas sin balón al espacio entre central y lateral', 'Precisión técnica en los últimos 15 minutos']
            },
            MPO: {
              rarity: '8.4% de los jugadores evaluados',
              motto: '"Visión quirúrgica entre líneas, creatividad bajo presión y el pase que nadie más ve."',
              freeKryptonite: 'Jaula defensiva del pivote rival cuando recibes estático de espaldas al arco.',
              proKryptonite1: 'Equipos que comprimen a 8 metros la distancia entre defensa y mediocampo para obligarte a bajar demasiado lejos del área.',
              proKryptonite2: 'Desconexión en fase sin balón que permite al Mediocentro Defensivo (MCD) rival construir sin oposición.',
              proAntidote: 'Recibir en movimiento diagonal en los bolsillos laterales del pivote rival y perfilar el cuerpo antes del contacto.',
              bestDuoPartner: 'Delantero Centro (DC) & Extremo / Invertido (EXT)',
              bestDuoReason: 'Tus pases filtrados cobran vida cuando tienes atacantes que tiran diagonales agresivas a la espalda de la defensa.',
              proDuoSecret: 'Clave Pro: Cuando fijas al central con la mirada hacia la banda y filtras al DC con giro de tobillo, rompes cualquier bloque bajo.',
              bestFormation: '4-2-3-1 Enganche Libre (98% Afinidad)',
              altFormation: '4-3-3 Interior Ofensivo en Zona 14 (93% Afinidad)',
              worstFormation: '4-4-2 Clásico Rígido sin mediapunta (63% Afinidad - te obliga a jugar encajonado en banda)',
              week1Focus: ['Recepción perfilada en Zona 14 entre líneas', 'Finta corporal antes de recibir para ganar 1 metro', 'Pase filtrado al hueco con peso exacto'],
              week2Focus: ['Giro en espacio reducido bajo marca pegajosa', 'Disparo colocado a media distancia tras amague', 'Paredes al primer toque en la frontal del área'],
              week3Focus: ['Movilidad en pasillos intermedios', 'Presión inteligente sobre la salida del MCD rival', 'Asistencias elevadas sobre línea defensiva'],
              week4Focus: ['Destrabar defensas cerradas de 5 hombres', 'Toma de decisión en 1.2 segundos en área rival', 'Liderazgo creativo en momentos de máxima presión']
            },
            EXT: {
              rarity: '15.1% de los jugadores evaluados',
              motto: '"Desequilibrio puro en 1v1, cambio de ritmo eléctrico y amenaza constante en diagonal."',
              freeKryptonite: 'Doble marca (2v1) contra la línea de cal cuando recibes al pie sin opción de descarga.',
              proKryptonite1: 'Laterales que te cierran el perfil interior y te llevan hacia el córner donde tu ángulo de remate desaparece.',
              proKryptonite2: 'Previsibilidad al intentar siempre la misma salida en el 1v1 durante la segunda mitad del partido.',
              proAntidote: 'Amague de recepción al pie para romper al espacio corto, y alternar salida exterior rápida con recorte interior de disparo.',
              bestDuoPartner: 'Lateral / Carrilero (LAT) & Mediapunta / Creador (MPO)',
              bestDuoReason: 'El Lateral arrastra una marca con su desdoblamiento y el MPO te habilita en ventaja para encarar en 1v1 aislado.',
              proDuoSecret: 'Clave Pro: Si en los primeros 10 minutos ganas la línea de fondo por fuera, el defensa abrirá su perfil y te dejará libre el recorte interior de gol.',
              bestFormation: '4-3-3 Extremos Abiertos / Invertidos (97% Afinidad)',
              altFormation: '4-2-3-1 Ataque por Bandas (94% Afinidad)',
              worstFormation: '3-5-2 sin extremos naturales (60% Afinidad - te obliga a defender todo el carril o jugar de espaldas)',
              week1Focus: ['Cambio de ritmo explosivo tras finta estática', 'Alternancia de salida por fuera y diagonal interior', 'Diagonal sin balón a la espalda del lateral rival'],
              week2Focus: ['Finalización al segundo palo tras recorte interior', 'Centro raso tenso atrás al punto de penal', 'Asociación en pared para superar doble marca 2v1'],
              week3Focus: ['Ataque al segundo palo cuando el balón viene de la otra banda', 'Presión agresiva sobre la salida del central rival', 'Regate en carrera a máxima velocidad'],
              week4Focus: ['Efectividad en último tercio (decisión pase vs tiro)', 'Desgaste psicológico al lateral rival en 90 minutos', 'Ejecución letal en transiciones rápidas 3v2']
            },
            DC: {
              rarity: '14.6% de los jugadores evaluados',
              motto: '"Instinto letal en el área, movimientos de ruptura y sangre fría frente al arco."',
              freeKryptonite: 'Quedar aislado entre dos Defensas Centrales (DEC) físicos cuando el equipo no logra progresar.',
              proKryptonite1: 'Trampas de fuera de juego cuando inicias la carrera mirando el balón en lugar del hombro del último defensor.',
              proKryptonite2: 'Precipitación en el primer control dentro del área cuando tienes medio segundo extra para perfilar el remate.',
              proAntidote: 'Desmarque en doble movimiento (cortina al primer palo y ruptura al punto ciego del central) + definición a 1 o 2 toques.',
              bestDuoPartner: 'Mediapunta / Creador (MPO) & Extremo / Invertido (EXT)',
              bestDuoReason: 'Ellos generan el desequilibrio y los pases filtrados; tú conviertes cada ventaja en peligro real de gol.',
              proDuoSecret: 'Clave Pro: Inicia tu carrera en el hombro ciego del central más lento; ganarás medio metro decisivo antes de que pueda girar.',
              bestFormation: '4-3-3 Referencia de Área Móvil (97% Afinidad)',
              altFormation: '4-2-3-1 Punta con Enganche (95% Afinidad)',
              worstFormation: '5-4-1 Aislado a 50 metros del arco rival (62% Afinidad - te obliga a pelear balones divididos lejos del área)',
              week1Focus: ['Doble movimiento de desmarque en el punto ciego del central', 'Definición a un toque a las esquinas inferiores', 'Juego de espaldas: apoyo de cara para el MPO/MC'],
              week2Focus: ['Ataque al primer palo en centros tensos desde banda', 'Control orientado en el área para eliminar al defensa en 1 toque', 'Finalización en 1v1 ante achique del portero'],
              week3Focus: ['Rupturas en diagonal sobre la línea del fuera de juego', 'Remate de cabeza con salto en carrera', 'Presión orientada para forzar el error del central'],
              week4Focus: ['Sangre fría en ocasiones claras bajo fatiga máxima', 'Lectura de rebotes en el área chica', 'Sincronización con Extremos (EXT) en contraataques']
            }
          },
          en: {
            POR: {
              rarity: '6.8% of evaluated players',
              motto: '"Command under the posts and clean first distribution to launch the attack."',
              freeKryptonite: 'Far-post crosses after a short build-up turnover when the defensive line is spread open.',
              proKryptonite1: 'High press targeting your weaker foot: rival strikers angle their run to cut off your passing lane to the center-back.',
              proKryptonite2: 'Diagonal 1v1 duels where the attacker feints near-post: committing body weight 0.3s too early before the shot.',
              proAntidote: 'Pre-scan the Defensive Midfielder (MCD) support angle before receiving and execute a micro split-step when closing down 1v1.',
              bestDuoPartner: 'Center Back (DEC) & Defensive Midfielder (MCD)',
              bestDuoReason: 'Forms a clean build-up triangle to bait rival pressing and bypass lines with numerical superiority.',
              proDuoSecret: 'Pro Key: When the MCD drops between the center-backs, your crisp pass to the free Fullback (LAT) breaks 2 pressing lines.',
              bestFormation: '4-3-3 Sweeper Build-up (96% Match)',
              altFormation: '4-2-3-1 Double Pivot (91% Match)',
              worstFormation: '5-4-1 Deep Block with long punts only (62% Match - wastes your footwork)',
              week1Focus: ['Footwork reactivity (Split-Step) & base stance', 'Oriented first touch under 2-second press', 'Defensive line command & vocal organization'],
              week2Focus: ['Crisp driven pass into the MCD pocket', 'Reading in-swinging crosses in heavy traffic', '1v1 closing angles & cross-block technique'],
              week3Focus: ['Mid-range side-volley distribution to wide channels', 'Sweeper coverage 25m off the goal line', 'Double-save recovery after short rebounds'],
              week4Focus: ['High-press match simulation build-up', 'Set-piece defensive command', 'Late-game mental focus routine (mins 80-90)']
            },
            DEC: {
              rarity: '14.2% of evaluated players',
              motto: '"Defensive authority in duels, early anticipation, and composed progression from the back."',
              freeKryptonite: 'Fast transitions behind your back when the team pushes a high line to the halfway line.',
              proKryptonite1: 'Strikers dragging you toward midfield to spin in behind and release the Winger (EXT) into the vacated channel.',
              proKryptonite2: 'Rapid switches of play to the weak side when your hips are locked facing one touchline.',
              proAntidote: 'Maintain a 45° open body posture before the pass is played + keep a 2-meter cushion when stepping up to intercept.',
              bestDuoPartner: 'Defensive Midfielder (MCD)',
              bestDuoReason: 'The MCD screens central passing lanes while you step in to intercept or carry the ball forward.',
              proDuoSecret: 'Pro Key: Carrying the ball 8 meters forward until you commit a rival midfielder automatically frees your Central Midfielder (MC).',
              bestFormation: '4-3-3 High Line (95% Match)',
              altFormation: '3-5-2 Sweeper / Stopper (92% Match)',
              worstFormation: '4-4-2 Disconnected Lines (64% Match - leaves you exposed in wide open 1v1s)',
              week1Focus: ['45° defensive body shape while backpedaling', 'Line-breaking ground pass into midfield', '1v1 wide delay technique without fouling'],
              week2Focus: ['Defending space in behind (diagonal recovery sprint)', 'Aerial timing in both boxes', 'Playing out of pressure to the advancing fullback'],
              week3Focus: ['Cover shadows & rotation with the Fullback (LAT)', '35m diagonal switch to the weak-side winger', 'Box command on driven low crosses'],
              week4Focus: ['Coordinated offside-line stepping', 'High-intensity duel execution under fatigue', 'Vocal block shifting & defensive leadership']
            },
            LAT: {
              rarity: '13.5% of evaluated players',
              motto: '"Relentless box-to-box engine, attacking width, and lockdown wide defending."',
              freeKryptonite: 'Through-balls into the space behind you right after overlapping into the final third.',
              proKryptonite1: 'Inverted wingers driving inside at your weaker hip when your Central Midfielder (MC) is late providing cover.',
              proKryptonite2: 'Rushed final crosses caused by arriving at the byline at 100% sprint speed without a balance check-step.',
              proAntidote: 'Deceleration adjustment step before delivering the cross + diagonal recovery sprint toward the penalty spot.',
              bestDuoPartner: 'Winger / Inverted Winger (EXT)',
              bestDuoReason: 'When the Winger pins the defender inside, the entire outer corridor opens up for your overlapping run.',
              proDuoSecret: 'Pro Key: Alternate 2 outside overlaps with 1 inside underlap run to make your flank completely unpredictable.',
              bestFormation: '4-3-3 Attacking Fullbacks (96% Match)',
              altFormation: '3-5-2 Wing-Back System (93% Match)',
              worstFormation: '4-4-2 Ultra-Low Block (65% Match - restricts your attacking runs)',
              week1Focus: ['Deceleration check-step before crossing at speed', 'Body angle vs inverted wingers cutting inside', 'Quick give-and-go combinations on the flank'],
              week2Focus: ['Driven far-post crosses & low cut-backs', 'Diagonal defensive transition sprint to the box', 'Forward-oriented first touch along the touchline'],
              week3Focus: ['Interior underlap run into the half-space', 'Open-field 1v1 defensive duel recovery', 'Repeated Sprint Ability (RSA) conditioning'],
              week4Focus: ['Final-third decision making under heavy fatigue', 'Rotational cover with your Winger (EXT)', 'Back-post tuck-in coverage on opposite-flank crosses']
            },
            MCD: {
              rarity: '11.4% of evaluated players',
              motto: '"The invisible anchor: smart recoveries, defensive cover, and tempo distribution."',
              freeKryptonite: 'Receiving with your back to play without scanning when opponents trigger a diamond press.',
              proKryptonite1: 'Attacking Midfielders (MPO) lurking behind your blind shoulder to force your first touch toward a crowded sideline.',
              proKryptonite2: 'Dropping too deep between the center-backs too early, leaving a 15-meter vacuum in Zone 14.',
              proAntidote: 'Double shoulder-scan every 3 seconds before receiving and cushion the ball with your back foot away from pressure.',
              bestDuoPartner: 'Box-to-Box Central Midfielder (MC)',
              bestDuoReason: 'You secure positional balance and clean first passes so the MC can break lines with confidence.',
              proDuoSecret: 'Pro Key: Playing 1-2 touch passes after a recovery draws 2 opponents in and opens a direct lane to your Attacking Midfielder (MPO).',
              bestFormation: '4-3-3 Single Pivot Anchor (97% Match)',
              altFormation: '4-2-3-1 Associative Double Pivot (93% Match)',
              worstFormation: 'Direct long-ball bypass system (61% Match - skips your midfield orchestration)',
              week1Focus: ['360° shoulder scanning before receiving from CBs', 'Safe-foot oriented control away from pressing marker', 'Cutting interior passing lanes via cover shadow'],
              week2Focus: ['Two-touch pivot turn & switch of play', 'Rest-defense positioning while team attacks', 'Vertical line-breaking ground pass'],
              week3Focus: ['Covering behind advancing Fullbacks (LAT)', 'Tactical duel leverage & clean ball winning', 'Delaying 2v1 counter-attacks in transition'],
              week4Focus: ['Match tempo control (pause vs acceleration)', 'Build-up distribution under extreme high press', 'Central axis vocal command']
            },
            MC: {
              rarity: '16.0% of evaluated players',
              motto: '"Box-to-box powerhouse: relentless dynamics, second-line arrivals, and tempo control."',
              freeKryptonite: 'Wasting energy chasing the ball carrier before sealing off interior passing lanes.',
              proKryptonite1: 'Getting caught flat-footed in transition when opponents play a quick vertical pass behind your midfield line.',
              proKryptonite2: 'Releasing the final pass half a second too early while carrying forward before the Striker (DC) finishes their run.',
              proAntidote: 'Half-second tempo pause entering the final third + timed late run into the box as the Striker pins the center-backs.',
              bestDuoPartner: 'Defensive Midfielder (MCD) & Attacking Midfielder (MPO)',
              bestDuoReason: 'With the MCD protecting behind you and the MPO drawing markers, your late runs into the box go untracked.',
              proDuoSecret: 'Pro Key: Arriving at the edge of the box 1.5 seconds after a wide cross gives you a 78% higher chance of an uncontested shot.',
              bestFormation: '4-3-3 Box-to-Box Interior (96% Match)',
              altFormation: '4-2-3-1 Dynamic Midfielder (92% Match)',
              worstFormation: '5-3-2 Passive Low Block (66% Match - limits your box-to-box arrivals)',
              week1Focus: ['Progressive ball carry to commit a defender', 'Staggered late arrival to the edge of the box', '4-second counter-press reaction after turnover'],
              week2Focus: ['Burst of acceleration on half-turn reception', 'First-time finish from the penalty arc', 'Wide triangle combination with LAT and EXT'],
              week3Focus: ['High-intensity box-to-box pacing', 'Diagonal through-balls behind the fullback', 'Interior channel recovery tracking'],
              week4Focus: ['Controlling end-to-end match transitions', 'Off-ball third-man runs through the half-space', 'Passing precision in minutes 75-90']
            },
            MPO: {
              rarity: '8.4% of evaluated players',
              motto: '"Surgical vision between the lines, composure under pressure, and the pass nobody else sees."',
              freeKryptonite: 'Getting boxed in by the rival defensive pivot when receiving flat-footed with your back to goal.',
              proKryptonite1: 'Compact blocks squeezing the gap between defense and midfield to 8 meters, forcing you to drop harmlessly deep.',
              proKryptonite2: 'Switching off defensively after a turnover, allowing the rival Defensive Midfielder (MCD) a free build-up pass.',
              proAntidote: 'Receive on a diagonal movement in the blind pockets beside the rival pivot with an open half-turn stance.',
              bestDuoPartner: 'Striker (DC) & Winger (EXT)',
              bestDuoReason: 'Your through-balls become lethal when paired with forwards making aggressive diagonal runs in behind.',
              proDuoSecret: 'Pro Key: Freeze the center-back by looking toward the wing, then disguise a reverse pass to the Striker (DC) with your ankle.',
              bestFormation: '4-2-3-1 Free Playmaker #10 (98% Match)',
              altFormation: '4-3-3 Attacking Interior in Zone 14 (93% Match)',
              worstFormation: '4-4-2 Rigid Flat Four (63% Match - forces you out wide into a defensive shell)',
              week1Focus: ['Half-turn reception in Zone 14 between lines', 'Pre-reception body feint to gain 1 yard of space', 'Weighted through-ball timing into space'],
              week2Focus: ['Tight-space escape turn under man-marking', 'Placed finesse shot from the edge of the box', 'One-touch wall passes around the penalty arc'],
              week3Focus: ['Drifting into half-space pockets', 'Pressing cover shadow on the rival MCD', 'Chip/lofted assist over a flat backline'],
              week4Focus: ['Unlocking 5-man low defensive blocks', '1.2-second decision execution inside the box', 'Creative leadership in high-pressure moments']
            },
            EXT: {
              rarity: '15.1% of evaluated players',
              motto: '"Pure 1v1 disequilibrium, electric change of pace, and constant diagonal threat."',
              freeKryptonite: 'Getting trapped in a 2v1 double-team against the touchline when receiving stationary to feet.',
              proKryptonite1: 'Fullbacks who seal your inside foot and usher you toward the corner flag where your shooting angle vanishes.',
              proKryptonite2: 'Becoming predictable by repeating the same 1v1 exit direction during the second half.',
              proAntidote: 'Check-to-feet feint followed by a short dart in behind + alternate rapid outside bursts with inside shooting cut-backs.',
              bestDuoPartner: 'Fullback (LAT) & Attacking Midfielder (MPO)',
              bestDuoReason: 'The Fullback drags a defender away on the overlap while the MPO feeds you in isolated 1v1 situations.',
              proDuoSecret: 'Pro Key: Beat your marker down the outside in the first 10 minutes; they will over-shift their hips, opening your inside curler.',
              bestFormation: '4-3-3 Wide / Inverted Wingers (97% Match)',
              altFormation: '4-2-3-1 Wing Attack (94% Match)',
              worstFormation: '3-5-2 without natural wingers (60% Match - forces you to defend the whole flank or play back-to-goal)',
              week1Focus: ['Explosive acceleration burst after static feint', 'Alternating outside byline drive & inside cut', 'Blind-side diagonal run behind the rival fullback'],
              week2Focus: ['Far-post curled finish after cutting inside', 'Driven low cut-back pass to the penalty spot', 'Give-and-go wall pass to beat 2v1 double teams'],
              week3Focus: ['Back-post box attack when crosses come from opposite wing', 'Aggressive press angle on rival center-back build-up', 'Top-speed ball control while dribbling in transition'],
              week4Focus: ['Final-third efficiency (shot vs assist decision)', 'Wearing down the opposing fullback over 90 mins', 'Clinical execution in 3v2 fast breaks']
            },
            DC: {
              rarity: '14.6% of evaluated players',
              motto: '"Lethal instinct inside the box, explosive runs in behind, and ice-cold finishing."',
              freeKryptonite: 'Becoming isolated between two physical Center Backs (DEC) when the team struggles to progress the ball.',
              proKryptonite1: 'Falling into offside traps by starting your sprint watching the ball carrier instead of the last defender’s shoulder.',
              proKryptonite2: 'Rushing your first touch inside the box when you actually have an extra half-second to set your shooting angle.',
              proAntidote: 'Double-movement run (Check near-post, dart into the center-back’s blind spot) + clinical 1-or-2 touch finishing.',
              bestDuoPartner: 'Attacking Midfielder (MPO) & Winger (EXT)',
              bestDuoReason: 'They create chaos, crosses, and through-balls; you turn every half-chance into goals.',
              proDuoSecret: 'Pro Key: Start your run off the blind shoulder of the slower center-back to gain a decisive half-yard before they can turn.',
              bestFormation: '4-3-3 Mobile Central Striker (97% Match)',
              altFormation: '4-2-3-1 Striker with #10 Support (95% Match)',
              worstFormation: '5-4-1 Isolated 50m from goal (62% Match - forces you to fight long aerial duels away from the box)',
              week1Focus: ['Double-movement blind-spot separation in the box', 'One-touch low-corner clinical finishing', 'Hold-up play & clean lay-offs to MPO/MC'],
              week2Focus: ['Near-post darting runs on driven wide crosses', 'Oriented first touch to eliminate defender in 1 motion', '1v1 composure & dink/placement vs rushing keeper'],
              week3Focus: ['Curved diagonal runs along the offside line', 'Attacking headers in full stride', 'Curved pressing runs to trap the rival center-back'],
              week4Focus: ['Ice-cold finishing under late-game fatigue', 'Six-yard box rebound anticipation', 'Counter-attack lane synchronization with Wingers (EXT)']
            }
          },
          pt: {
            POR: {
              rarity: '6.8% dos jogadores avaliados',
              motto: '"Segurança entre os postes e primeiro passe limpo para iniciar o ataque."',
              freeKryptonite: 'Bolas cruzadas ao segundo poste após perda na saída curta quando a defesa está aberta.',
              proKryptonite1: 'Pressão alta sobre o pé menos dominante: os avançados fecham a linha com o central para forçar o pontapé longo dividido.',
              proKryptonite2: 'Duelos 1v1 em diagonal onde o atacante simula ao primeiro poste: tendência a comprometer o peso corporal 0.3s antes do remate.',
              proAntidote: 'Leitura prévia de apoio com o Médio Defensivo (MCD) antes de controlar e passo curto de ajuste na mancha 1v1.',
              bestDuoPartner: 'Defesa Central (DEC) & Médio Defensivo (MCD)',
              bestDuoReason: 'Triângulo de saída limpa para atrair a pressão adversária e quebrar linhas com superioridade.',
              proDuoSecret: 'Chave Pro: Quando o MCD baixa entre os centrais, o teu passe tenso para o Lateral (LAT) livre quebra 2 linhas de pressão.',
              bestFormation: '4-3-3 Saída Apoiada (96% Afinidade)',
              altFormation: '4-2-3-1 Duplo Pivô (91% Afinidade)',
              worstFormation: '5-4-1 Bloco Baixo sem construção (62% Afinidade - limita o teu jogo de pés)',
              week1Focus: ['Reatividade de apoios e postura base de defesa', 'Controlo orientado sob pressão de 2 segundos', 'Comunicação de comando com a linha defensiva'],
              week2Focus: ['Passe tenso rasteiro para o MCD entre linhas', 'Leitura de cruzamentos fechados em tráfego', 'Mancha 1v1 com bloqueio em cruz'],
              week3Focus: ['Distribuição de média distância para os corredores', 'Cobertura da profundidade a 25 metros da baliza', 'Dupla reação após ressalto curto'],
              week4Focus: ['Simulação de jogo sob pressão alta', 'Liderança nas bolas paradas defensivas', 'Rotina mental de foco nos minutos 80-90']
            },
            DEC: {
              rarity: '14.2% dos jogadores avaliados',
              motto: '"Hierarquia no duelo, leitura antecipada e saída firme desde trás."',
              freeKryptonite: 'Transições rápidas nas tuas costas quando a equipa sobe a linha até ao meio-campo.',
              proKryptonite1: 'Avançados que te atraem ao meio-campo para rodar e lançar o Extremo (EXT) em diagonal no espaço vazio.',
              proKryptonite2: 'Mudanças rápidas de flanco para o corredor fraco quando ficas perfilado apenas para um lado.',
              proAntidote: 'Perfilamento corporal a 45° antes do passe adversário + margem de 2 metros ao antecipar sem ir ao chão.',
              bestDuoPartner: 'Médio Defensivo (MCD)',
              bestDuoReason: 'O MCD protege a zona frontal enquanto antecipas ou conduzes para dividir a primeira linha rival.',
              proDuoSecret: 'Chave Pro: Se conduzires 8 metros com bola controlada até fixar o médio rival, libertas automaticamente o teu Médio Centro (MC).',
              bestFormation: '4-3-3 Linha Subida (95% Afinidade)',
              altFormation: '3-5-2 Líbero / Central (92% Afinidade)',
              worstFormation: '4-4-2 Estático com linhas afastadas (64% Afinidade - expõe-te em 1v1 abertos)',
              week1Focus: ['Perfilamento corporal de 45° em recuo', 'Passe vertical rasteiro a quebrar a primeira linha', 'Temporização 1v1 no corredor sem fazer falta'],
              week2Focus: ['Defesa da profundidade (sprint em diagonal)', 'Jogo aéreo ofensivo e defensivo com tempo de salto', 'Saída sob pressão para o lateral projetado'],
              week3Focus: ['Dobras e coberturas com o Lateral (LAT)', 'Variação de flanco de 35m para o extremo oposto', 'Domínio da área em cruzamentos laterais'],
              week4Focus: ['Coordenação da linha de fora de jogo', 'Duelos de alta intensidade sob fadiga', 'Comando tático e basculação do bloco']
            },
            LAT: {
              rarity: '13.5% dos jogadores avaliados',
              motto: '"Ida e volta incansável, largura ofensiva e segurança nos duelos de corredor."',
              freeKryptonite: 'Passes filtrados nas tuas costas logo após subires no apoio ofensivo.',
              proKryptonite1: 'Extremos adversários de pé trocado que conduzem para dentro quando o teu Médio Centro (MC) tarda na dobra.',
              proKryptonite2: 'Perda de precisão no cruzamento final por chegar ao último terço a 100% de velocidade sem passo de equilíbrio.',
              proAntidote: 'Travagem de ajuste no último apoio antes de cruzar e corrida de retorno em diagonal para o eixo central.',
              bestDuoPartner: 'Extremo / Invertido (EXT)',
              bestDuoReason: 'Quando o Extremo fixa por dentro, todo o corredor exterior fica livre para a tua sobreposição.',
              proDuoSecret: 'Chave Pro: Alterna 2 subidas por fora com 1 rutura interior para tornar o teu flanco imprevisível.',
              bestFormation: '4-3-3 com Laterais Profundos (96% Afinidade)',
              altFormation: '3-5-2 Ala Total (93% Afinidade)',
              worstFormation: '4-4-2 Bloco Baixo sem projeção (65% Afinidade - desperdiça a tua profundidade)',
              week1Focus: ['Passo de desaceleração antes do cruzamento em corrida', 'Perfilamento defensivo perante extremos de pé trocado', 'Tabelas curtas no corredor com médio ou extremo'],
              week2Focus: ['Cruzamentos tensos ao segundo poste e passe atrasado', 'Transição defensiva em diagonal para a área', 'Controlo orientado para a frente junto à linha'],
              week3Focus: ['Rutura interior para zona de finalização', 'Duelo 1v1 defensivo em espaço aberto', 'Resistência a sprints repetidos de alta intensidade'],
              week4Focus: ['Tomada de decisão no último terço sob fadiga', 'Sincronização de compensações com o Extremo (EXT)', 'Fecho do segundo poste em cruzamentos do lado oposto']
            },
            MCD: {
              rarity: '11.4% dos jogadores avaliados',
              motto: '"O equilíbrio invisível: recuperação inteligente, coberturas e bússola de distribuição."',
              freeKryptonite: 'Receber de costas sem olhar por cima do ombro quando o adversário fecha em losango.',
              proKryptonite1: 'Médios Ofensivos (MPO) que se colocam atrás do teu ombro cego para te obrigar a rodar para a linha lateral.',
              proKryptonite2: 'Baixar cedo demais entre os centrais, deixando um vazio de 15 metros à entrada da área.',
              proAntidote: 'Dupla leitura de ombros a cada 3 segundos antes do passe e receção orientada com o pé mais afastado do marcador.',
              bestDuoPartner: 'Médio Centro / Box-to-Box (MC)',
              bestDuoReason: 'Garantes a âncora posicional e o primeiro passe limpo para o MC quebrar linhas com liberdade.',
              proDuoSecret: 'Chave Pro: Jogar a 1-2 toques após recuperar atrai 2 adversários e abre a linha de passe direta para o Médio Ofensivo (MPO).',
              bestFormation: '4-3-3 Pivô Único (97% Afinidade)',
              altFormation: '4-2-3-1 Duplo Pivô Associativo (93% Afinidade)',
              worstFormation: 'Jogo direto de bola longa (61% Afinidade - anula a tua influência na construção)',
              week1Focus: ['Leitura 360° antes de receber dos defesas centrais', 'Controlo orientado com a perna afastada da pressão', 'Interceção de linhas de passe interiores'],
              week2Focus: ['Rotação rápida para variar o flanco em 2 toques', 'Posicionamento de equilíbrio defensivo no ataque', 'Passe vertical rasteiro a quebrar a linha média'],
              week3Focus: ['Coberturas nas costas dos Laterais (LAT)', 'Gestão de duelos físicos e recuperação limpa', 'Temporização perante contra-ataques em inferioridade'],
              week4Focus: ['Controlo do ritmo de jogo (pausa vs aceleração)', 'Distribuição sob pressão extrema em bloco alto', 'Liderança tática do corredor central']
            },
            MC: {
              rarity: '16.0% dos jogadores avaliados',
              motto: '"Motor de área a área: dinâmica, chegada de segunda linha e controlo dos tempos."',
              freeKryptonite: 'Desgaste físico por correr atrás da bola sem fechar primeiro os corredores interiores.',
              proKryptonite1: 'Ficar a meio caminho nas transições quando o adversário mete bola rápida nas costas do meio-campo.',
              proKryptonite2: 'Precipitar o último passe em condução quando o Avançado (DC) ainda não concluiu a desmarcação.',
              proAntidote: 'Meio segundo de pausa ativa ao entrar no último terço e ataque ao espaço vazio quando o DC arrasta a marcação.',
              bestDuoPartner: 'Médio Defensivo (MCD) & Médio Ofensivo (MPO)',
              bestDuoReason: 'Com o MCD a proteger as tuas costas e o MPO a atrair defesas, as tuas chegadas de trás são letais.',
              proDuoSecret: 'Chave Pro: Chegar à entrada da área 1.5 segundos após o cruzamento lateral dá-te 78% mais hipóteses de remate livre.',
              bestFormation: '4-3-3 Interior Box-to-Box (96% Afinidade)',
              altFormation: '4-2-3-1 Médio Dinâmico (92% Afinidade)',
              worstFormation: '5-3-2 Ultra Defensivo sem posse (66% Afinidade - reduz a tua chegada à área rival)',
              week1Focus: ['Condução progressiva para fixar e soltar em vantagem', 'Chegada escalonada à zona de ressalto frontal', 'Reação à perda nos primeiros 4 segundos'],
              week2Focus: ['Mudança de ritmo na receção orientada entre linhas', 'Remate de primeira à entrada da área', 'Triangulação no corredor com LAT e EXT'],
              week3Focus: ['Gestão de esforços de alta intensidade (Box-to-Box)', 'Passes filtrados em diagonal para os extremos', 'Fecho do corredor interior no recuo defensivo'],
              week4Focus: ['Domínio do ritmo em jogos partidos de ida e volta', 'Ruturas sem bola no espaço entre central e lateral', 'Precisão técnica nos últimos 15 minutos']
            },
            MPO: {
              rarity: '8.4% dos jogadores avaliados',
              motto: '"Visão cirúrgica entre linhas, criatividade sob pressão e o passe que mais ninguém vê."',
              freeKryptonite: 'Gaiola defensiva do trinco adversário quando recebes parado de costas para a baliza.',
              proKryptonite1: 'Equipas que encurtam para 8 metros a distância entre defesa e meio-campo para te obrigar a recuar demasiado.',
              proKryptonite2: 'Desconexão no momento sem bola que permite ao Médio Defensivo (MCD) rival construir sem oposição.',
              proAntidote: 'Receber em movimento diagonal nos espaços laterais ao trinco rival e perfilar o corpo antes da receção.',
              bestDuoPartner: 'Avançado Centro (DC) & Extremo (EXT)',
              bestDuoReason: 'Os teus passes de rutura ganham vida quando tens atacantes que atacam a profundidade em diagonal.',
              proDuoSecret: 'Chave Pro: Quando fixas o central com o olhar para a ala e filtras para o DC com rotação de tornozelo, desmontas qualquer bloco baixo.',
              bestFormation: '4-2-3-1 Criativo Livre #10 (98% Afinidade)',
              altFormation: '4-3-3 Interior Ofensivo na Zona 14 (93% Afinidade)',
              worstFormation: '4-4-2 Clássico Rígido sem número 10 (63% Afinidade - obriga-te a jogar fechado na ala)',
              week1Focus: ['Receção perfilada na Zona 14 entre linhas', 'Finta corporal antes de receber para ganhar 1 metro', 'Passe de rutura com o peso e tempo exatos'],
              week2Focus: ['Rotação em espaço curto sob marcação cerrada', 'Remate colocado de média distância após simulação', 'Tabelas ao primeiro toque à entrada da área'],
              week3Focus: ['Mobilidade nos corredores intermédios', 'Pressão inteligente sobre a saída do MCD rival', 'Passes picados por cima da linha defensiva'],
              week4Focus: ['Desbloquear defesas fechadas de 5 jogadores', 'Decisão em 1.2 segundos dentro da área adversária', 'Liderança criativa nos momentos de máxima pressão']
            },
            EXT: {
              rarity: '15.1% dos jogadores avaliados',
              motto: '"Desequilíbrio puro no 1v1, mudança de ritmo elétrica e ameaça constante em diagonal."',
              freeKryptonite: 'Dobra de marcação (2v1) junto à linha lateral quando recebes parado no pé sem linha de apoio.',
              proKryptonite1: 'Laterais que te fecham o pé interior e te empurram para a bandeirola de canto onde o ângulo de remate desaparece.',
              proKryptonite2: 'Previsibilidade ao tentar sempre o mesmo lado de saída no 1v1 durante a segunda parte.',
              proAntidote: 'Simulação de receção no pé para atacar o espaço curto e alternar saída exterior rápida com diagonal interior de remate.',
              bestDuoPartner: 'Lateral (LAT) & Médio Ofensivo (MPO)',
              bestDuoReason: 'O Lateral arrasta um defesa na sobreposição e o MPO coloca-te a bola em vantagem para o 1v1 isolado.',
              proDuoSecret: 'Chave Pro: Se nos primeiros 10 minutos ganhares a linha de fundo por fora, o defesa abrirá os apoios e deixará livre a diagonal interior para o golo.',
              bestFormation: '4-3-3 Extremos Abertos / Invertidos (97% Afinidade)',
              altFormation: '4-2-3-1 Ataque pelos Flancos (94% Afinidade)',
              worstFormation: '3-5-2 sem extremos puros (60% Afinidade - obriga-te a defender todo o corredor ou jogar de costas)',
              week1Focus: ['Mudança de ritmo explosiva após finta estática', 'Alternância entre saída por fora e diagonal interior', 'Diagonal sem bola nas costas do lateral adversário'],
              week2Focus: ['Finalização ao segundo poste após puxar para dentro', 'Cruzamento rasteiro atrasado para a marca de penálti', 'Tabela curta para superar marcação dupla 2v1'],
              week3Focus: ['Ataque ao segundo poste quando o cruzamento vem do lado oposto', 'Pressão orientada sobre a saída do central rival', 'Condução e drible em velocidade máxima'],
              week4Focus: ['Eficácia no último terço (decisão passe vs remate)', 'Desgaste constante ao lateral rival durante 90 minutos', 'Execução letal em transições rápidas 3v2']
            },
            DC: {
              rarity: '14.6% dos jogadores avaliados',
              motto: '"Instinto letal na área, movimentos de rutura e sangue-frio em frente à baliza."',
              freeKryptonite: 'Ficar isolado entre dois Defesas Centrais (DEC) físicos quando a equipa não consegue progredir.',
              proKryptonite1: 'Armadilhas de fora de jogo quando inicias o sprint a olhar para a bola em vez do ombro do último defesa.',
              proKryptonite2: 'Precipitação na primeira receção dentro da área quando tens meio segundo extra para enquadrar o remate.',
              proAntidote: 'Desmarcação em duplo movimento (finta ao primeiro poste e ataque ao ângulo cego do central) + finalização a 1 ou 2 toques.',
              bestDuoPartner: 'Médio Ofensivo (MPO) & Extremo (EXT)',
              bestDuoReason: 'Eles criam o desequilíbrio e os passes de rutura; tu transformas cada vantagem em golo.',
              proDuoSecret: 'Chave Pro: Inicia a corrida nas costas do central mais lento; ganharás meio metro decisivo antes que ele consiga rodar.',
              bestFormation: '4-3-3 Avançado Móvel de Área (97% Afinidade)',
              altFormation: '4-2-3-1 Ponta de Lança com #10 (95% Afinidade)',
              worstFormation: '5-4-1 Isolado a 50 metros da baliza (62% Afinidade - obriga-te a disputar bolas divididas longe da área)',
              week1Focus: ['Duplo movimento de desmarcação no ângulo cego do central', 'Finalização ao primeiro toque para os cantos inferiores', 'Jogo de costas: apoio frontal limpo para o MPO/MC'],
              week2Focus: ['Ataque ao primeiro poste em cruzamentos tensos', 'Receção orientada na área para eliminar o defesa num toque', 'Finalização 1v1 perante a saída do guarda-redes'],
              week3Focus: ['Ruturas em diagonal no limite do fora de jogo', 'Cabeceamento ofensivo em corrida', 'Pressão curva para forçar o erro do central'],
              week4Focus: ['Sangue-frio em ocasiões claras sob fadiga máxima', 'Leitura e reação a ressaltos na pequena área', 'Sincronização com os Extremos (EXT) em contra-ataques']
            }
          }
        };

        const activeLangMap = tacticalMetaByLang[lang] || tacticalMetaByLang.es;
        const meta = activeLangMap[posCode] || activeLangMap.MC;

        return (
          <div className="space-y-6">
            {/* 1. 16PERSONALITIES-STYLE ARCHETYPE IDENTITY & STORIES CARD BANNER */}
            <div className="bg-gradient-to-br from-slate-900 via-[#0b1325] to-black border border-volt/35 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-8xl font-black italic font-display text-volt/5 pointer-events-none select-none">
                {posCode}
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-volt/15 border border-volt/40 text-volt text-[10px] font-mono-code font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-volt" />
                      {lang === 'en' ? 'TACTICAL ARCHETYPE IDENTITY' : lang === 'pt' ? 'IDENTIDADE DE ARQUÉTIPO TÁTICO' : 'IDENTIDAD DE ARQUETIPO TÁCTICO'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-code font-bold uppercase">
                      {lang === 'en' ? `Rarity: ${meta.rarity}` : lang === 'pt' ? `Raridade: ${meta.rarity}` : `Rareza: ${meta.rarity}`}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black italic text-white font-display uppercase tracking-tight">
                    {result.primaryPosition.title} <span className="text-volt">({posCode})</span>
                  </h3>
                  <p className="text-xs sm:text-sm italic text-slate-300 font-medium">
                    {meta.motto}
                  </p>
                </div>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg shadow-volt/20"
                >
                  <Camera className="w-4 h-4 text-black" />
                  <span>{lang === 'en' ? 'Download Stories Card (9:16)' : lang === 'pt' ? 'Baixar Cartão Stories (9:16)' : 'Descargar Tarjeta Stories (9:16)'}</span>
                </button>
              </div>

              {/* 4 Polar Personality Scales (16Personalities Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-volt">{lang === 'en' ? 'Vertical Penetration' : lang === 'pt' ? 'Verticalidade Direta' : 'Verticalidad Directa'} ({scaleVerticality}%)</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Associative Control' : lang === 'pt' ? 'Pausa Associativa' : 'Pausa Asociativa'} ({100 - scaleVerticality}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div style={{ width: `${scaleVerticality}%` }} className="h-full bg-volt rounded-full" />
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-sky-400">{lang === 'en' ? '1v1 Creativity & Flair' : lang === 'pt' ? 'Criatividade & Desequilíbrio' : 'Creatividad & Desborde'} ({scaleCreativity}%)</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Tactical Discipline' : lang === 'pt' ? 'Rigor Posicional' : 'Rigor Posicional'} ({100 - scaleCreativity}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div style={{ width: `${scaleCreativity}%` }} className="h-full bg-sky-400 rounded-full" />
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-400">{lang === 'en' ? 'High Press Intensity' : lang === 'pt' ? 'Pressão Alta & Recuperação' : 'Presión Alta & Recuperación'} ({scalePressing}%)</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Positional Coverage' : lang === 'pt' ? 'Leitura de Cobertura' : 'Lectura de Cobertura'} ({100 - scalePressing}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div style={{ width: `${scalePressing}%` }} className="h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-amber-400">{lang === 'en' ? 'Athletic Power & Mentality' : lang === 'pt' ? 'Potência & Caráter' : 'Potencia & Carácter'} ({scalePower}%)</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Surgical Finesse' : lang === 'pt' ? 'Sutileza Técnica' : 'Sutileza Técnica'} ({100 - scalePower}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div style={{ width: `${scalePower}%` }} className="h-full bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 REAL TESTIMONIAL REWARD BANNER: 50% PRO UNLOCK FOR THIS 1 SINGLE EVALUATION */}
            {!hasProAccess && (
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-volt/40 rounded-2xl p-5 sm:p-6 shadow-xl">
                {(() => {
                  const isHalfUnlockedForThisEval =
                    rewardState.hasSubmittedReview && rewardState.unlockedEvaluationId === result.id;
                  const isUsedOnAnotherEval =
                    rewardState.hasSubmittedReview &&
                    rewardState.unlockedEvaluationId &&
                    rewardState.unlockedEvaluationId !== result.id &&
                    rewardState.unlockedEvaluationId !== 'PENDING_NEXT_EVAL';

                  if (isHalfUnlockedForThisEval) {
                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-code font-bold uppercase">
                            <Gift className="w-3.5 h-3.5" />
                            {lang === 'en'
                              ? '🎁 50% PRO REWARD UNLOCKED FOR THIS 1 EVALUATION'
                              : lang === 'pt'
                              ? '🎁 50% PRO DESBLOQUEADO NESTA 1 AVALIAÇÃO POR TESTEMUNHO'
                              : '🎁 50% PRO DESBLOQUEADO EN ESTA 1 EVALUACIÓN POR TU RESEÑA'}
                          </span>
                          <p className="text-xs text-slate-200">
                            {lang === 'en'
                              ? 'You unlocked 50% of the Pro modules below (Tactical Trap #2, Duo Combination Automatism, and Week 02 of the Micro-Cycle) exclusively for this evaluation.'
                              : lang === 'pt'
                              ? 'Desbloqueou metade (50%) dos módulos Pro abaixo (Armadilha #2, Automatismo de Dupla e Semana 02 do Micro-Ciclo) exclusivamente para esta avaliação.'
                              : 'Has desbloqueado la mitad (50%) de los módulos Pro abajo (Trampa Rival #2, Automatismo Letal de Dúo y Semana 02 del Micro-Ciclo) exclusivamente para esta evaluación.'}
                          </p>
                        </div>
                        {onOpenPricing && (
                          <button
                            onClick={onOpenPricing}
                            className="px-4 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider cursor-pointer shrink-0"
                          >
                            {lang === 'en'
                              ? 'Unlock Remaining 50% (Full Pro)'
                              : lang === 'pt'
                              ? 'Desbloquear Restantes 50% (Pro)'
                              : 'Desbloquear el 50% Restante (Plan Pro)'}
                          </button>
                        )}
                      </div>
                    );
                  }

                  if (isUsedOnAnotherEval) {
                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono-code font-bold uppercase">
                            <Gift className="w-3.5 h-3.5" />
                            {lang === 'en'
                              ? '1-EVALUATION REVIEW REWARD ALREADY USED'
                              : lang === 'pt'
                              ? 'RECOMPENSA DE 1 AVALIAÇÃO POR RESENHA JÁ UTILIZADA'
                              : 'RECOMPENSA DE 1 EVALUACIÓN POR RESEÑA YA UTILIZADA'}
                          </span>
                          <p className="text-xs text-slate-300">
                            {lang === 'en'
                              ? 'Your 50% review reward is valid for 1 single evaluation and was already applied to your previous evaluation. Upgrade to Pro for unlimited full evaluations.'
                              : lang === 'pt'
                              ? 'A sua recompensa de 50% por testemunho é válida para apenas 1 avaliação e já foi aplicada na sua avaliação anterior. Ative o Plano Pro para acesso total ilimitado.'
                              : 'Tu recompensa del 50% por reseña es válida para 1 sola evaluación y ya fue utilizada en tu evaluación anterior. Activa el Plan Pro para acceso total ilimitado.'}
                          </p>
                        </div>
                        {onOpenPricing && (
                          <button
                            onClick={onOpenPricing}
                            className="px-4 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider cursor-pointer shrink-0"
                          >
                            {lang === 'en' ? 'Get Full Pro Access' : lang === 'pt' ? 'Obter Plano Pro' : 'Obtener Plan Pro Total'}
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-volt/15 border border-volt/40 text-volt text-[10px] font-mono-code font-bold uppercase">
                            <Gift className="w-3.5 h-3.5" />
                            {lang === 'en'
                              ? 'FREE REWARD • 50% PRO UNLOCK (1 SINGLE EVALUATION)'
                              : lang === 'pt'
                              ? 'RECOMPENSA GRÁTIS • 50% PRO (1 ÚNICA AVALIAÇÃO)'
                              : 'RECOMPENSA GRATIS • 50% PRO (VÁLIDO POR 1 SOLA EVALUACIÓN)'}
                          </span>
                          <h4 className="text-base sm:text-lg font-black italic uppercase text-white font-display">
                            {lang === 'en'
                              ? 'Unlock 50% of This Evaluation Free by Posting Your Real Testimonial'
                              : lang === 'pt'
                              ? 'Desbloqueie 50% Desta Avaliação Grátis Deixando o Seu Testemunho Real'
                              : 'Desbloquea el 50% de Esta Evaluación Gratis Dejando tu Testimonio Real'}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {lang === 'en'
                              ? 'Leave an honest review for the community wall and immediately unlock half (50%) of the Pro tactical modules on this evaluation (1 evaluation per review).'
                              : lang === 'pt'
                              ? 'Deixe uma opinião honesta para o mural da comunidade e desbloqueie de imediato metade (50%) dos módulos Pro nesta avaliação (1 avaliação por resenha).'
                              : 'Publica tu opinión honesta para el muro de la comunidad y desbloquea al instante la mitad (50%) de los módulos Pro en esta evaluación (1 sola evaluación por reseña).'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                          className="px-5 py-3 rounded-xl bg-volt hover:bg-white text-black font-black italic uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg shadow-volt/20"
                        >
                          <MessageSquarePlus className="w-4 h-4 text-black" />
                          <span>
                            {lang === 'en'
                              ? 'Leave Real Review & Unlock 50%'
                              : lang === 'pt'
                              ? 'Deixar Testemunho & Desbloquear 50%'
                              : 'Dejar Reseña Real & Desbloquear 50%'}
                          </span>
                        </button>
                      </div>

                      <AnimatePresence>
                        {isReviewFormOpen && (
                          <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleClaimHalfProViaReview}
                            className="mt-5 pt-5 border-t border-white/10 space-y-4 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                                  {lang === 'en' ? 'Your Name *' : lang === 'pt' ? 'O Teu Nome *' : 'Tu Nombre *'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={reviewName}
                                  onChange={(e) => setReviewName(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                                  {lang === 'en' ? 'Position / Role' : lang === 'pt' ? 'Posição / Papel' : 'Posición / Rol'}
                                </label>
                                <input
                                  type="text"
                                  value={reviewRole}
                                  onChange={(e) => setReviewRole(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                                  {lang === 'en' ? 'Rating' : lang === 'pt' ? 'Classificação' : 'Calificación'} ({reviewRating}/5)
                                </label>
                                <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setReviewRating(s)}
                                      className="p-0.5 cursor-pointer"
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1 font-bold">
                                {lang === 'en'
                                  ? 'Your Real Testimonial *'
                                  : lang === 'pt'
                                  ? 'O Teu Testemunho Real *'
                                  : 'Tu Testimonio Real *'}
                              </label>
                              <textarea
                                required
                                minLength={5}
                                rows={2}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder={
                                  lang === 'en'
                                    ? 'How accurate was your tactical archetype and position diagnosis?'
                                    : lang === 'pt'
                                    ? 'O que achou da precisão do seu diagnóstico tático e posição ideal?'
                                    : '¿Qué te pareció la precisión de tu diagnóstico táctico y posición ideal?'
                                }
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-volt"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setIsReviewFormOpen(false)}
                                className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-bold uppercase cursor-pointer"
                              >
                                {lang === 'en' ? 'Cancel' : 'Cancelar'}
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmittingReview || !reviewName.trim() || reviewComment.trim().length < 5}
                                className="px-5 py-2 rounded-xl bg-volt hover:bg-white disabled:opacity-50 text-black font-black italic uppercase text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>
                                  {lang === 'en'
                                    ? 'Publish & Unlock 50% Now'
                                    : lang === 'pt'
                                    ? 'Publicar & Desbloquear 50%'
                                    : 'Publicar & Desbloquear 50% Ahora'}
                                </span>
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 2. KRYPTONITE & DUO CHEMISTRY GRID (WITH PRO FOMO & 50% SINGLE-EVAL REVIEW UNLOCK) */}
            {(() => {
              const isHalfUnlocked =
                !hasProAccess &&
                rewardState.hasSubmittedReview &&
                rewardState.unlockedEvaluationId === result.id;

              return (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card A: Tu Kriptonita en la Cancha */}
                    <div className="bg-slate-900/60 border border-red-500/25 rounded-2xl p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                            {lang === 'en' ? 'TACTICAL KRYPTONITE & BLIND SPOTS' : lang === 'pt' ? 'A TUA KRIPTONITA EM CAMPO' : 'TU KRIPTONITA EN LA CANCHA'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {hasProAccess
                              ? lang === 'en'
                                ? '100% PRO UNLOCKED'
                                : '100% PRO DESBLOQUEADO'
                              : isHalfUnlocked
                              ? lang === 'en'
                                ? '🎁 50% UNLOCKED (REVIEW)'
                                : '🎁 50% DESBLOQUEADO (RESEÑA)'
                              : lang === 'en'
                              ? '1/4 VISIBLE'
                              : '1/4 VISIBLE'}
                          </span>
                        </div>

                        <h4 className="text-lg font-black italic text-white font-display uppercase">
                          {lang === 'en'
                            ? `How Opponents Try to Neutralize a ${result.primaryPosition.title}`
                            : lang === 'pt'
                            ? `Como os Adversários Tentam Anular um ${result.primaryPosition.title}`
                            : `Cómo Intentan Anular a un ${result.primaryPosition.title}`}
                        </h4>

                        {/* Free Visible Blind Spot #1 */}
                        <div className="p-3.5 rounded-xl bg-black/50 border border-red-500/20 space-y-1">
                          <div className="text-[10px] font-mono font-bold text-red-400 uppercase">
                            ⚠️ {lang === 'en' ? 'Primary Vulnerability (Detected)' : lang === 'pt' ? 'Ponto Cego #1 (Detetado)' : 'Punto Ciego #1 (Detectado)'}
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {meta.freeKryptonite}
                          </p>
                        </div>

                        {/* Item #2: Unlocked if Pro OR if 50% Review Reward is active for this single evaluation (2/4 = 50%) */}
                        {(hasProAccess || isHalfUnlocked) && (
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                🎯 {lang === 'en' ? 'Tactical Trap #2' : lang === 'pt' ? 'Armadilha Adversária #2' : 'Trampa Rival #2 en Partido'}
                              </span>
                              {isHalfUnlocked && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase">
                                  {lang === 'en' ? '🎁 50% REVIEW REWARD' : lang === 'pt' ? '🎁 50% POR RESENHA' : '🎁 50% POR TU RESEÑA'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {meta.proKryptonite1}
                            </p>
                          </div>
                        )}

                        {/* Remaining 50% (Items #3 & #4 - Strictly Pro Only) */}
                        <div className="relative">
                          <div className={`space-y-3 transition-all ${!hasProAccess ? 'blur-[5px] select-none pointer-events-none opacity-60' : ''}`}>
                            {!hasProAccess && !isHalfUnlocked && (
                              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                  🎯 {lang === 'en' ? 'Tactical Trap #2' : lang === 'pt' ? 'Armadilha Adversária #2' : 'Trampa Rival #2 en Partido'}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {meta.proKryptonite1}
                                </p>
                              </div>
                            )}

                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                ⚡ {lang === 'en' ? 'Critical Habit to Fix #3' : lang === 'pt' ? 'Quebra de Rendimento #3' : 'Fuga de Rendimiento #3'}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {meta.proKryptonite2}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                                🛡️ {lang === 'en' ? 'Strike Pro Tactical Antidote' : lang === 'pt' ? 'Antídoto Tático Strike Pro' : 'Antídoto Táctico Strike Pro'}
                              </div>
                              <p className="text-xs text-emerald-200 leading-relaxed">
                                {meta.proAntidote}
                              </p>
                            </div>
                          </div>

                          {!hasProAccess && onOpenPricing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] rounded-xl p-4 text-center border border-volt/30">
                              <Lock className="w-6 h-6 text-volt mb-2" />
                              <div className="text-xs font-black uppercase italic text-white font-display">
                                {isHalfUnlocked
                                  ? lang === 'en'
                                    ? 'Remaining 50%: Blind Spot #3 + Strike Pro Antidote'
                                    : lang === 'pt'
                                    ? '50% Restantes: Ponto Cego #3 + Antídoto Tático'
                                    : '50% Restante: Punto Ciego #3 + Antídoto Táctico'
                                  : lang === 'en'
                                  ? '2 Hidden Blind Spots & Tactical Antidote'
                                  : lang === 'pt'
                                  ? '2 Pontos Cegos Ocultos + Antídoto Tático'
                                  : '2 Puntos Ciegos Ocultos + Antídoto Táctico'}
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 max-w-xs">
                                {lang === 'en'
                                  ? 'Unlock the complete 100% Kryptonite diagnosis and exact counter-movement with Pro.'
                                  : lang === 'pt'
                                  ? 'Desbloqueie 100% do diagnóstico de Kriptonita e o antídoto tático completo com o Plano Pro.'
                                  : 'Desbloquea el 100% del diagnóstico de Kriptonita y el antídoto táctico completo con el Plan Pro.'}
                              </p>
                              <button
                                onClick={onOpenPricing}
                                className="mt-3 px-4 py-2 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-[11px] tracking-wider transition-all cursor-pointer shadow-md shadow-volt/20"
                              >
                                {lang === 'en' ? 'Unlock 100% Kryptonite Analysis' : lang === 'pt' ? 'Desbloquear 100% Análise Pro' : 'Desbloquear 100% Análisis Pro'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card B: Química de Dúo y Ecosistema Táctico Ideal */}
                    <div className="bg-slate-900/60 border border-sky-500/25 rounded-2xl p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-sky-400" />
                            {lang === 'en' ? 'DUO CHEMISTRY & IDEAL ECOSYSTEM' : lang === 'pt' ? 'QUÍMICA DE DUPLA & ECOSSISTEMA IDEAL' : 'QUÍMICA DE DÚO & ECOSISTEMA IDEAL'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {hasProAccess
                              ? lang === 'en'
                                ? '100% PRO UNLOCKED'
                                : '100% PRO DESBLOQUEADO'
                              : isHalfUnlocked
                              ? lang === 'en'
                                ? '🎁 50% UNLOCKED (REVIEW)'
                                : '🎁 50% DESBLOQUEADO (RESEÑA)'
                              : lang === 'en'
                              ? '1/4 VISIBLE'
                              : '1/4 VISIBLE'}
                          </span>
                        </div>

                        <h4 className="text-lg font-black italic text-white font-display uppercase">
                          {lang === 'en'
                            ? 'Best Teammate Synergy & Tactical System Fit'
                            : lang === 'pt'
                            ? 'O Teu Melhor Parceiro em Campo e Sistemas Ideais'
                            : 'Tu Mejor Socio en Cancha y Sistemas Ideales'}
                        </h4>

                        {/* Free Visible Best Partner & #1 System */}
                        <div className="p-3.5 rounded-xl bg-black/50 border border-sky-500/20 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                              🤝 {lang === 'en' ? 'Ideal Pitch Partner:' : lang === 'pt' ? 'Parceiro Ideal em Campo:' : 'Tu Socio Ideal en Cancha:'}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-volt bg-volt/10 px-2 py-0.5 rounded">
                              {meta.bestFormation}
                            </span>
                          </div>
                          <div className="text-sm font-black italic text-white font-display uppercase">
                            {meta.bestDuoPartner}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {meta.bestDuoReason}
                          </p>
                        </div>

                        {/* Item #2: Pro Duo Automatism — Unlocked if Pro OR if 50% Review Reward is active for this evaluation (2/4 = 50%) */}
                        {(hasProAccess || isHalfUnlocked) && (
                          <div className="p-3.5 rounded-xl bg-volt/10 border border-volt/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-volt uppercase">
                                ⚡ {lang === 'en' ? 'Pro Combination Automatism' : lang === 'pt' ? 'Automatismo Letal de Dupla' : 'Automatismo Letal de Sociedad'}
                              </span>
                              {isHalfUnlocked && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase">
                                  {lang === 'en' ? '🎁 50% REVIEW REWARD' : lang === 'pt' ? '🎁 50% POR RESENHA' : '🎁 50% POR TU RESEÑA'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {meta.proDuoSecret}
                            </p>
                          </div>
                        )}

                        {/* Remaining 50% (Alt Formation & Worst Formation - Strictly Pro Only) */}
                        <div className="relative">
                          <div className={`space-y-3 transition-all ${!hasProAccess ? 'blur-[5px] select-none pointer-events-none opacity-60' : ''}`}>
                            {!hasProAccess && !isHalfUnlocked && (
                              <div className="p-3.5 rounded-xl bg-volt/10 border border-volt/30 space-y-1">
                                <div className="text-[10px] font-mono font-bold text-volt uppercase">
                                  ⚡ {lang === 'en' ? 'Pro Combination Automatism' : lang === 'pt' ? 'Automatismo Letal de Dupla' : 'Automatismo Letal de Sociedad'}
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                  {meta.proDuoSecret}
                                </p>
                              </div>
                            )}

                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                                ✅ {lang === 'en' ? 'Secondary High-Fit System' : lang === 'pt' ? 'Segundo Esquema Compatível' : 'Segundo Esquema Compatible'}
                              </div>
                              <p className="text-xs text-slate-300">
                                {meta.altFormation}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 space-y-1">
                              <div className="text-[10px] font-mono font-bold text-red-400 uppercase">
                                🚫 {lang === 'en' ? 'System That Limits Your DNA' : lang === 'pt' ? 'Esquema Onde o Teu Perfil Sofre' : 'Esquema donde Sufre tu Perfil'}
                              </div>
                              <p className="text-xs text-slate-300">
                                {meta.worstFormation}
                              </p>
                            </div>
                          </div>

                          {!hasProAccess && onOpenPricing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] rounded-xl p-4 text-center border border-sky-500/30">
                              <Lock className="w-6 h-6 text-sky-400 mb-2" />
                              <div className="text-xs font-black uppercase italic text-white font-display">
                                {isHalfUnlocked
                                  ? lang === 'en'
                                    ? 'Remaining 50%: Alternative & Limiting Tactical Systems'
                                    : lang === 'pt'
                                    ? '50% Restantes: Segundo Esquema + Sistema que te Limita'
                                    : '50% Restante: Segundo Esquema + Sistema que te Limita'
                                  : lang === 'en'
                                  ? 'Unlock Duo Automatisms & System Friction'
                                  : lang === 'pt'
                                  ? 'Automatismo de Dupla + Esquemas que te Limitam'
                                  : 'Automatismo de Dúo + Esquemas que te Limitan'}
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 max-w-xs">
                                {lang === 'en'
                                  ? 'Unlock 100% of your tactical ecosystem compatibility and formation friction analysis.'
                                  : lang === 'pt'
                                  ? 'Desbloqueie 100% da compatibilidade de sistemas táticos com o Plano Pro.'
                                  : 'Desbloquea el 100% de compatibilidad de sistemas tácticos con el Plan Pro.'}
                              </p>
                              <button
                                onClick={onOpenPricing}
                                className="mt-3 px-4 py-2 rounded-xl bg-sky-400 hover:bg-white text-black font-black uppercase italic text-[11px] tracking-wider transition-all cursor-pointer shadow-md"
                              >
                                {lang === 'en' ? 'Unlock 100% Tactical Chemistry' : lang === 'pt' ? 'Desbloquear 100% Química Pro' : 'Desbloquear 100% Química Pro'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. 4-WEEK EVOLUTION MICRO-CYCLE ROADMAP (WEEK 1 FREE, WEEK 2 UNLOCKED ON 50% REVIEW REWARD = 2/4 WEEKS, WEEKS 3-4 PRO) */}
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-volt/15 border border-volt/30 text-volt text-[10px] font-mono-code font-bold uppercase inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-volt" />
                            {lang === 'en' ? '4-WEEK STRIKE PRO MICRO-CYCLE' : lang === 'pt' ? 'MICRO-CICLO EVOLUTIVO DE 4 SEMANAS' : 'MICRO-CICLO EVOLUTIVO DE 4 SEMANAS'}
                          </span>
                          {isHalfUnlocked && (
                            <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono-code font-bold uppercase">
                              {lang === 'en'
                                ? '🎁 2 OF 4 WEEKS UNLOCKED (50% REVIEW REWARD)'
                                : lang === 'pt'
                                ? '🎁 2 DE 4 SEMANAS DESBLOQUEADAS (50% POR RESENHA)'
                                : '🎁 2 DE 4 SEMANAS DESBLOQUEADAS (50% POR TU RESEÑA)'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black italic text-white font-display uppercase mt-2">
                          {lang === 'en'
                            ? `Monthly Progression Roadmap for ${result.primaryPosition.title}`
                            : lang === 'pt'
                            ? `Plano Mensal de Progressão para ${result.primaryPosition.title}`
                            : `Plan Mensual de Progresión para ${result.primaryPosition.title}`}
                        </h3>
                      </div>
                      {!hasProAccess && onOpenPricing && (
                        <button
                          onClick={onOpenPricing}
                          className="px-4 py-2 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-volt/20"
                        >
                          {isHalfUnlocked
                            ? lang === 'en'
                              ? 'Unlock Weeks 03 & 04 (Full Pro)'
                              : lang === 'pt'
                              ? 'Desbloquear Semanas 03 e 04 (Pro)'
                              : 'Desbloquear Semanas 03 y 04 (Plan Pro)'
                            : lang === 'en'
                            ? 'Unlock Full 4-Week Plan'
                            : lang === 'pt'
                            ? 'Desbloquear Mês Completo'
                            : 'Desbloquear Mes Completo'}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Week 1 - Open to All */}
                      <div className="bg-black/50 border border-volt/40 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono text-volt uppercase">
                            {lang === 'en' ? 'WEEK 01' : 'SEMANA 01'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-volt text-black text-[9px] font-mono font-black uppercase">
                            {lang === 'en' ? 'OPEN' : 'GRATIS'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white uppercase italic font-display">
                          {lang === 'en' ? 'DNA Activation & Body Profile' : lang === 'pt' ? 'Ativação de ADN e Perfil Corporal' : 'Activación de ADN y Perfil Corporal'}
                        </div>
                        <ul className="space-y-2 text-[11px] text-slate-300">
                          {meta.week1Focus.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-volt shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weeks 2, 3, 4 — Week 2 (idx === 0) is unlocked when isHalfUnlocked is true (so 2/4 = 50% unlocked) */}
                      {[
                        {
                          weekLabel: lang === 'en' ? 'WEEK 02' : 'SEMANA 02',
                          title: lang === 'en' ? 'Under-Pressure Automatisms (1.5s)' : lang === 'pt' ? 'Automatismos Sob Pressão (1.5s)' : 'Automatismos Bajo Presión (1.5s)',
                          items: meta.week2Focus
                        },
                        {
                          weekLabel: lang === 'en' ? 'WEEK 03' : 'SEMANA 03',
                          title: lang === 'en' ? 'Hot-Zone Mastery & Duo Synergy' : lang === 'pt' ? 'Domínio de Zona Quente e Dupla' : 'Dominio de Zona Caliente y Sociedad',
                          items: meta.week3Focus
                        },
                        {
                          weekLabel: lang === 'en' ? 'WEEK 04' : 'SEMANA 04',
                          title: lang === 'en' ? 'Match-Day Peak & Critical Scenarios' : lang === 'pt' ? 'Pico Competitivo de Jogo (90m)' : 'Pico Competitivo de Partido (90m)',
                          items: meta.week4Focus
                        }
                      ].map((wk, idx) => {
                        const isWeekUnlocked = hasProAccess || (isHalfUnlocked && idx === 0);
                        return (
                          <div
                            key={idx}
                            className={`rounded-xl p-4 space-y-3 relative overflow-hidden ${
                              isWeekUnlocked
                                ? 'bg-black/50 border border-emerald-500/40'
                                : 'bg-black/40 border border-white/10'
                            }`}
                          >
                            <div className={!isWeekUnlocked ? 'blur-[4px] select-none pointer-events-none opacity-60 space-y-3' : 'space-y-3'}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black font-mono text-slate-300 uppercase">
                                  {wk.weekLabel}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                    isHalfUnlocked && idx === 0
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-white/10 text-volt'
                                  }`}
                                >
                                  {isHalfUnlocked && idx === 0
                                    ? lang === 'en'
                                      ? '🎁 50% REWARD'
                                      : '🎁 50% RESEÑA'
                                    : 'PRO'}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-white uppercase italic font-display">
                                {wk.title}
                              </div>
                              <ul className="space-y-2 text-[11px] text-slate-300">
                                {wk.items.map((item, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {!isWeekUnlocked && onOpenPricing && (
                              <div
                                onClick={onOpenPricing}
                                className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-slate-950/50 transition-colors"
                              >
                                <Lock className="w-4 h-4 text-volt mb-1" />
                                <span className="text-[11px] font-black uppercase italic text-white font-display">
                                  {wk.weekLabel} • {lang === 'en' ? 'PRO PLAN' : lang === 'pt' ? 'PLANO PRO' : 'PLAN PRO'}
                                </span>
                                <span className="text-[10px] text-volt underline mt-1">
                                  {lang === 'en' ? 'Tap to unlock' : lang === 'pt' ? 'Toque para desbloquear' : 'Toca para desbloquear'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        );
      })()}

      {/* Gemini AI Deep Analysis Trigger Card */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-volt font-bold text-[10px] uppercase tracking-widest border border-white/10 font-mono-code">
              <Sparkles className="w-3.5 h-3.5" />
              IA SCOUTING ENGINE
            </span>
            <h3 className="text-2xl font-black italic text-white font-display uppercase">
              {lang === 'en'
                ? 'Generate In-Depth Technical Report with AI'
                : lang === 'pt'
                ? 'Gerar Relatório Técnico Aprofundado com IA'
                : 'Generar Informe Técnico Profundo con IA'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Get a tailored scouting report, recommended pro signature move, and personalized training guidelines.'
                : lang === 'pt'
                ? 'Obtenha um relatório personalizado de scouting, movimento pro de assinatura e diretrizes de treino.'
                : 'Obtén un informe personalizado de scouting, movimiento pro recomendado y directrices de entrenamiento generadas al instante.'}
            </p>
          </div>

          <button
            onClick={handleGenerateAIReport}
            disabled={aiLoading}
            className="px-6 py-3.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-volt/15 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            {aiLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>{lang === 'en' ? 'Analyzing DNA...' : lang === 'pt' ? 'A analisar ADN...' : 'Analizando ADN...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black text-black" />
                <span>{lang === 'en' ? 'Analyze with AI' : lang === 'pt' ? 'Analisar com IA' : 'Analizar con IA'}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Display */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-white/10 space-y-4"
          >
            <h4 className="text-lg font-black italic text-volt font-display uppercase">
              {aiAnalysis.analysisTitle || (lang === 'en' ? 'AI Tactical Scouting Report' : lang === 'pt' ? 'Relatório de Scouting Tático IA' : 'Informe Táctico Scouting IA')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {aiAnalysis.tacticalOverview}
            </p>

            {aiAnalysis.signatureMove && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-bold text-volt uppercase tracking-wider block mb-1 font-mono-code">
                  {lang === 'en' ? 'Recommended Pro Move:' : lang === 'pt' ? 'Movimento Pro Recomendado:' : 'Movimiento Pro Recomendado:'}
                </span>
                <span className="text-xs font-bold text-white uppercase italic font-display">{aiAnalysis.signatureMove}</span>
              </div>
            )}

            {aiAnalysis.proQuote && (
              <p className="text-xs italic text-slate-400 bg-black/40 p-3 rounded-lg border border-white/5">
                "{aiAnalysis.proQuote}"
              </p>
            )}
          </motion.div>
        )}

        {aiError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono-code">
            {aiError}
          </div>
        )}
      </div>

      {/* Recommended Drills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] flex items-center gap-2 font-mono-code">
            <BookOpen className="w-4 h-4 text-volt" />
            {t.recommendedDrillsTitle}
          </h2>
          <span className="text-[10px] text-slate-500 font-mono-code">
            {lang === 'en' ? '3 GENERATED DRILLS' : lang === 'pt' ? '3 EXERCÍCIOS GERADOS' : '3 EJERCICIOS GENERADOS'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.recommendedDrills.map((drill, idx) => {
            const localizedDrill = getLocalizedDrills(lang).find((d) => d.id === drill.id) || drill;
            return (
              <div key={drill.id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">{drill.durationMinutes} MINS</span>
                  </div>

                  <h4 className="text-base font-black italic text-white font-display uppercase">
                    {localizedDrill.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {localizedDrill.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs space-y-1 text-slate-400">
                  <div>• <strong className="text-slate-200">{lang === 'en' ? 'Sets:' : lang === 'pt' ? 'Séries:' : 'Series:'}</strong> {drill.sets}</div>
                  <div>• <strong className="text-slate-200">{lang === 'en' ? 'Reps:' : lang === 'pt' ? 'Reps:' : 'Reps:'}</strong> {drill.reps}</div>
                  <div className="mt-2 text-[11px] text-volt italic">💡 {localizedDrill.proTip}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Deep Dive Modal */}
      <PositionDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        assessmentResult={result}
        initialPosition={result.primaryPosition.code}
      />

      {/* 16Personalities-Style Share Report Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Sparkles, UserCheck, ShieldCheck, Flame, ChevronRight, 
  RotateCcw, Bookmark, Share2, BookOpen, AlertCircle, CheckCircle2,
  Zap, Award, Play, Users, FileDown, Download, Link2, Check, Globe
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

            {/* 2. Native Web Share Button */}
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
              title={lang === 'en' ? 'Download Official UEFA Pro PDF Scouting Report' : lang === 'pt' ? 'Descarregar Relatório Oficial PDF' : 'Descargar Informe Oficial PDF UEFA Pro'}
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
                    ? 'UEFA Pro Academy Membership active. Full access to roster files and Starting XI line-up builder.'
                    : lang === 'pt'
                    ? 'Subscrição Modo Academia UEFA Pro ativa. Acesso total a fichas de alunos e Onze Ideal.'
                    : 'Membresía Modo Academia UEFA Pro activa. Acceso total a cantera y armado de once.'}
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

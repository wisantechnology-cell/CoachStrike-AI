import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Award,
  FileText,
  Camera,
  ExternalLink,
  Link2,
  Globe
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { AssessmentResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generatePdfReport } from '../utils/pdfGenerator';
import { buildReportShareUrl, copyReportLinkToClipboard } from '../utils/shareLink';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AssessmentResult;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const { lang } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  if (!isOpen) return null;

  const t = {
    en: {
      modalTitle: 'Share Full Report & Tactical DNA',
      modalSubtitle: 'Share your official 16Personalities-style footballer profile and full interactive report link',
      dnaBadge: 'COACHSTRIKE TACTICAL ARCHETYPE',
      affinityWith: 'PRO PLAYER BENCHMARK',
      matchScore: 'IDEAL MATCH',
      traitsTitle: 'TACTICAL DNA PERSONALITY SCALES',
      trait1Left: 'Direct Penetration',
      trait1Right: 'Associative Build-up',
      trait2Left: 'Spontaneous Creativity',
      trait2Right: 'Tactical Rigor',
      trait3Left: 'High Press Intensity',
      trait3Right: 'Positional Rest',
      trait4Left: 'Explosive Athleticism',
      trait4Right: 'Technical Precision',
      publicLinkLabel: 'PUBLIC LINK TO VIEW ENTIRE REPORT',
      publicLinkDesc: 'Anyone with this link can view the complete interactive evaluation report on any device.',
      btnCopyLink: 'Copy Full Report Link',
      btnOpenLink: 'Open Link',
      btnCopyText: 'Copy Summary',
      btnDownloadImage: 'Save Card Image (PNG)',
      btnDownloadPdf: 'Download PDF Report',
      copied: 'Link Copied!',
      textCopied: 'Summary Copied!',
      shareSuccess: 'Card image saved! Share it on your stories or group chats.',
      signatureQuote: '"Football is played with your head; your legs are just the tools."',
      shareHeader: '⚡ My Tactical DNA Result on CoachStrike AI:',
      shareCallToAction: 'Click the link to view my full report and take the test:'
    },
    es: {
      modalTitle: 'Compartir Informe Completo & ADN Táctico',
      modalSubtitle: 'Comparte tu tarjeta estilo 16Personalidades y el enlace directo para ver tu informe completo',
      dnaBadge: 'ARQUETIPO TÁCTICO COACHSTRIKE',
      affinityWith: 'COMPARATIVA PROFESIONAL',
      matchScore: 'COMPATIBILIDAD',
      traitsTitle: 'ESCALAS DE PERSONALIDAD TÁCTICA',
      trait1Left: 'Penetración Vertical',
      trait1Right: 'Juego Asociativo',
      trait2Left: 'Creatividad & Desborde',
      trait2Right: 'Rigor Posicional',
      trait3Left: 'Presión Alta e Intensidad',
      trait3Right: 'Gestión de Energía',
      trait4Left: 'Potencia Atlética',
      trait4Right: 'Precisión Quirúrgica',
      publicLinkLabel: 'ENLACE PÚBLICO AL INFORME COMPLETO',
      publicLinkDesc: 'Cualquier persona que haga clic en este enlace podrá ver tu informe técnico completo interactivo.',
      btnCopyLink: 'Copiar Enlace del Reporte',
      btnOpenLink: 'Abrir Enlace',
      btnCopyText: 'Copiar Resumen',
      btnDownloadImage: 'Descargar Tarjeta (PNG)',
      btnDownloadPdf: 'Descargar Ficha PDF',
      copied: '¡Enlace Copiado!',
      textCopied: '¡Resumen Copiado!',
      shareSuccess: '¡Tarjeta guardada! Compártela en tus redes o grupo de vestuario.',
      signatureQuote: '"El fútbol se juega con la cabeza; las piernas son solo tus herramientas."',
      shareHeader: '⚡ Mi Resultado de ADN Táctico en CoachStrike AI:',
      shareCallToAction: 'Haz clic en el enlace para ver mi informe completo o hacer tu propio test:'
    },
    pt: {
      modalTitle: 'Partilhar Relatório Completo & ADN Tático',
      modalSubtitle: 'Partilhe o seu cartão estilo 16Personalities e o link direto para ver o seu relatório completo',
      dnaBadge: 'ARQUÉTIPO TÁTICO COACHSTRIKE',
      affinityWith: 'BENCHMARK PROFISSIONAL',
      matchScore: 'COMPATIBILIDADE',
      traitsTitle: 'ESCALAS DE PERSONALIDADE TÁTICA',
      trait1Left: 'Rutura Vertical',
      trait1Right: 'Jogo Associativo',
      trait2Left: 'Criatividade Espontânea',
      trait2Right: 'Rigor Posicional',
      trait3Left: 'Pressão Alta e Intensidad',
      trait3Right: 'Gestão Posicional',
      trait4Left: 'Potência Atlética',
      trait4Right: 'Precisão Cirúrgica',
      publicLinkLabel: 'LINK PÚBLICO PARA O RELATÓRIO COMPLETO',
      publicLinkDesc: 'Qualquer pessoa com este link pode abrir e ver o seu relatório técnico completo interativo.',
      btnCopyLink: 'Copiar Link do Relatório',
      btnOpenLink: 'Abrir Link',
      btnCopyText: 'Copiar Resumo',
      btnDownloadImage: 'Guardar Cartão (PNG)',
      btnDownloadPdf: 'Descarregar Ficha PDF',
      copied: 'Link Copiado!',
      textCopied: 'Resumo Copiado!',
      shareSuccess: 'Cartão guardado! Partilhe nas suas redes ou balneário.',
      signatureQuote: '"O futebol joga-se com a cabeça; as pernas são apenas as tuas ferramentas."',
      shareHeader: '⚡ O meu resultado de ADN Tático no CoachStrike AI:',
      shareCallToAction: 'Clique no link para ver o meu relatório completo ou fazer o teste:'
    }
  }[lang] || {
    modalTitle: 'Share Full Report & Tactical DNA',
    modalSubtitle: 'Share your official 16Personalities-style footballer profile and full interactive report link',
    dnaBadge: 'COACHSTRIKE TACTICAL ARCHETYPE',
    affinityWith: 'PRO PLAYER BENCHMARK',
    matchScore: 'IDEAL MATCH',
    traitsTitle: 'TACTICAL DNA PERSONALITY SCALES',
    trait1Left: 'Direct Penetration',
    trait1Right: 'Associative Build-up',
    trait2Left: 'Spontaneous Creativity',
    trait2Right: 'Tactical Rigor',
    trait3Left: 'High Press Intensity',
    trait3Right: 'Positional Rest',
    trait4Left: 'Explosive Athleticism',
    trait4Right: 'Technical Precision',
    publicLinkLabel: 'PUBLIC LINK TO VIEW ENTIRE REPORT',
    publicLinkDesc: 'Anyone with this link can view the complete interactive evaluation report on any device.',
    btnCopyLink: 'Copy Full Report Link',
    btnOpenLink: 'Open Link',
    btnCopyText: 'Copy Summary',
    btnDownloadImage: 'Save Card Image (PNG)',
    btnDownloadPdf: 'Download PDF Report',
    copied: 'Link Copied!',
    textCopied: 'Summary Copied!',
    shareSuccess: 'Card image saved! Share it on your stories or group chats.',
    signatureQuote: '"Football is played with your head; your legs are just the tools."',
    shareHeader: '⚡ My Tactical DNA Result on CoachStrike AI:',
    shareCallToAction: 'Click the link to view my full report and take the test:'
  };

  // Trait scale calculations based on 8 skills
  const traitDirectness = Math.min(95, Math.max(15, Math.round((result.skills.speed * 0.6 + result.skills.finishing * 0.4))));
  const traitCreativity = Math.min(95, Math.max(15, Math.round((result.skills.technique * 0.7 + result.skills.mental * 0.3))));
  const traitPressing = Math.min(95, Math.max(15, Math.round((result.skills.defending * 0.6 + result.skills.physical * 0.4))));
  const traitAthleticism = Math.min(95, Math.max(15, Math.round((result.skills.physical * 0.6 + result.skills.speed * 0.4))));

  const shareUrl = buildReportShareUrl(result);

  const handleCopyLink = async () => {
    await copyReportLinkToClipboard(result);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopySummaryText = () => {
    const summary = `${t.shareHeader}\n👤 ${result.playerName} (${result.preferredFoot})\n⚽ Pos: ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}% Match)\n🌟 Pro Benchmark: ${result.proComparison.player.name} (${result.proComparison.matchPercentage}% Affinity)\n📊 PAC:${result.skills.speed} | TEC:${result.skills.technique} | PAS:${result.skills.passing} | TAC:${result.skills.tacticalIQ}\n\n🔗 ${t.shareCallToAction}\n${shareUrl}`;
    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CoachStrike AI • ${result.playerName} Tactical DNA Report`,
          text: `⚽ ${result.playerName} is a ${result.primaryPosition.title} (${result.primaryPosition.matchPercentage}% Match). View full report:`,
          url: shareUrl
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#070b16'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `CoachStrike_Persona_${result.playerName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting card image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-volt flex items-center justify-center text-black font-black italic">
              <Share2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white uppercase italic font-display flex items-center gap-2">
                {t.modalTitle}
              </h2>
              <p className="text-[11px] text-slate-400">
                {t.modalSubtitle}
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

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Public Link Box - Direct URL to view the entire interactive report */}
          <div className="p-4 rounded-2xl bg-volt/10 border border-volt/30 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-volt font-bold text-xs uppercase tracking-wider font-mono-code">
                <Globe className="w-4 h-4 text-volt" />
                <span>{t.publicLinkLabel}</span>
              </div>
              <span className="text-[10px] text-volt bg-black/40 px-2 py-0.5 rounded font-mono font-bold">
                16Personalities style
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {t.publicLinkDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 truncate select-all flex items-center gap-2">
                <Link2 className="w-4 h-4 text-volt shrink-0" />
                <span className="truncate">{shareUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black italic uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-volt/20"
              >
                {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                <span>{copiedLink ? t.copied : t.btnCopyLink}</span>
              </button>
            </div>
          </div>

          {/* Printable / Capturable 16Personalities-Style Tactical Card */}
          <div
            ref={cardRef}
            className="rounded-2xl bg-gradient-to-br from-[#0c1324] via-[#080d1a] to-[#04070d] border-2 border-volt/40 p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Background Aesthetic Watermark */}
            <div className="absolute top-0 right-0 p-3 opacity-5 text-7xl font-black italic font-display text-volt pointer-events-none select-none -rotate-12">
              DNA
            </div>

            {/* Top Archetype Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-md shadow-volt/50 animate-pulse" />
                <span className="text-[10px] font-black font-mono tracking-widest text-volt uppercase">
                  {t.dnaBadge}
                </span>
              </div>
              <span className="text-[10px] font-mono-code font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                #STK-{result.id.slice(-4).toUpperCase()}
              </span>
            </div>

            {/* Persona Hero Section */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-volt font-mono font-bold uppercase tracking-wider block">
                  {result.primaryPosition.code} • {result.preferredFoot}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black italic text-white font-display uppercase tracking-tight leading-none mt-1">
                  {result.playerName}
                </h3>
                <div className="text-lg font-black italic text-volt font-display uppercase mt-1">
                  {result.primaryPosition.title}
                </div>
              </div>

              {/* Match Percentage Pill */}
              <div className="text-right sm:shrink-0 bg-black/60 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-2xl sm:text-3xl font-black italic font-display text-volt leading-none">
                  {result.primaryPosition.matchPercentage}%
                </span>
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 mt-1">
                  {t.matchScore}
                </span>
              </div>
            </div>

            {/* 16Personalities-Style Polar Trait Scale Bars */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-volt" />
                {t.traitsTitle}
              </div>

              {/* Trait 1: Direct Penetration vs Associative Play */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span className="text-volt">{t.trait1Left} ({traitDirectness}%)</span>
                  <span className="text-slate-400">{t.trait1Right} ({100 - traitDirectness}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div
                    style={{ width: `${traitDirectness}%` }}
                    className="bg-volt h-full rounded-full shadow-sm shadow-volt/30"
                  />
                </div>
              </div>

              {/* Trait 2: Creativity vs Tactical Rigor */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span className="text-sky-400">{t.trait2Left} ({traitCreativity}%)</span>
                  <span className="text-slate-400">{t.trait2Right} ({100 - traitCreativity}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div
                    style={{ width: `${traitCreativity}%` }}
                    className="bg-sky-400 h-full rounded-full shadow-sm shadow-sky-400/30"
                  />
                </div>
              </div>

              {/* Trait 3: High Press vs Energy Management */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{t.trait3Left} ({traitPressing}%)</span>
                  <span className="text-slate-400">{t.trait3Right} ({100 - traitPressing}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div
                    style={{ width: `${traitPressing}%` }}
                    className="bg-emerald-400 h-full rounded-full shadow-sm shadow-emerald-400/30"
                  />
                </div>
              </div>

              {/* Trait 4: Athleticism vs Precision */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-400">{t.trait4Left} ({traitAthleticism}%)</span>
                  <span className="text-slate-400">{t.trait4Right} ({100 - traitAthleticism}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div
                    style={{ width: `${traitAthleticism}%` }}
                    className="bg-amber-400 h-full rounded-full shadow-sm shadow-amber-400/30"
                  />
                </div>
              </div>
            </div>

            {/* Pro Player Comparison Snippet */}
            <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={result.proComparison.player.avatarUrl}
                  alt={result.proComparison.player.name}
                  className="w-10 h-10 rounded-xl object-cover border border-volt"
                />
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">
                    {t.affinityWith}
                  </span>
                  <span className="text-xs font-black uppercase text-white">
                    {result.proComparison.player.name} ({result.proComparison.player.club})
                  </span>
                </div>
              </div>

              <span className="px-2 py-1 rounded bg-volt text-black text-[10px] font-mono font-bold shrink-0">
                {result.proComparison.matchPercentage}% AFN
              </span>
            </div>

            {/* Footer Branding inside the shareable image */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span className="text-volt font-bold">COACHSTRIKE AI • UEFA PRO SCOUTING</span>
              <span>coachstrike.ai</span>
            </div>
          </div>

          {/* Sharing Actions Row */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
            {/* 1. Copy Summary Text */}
            <button
              onClick={handleCopySummaryText}
              className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-volt" />}
              <span>{copiedText ? t.textCopied : t.btnCopyText}</span>
            </button>

            {/* 2. Copy Link / Native Share */}
            <button
              onClick={handleNativeShare}
              className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-volt" />}
              <span>{copiedLink ? t.copied : t.btnCopyLink}</span>
            </button>

            {/* 3. Export PNG Image Card */}
            <button
              onClick={handleDownloadCardImage}
              disabled={isExportingImage}
              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase italic tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-sky-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isExportingImage ? 'PNG...' : t.btnDownloadImage}</span>
            </button>

            {/* 4. Download Full PDF Report */}
            <button
              onClick={() => generatePdfReport(result, lang)}
              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-volt hover:bg-white text-black text-xs font-black uppercase italic tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-volt/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-black" />
              <span>{t.btnDownloadPdf}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

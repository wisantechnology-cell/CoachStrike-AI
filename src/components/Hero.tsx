import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Users, Award, ChevronRight, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onStartTest: () => void;
  onExploreDrills: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTest, onExploreDrills }) => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-4 lg:px-8">
      {/* Background Tactical Grid & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-volt-10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Watermark Logo Backing */}
      <div className="absolute top-0 right-10 opacity-5 uppercase text-9xl font-black italic pointer-events-none select-none text-white font-display hidden md:block">
        STRIKE
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-volt-10 border border-volt-30 flex items-center justify-center text-volt mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-1 font-mono-code">PASO 01</h2>
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
            <h2 className="text-xs uppercase font-bold text-volt tracking-[0.2em] mb-1 font-mono-code">PASO 02</h2>
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
            <h2 className="text-xs uppercase font-bold tracking-[0.2em] mb-1 text-black/70 font-mono-code">PASO 03</h2>
            <h3 className="text-xl font-black italic text-black mb-2 font-display uppercase">
              {t.heroFeature3Title}
            </h3>
            <p className="text-xs text-black/80 font-medium leading-relaxed">
              {t.heroFeature3Desc}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

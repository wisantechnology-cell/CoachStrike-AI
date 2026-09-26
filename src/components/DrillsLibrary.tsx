import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Filter, Clock, Dumbbell, Award, Target, CheckCircle2, X } from 'lucide-react';
import { DRILLS_DATABASE } from '../data/drills';
import { Drill } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TacticalTerm } from './TacticalTerm';

export const DrillsLibrary: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrillModal, setActiveDrillModal] = useState<Drill | null>(null);

  const categories = ['Todas', 'Técnica', 'Físico', 'Finalización', 'Táctica', 'Visión'];

  const filteredDrills = DRILLS_DATABASE.filter((drill) => {
    const matchesCategory = selectedCategory === 'Todas' || drill.category === selectedCategory;
    const matchesSearch =
      drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-black/60 text-volt font-bold text-[10px] border border-white/10 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono-code">
              <BookOpen className="w-3.5 h-3.5 text-volt" />
              {t.drillsTag}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black italic text-white font-display uppercase tracking-tight">
            {t.drillsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.drillsSubtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchDrillPlaceholder}
            className="w-full bg-black/60 border border-white/10 focus:border-volt focus:ring-1 focus:ring-volt rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 outline-hidden text-xs font-medium"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black italic uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-volt text-black shadow-md shadow-volt/20 font-display'
                : 'bg-black/40 text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            {cat === 'Todas' ? t.allCategories : cat}
          </button>
        ))}
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <motion.div
            key={drill.id}
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                  {drill.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-code flex items-center gap-1">
                  <Clock className="w-3 h-3 text-volt" />
                  {drill.durationMinutes} {t.durationMins}
                </span>
              </div>

              <h3 className="text-xl font-black italic text-white font-display uppercase tracking-wide">
                {drill.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {drill.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
                <span>Dificultad: <strong className="text-volt">{drill.difficulty}</strong></span>
                <span>{drill.sets} x {drill.reps}</span>
              </div>

              <button
                onClick={() => setActiveDrillModal(drill)}
                className="w-full py-2.5 rounded-xl bg-black/60 hover:bg-slate-800 border border-white/10 text-white font-black italic uppercase text-xs tracking-wider transition-colors cursor-pointer"
              >
                {t.viewProSteps}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drill Detail Modal */}
      {activeDrillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-volt text-black font-black text-[10px] font-mono-code uppercase">
                  {activeDrillModal.category} • {activeDrillModal.difficulty}
                </span>
                <h3 className="text-3xl font-black italic text-white font-display uppercase tracking-wide mt-2">
                  {activeDrillModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDrillModal(null)}
                className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeDrillModal.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-volt uppercase tracking-wider font-mono-code">
                Pasos de Ejecución UEFA:
              </h4>
              <ol className="space-y-2 text-xs text-slate-300">
                {activeDrillModal.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-volt text-black font-black text-[10px] flex items-center justify-center shrink-0 font-mono-code">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-volt-10 border border-volt-30 text-xs space-y-1">
              <span className="text-volt font-bold uppercase tracking-wider text-[10px] font-mono-code block">
                💡 Consejo del Director Técnico:
              </span>
              <p className="text-slate-200 italic font-medium">
                "{activeDrillModal.proTip}"
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveDrillModal(null)}
                className="px-6 py-2.5 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-wider hover:bg-white transition-all cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

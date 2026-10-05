import React, { useState } from 'react';
import { Search, BookOpen, X, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { footballTerms, FootballTermDefinition } from '../data/footballTerms';
import { useLanguage } from '../context/LanguageContext';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeTerm, setActiveTerm] = useState<FootballTermDefinition | null>(null);

  if (!isOpen) return null;

  const categoryLabels: Record<string, { en: string; es: string; pt: string }> = {
    'Todas': { en: 'All Terms', es: 'Todas', pt: 'Todas' },
    'Táctica': { en: 'Tactics', es: 'Táctica', pt: 'Tática' },
    'Posición': { en: 'Position', es: 'Posición', pt: 'Posição' },
    'Ataque': { en: 'Attacking', es: 'Ataque', pt: 'Ataque' },
    'Defensa': { en: 'Defending', es: 'Defensa', pt: 'Defesa' },
    'Físico': { en: 'Physical', es: 'Físico', pt: 'Físico' }
  };

  const categories = ['Todas', 'Táctica', 'Posición', 'Ataque', 'Defensa', 'Físico'];

  const filteredTerms = footballTerms.filter((term) => {
    const title = (term.title[lang] || term.title.es).toLowerCase();
    const desc = (term.fullDesc[lang] || term.fullDesc.es).toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 bg-black/60 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-volt flex items-center justify-center text-black font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic text-white font-display uppercase tracking-wider">
                {t.glossaryTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.glossarySubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchGlossaryPlaceholder}
              className="w-full bg-black/60 border border-white/10 focus:border-volt focus:ring-1 focus:ring-volt rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-hidden text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-volt text-black shadow-md shadow-volt/20'
                    : 'bg-black/40 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {categoryLabels[cat]?.[lang] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid & Detail Panel */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => {
            const title = term.title[lang] || term.title.es;
            const shortDesc = term.shortDesc[lang] || term.shortDesc.es;
            const fullDesc = term.fullDesc[lang] || term.fullDesc.es;
            const importance = term.importance[lang] || term.importance.es;
            const example = term.example[lang] || term.example.es;

            return (
              <motion.div
                key={term.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTerm(term)}
                className="bg-black/40 border border-white/10 hover:border-volt/50 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-volt text-black font-black">
                      {categoryLabels[term.category]?.[lang] || term.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-volt transition-colors" />
                  </div>
                  <h3 className="text-lg font-black italic text-white font-display uppercase tracking-wide group-hover:text-volt transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-[10px] text-volt font-mono-code font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>{lang === 'en' ? 'Click to view breakdown & practical drill' : lang === 'pt' ? 'Clique para ver análise & exemplo prático' : 'Haz clic para ver análisis & ejemplo práctico'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Term Detail Inner Modal */}
        <AnimatePresence>
          {activeTerm && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 p-6 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl relative"
              >
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase px-2.5 py-1 rounded bg-volt text-black font-black">
                      {categoryLabels[activeTerm.category]?.[lang] || activeTerm.category}
                    </span>
                    <h3 className="text-3xl font-black italic text-white font-display uppercase tracking-wide mt-2">
                      {activeTerm.title[lang] || activeTerm.title.es}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTerm(null)}
                    className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeTerm.fullDesc[lang] || activeTerm.fullDesc.es}
                </p>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs">
                  <div className="text-volt font-bold uppercase tracking-wider text-[10px] font-mono-code">
                    📌 {t.glossaryImportance}:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeTerm.importance[lang] || activeTerm.importance.es}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-volt-10 border border-volt-30 text-xs space-y-1">
                  <div className="text-volt font-bold uppercase tracking-wider text-[10px] font-mono-code">
                    ⚽ {t.glossaryExample}:
                  </div>
                  <p className="text-slate-200 italic font-medium">
                    "{activeTerm.example[lang] || activeTerm.example.es}"
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setActiveTerm(null)}
                    className="px-5 py-2.5 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-wider hover:bg-white transition-all cursor-pointer"
                  >
                    {lang === 'en' ? 'Back to Glossary' : lang === 'pt' ? 'Voltar ao Glossário' : 'Volver al Glosario'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

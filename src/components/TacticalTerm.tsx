import React, { useState } from 'react';
import { HelpCircle, Info, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { footballTerms, FootballTermDefinition } from '../data/footballTerms';
import { useLanguage } from '../context/LanguageContext';

interface TacticalTermProps {
  termKey: string;
  children?: React.ReactNode;
  className?: string;
}

export const TacticalTerm: React.FC<TacticalTermProps> = ({ termKey, children, className = '' }) => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Find matching term definition by id or keyTerms
  const termData = footballTerms.find((term) =>
    term.id === termKey.toLowerCase() ||
    term.keyTerms.some((k) => k.toLowerCase() === termKey.toLowerCase())
  );

  if (!termData) {
    return <span className={className}>{children || termKey}</span>;
  }

  const title = termData.title[lang] || termData.title.es;
  const shortDesc = termData.shortDesc[lang] || termData.shortDesc.es;
  const fullDesc = termData.fullDesc[lang] || termData.fullDesc.es;
  const importance = termData.importance[lang] || termData.importance.es;
  const example = termData.example[lang] || termData.example.es;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1 font-bold text-volt underline decoration-dotted underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer ${className}`}
        title={`Ver significado de: ${title}`}
      >
        <span>{children || title}</span>
        <Info className="w-3.5 h-3.5 text-volt inline shrink-0" />
      </button>

      {/* Popover Detail Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative text-left"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-volt-10 text-volt border border-volt-30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-volt text-black font-black">
                      {termData.category}
                    </span>
                    <h3 className="text-xl font-black italic text-white font-display uppercase tracking-wide mt-1">
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {fullDesc}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                <div className="text-volt font-bold uppercase tracking-wider text-[10px] font-mono-code flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {t.glossaryImportance}:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {importance}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-volt-10 border border-volt-30 text-xs space-y-1">
                <div className="text-volt font-bold uppercase tracking-wider text-[10px] font-mono-code">
                  ⚽ {t.glossaryExample}:
                </div>
                <p className="text-slate-200 italic font-medium text-[11px]">
                  "{example}"
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-volt text-black font-black uppercase italic text-xs tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

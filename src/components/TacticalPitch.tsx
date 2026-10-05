import React from 'react';
import { TacticalZone } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TacticalPitchProps {
  zones: TacticalZone[];
  positionTitle: string;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({ zones, positionTitle }) => {
  const { lang } = useLanguage();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white font-['Barlow_Semi_Condensed'] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {lang === 'en'
            ? 'Pitch Positioning & Tactical Coverage Map'
            : lang === 'pt'
            ? 'Mapa de Posicionamento & Cobertura Tática'
            : 'Mapa de Posicionamiento & Cobertura Táctica'}
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          {lang === 'en'
            ? 'Full Pitch View'
            : lang === 'pt'
            ? 'Vista Campo Completo'
            : 'Vista Terreno Completo'}
        </span>
      </div>

      {/* Pitch Graphics */}
      <div className="relative w-full aspect-[16/10] bg-emerald-950/80 rounded-xl border-2 border-emerald-500/30 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Pitch Turf Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_50%,#064e3b_50%)] opacity-30 bg-[length:40px_100%]" />

        {/* Pitch Lines */}
        <svg viewBox="0 0 1000 600" className="w-full h-full relative z-10 pointer-events-none stroke-emerald-400/40 fill-none stroke-[2]">
          {/* Outer Boundary */}
          <rect x="20" y="20" width="960" height="560" />
          {/* Halfway Line */}
          <line x1="500" y1="20" x2="500" y2="580" />
          {/* Center Circle */}
          <circle cx="500" cy="300" r="90" />
          <circle cx="500" cy="300" r="4" fill="currentColor" />

          {/* Left Penalty Area */}
          <rect x="20" y="130" width="165" height="340" />
          <rect x="20" y="210" width="55" height="180" />
          <circle cx="130" cy="300" r="3" fill="currentColor" />
          <path d="M 185 230 A 90 90 0 0 1 185 370" />

          {/* Right Penalty Area */}
          <rect x="815" y="130" width="165" height="340" />
          <rect x="925" y="210" width="55" height="180" />
          <circle cx="870" cy="300" r="3" fill="currentColor" />
          <path d="M 815 230 A 90 90 0 0 0 815 370" />

          {/* Goals */}
          <rect x="4" y="240" width="16" height="120" stroke="#10b981" strokeWidth="3" />
          <rect x="980" y="240" width="16" height="120" stroke="#10b981" strokeWidth="3" />

          {/* Attack Direction Arrow Header */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
          <line x1="420" y1="35" x2="580" y2="35" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow)" strokeDasharray="6 3" />
          <text x="500" y="28" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">
            {lang === 'en'
              ? 'ATTACK DIRECTION →'
              : lang === 'pt'
              ? 'DIREÇÃO DE ATAQUE →'
              : 'DIRECCIÓN DE ATAQUE →'}
          </text>
        </svg>

        {/* Heatmaps & Tactical Zones Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {zones.map((zone, idx) => {
            const posX = zone.pitchX; // percentage
            const posY = zone.pitchY; // percentage

            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all"
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                {/* Glowing Heat Gradient Circle */}
                <div 
                  className="rounded-full bg-emerald-500/30 border border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse flex items-center justify-center"
                  style={{ width: `${zone.radius * 3.2}px`, height: `${zone.radius * 3.2}px` }}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400" />
                </div>

                {/* Zone Badge Text */}
                <div className="mt-1 px-2.5 py-1 rounded-md bg-slate-950/90 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] sm:text-xs whitespace-nowrap shadow-xl">
                  {zone.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Descriptions List */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {zones.map((zone, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <span className="font-bold text-emerald-400 block mb-0.5">{zone.label}</span>
            <p className="text-slate-300">{zone.roleDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

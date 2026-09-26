import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Shield, Users, Layers, Info } from 'lucide-react';
import { PositionCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TacticalTerm } from './TacticalTerm';

interface FormationPlayer {
  id: string;
  number: number;
  label: string;
  role: PositionCategory;
  x: number; // percentage
  y: number; // percentage
  duties: string;
}

interface Formation {
  id: string;
  name: string;
  description: string;
  players: FormationPlayer[];
}

const FORMATIONS: Formation[] = [
  {
    id: '433',
    name: '4-3-3 Ofensivo (Ataque Posicional)',
    description: 'Aplica máxima amplitud por bandas con extremos bien abiertos y centrocampistas que dominan la posesión.',
    players: [
      { id: 'por', number: 1, label: 'POR', role: 'POR', x: 10, y: 50, duties: 'Línea de salida y blocajes.' },
      { id: 'ld', number: 2, label: 'LD', role: 'LAT', x: 28, y: 82, duties: 'Proyección por banda derecha.' },
      { id: 'dec1', number: 4, label: 'DEC', role: 'DEC', x: 22, y: 35, duties: 'Cierre central y juego aéreo.' },
      { id: 'dec2', number: 5, label: 'DEC', role: 'DEC', x: 22, y: 65, duties: 'Marca al delantero e intercepción.' },
      { id: 'li', number: 3, label: 'LI', role: 'LAT', x: 28, y: 18, duties: 'Profundidad por banda izquierda.' },
      { id: 'mcd', number: 6, label: 'MCD', role: 'MCD', x: 42, y: 50, duties: 'Ancla del equipo y basculación.' },
      { id: 'mc1', number: 8, label: 'MC', role: 'MC', x: 58, y: 32, duties: 'Interiores de ida y vuelta.' },
      { id: 'mc2', number: 10, label: 'MPO', role: 'MPO', x: 58, y: 68, duties: 'Pase filtrado y remate lejano.' },
      { id: 'extd', number: 7, label: 'EXT', role: 'EXT', x: 80, y: 85, duties: 'Desborde 1v1 y centros.' },
      { id: 'exti', number: 11, label: 'EXT', role: 'EXT', x: 80, y: 15, duties: 'Diagonal a pierna cambiada.' },
      { id: 'dc', number: 9, label: 'DC', role: 'DC', x: 86, y: 50, duties: 'Fijar centrales y remate.' }
    ]
  },
  {
    id: '4231',
    name: '4-2-3-1 Bloque Medio-Alto',
    description: 'Doble pivote defensivo que asegura la estructura mientras los 3 mediapuntas presionan.',
    players: [
      { id: 'por', number: 1, label: 'POR', role: 'POR', x: 10, y: 50, duties: 'Atento a los balones a la espalda.' },
      { id: 'ld', number: 2, label: 'LD', role: 'LAT', x: 28, y: 82, duties: 'Cierre de banda.' },
      { id: 'dec1', number: 4, label: 'DEC', role: 'DEC', x: 22, y: 36, duties: 'Marcaje estrecho.' },
      { id: 'dec2', number: 5, label: 'DEC', role: 'DEC', x: 22, y: 64, duties: 'Anticipación por bajo.' },
      { id: 'li', number: 3, label: 'LI', role: 'LAT', x: 28, y: 18, duties: 'Banda izquierda activa.' },
      { id: 'mcd1', number: 6, label: 'MCD', role: 'MCD', x: 42, y: 35, duties: 'Pivote robador.' },
      { id: 'mcd2', number: 8, label: 'MCD', role: 'MC', x: 42, y: 65, duties: 'Pivote distribuidor.' },
      { id: 'mpo', number: 10, label: 'MPO', role: 'MPO', x: 68, y: 50, duties: 'Nexo entre líneas.' },
      { id: 'extd', number: 7, label: 'EXT', role: 'EXT', x: 72, y: 80, duties: 'Presión a banda rival.' },
      { id: 'exti', number: 11, label: 'EXT', role: 'EXT', x: 72, y: 20, duties: 'Entrada al área desde izquierda.' },
      { id: 'dc', number: 9, label: 'DC', role: 'DC', x: 88, y: 50, duties: 'Presión alta y gol.' }
    ]
  },
  {
    id: '352',
    name: '3-5-2 Carrileros Totales',
    description: 'Dominio de la franja central con 3 centrales corpulentos y 2 carrileros de largo recorrido.',
    players: [
      { id: 'por', number: 1, label: 'POR', role: 'POR', x: 10, y: 50, duties: 'Comunicación constante.' },
      { id: 'dec1', number: 2, label: 'DEC', role: 'DEC', x: 22, y: 25, duties: 'Central perfil izquierdo.' },
      { id: 'dec2', number: 4, label: 'DEC', role: 'DEC', x: 20, y: 50, duties: 'Líbero y mariscal.' },
      { id: 'dec3', number: 5, label: 'DEC', role: 'DEC', x: 22, y: 75, duties: 'Central perfil derecho.' },
      { id: 'carri', number: 3, label: 'CAR', role: 'LAT', x: 50, y: 12, duties: 'Carrilero banda izquierda completa.' },
      { id: 'carrd', number: 7, label: 'CAR', role: 'LAT', x: 50, y: 88, duties: 'Carrilero banda derecha completa.' },
      { id: 'mcd', number: 6, label: 'MCD', role: 'MCD', x: 45, y: 50, duties: 'Recuperador en medio.' },
      { id: 'mc1', number: 8, label: 'MC', role: 'MC', x: 60, y: 35, duties: 'Interior de enlace.' },
      { id: 'mc2', number: 10, label: 'MC', role: 'MC', x: 60, y: 65, duties: 'Llegada y disparo.' },
      { id: 'dc1', number: 9, label: 'DC', role: 'DC', x: 84, y: 38, duties: 'Delantero móvil.' },
      { id: 'dc2', number: 19, label: 'DC', role: 'DC', x: 84, y: 62, duties: 'Delantero tanque.' }
    ]
  }
];

export const TacticalBoard: React.FC = () => {
  const { t } = useLanguage();
  const [activeFormationId, setActiveFormationId] = useState<string>('433');
  const [selectedPlayer, setSelectedPlayer] = useState<FormationPlayer | null>(FORMATIONS[0].players[8]);

  const activeFormation = FORMATIONS.find((f) => f.id === activeFormationId) || FORMATIONS[0];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Top Title */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-volt-10 border border-volt-30 text-volt text-xs font-bold font-mono-code uppercase tracking-widest">
            {t.tacticsTag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-white font-display uppercase tracking-tight mt-2">
            {t.tacticsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.tacticsSubtitle}
          </p>
        </div>

        {/* Formation Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFormationId(f.id);
                setSelectedPlayer(f.players[8]);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-black italic font-display uppercase transition-all cursor-pointer ${
                activeFormationId === f.id
                  ? 'bg-volt text-black shadow-md shadow-volt/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pitch Display */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
            <span className="text-volt font-bold uppercase">{activeFormation.name}</span>
            <span>{t.clickPlayerInstruction}</span>
          </div>

          {/* Simulated Pitch Canvas */}
          <div className="relative w-full aspect-[16/10] bg-emerald-950 border-2 border-white/20 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Field Stripes */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:10%_100%]" />

            {/* Pitch Markings */}
            <div className="absolute inset-0 border border-white/20 m-2 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/20 pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/20 rounded-full pointer-events-none" />

            {/* Penalty Areas */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[16%] h-[50%] border border-white/20 pointer-events-none" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[16%] h-[50%] border border-white/20 pointer-events-none" />

            {/* Players Tokens */}
            {activeFormation.players.map((p) => {
              const isSelected = selectedPlayer?.id === p.id;
              return (
                <motion.div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-shadow ${
                    isSelected ? 'z-30' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border-2 shadow-lg transition-all ${
                      isSelected
                        ? 'bg-volt text-black border-white ring-4 ring-volt/40 font-black'
                        : 'bg-black/90 text-white border-white/30 hover:border-volt'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-black font-display italic leading-none">{p.number}</span>
                    <span className="text-[8px] font-mono-code leading-none font-bold">{p.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 italic text-center">
            {activeFormation.description}
          </p>
        </div>

        {/* Selected Player Duty File */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <span className="w-8 h-8 rounded-lg bg-volt-10 text-volt border border-volt-30 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-black italic text-white font-display uppercase tracking-wide">
              {t.dutyCardTitle}
            </h3>
          </div>

          {selectedPlayer ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-volt text-black font-black font-display text-2xl flex items-center justify-center italic">
                    {selectedPlayer.number}
                  </div>
                  <div>
                    <div className="text-xl font-black italic text-white font-display uppercase">
                      {selectedPlayer.label}
                    </div>
                    <div className="text-xs text-slate-400 font-mono-code font-bold">
                      {t.roleLabel}: {selectedPlayer.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-volt font-bold uppercase text-[10px] font-mono-code tracking-wider">
                  Obligaciones Tácticas Principales:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedPlayer.duties}
                </p>
              </div>

              {/* Glossared keywords tips */}
              <div className="p-4 rounded-xl bg-volt-10 border border-volt-30 text-xs space-y-2">
                <div className="text-volt font-bold uppercase text-[10px] font-mono-code">
                  💡 Conceptos Clave del Puesto:
                </div>
                <div className="text-slate-300 space-y-1.5 text-[11px]">
                  <p>
                    Para rendir en esta posición, domina la <TacticalTerm termKey="perfilacion-corporal">Perfilación Corporal</TacticalTerm> previa al recibo.
                  </p>
                  <p>
                    Aplica <TacticalTerm termKey="presion-tras-perdida">Presión Tras Pérdida</TacticalTerm> para cortar transiciones enemigas.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-12">
              Haz clic en cualquier dorsal del campo para inspeccionar su ficha técnica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

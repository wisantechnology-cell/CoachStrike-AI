import React from 'react';
import { SkillScores } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RadarChartProps {
  playerScores: SkillScores;
  proScores?: SkillScores;
  proPlayerName?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  playerScores,
  proScores,
  proPlayerName
}) => {
  const { lang } = useLanguage();
  const size = 320;
  const center = size / 2;
  const radius = size * 0.38;

  const labelsMap: Record<string, { key: keyof SkillScores; label: string }[]> = {
    en: [
      { key: 'speed', label: 'Pace' },
      { key: 'technique', label: 'Technique' },
      { key: 'finishing', label: 'Finishing' },
      { key: 'passing', label: 'Passing' },
      { key: 'defending', label: 'Defending' },
      { key: 'physical', label: 'Physical' },
      { key: 'tacticalIQ', label: 'Tactics' },
      { key: 'mental', label: 'Mental' }
    ],
    pt: [
      { key: 'speed', label: 'Velocidade' },
      { key: 'technique', label: 'Técnica' },
      { key: 'finishing', label: 'Remate' },
      { key: 'passing', label: 'Passe' },
      { key: 'defending', label: 'Defesa' },
      { key: 'physical', label: 'Físico' },
      { key: 'tacticalIQ', label: 'Tática' },
      { key: 'mental', label: 'Mental' }
    ],
    es: [
      { key: 'speed', label: 'Velocidad' },
      { key: 'technique', label: 'Técnica' },
      { key: 'finishing', label: 'Remate' },
      { key: 'passing', label: 'Pase' },
      { key: 'defending', label: 'Defensa' },
      { key: 'physical', label: 'Físico' },
      { key: 'tacticalIQ', label: 'Táctica' },
      { key: 'mental', label: 'Mental' }
    ]
  };

  const labels = labelsMap[lang] || labelsMap.en;
  const totalAxes = labels.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  const getPolygonPoints = (scores: SkillScores) => {
    return labels
      .map((item, index) => {
        const val = scores[item.key] || 50;
        const { x, y } = getCoordinates(index, val);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grid Circles / Polygons */}
        {gridLevels.map((level, idx) => {
          const points = labels
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level * 100);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <g key={idx}>
              <polygon
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-800/80"
              />
              <text
                x={center}
                y={center - radius * level + 11}
                fill="currentColor"
                className="text-[9px] fill-slate-600 font-bold"
                textAnchor="middle"
              >
                {Math.round(level * 100)}
              </text>
            </g>
          );
        })}

        {/* Axis Lines */}
        {labels.map((item, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-800"
            />
          );
        })}

        {/* Pro Player Radar Overlay (Optional) */}
        {proScores && (
          <polygon
            points={getPolygonPoints(proScores)}
            fill="rgba(56, 189, 248, 0.15)"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        )}

        {/* Player Radar Area */}
        <polygon
          points={getPolygonPoints(playerScores)}
          fill="rgba(204, 255, 0, 0.25)"
          stroke="#ccff00"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_15px_rgba(204,255,0,0.6)]"
        />

        {/* Data Points on Player Polygon */}
        {labels.map((item, i) => {
          const val = playerScores[item.key] || 50;
          const { x, y } = getCoordinates(i, val);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill="#ccff00"
              stroke="#05070a"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels Outer Text */}
        {labels.map((item, i) => {
          const { x, y } = getCoordinates(i, 115);
          const score = playerScores[item.key];
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="currentColor"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-300 font-mono-code"
            >
              {item.label} <tspan fill="#ccff00">({score})</tspan>
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ccff00] shadow-md shadow-[#ccff00]/50" />
          <span className="text-white">
            {lang === 'en' ? 'Your Player DNA' : lang === 'pt' ? 'O Seu ADN Jogador' : 'Tu ADN Jugador'}
          </span>
        </div>
        {proScores && proPlayerName && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 border border-sky-300" />
            <span className="text-slate-400">Pro: {proPlayerName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

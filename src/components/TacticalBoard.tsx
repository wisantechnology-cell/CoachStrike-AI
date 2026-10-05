import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Users, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Info, 
  Move, 
  Eye, 
  EyeOff, 
  Zap, 
  ChevronRight, 
  Activity, 
  Play, 
  Maximize2,
  Compass,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { PositionCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TacticalTerm } from './TacticalTerm';

export interface FormationPlayer {
  id: string;
  number: number;
  label: string;
  role: PositionCategory;
  name: string;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  duties: {
    en: string;
    es: string;
    pt: string;
  };
  offensiveMovement: {
    en: string;
    es: string;
    pt: string;
  };
  defensiveDuty: {
    en: string;
    es: string;
    pt: string;
  };
  keyConceptKey: string;
  keyConceptLabel: {
    en: string;
    es: string;
    pt: string;
  };
}

export interface TacticalFormation {
  id: string;
  name: string;
  system: string;
  description: {
    en: string;
    es: string;
    pt: string;
  };
  category: 'offensive' | 'balanced' | 'counter' | 'possession';
  players: FormationPlayer[];
  passingLinks: [string, string][]; // pairs of player IDs to draw passing networks
}

const FORMATIONS: TacticalFormation[] = [
  {
    id: '4-3-3',
    name: '4-3-3 Positional Attack',
    system: '4-3-3',
    category: 'possession',
    description: {
      en: 'Dominates territorial control through interior numerical superiorities, wide wingers stretching the backline, and third-man link-ups.',
      es: 'Aplica máxima amplitud por bandas con extremos abiertos, un pivote ancla que equilibra la salida lavolpiana y triangulaciones interiores constantes.',
      pt: 'Aplica largura máxima nas alas com extremos bem abertos, um trinco fixo e triângulos constantes no meio-campo para posse dominante.'
    },
    passingLinks: [
      ['por', 'dec1'], ['por', 'dec2'], ['dec1', 'dec2'],
      ['dec1', 'li'], ['dec2', 'ld'], ['dec1', 'mcd'], ['dec2', 'mcd'],
      ['li', 'mc1'], ['ld', 'mc2'], ['mcd', 'mc1'], ['mcd', 'mc2'],
      ['mc1', 'mc2'], ['mc1', 'exti'], ['mc2', 'extd'], ['mc1', 'dc'],
      ['mc2', 'dc'], ['exti', 'dc'], ['extd', 'dc'], ['li', 'exti'], ['ld', 'extd']
    ],
    players: [
      {
        id: 'por', number: 1, label: 'POR', role: 'POR', name: 'Sweeper Keeper', x: 8, y: 50,
        duties: {
          en: 'Active sweeper keeper, plays as 11th outfield player in build-up and controls depth behind high defensive line.',
          es: 'Portero líbero proactivo en salida de balón lavolpiana y achique del espacio a espaldas de la zaga adelantada.',
          pt: 'Guarda-redes líbero na primeira fase de construção e cobertura em profundidade nas costas da linha defensiva alta.'
        },
        offensiveMovement: {
          en: 'Steps up outside penalty box to provide a central passing outlet to center backs under high press.',
          es: 'Se adelanta al borde del área grande para ofrecer línea de pase de seguridad ante presión alta.',
          pt: 'Adiantamento na área para dar linha de passe de segurança face à pressão rival.'
        },
        defensiveDuty: {
          en: 'Aggressive sweep clearances outside 18-yard box and dominant claim of aerial crosses.',
          es: 'Coberturas y anticipaciones fuera del área ante balones largos frontales y blocaje aéreo.',
          pt: 'Saídas rápidas fora da área a bolas longas e comando aéreo seguro.'
        },
        keyConceptKey: 'salida-lavolpiana',
        keyConceptLabel: { en: 'Lavolpiana Build-up', es: 'Salida Lavolpiana', pt: 'Saída Lavolpiana' }
      },
      {
        id: 'li', number: 3, label: 'LI', role: 'LAT', name: 'Left Fullback', x: 26, y: 16,
        duties: {
          en: 'Overlapping & underlapping runs, creates maximum offensive width and delivers driven low crosses.',
          es: 'Amplitud total en carril izquierdo, desdobles interiores y centros tensos al área rival.',
          pt: 'Largura total no corredor esquerdo, sobreposições e cruzamentos tensos à área.'
        },
        offensiveMovement: {
          en: 'Pushes high up the touchline when inverted winger cuts inside into half-space.',
          es: 'Proyección ofensiva hacia línea de fondo cuando el extremo izquierdo ataca el pasillo interior.',
          pt: 'Projeção ofensiva profunda quando o extremo esquerdo flete para o espaço interior.'
        },
        defensiveDuty: {
          en: 'Containment against winger 1v1 and rapid recovery transition into back-four line.',
          es: 'Contención 1v1 en banda y basculación compacta para cerrar centros al segundo palo.',
          pt: 'Contenção 1v1 na ala e basculação defensiva em bloco compacto.'
        },
        keyConceptKey: 'desdoble-ofensivo',
        keyConceptLabel: { en: 'Offensive Overlap', es: 'Desdoble Ofensivo', pt: 'Desdobramento Ofensivo' }
      },
      {
        id: 'dec1', number: 4, label: 'DEC', role: 'DEC', name: 'Left Center-Back', x: 22, y: 35,
        duties: {
          en: 'Left-sided defensive general, progressive line-breaking passes and commanding 1v1 ground duels.',
          es: 'Central izquierdo, salida limpia con pase vertical raso y contención aérea sólida.',
          pt: 'Central canhoto/equilibrador com passe vertical de rutura e marcação agressiva.'
        },
        offensiveMovement: {
          en: 'Drives forward into midfield space if opposition drop into a passive low block.',
          es: 'Conducción fijadora hacia campo rival si el adversario repliega en bloque bajo.',
          pt: 'Condução frontal para fixar adversários se o rival recuar em bloco baixo.'
        },
        defensiveDuty: {
          en: 'Body shape orientation at 45° to track diagonal runs and protect interior corridor.',
          es: 'Perfilación corporal a 45° para anticipar carreras a la espalda y coberturas al lateral.',
          pt: 'Perfilamento corporal a 45° para antecipar desmarcações nas costas.'
        },
        keyConceptKey: 'perfilacion-corporal',
        keyConceptLabel: { en: 'Body Orientation', es: 'Perfilación Corporal', pt: 'Perfilamento Corporal' }
      },
      {
        id: 'dec2', number: 5, label: 'DEC', role: 'DEC', name: 'Right Center-Back', x: 22, y: 65,
        duties: {
          en: 'Defensive leader, aerial dominance, box protection and diagonal switches of play.',
          es: 'Central corrector, juego aéreo dominante, liderazgo vocal y cambios de orientación precisos.',
          pt: 'Líder de defesa, domínio aéreo, vigilância na área e lançamentos diagonais.'
        },
        offensiveMovement: {
          en: 'Distributes long diagonals to the isolated right winger to exploit 1v1 isolation.',
          es: 'Cambio de juego largo hacia el extremo derecho desmarcado en situación de aislamiento 1v1.',
          pt: 'Variação longa para o extremo isolado em situação de 1v1.'
        },
        defensiveDuty: {
          en: 'Constant defensive surveillance on the striker and immediate counter-press upon possession loss.',
          es: 'Vigilancia defensiva permanente sobre el punta rival y presión inmediata tras pérdida.',
          pt: 'Vigilância defensiva no avançado rival e pressão imediata pós-perda.'
        },
        keyConceptKey: 'vigilancia-defensiva',
        keyConceptLabel: { en: 'Defensive Surveillance', es: 'Vigilancia Defensiva', pt: 'Vigilância Defensiva' }
      },
      {
        id: 'ld', number: 2, label: 'LD', role: 'LAT', name: 'Right Fullback', x: 26, y: 84,
        duties: {
          en: 'Dynamic right flank outlet, combines with interior midfielder and cuts out wide counters.',
          es: 'Lateral derecho profundo, apoyo constante en pared con el interior y repliegue veloz.',
          pt: 'Lateral direito de intensidade, apoios curtos e coberturas rápidas na transição.'
        },
        offensiveMovement: {
          en: 'Timing overlapping runs to generate a 2v1 overload against the opponent left back.',
          es: 'Desdoble en velocidad para generar superioridad numérica 2v1 en banda derecha.',
          pt: 'Desdobramento em velocidade para criar superioridade 2v1 no flanco.'
        },
        defensiveDuty: {
          en: 'Channels opposing wingers onto their weaker foot and closes the back post.',
          es: 'Perfilación para orientar al rival hacia banda exterior y cierre del segundo palo.',
          pt: 'Orienta o adversário para o pé fraco e fecha o segundo poste.'
        },
        keyConceptKey: 'basculacion',
        keyConceptLabel: { en: 'Tactical Shifting', es: 'Basculación Defensiva', pt: 'Basculação Defensiva' }
      },
      {
        id: 'mcd', number: 6, label: 'MCD', role: 'MCD', name: 'Anchor Pivot', x: 42, y: 50,
        duties: {
          en: 'Structural heartbeat of the team, shields center-backs, recycles possession, and dictates tempo.',
          es: 'Pivote ancla y termómetro del equipo, recupera balones, bascula y da salida fluida en 1 o 2 toques.',
          pt: 'Trinco e pêndulo tático, protege os centrais, recupera e dita o ritmo a 1-2 toques.'
        },
        offensiveMovement: {
          en: 'Drops between or just ahead of center-backs to form a 3-man first build-up line.',
          es: 'Descenso entre centrales para crear superioridad numérica 3v2 en primera línea de salida.',
          pt: 'Recuo entre os centrais para gerar superioridade 3v2 na saída.'
        },
        defensiveDuty: {
          en: 'Immediate intense counter-pressing in central zone within 5 seconds of ball loss.',
          es: 'Presión asfixiante tras pérdida para asfixiar contragolpes en el círculo central.',
          pt: 'Pressão intensa pós-perda para travar contragolpes na zona central.'
        },
        keyConceptKey: 'presion-tras-perdida',
        keyConceptLabel: { en: 'Counter-Pressing', es: 'Presión Tras Pérdida', pt: 'Pressão Pós-Perda' }
      },
      {
        id: 'mc1', number: 8, label: 'MC', role: 'MC', name: 'Left Box-to-Box', x: 58, y: 32,
        duties: {
          en: 'Box-to-box engine, vertical driving through half-spaces, third-man connections and edge-of-box arriving.',
          es: 'Interior de ida y vuelta, conducción vertical por pasillo interior, paredes y remate desde segunda línea.',
          pt: 'Médio box-to-box, progressão entrelinhas, terceiro homem e chegada com remate à entrada da área.'
        },
        offensiveMovement: {
          en: 'Acts as the elusive third-man passing target to break opposing midfield press.',
          es: 'Búsqueda constante del "Tercer Hombre" para desarmar la presión rival a un toque.',
          pt: 'Movimentação em "Terceiro Homem" para ultrapassar a pressão adversária.'
        },
        defensiveDuty: {
          en: 'Tracks opposing midfield runners and executes aggressive counter-pressing traps.',
          es: 'Bloqueo de líneas de pase interiores y repliegue coordinado en bloque medio.',
          pt: 'Bloqueio de linhas interiores e pressão coordenada em bloco médio.'
        },
        keyConceptKey: 'tercer-hombre',
        keyConceptLabel: { en: 'Third Man Principle', es: 'Tercer Hombre', pt: 'Terceiro Homem' }
      },
      {
        id: 'mc2', number: 10, label: 'MPO', role: 'MPO', name: 'Right Attacking Mid', x: 58, y: 68,
        duties: {
          en: 'Creative orchestrator, operates between lines, executes killer through balls and long-range shooting.',
          es: 'Interior creativo / mediapunta, recepción entre líneas, último pase quirúrgico y llegada a gol.',
          pt: 'Médio criativo, receção entrelinhas, visão de último passe e remate de meia distância.'
        },
        offensiveMovement: {
          en: 'Floats in the pocket between opposing midfield and defensive lines to receive on the half-turn.',
          es: 'Desmarque de apoyo en zona ciega del rival para recibir perfilado hacia portería.',
          pt: 'Posicionamento no espaço entrelinhas para receber orientado à baliza.'
        },
        defensiveDuty: {
          en: 'Angles pressing run to cut off return passes to opponent holding midfielder.',
          es: 'Dirección de presión para tapar la salida del pivote rival y forzar el juego largo.',
          pt: 'Sombra na linha de passe para o trinco adversário forçando o passe longo.'
        },
        keyConceptKey: 'pase-filtrado',
        keyConceptLabel: { en: 'Line-Breaking Pass', es: 'Pase Filtrado', pt: 'Passe de Rutura' }
      },
      {
        id: 'exti', number: 11, label: 'EXT', role: 'EXT', name: 'Inverted Left Winger', x: 78, y: 18,
        duties: {
          en: 'Inverted wide forward, cuts inside on stronger foot, 1v1 explosive dribbling and curling shots.',
          es: 'Extremo a pierna cambiada, diagonal agresiva hacia dentro, regate 1v1 y golpeo al segundo palo.',
          pt: 'Extremo de pé trocado, diagonais interiores, drible agressivo 1v1 e remate em arco.'
        },
        offensiveMovement: {
          en: 'Attacks the space behind opposing right center-back when striker drags markers away.',
          es: 'Diagonal de ruptura al espacio ciego del central rival cuando el delantero arrastra marcas.',
          pt: 'Ataque ao espaço nas costas do central rival aproveitando o arrasto do ponta de lança.'
        },
        defensiveDuty: {
          en: 'Closes down the opposing fullback early and prevents switches of play.',
          es: 'Presión alta sobre el lateral rival para impedir centros y forzar el error en salida.',
          pt: 'Pressão alta no lateral rival impedindo lançamentos longos.'
        },
        keyConceptKey: 'ataque-al-espacio',
        keyConceptLabel: { en: 'Space Attack & Runs', es: 'Ataque al Espacio', pt: 'Ataque ao Espaço' }
      },
      {
        id: 'dc', number: 9, label: 'DC', role: 'DC', name: 'Center Forward Striker', x: 86, y: 50,
        duties: {
          en: 'Complete No. 9, pins center backs, executes blindside runs, first-time finishing and pressing trigger.',
          es: 'Delantero centro total, fija centrales, desmarques de ruptura al primer palo y remate al primer toque.',
          pt: 'Ponta de lança de referência, fixação de centrais, desmarcações de rutura e finalização rápida.'
        },
        offensiveMovement: {
          en: 'Sharp double-movement: feints dropping deep before sprinting in behind defensive line.',
          es: 'Desmarque de engaño: amago en apoyo y ruptura súbita a la espalda del central.',
          pt: 'Movimento duplo: apoio curto simulado e desmarcação em profundidade.'
        },
        defensiveDuty: {
          en: 'First line of press, curves run to force opposition keeper onto their weaker foot.',
          es: 'Inicia la presión alta orientando al portero y centrales hacia la banda de recuperación.',
          pt: 'Primeiro defensor na pressão alta, orientando a saída rival para a zona de corte.'
        },
        keyConceptKey: 'desmarque-de-ruptura',
        keyConceptLabel: { en: 'Blindside Rupture', es: 'Desmarque de Ruptura', pt: 'Desmarcação de Rutura' }
      },
      {
        id: 'extd', number: 7, label: 'EXT', role: 'EXT', name: 'Right Winger', x: 78, y: 82,
        duties: {
          en: 'Pure explosive winger, maintains maximal pitch width, delivers dangerous low crosses across six-yard box.',
          es: 'Extremo puro desbordador, fijación pegado a la cal, desborde por fuera y centros al área de penalti.',
          pt: 'Extremo puro de velocidade, fixação na linha lateral, drible exterior e cruzamentos perigosos.'
        },
        offensiveMovement: {
          en: 'Holds maximum width to stretch opponent backline and isolate opposing fullback in 1v1.',
          es: 'Pisa la línea de cal para estirar la zaga rival y forzar el duelo 1v1 con espacio.',
          pt: 'Cola à linha de cal para alargar a defesa rival e explorar o 1v1 com espaço.'
        },
        defensiveDuty: {
          en: 'Tracks opposing fullback on counter and presses aggressively on backwards passes.',
          es: 'Ayuda defensiva en repliegue y presión inmediata ante pases retrasados del lateral.',
          pt: 'Acompanha as subidas do lateral rival e pressiona passes recuados.'
        },
        keyConceptKey: 'amplitud-y-profundidad',
        keyConceptLabel: { en: 'Width & Depth Stretch', es: 'Amplitud y Profundidad', pt: 'Amplitude e Profundidade' }
      }
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 High Press & Double Pivot',
    system: '4-2-3-1',
    category: 'balanced',
    description: {
      en: 'High tactical balance with a solid double-pivot foundation and an offensive quartet pressing high up the pitch.',
      es: 'Estructura equilibrada con doble pivote defensivo complementario y una mediapunta creativa con máxima libertad.',
      pt: 'Estrutura equilibrada com duplo pivô a dar suporte e três médios ofensivos velozes na pressão.'
    },
    passingLinks: [
      ['por', 'dec1'], ['por', 'dec2'], ['dec1', 'dec2'],
      ['dec1', 'li'], ['dec2', 'ld'], ['dec1', 'mcd'], ['dec2', 'mc1'],
      ['mcd', 'mc1'], ['mcd', 'mpo'], ['mc1', 'mpo'], ['li', 'exti'],
      ['ld', 'extd'], ['mpo', 'exti'], ['mpo', 'extd'], ['mpo', 'dc'],
      ['exti', 'dc'], ['extd', 'dc']
    ],
    players: [
      {
        id: 'por', number: 1, label: 'POR', role: 'POR', name: 'Goalkeeper', x: 8, y: 50,
        duties: {
          en: 'Commanding aerial keeper, fast distribution to fullbacks to bypass first press line.',
          es: 'Portero seguro bajo palos, juego de pies sobrio y distribución rápida a las bandas.',
          pt: 'Guarda-redes seguro entre os postes e distribuição rápida para transições.'
        },
        offensiveMovement: {
          en: 'Offers deep central triangle support to center-backs.',
          es: 'Apoyo en triángulo de seguridad a los dos centrales.',
          pt: 'Apoio em triângulo seguro aos centrais.'
        },
        defensiveDuty: {
          en: 'Dominates the 6-yard box on set pieces and crosses.',
          es: 'Dominio de área pequeña en jugadas a balón parado.',
          pt: 'Domínio da pequena área em bolas paradas.'
        },
        keyConceptKey: 'salida-lavolpiana',
        keyConceptLabel: { en: 'Build-up Shape', es: 'Salida de Balón', pt: 'Saída de Bola' }
      },
      {
        id: 'li', number: 3, label: 'LI', role: 'LAT', name: 'Left Back', x: 26, y: 16,
        duties: {
          en: 'Disciplined defender, alternates overlaps with winger.',
          es: 'Lateral izquierdo equilibrado, alternancia de subidas con el extremo.',
          pt: 'Lateral esquerdo disciplinado com subidas alternadas.'
        },
        offensiveMovement: {
          en: 'Underlaps when winger stays wide on touchline.',
          es: 'Desdoble interior cuando el extremo fija en la banda.',
          pt: 'Sobreposição interior quando o extremo abre na ala.'
        },
        defensiveDuty: {
          en: 'Locks down wide corridor and prevents crosses.',
          es: 'Cierre del carril exterior y bloqueo de centros.',
          pt: 'Bloqueio do corredor e contenção de cruzamentos.'
        },
        keyConceptKey: 'desdoble-ofensivo',
        keyConceptLabel: { en: 'Underlap Run', es: 'Desdoble Interior', pt: 'Desdobramento Interior' }
      },
      {
        id: 'dec1', number: 4, label: 'DEC', role: 'DEC', name: 'Center-Back', x: 22, y: 36,
        duties: {
          en: 'Aggressive stopper, steps up to intercept between lines.',
          es: 'Central marcador, anticipación por bajo y juego físico.',
          pt: 'Central marcador com antecipação agressiva.'
        },
        offensiveMovement: {
          en: 'Plays crisp vertical passes into double pivot.',
          es: 'Pase vertical tenso hacia los mediocentros.',
          pt: 'Passe vertical tenso para o duplo pivô.'
        },
        defensiveDuty: {
          en: 'Tight man-to-man marking on opposing striker.',
          es: 'Marcaje en corto al delantero rival.',
          pt: 'Marcação apertada ao ponta de lança rival.'
        },
        keyConceptKey: 'perfilacion-corporal',
        keyConceptLabel: { en: 'Close Marking', es: 'Marcaje Férreo', pt: 'Marcação Homem a Homem' }
      },
      {
        id: 'dec2', number: 5, label: 'DEC', role: 'DEC', name: 'Covering Center-Back', x: 22, y: 64,
        duties: {
          en: 'Covering defender, reads long balls and marshals offside line.',
          es: 'Central escoba, coberturas laterales y control del fuera de juego.',
          pt: 'Central de cobertura com leitura de bolas longas.'
        },
        offensiveMovement: {
          en: 'Switches play to right winger with precision long balls.',
          es: 'Cambio de juego preciso hacia banda derecha.',
          pt: 'Variação longa para o extremo direito.'
        },
        defensiveDuty: {
          en: 'Sweeps behind aggressive partner.',
          es: 'Coberturas a la espalda del central agresivo.',
          pt: 'Cobertura nas costas do central marcador.'
        },
        keyConceptKey: 'vigilancia-defensiva',
        keyConceptLabel: { en: 'Depth Control', es: 'Coberturas Defensivas', pt: 'Cobertura Defensiva' }
      },
      {
        id: 'ld', number: 2, label: 'LD', role: 'LAT', name: 'Right Back', x: 26, y: 84,
        duties: {
          en: 'Pacey wing-back, delivers early crosses and blocks counter-attacks.',
          es: 'Lateral derecho veloz, centros al primer palo y repliegue.',
          pt: 'Lateral direito veloz com cruzamentos venenosos.'
        },
        offensiveMovement: {
          en: 'High overlap to deliver crosses behind defensive line.',
          es: 'Desdoble en velocidad para meter centros a la espalda.',
          pt: 'Desdobramento em velocidade para cruzamentos.'
        },
        defensiveDuty: {
          en: 'Maintains compact distance with right center back.',
          es: 'Mantiene distancia compacta con el central derecho.',
          pt: 'Mantém bloco compacto com o central direito.'
        },
        keyConceptKey: 'basculacion',
        keyConceptLabel: { en: 'Defensive Shifting', es: 'Basculación', pt: 'Basculação' }
      },
      {
        id: 'mcd', number: 6, label: 'MCD', role: 'MCD', name: 'Ball-Winner Pivot', x: 44, y: 35,
        duties: {
          en: 'Ball-winning destroyer, tackles aggressively and breaks opposition rhythm.',
          es: 'Pivote destructor, recuperador incansable y equilibrio táctico.',
          pt: 'Trinco destruidor, recuperação de bolas e equilíbrio tático.'
        },
        offensiveMovement: {
          en: 'Simple 1-touch pass to creative partner.',
          es: 'Pase de seguridad a 1 toque hacia el interior distribuidor.',
          pt: 'Passe de segurança a 1 toque para o médio distribuidor.'
        },
        defensiveDuty: {
          en: 'Covers zone 14 and shuts down attacking midfielder.',
          es: 'Controla la frontal del área y anula al mediapunta rival.',
          pt: 'Controla a zona 14 e anula o médio ofensivo adversário.'
        },
        keyConceptKey: 'presion-tras-perdida',
        keyConceptLabel: { en: 'Ball Recovery', es: 'Presión y Robo', pt: 'Recuperação de Bola' }
      },
      {
        id: 'mc1', number: 8, label: 'MC', role: 'MC', name: 'Deep-Lying Playmaker', x: 44, y: 65,
        duties: {
          en: 'Playmaking regista, controls game tempo and finds gaps between lines.',
          es: 'Pivote organizador, marca el tempo y distribuye pases milimétricos.',
          pt: 'Médio organizador de jogo, dita o ritmo e faz passes verticais.'
        },
        offensiveMovement: {
          en: 'Steps into pocket to receive and turn facing forward.',
          es: 'Perfilación orientada hacia delante para enlazar con la mediapunta.',
          pt: 'Receção orientada para ligar com a linha avançada.'
        },
        defensiveDuty: {
          en: 'Intercepts passing lanes and drops to form defensive shield.',
          es: 'Intercepta líneas de pase y forma escudo defensivo doble.',
          pt: 'Interceta linhas de passe e protege o meio.'
        },
        keyConceptKey: 'tercer-hombre',
        keyConceptLabel: { en: 'Tempo Dictation', es: 'Distribución y Tempo', pt: 'Organização de Jogo' }
      },
      {
        id: 'mpo', number: 10, label: 'MPO', role: 'MPO', name: 'Central Number 10', x: 66, y: 50,
        duties: {
          en: 'The tactical maestro, creates overloads, delivers through balls and finishes in the box.',
          es: 'Mediapunta clásico con libertad total, visión 360°, paredes y tiro de media distancia.',
          pt: 'Número 10 criativo com visão 360°, combinações rápidas e remate exterior.'
        },
        offensiveMovement: {
          en: 'Finds pockets behind defensive midfielders and slips passes to wingers.',
          es: 'Se desmarca en zona ciega y filtra pases a espaldas de centrales.',
          pt: 'Movimenta-se no espaço entre linhas e assiste os extremos.'
        },
        defensiveDuty: {
          en: 'Presses opponent holding midfielder upon turnover.',
          es: 'Presión inmediata sobre el primer pasador rival.',
          pt: 'Primeira pressão sobre o distribuidor adversário.'
        },
        keyConceptKey: 'pase-filtrado',
        keyConceptLabel: { en: 'Visionary Pass', es: 'Pase Filtrado', pt: 'Passe de Rutura' }
      },
      {
        id: 'exti', number: 11, label: 'EXT', role: 'EXT', name: 'Left Inside Forward', x: 70, y: 20,
        duties: {
          en: 'Direct attacking winger, attacks half-space and converts back-post crosses.',
          es: 'Extremo encarador, diagonal hacia el área y remate de zurda o diestra.',
          pt: 'Extremo vertical, entrada na área em diagonal e remate.'
        },
        offensiveMovement: {
          en: 'Attacks second post when ball is on right wing.',
          es: 'Llegada sorpresiva al segundo palo en centros laterales.',
          pt: 'Ataque ao segundo poste em cruzamentos da direita.'
        },
        defensiveDuty: {
          en: 'Tracks opposing fullback to maintain 4-4-2 defensive shape.',
          es: 'Repliega formando línea de 4 centrocampistas en defensa.',
          pt: 'Recua para compor linha de 4 médios em fase defensiva.'
        },
        keyConceptKey: 'ataque-al-espacio',
        keyConceptLabel: { en: 'Second Post Run', es: 'Llegada al Segundo Palo', pt: 'Ataque ao Segundo Poste' }
      },
      {
        id: 'extd', number: 7, label: 'EXT', role: 'EXT', name: 'Right Inside Forward', x: 70, y: 80,
        duties: {
          en: 'Speedy dribbler, 1v1 threat on right channel and crossing specialist.',
          es: 'Extremo veloz, desequilibrio en velocidad y centro raso tenso.',
          pt: 'Extremo velocista, drible veloz e cruzamento tenso.'
        },
        offensiveMovement: {
          en: 'Drags left back wide to open half-space for attacking midfielder.',
          es: 'Arrastra al lateral rival hacia la cal para abrir el pasillo al 10.',
          pt: 'Arrasta o lateral rival para abrir espaço ao número 10.'
        },
        defensiveDuty: {
          en: 'Blocks outside passing channel.',
          es: 'Cierra la línea de banda en presión alta.',
          pt: 'Bloqueia o passe na ala em pressão alta.'
        },
        keyConceptKey: 'amplitud-y-profundidad',
        keyConceptLabel: { en: 'Flank Threat', es: 'Desborde Exterior', pt: 'Desborde Exterior' }
      },
      {
        id: 'dc', number: 9, label: 'DC', role: 'DC', name: 'Target Forward', x: 88, y: 50,
        duties: {
          en: 'Clinical goalscorer, hold-up play, pins defense and clinical box finishing.',
          es: 'Delantero centro rematador, juego de espaldas y desmarques al primer palo.',
          pt: 'Ponta de lança finalizador, jogo de costas e faro de golo.'
        },
        offensiveMovement: {
          en: 'First-post darting runs across the center-back.',
          es: 'Anticipación agresiva al primer palo en centros laterales.',
          pt: 'Antecipação ao primeiro poste em cruzamentos.'
        },
        defensiveDuty: {
          en: 'Forces center-backs onto their weaker foot during build-up.',
          es: 'Fuerza a los centrales rivales a su pierna no hábil.',
          pt: 'Obriga os centrais a jogar com o pé fraco.'
        },
        keyConceptKey: 'desmarque-de-ruptura',
        keyConceptLabel: { en: 'First Post Dart', es: 'Desmarque al Primer Palo', pt: 'Antecipação de Golo' }
      }
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2 Complete Wing-Backs & Twin Strikers',
    system: '3-5-2',
    category: 'offensive',
    description: {
      en: 'High-density central overload with 3 imposing center-backs, explosive box-to-box wing-backs, and twin attacking partnership.',
      es: 'Dominio físico y táctico del eje central con 3 centrales, 2 carrileros incansables y 2 delanteros complementarios.',
      pt: 'Domínio do corredor central com 3 defesas centrais, 2 alas de grande fôlego e dupla de avançados letais.'
    },
    passingLinks: [
      ['por', 'dec1'], ['por', 'dec2'], ['por', 'dec3'],
      ['dec1', 'dec2'], ['dec2', 'dec3'], ['dec1', 'carri'], ['dec3', 'carrd'],
      ['dec2', 'mcd'], ['carri', 'mc1'], ['carrd', 'mc2'],
      ['mcd', 'mc1'], ['mcd', 'mc2'], ['mc1', 'mc2'],
      ['mc1', 'dc1'], ['mc2', 'dc2'], ['dc1', 'dc2'], ['carri', 'dc1'], ['carrd', 'dc2']
    ],
    players: [
      {
        id: 'por', number: 1, label: 'POR', role: 'POR', name: 'Goalkeeper', x: 8, y: 50,
        duties: {
          en: 'Strong vocal communicator, controls defensive line depth.',
          es: 'Líder vocal y dominador del área grande.',
          pt: 'Comando vocal e segurança no controlo da área.'
        },
        offensiveMovement: {
          en: 'Distributes quickly to running wing-backs.',
          es: 'Salida rápida hacia los carrileros lanzados.',
          pt: 'Lançamento rápido para os alas em velocidade.'
        },
        defensiveDuty: {
          en: 'Dominates high balls and clears danger outside box.',
          es: 'Blocajes aéreos y salidas rápidas.',
          pt: 'Domínio de cruzamentos e saídas rápidas.'
        },
        keyConceptKey: 'salida-lavolpiana',
        keyConceptLabel: { en: 'Long Launching', es: 'Salida con Carrileros', pt: 'Lançamento para Alas' }
      },
      {
        id: 'dec1', number: 2, label: 'DEC', role: 'DEC', name: 'Left Center-Back', x: 22, y: 25,
        duties: {
          en: 'Wide left center-back, steps out to cover flank when wing-back pushes high.',
          es: 'Central exterior izquierdo, coberturas al carrilero y salida en conducción.',
          pt: 'Central esquerdo com coberturas ao ala e saída com bola.'
        },
        offensiveMovement: {
          en: 'Steps up into left half-space to provide passing support.',
          es: 'Avanza hacia el pasillo interior para asociarse con el interior izquierdo.',
          pt: 'Avança no espaço interior para apoiar o médio.'
        },
        defensiveDuty: {
          en: 'Defends wide channel 1v1 when opponent counters.',
          es: 'Duelos 1v1 en banda si el carrilero queda descolgado.',
          pt: 'Duelos 1v1 na lateral quando o ala sobe.'
        },
        keyConceptKey: 'perfilacion-corporal',
        keyConceptLabel: { en: 'Wide Channel Defense', es: 'Cierre del Intervalo', pt: 'Cobertura Lateral' }
      },
      {
        id: 'dec2', number: 4, label: 'DEC', role: 'DEC', name: 'Central Sweeper / Libero', x: 19, y: 50,
        duties: {
          en: 'Marshal of the back-three, leads offside trap and sweeps loose balls.',
          es: 'Mariscal central de la zaga, organiza la línea de 3 y realiza coberturas a ambos lados.',
          pt: 'Líbero e patrão da defesa de 3, lidera a linha e faz coberturas aos centrais.'
        },
        offensiveMovement: {
          en: 'Directs passing from deep with pinpoint switches.',
          es: 'Inicia el juego con cambios de orientación milimétricos.',
          pt: 'Inicia a construção com passes teleguiados.'
        },
        defensiveDuty: {
          en: 'Clears all dangerous crosses in the central channel.',
          es: 'Despejes y anticipación en el punto de penalti.',
          pt: 'Corte de cruzamentos na zona de grande penalidade.'
        },
        keyConceptKey: 'vigilancia-defensiva',
        keyConceptLabel: { en: 'Central Marshalling', es: 'Mariscal de Zaga', pt: 'Patrão da Defesa' }
      },
      {
        id: 'dec3', number: 5, label: 'DEC', role: 'DEC', name: 'Right Center-Back', x: 22, y: 75,
        duties: {
          en: 'Wide right center-back, physical aerial dominance and strong tackles.',
          es: 'Central exterior derecho, contundencia en los duelos y cobertura por derecha.',
          pt: 'Central direito, agressividade no desarme e cobertura ao ala direito.'
        },
        offensiveMovement: {
          en: 'Carries ball forward to draw opposition pressing player.',
          es: 'Conducción ofensiva para atraer marcas y liberar al interior.',
          pt: 'Condução ofensiva para fixar marcas.'
        },
        defensiveDuty: {
          en: 'Covers the right flank when right wing-back is caught forward.',
          es: 'Cubre la banda derecha en transiciones del rival.',
          pt: 'Cobre a ala direita em contra-ataques.'
        },
        keyConceptKey: 'perfilacion-corporal',
        keyConceptLabel: { en: 'Right Channel Cover', es: 'Cobertura de Flanco', pt: 'Cobertura de Flanco' }
      },
      {
        id: 'carri', number: 3, label: 'CAR', role: 'LAT', name: 'Left Wing-Back', x: 48, y: 12,
        duties: {
          en: 'End-to-end powerhouse, provides entire left-flank width and arrives into the box.',
          es: 'Carrilero total de banda completa, ida y vuelta sin descanso, centros y llegada a gol.',
          pt: 'Ala esquerdo total de grande intensidade, cruzamentos e finalizações ao segundo poste.'
        },
        offensiveMovement: {
          en: 'Sprints along the touchline and arrives at the back post to finish crosses.',
          es: 'Proyección constante y llegada a remate en el segundo palo.',
          pt: 'Chegada ao segundo poste para finalizar cruzamentos.'
        },
        defensiveDuty: {
          en: 'Recovers into a back-5 defensive shape out of possession.',
          es: 'Repliegue inmediato para formar línea de 5 en fase defensiva.',
          pt: 'Recuo imediato para formar linha de 5 defesas.'
        },
        keyConceptKey: 'desdoble-ofensivo',
        keyConceptLabel: { en: 'Wing-Back Dynamic', es: 'Carrilero Total', pt: 'Ala de Banda Toda' }
      },
      {
        id: 'carrd', number: 7, label: 'CAR', role: 'LAT', name: 'Right Wing-Back', x: 48, y: 88,
        duties: {
          en: 'Explosive right flank runner, delivery specialist and aggressive pressing.',
          es: 'Carrilero derecho explosivo, centros milimétricos y presión en banda.',
          pt: 'Ala direito velocista, cruzamentos perfeitos e pressão em bloco.'
        },
        offensiveMovement: {
          en: 'Reaches the byline to deliver dangerous cut-backs to penalty spot.',
          es: 'Pisa línea de fondo y pone pases de la muerte al punto de penalti.',
          pt: 'Ganha a linha de fundo e serve o passe atrasado.'
        },
        defensiveDuty: {
          en: 'Drops back quickly into 5-3-2 compact block.',
          es: 'Se integra en la línea defensiva de 5 defensores.',
          pt: 'Recua para linha de 5 defesas sem bola.'
        },
        keyConceptKey: 'amplitud-y-profundidad',
        keyConceptLabel: { en: 'Flank Superiority', es: 'Desborde de Banda', pt: 'Superioridade na Ala' }
      },
      {
        id: 'mcd', number: 6, label: 'MCD', role: 'MCD', name: 'Central Defensive Anchor', x: 44, y: 50,
        duties: {
          en: 'Defensive screen, wins second balls and dictates short passing circulation.',
          es: 'Pivote defensivo central, recuperador de segundas jugadas y pase seguro.',
          pt: 'Trinco recuperador, domínio de segundas bolas e passe seguro.'
        },
        offensiveMovement: {
          en: 'Shifts horizontally to maintain triangular passing options.',
          es: 'Basculación horizontal para ofrecer apoyo constante en corto.',
          pt: 'Movimentação horizontal para apoios curtos.'
        },
        defensiveDuty: {
          en: 'Stops opposition counters through the middle at all costs.',
          es: 'Filtro central para cortar cualquier contraataque rival.',
          pt: 'Trinco de contenção no meio-campo.'
        },
        keyConceptKey: 'presion-tras-perdida',
        keyConceptLabel: { en: 'Central Anchor', es: 'Pivote de Contención', pt: 'Trinco Fixo' }
      },
      {
        id: 'mc1', number: 8, label: 'MC', role: 'MC', name: 'Left Central Mid', x: 60, y: 35,
        duties: {
          en: 'Dynamic mezzala, attacks the half-space channel and links with twin strikers.',
          es: 'Interior izquierdo de ruptura (Mezzala), incursiones verticales y paredes rápidas.',
          pt: 'Médio interior esquerdo, infiltrações verticais e combinações com os avançados.'
        },
        offensiveMovement: {
          en: 'Underlaps through half-space as left wing-back provides width.',
          es: 'Ruptura interior cuando el carrilero abre la banda.',
          pt: 'Infiltração interior quando o ala dá largura.'
        },
        defensiveDuty: {
          en: 'Forms central pressing trap with anchor.',
          es: 'Presión en bloque medio coordinada con el pivote.',
          pt: 'Pressão a meio-campo coordenada com o trinco.'
        },
        keyConceptKey: 'tercer-hombre',
        keyConceptLabel: { en: 'Mezzala Penetration', es: 'Incursión Mezzala', pt: 'Infiltração de Médio' }
      },
      {
        id: 'mc2', number: 10, label: 'MC', role: 'MC', name: 'Right Central Mid', x: 60, y: 65,
        duties: {
          en: 'Creative interior playmaker, orchestrates final third and shoots from distance.',
          es: 'Interior derecho creativo, visión de juego, último pase y tiro desde fuera del área.',
          pt: 'Médio interior direito criativo, visão de jogo e remate potente exterior.'
        },
        offensiveMovement: {
          en: 'Gives through-balls between opposition center-back and fullback.',
          es: 'Pases filtrados a la espalda del lateral rival.',
          pt: 'Passes de rutura nas costas dos defesas.'
        },
        defensiveDuty: {
          en: 'Presses opponent central midfielders aggressively.',
          es: 'Presión sobre la salida del mediocentro rival.',
          pt: 'Pressão alta na primeira linha do rival.'
        },
        keyConceptKey: 'pase-filtrado',
        keyConceptLabel: { en: 'Playmaking Surge', es: 'Llegada y Último Pase', pt: 'Criatividade e Remate' }
      },
      {
        id: 'dc1', number: 9, label: 'DC', role: 'DC', name: 'Mobile / Second Striker', x: 84, y: 38,
        duties: {
          en: 'Mobile forward, drops between lines to combine and drags defenders out of position.',
          es: 'Delantero móvil, cae a bandas, arrastra marcas y se asocia en paredes.',
          pt: 'Avançado móvel, cai nas alas, cria linhas de passe e arrasta marcações.'
        },
        offensiveMovement: {
          en: 'Drops deep to pull out central defender, creating space for partner.',
          es: 'Desmarque de apoyo para sacar al central y dejar espacio al delantero tanque.',
          pt: 'Recuo tático para abrir espaço ao parceiro de ataque.'
        },
        defensiveDuty: {
          en: 'Presses opposition right-back in possession.',
          es: 'Presiona la salida del lateral derecho rival.',
          pt: 'Pressiona a saída lateral do adversário.'
        },
        keyConceptKey: 'ataque-al-espacio',
        keyConceptLabel: { en: 'Deep Drop & Link', es: 'Desmarque de Arrastre', pt: 'Arrasto de Centrais' }
      },
      {
        id: 'dc2', number: 19, label: 'DC', role: 'DC', name: 'Target Forward Killer', x: 84, y: 62,
        duties: {
          en: 'Physical penalty-box predator, wins aerial duels and converts crosses.',
          es: 'Delantero centro de área, poderío aéreo, remate demoledor y fijación de defensas.',
          pt: 'Ponta de lança demolidor, jogo aéreo imbatível e finalização de primeira.'
        },
        offensiveMovement: {
          en: 'Attacks the six-yard box directly on wing-back crosses.',
          es: 'Ataque frontal al área pequeña en centros laterales.',
          pt: 'Ataque implacável à pequena área nos cruzamentos.'
        },
        defensiveDuty: {
          en: 'Presses central defenders and blocks direct ground passes.',
          es: 'Bloquea la línea central de pase del portero y centrales.',
          pt: 'Bloqueia passes centrais dos defesas rivais.'
        },
        keyConceptKey: 'desmarque-de-ruptura',
        keyConceptLabel: { en: 'Box Target Finishing', es: 'Depredador de Área', pt: 'Faro de Golo' }
      }
    ]
  }
];

export const TacticalBoard: React.FC = () => {
  const { t, lang } = useLanguage();
  const pitchRef = useRef<HTMLDivElement>(null);
  const [activeFormationId, setActiveFormationId] = useState<string>('4-3-3');
  const [activeFormation, setActiveFormation] = useState<TacticalFormation>(FORMATIONS[0]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('dc');
  const [playersPos, setPlayersPos] = useState<Record<string, { x: number; y: number }>>({});
  const [showPassingLines, setShowPassingLines] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(false);
  const [tacticalPhase, setTacticalPhase] = useState<'buildUp' | 'attack' | 'compactDefense'>('buildUp');
  const [isDraggingToken, setIsDraggingToken] = useState<boolean>(false);

  // Initialize or change formation
  useEffect(() => {
    const found = FORMATIONS.find((f) => f.id === activeFormationId) || FORMATIONS[0];
    setActiveFormation(found);
    
    // Set initial player coordinates
    const initialMap: Record<string, { x: number; y: number }> = {};
    found.players.forEach((p) => {
      initialMap[p.id] = { x: p.x, y: p.y };
    });
    setPlayersPos(initialMap);
    
    // Select default key player (e.g. forward or midfielder)
    const defaultSelect = found.players.find((p) => p.id === 'dc') || found.players[found.players.length - 1];
    if (defaultSelect) {
      setSelectedPlayerId(defaultSelect.id);
    }
  }, [activeFormationId]);

  const handleResetPositions = () => {
    const initialMap: Record<string, { x: number; y: number }> = {};
    activeFormation.players.forEach((p) => {
      initialMap[p.id] = { x: p.x, y: p.y };
    });
    setPlayersPos(initialMap);
    setTacticalPhase('buildUp');
  };

  const handleApplyTacticalPhase = (phase: 'buildUp' | 'attack' | 'compactDefense') => {
    setTacticalPhase(phase);
    const updatedMap: Record<string, { x: number; y: number }> = {};

    activeFormation.players.forEach((p) => {
      let xOffset = 0;
      let yOffset = 0;

      if (phase === 'attack') {
        // Shift outfield players higher and wider
        if (p.role === 'POR') xOffset = 4;
        else if (p.role === 'DEC') xOffset = 14;
        else if (p.role === 'LAT') xOffset = 20;
        else if (p.role === 'MCD') xOffset = 15;
        else if (p.role === 'MC' || p.role === 'MPO') xOffset = 14;
        else if (p.role === 'EXT' || p.role === 'DC') xOffset = 8;
      } else if (phase === 'compactDefense') {
        // Drop into compact defensive shape
        if (p.role === 'POR') xOffset = -2;
        else if (p.role === 'DEC') xOffset = -8;
        else if (p.role === 'LAT') { xOffset = -10; yOffset = p.y < 50 ? 8 : -8; }
        else if (p.role === 'MCD') xOffset = -12;
        else if (p.role === 'MC' || p.role === 'MPO') xOffset = -18;
        else if (p.role === 'EXT' || p.role === 'DC') xOffset = -22;
      }

      const newX = Math.max(5, Math.min(94, p.x + xOffset));
      const newY = Math.max(8, Math.min(92, p.y + yOffset));
      updatedMap[p.id] = { x: newX, y: newY };
    });

    setPlayersPos(updatedMap);
  };

  const handleTokenDragEnd = (playerId: string, info: any) => {
    setIsDraggingToken(false);
    if (!pitchRef.current) return;

    const rect = pitchRef.current.getBoundingClientRect();
    const clientX = info.point.x;
    const clientY = info.point.y;

    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(4, Math.min(96, Math.round(relX * 10) / 10));
    const clampedY = Math.max(6, Math.min(94, Math.round(relY * 10) / 10));

    setPlayersPos((prev) => ({
      ...prev,
      [playerId]: { x: clampedX, y: clampedY }
    }));
  };

  const selectedPlayer = activeFormation.players.find((p) => p.id === selectedPlayerId) || activeFormation.players[0];

  const getRoleColorTheme = (role: PositionCategory) => {
    switch (role) {
      case 'POR':
        return {
          bg: 'bg-amber-400',
          text: 'text-black',
          border: 'border-amber-300',
          glow: 'shadow-amber-400/40',
          ring: 'ring-amber-400',
          pill: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          label: lang === 'en' ? 'Goalkeeper' : lang === 'pt' ? 'Guarda-Redes' : 'Portero'
        };
      case 'DEC':
      case 'LAT':
        return {
          bg: 'bg-[#4E92F2]',
          text: 'text-white',
          border: 'border-blue-300',
          glow: 'shadow-blue-500/40',
          ring: 'ring-blue-400',
          pill: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          label: lang === 'en' ? 'Defender' : lang === 'pt' ? 'Defesa' : 'Defensa'
        };
      case 'MCD':
      case 'MC':
      case 'MPO':
        return {
          bg: 'bg-emerald-400',
          text: 'text-black',
          border: 'border-emerald-200',
          glow: 'shadow-emerald-400/40',
          ring: 'ring-emerald-400',
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          label: lang === 'en' ? 'Midfielder' : lang === 'pt' ? 'Médio' : 'Centrocampista'
        };
      case 'EXT':
      case 'DC':
        return {
          bg: 'bg-[#ccff00]',
          text: 'text-black',
          border: 'border-white',
          glow: 'shadow-[#ccff00]/40',
          ring: 'ring-[#ccff00]',
          pill: 'bg-volt/20 text-volt border-volt/40',
          label: lang === 'en' ? 'Forward' : lang === 'pt' ? 'Avançado' : 'Delantero'
        };
      default:
        return {
          bg: 'bg-volt',
          text: 'text-black',
          border: 'border-white',
          glow: 'shadow-volt/40',
          ring: 'ring-volt',
          pill: 'bg-volt/20 text-volt border-volt/40',
          label: 'Player'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-volt/10 border border-volt/30 text-volt text-xs font-bold font-mono-code uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-volt" />
              {t.tacticsTag}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono font-bold uppercase">
              11 vs 11 UEFA Pro
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black italic text-white font-display uppercase tracking-tight mt-2">
            {t.tacticsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'en'
              ? 'Drag & reposition any player token smoothly across the pitch. Select circular tokens to inspect in-depth movements, defensive triggers and tactical responsibilities.'
              : lang === 'pt'
              ? 'Arraste e reposicione qualquer ficha circular no campo. Selecione os jogadores para ver movimentações em profundidade e obrigações táticas.'
              : 'Arrastra y reposiciona cualquier dorsal circular por el campo con total libertad. Haz clic en las fichas para ver funciones, desmarques y obligaciones tácticas.'}
          </p>
        </div>

        {/* Formation Picker Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
          {FORMATIONS.map((f) => {
            const isCurrent = activeFormationId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFormationId(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black italic font-display uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-volt text-black shadow-lg shadow-volt/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{f.system}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tactical Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center: Interactive 11-a-side Pitch (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
          
          {/* Pitch Control Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-volt font-black font-display uppercase italic text-sm tracking-wide">
                {activeFormation.system} • {activeFormation.name}
              </span>
            </div>

            {/* Quick Tactical Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tactical Phase Buttons */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-[11px] font-bold">
                <button
                  onClick={() => handleApplyTacticalPhase('buildUp')}
                  className={`px-2 py-1 rounded transition-colors ${tacticalPhase === 'buildUp' ? 'bg-volt text-black font-black' : 'text-slate-400 hover:text-white'}`}
                  title="Salida de balón / Base"
                >
                  {lang === 'en' ? 'Build-up' : lang === 'pt' ? 'Construção' : 'Salida'}
                </button>
                <button
                  onClick={() => handleApplyTacticalPhase('attack')}
                  className={`px-2 py-1 rounded transition-colors ${tacticalPhase === 'attack' ? 'bg-volt text-black font-black' : 'text-slate-400 hover:text-white'}`}
                  title="Bloque ofensivo / Ataque posicional"
                >
                  {lang === 'en' ? 'Attacking' : lang === 'pt' ? 'Ataque' : 'Ataque'}
                </button>
                <button
                  onClick={() => handleApplyTacticalPhase('compactDefense')}
                  className={`px-2 py-1 rounded transition-colors ${tacticalPhase === 'compactDefense' ? 'bg-volt text-black font-black' : 'text-slate-400 hover:text-white'}`}
                  title="Bloque bajo defensivo"
                >
                  {lang === 'en' ? 'Defense' : lang === 'pt' ? 'Defesa' : 'Defensa'}
                </button>
              </div>

              {/* Toggle Passing Lines */}
              <button
                onClick={() => setShowPassingLines(!showPassingLines)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  showPassingLines
                    ? 'bg-volt/10 border-volt/40 text-volt'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Líneas de pase y triángulos tácticos"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? 'Passing' : lang === 'pt' ? 'Passes' : 'Pases'}</span>
              </button>

              {/* Toggle Tactical Zones */}
              <button
                onClick={() => setShowZones(!showZones)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  showZones
                    ? 'bg-sky-500/10 border-sky-400/40 text-sky-400'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Pasillos interiores y Zona 14"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? 'Zones' : lang === 'pt' ? 'Zonas' : 'Zonas'}</span>
              </button>

              {/* Reset Formation Positions Button */}
              <button
                onClick={handleResetPositions}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-volt text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Reiniciar posiciones iniciales"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? 'Reset' : lang === 'pt' ? 'Repor' : 'Reiniciar'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Pitch Canvas */}
          <div
            ref={pitchRef}
            className="relative w-full aspect-[16/10] bg-[#072411] border-2 border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl select-none touch-none cursor-crosshair"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(3, 30, 15, 0.95) 100%),
                repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 40px, transparent 40px, transparent 80px)
              `
            }}
          >
            {/* Pitch Grass Mowing Striping */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:12.5%_100%] pointer-events-none" />

            {/* Tactical Channel & Zone 14 Overlay */}
            {showZones && (
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* 5 Vertical Corridors (Left Flank, Left Half-space, Center, Right Half-space, Right Flank) */}
                <div className="absolute inset-0 grid grid-rows-5 opacity-25">
                  <div className="border-b border-sky-400/40 bg-sky-400/5 flex items-center justify-end pr-4 text-[9px] font-mono font-bold text-sky-300 uppercase">
                    {lang === 'en' ? 'Left Flank' : lang === 'pt' ? 'Corredor Esquerdo' : 'Carril Izquierdo'}
                  </div>
                  <div className="border-b border-amber-400/40 bg-amber-400/5 flex items-center justify-end pr-4 text-[9px] font-mono font-bold text-amber-300 uppercase">
                    {lang === 'en' ? 'Left Half-Space' : lang === 'pt' ? 'Espaço Interior Esq.' : 'Pasillo Interior Izq.'}
                  </div>
                  <div className="border-b border-volt/40 bg-volt/5 flex items-center justify-end pr-4 text-[9px] font-mono font-bold text-volt uppercase">
                    {lang === 'en' ? 'Central Axis' : lang === 'pt' ? 'Eixo Central' : 'Eje Central'}
                  </div>
                  <div className="border-b border-amber-400/40 bg-amber-400/5 flex items-center justify-end pr-4 text-[9px] font-mono font-bold text-amber-300 uppercase">
                    {lang === 'en' ? 'Right Half-Space' : lang === 'pt' ? 'Espaço Interior Dir.' : 'Pasillo Interior Der.'}
                  </div>
                  <div className="bg-sky-400/5 flex items-center justify-end pr-4 text-[9px] font-mono font-bold text-sky-300 uppercase">
                    {lang === 'en' ? 'Right Flank' : lang === 'pt' ? 'Corredor Direito' : 'Carril Derecho'}
                  </div>
                </div>

                {/* Zone 14 Golden Pocket (Opponent Box Edge) */}
                <div className="absolute left-[66%] top-[30%] w-[18%] h-[40%] rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-400/15 flex items-center justify-center">
                  <span className="text-[10px] font-black font-mono tracking-widest text-amber-300 uppercase bg-black/60 px-2 py-0.5 rounded shadow">
                    ZONA 14
                  </span>
                </div>
              </div>
            )}

            {/* Pitch Markings SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Outer boundary border */}
              <rect x="2.5%" y="3%" width="95%" height="94%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              
              {/* Half-way line */}
              <line x1="50%" y1="3%" x2="50%" y2="97%" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              
              {/* Center Circle */}
              <circle cx="50%" cy="50%" r="14%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <circle cx="50%" cy="50%" r="3" fill="rgba(255,255,255,0.7)" />

              {/* Left Penalty Area (Home Goalie Box) */}
              <rect x="2.5%" y="22%" width="16%" height="56%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <rect x="2.5%" y="36%" width="6%" height="28%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <circle cx="13%" cy="50%" r="2.5" fill="rgba(255,255,255,0.7)" />
              <path d="M 18.5% 42% A 8% 8% 0 0 1 18.5% 58%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

              {/* Right Penalty Area (Opponent Box) */}
              <rect x="81.5%" y="22%" width="16%" height="56%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <rect x="91.5%" y="36%" width="6%" height="28%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <circle cx="87%" cy="50%" r="2.5" fill="rgba(255,255,255,0.7)" />
              <path d="M 81.5% 42% A 8% 8% 0 0 0 81.5% 58%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

              {/* Corner Arcs */}
              <path d="M 2.5% 6% A 3% 3% 0 0 1 5.5% 3%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <path d="M 2.5% 94% A 3% 3% 0 0 0 5.5% 97%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <path d="M 97.5% 6% A 3% 3% 0 0 0 94.5% 3%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <path d="M 97.5% 94% A 3% 3% 0 0 1 94.5% 97%" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

              {/* Dynamic Passing Network Triangles Lines */}
              {showPassingLines && activeFormation.passingLinks.map(([fromId, toId], idx) => {
                const posA = playersPos[fromId];
                const posB = playersPos[toId];
                if (!posA || !posB) return null;

                const isConnectedToSelected = selectedPlayerId === fromId || selectedPlayerId === toId;

                return (
                  <line
                    key={`link-${idx}`}
                    x1={`${posA.x}%`}
                    y1={`${posA.y}%`}
                    x2={`${posB.x}%`}
                    y2={`${posB.y}%`}
                    stroke={isConnectedToSelected ? '#ccff00' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={isConnectedToSelected ? 2 : 1}
                    strokeDasharray={isConnectedToSelected ? '4 2' : undefined}
                    strokeOpacity={isConnectedToSelected ? 0.9 : 0.4}
                  />
                );
              })}
            </svg>

            {/* Attack Direction Indicator Tag */}
            <div className="absolute top-2 right-4 pointer-events-none z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono-code text-slate-300">
              <span>{lang === 'en' ? 'ATTACK' : lang === 'pt' ? 'ATAQUE' : 'ATAQUE'}</span>
              <ArrowRight className="w-3 h-3 text-volt" />
            </div>

            {/* Drag & Drop Circular Player Tokens */}
            {activeFormation.players.map((p) => {
              const currentPos = playersPos[p.id] || { x: p.x, y: p.y };
              const isSelected = selectedPlayerId === p.id;
              const theme = getRoleColorTheme(p.role);

              return (
                <motion.div
                  key={p.id}
                  drag
                  dragConstraints={pitchRef}
                  dragElastic={0.05}
                  dragMomentum={false}
                  onDragStart={() => {
                    setIsDraggingToken(true);
                    setSelectedPlayerId(p.id);
                  }}
                  onDragEnd={(_, info) => handleTokenDragEnd(p.id, info)}
                  onClick={() => setSelectedPlayerId(p.id)}
                  style={{
                    left: `${currentPos.x}%`,
                    top: `${currentPos.y}%`
                  }}
                  animate={{
                    left: `${currentPos.x}%`,
                    top: `${currentPos.y}%`,
                    scale: isSelected ? 1.15 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20 group`}
                >
                  {/* Selected Ripple Pulse Glow Ring */}
                  {isSelected && (
                    <span className="absolute -inset-2.5 rounded-full bg-volt/30 animate-ping pointer-events-none" />
                  )}

                  {/* Main Circular Token */}
                  <div
                    className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center transition-all shadow-xl ${
                      isSelected
                        ? 'bg-black text-white ring-4 ring-volt border-2 border-white shadow-2xl shadow-volt/50 z-30'
                        : 'bg-slate-950/95 text-white border-2 border-white/40 hover:border-volt hover:scale-105 group-hover:shadow-lg'
                    }`}
                  >
                    {/* Role Color Accent Top Arc */}
                    <div className={`absolute top-0 inset-x-2 h-1 rounded-t-full ${theme.bg}`} />

                    {/* Dorsal Jersey Number */}
                    <span className={`text-sm sm:text-base font-black italic font-display leading-none ${isSelected ? 'text-volt' : 'text-white'}`}>
                      {p.number}
                    </span>

                    {/* Role Code Badge */}
                    <span className="text-[8px] sm:text-[9px] font-mono-code font-bold uppercase tracking-tight text-slate-300 leading-none mt-0.5">
                      {p.label}
                    </span>

                    {/* Drag Handle Indicator Dots on Hover */}
                    <div className="absolute -bottom-1 w-2 h-0.5 rounded-full bg-white/40 group-hover:bg-volt" />
                  </div>

                  {/* Floating Name Label Tag below token */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 pointer-events-none whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono-code font-bold uppercase tracking-wider block shadow ${
                      isSelected
                        ? 'bg-volt text-black font-black'
                        : 'bg-black/80 text-slate-300 border border-white/10'
                    }`}>
                      {p.label} • {p.name.split(' ')[0]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Pitch Footer Note */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-volt" />
              <span>{lang === 'en' ? 'Click & drag any player circle to customize pitch positioning' : lang === 'pt' ? 'Clique e arraste qualquer jogador para ajustar no relvado' : 'Haz clic y arrastra cualquier ficha para ajustar la disposición táctica'}</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 hidden sm:inline">
              {activeFormation.players.length} {lang === 'en' ? 'Players on Field' : lang === 'pt' ? 'Jogadores no Campo' : 'Jugadores en Campo'}
            </span>
          </div>
        </div>

        {/* Right Column: Selected Player Tactical File Card (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          
          {/* Card Header with Role Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-volt flex items-center justify-center text-black font-black italic shadow-md shadow-volt/20">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="text-base font-black italic text-white font-display uppercase tracking-wide">
                  {t.dutyCardTitle}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono-code uppercase">
                  {selectedPlayer.label} • #{selectedPlayer.number}
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${getRoleColorTheme(selectedPlayer.role).pill}`}>
              {getRoleColorTheme(selectedPlayer.role).label}
            </span>
          </div>

          {/* Selected Player Identity Hero */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-volt to-emerald-400 text-black font-black font-display text-2xl flex items-center justify-center italic shadow-lg shadow-volt/20">
                {selectedPlayer.number}
              </div>
              <div>
                <h4 className="text-lg font-black italic text-white font-display uppercase">
                  {selectedPlayer.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
                  <span>{t.roleLabel}: <strong className="text-volt">{selectedPlayer.role}</strong></span>
                  <span>•</span>
                  <span>Pos: X:{Math.round(playersPos[selectedPlayer.id]?.x || selectedPlayer.x)}% Y:{Math.round(playersPos[selectedPlayer.id]?.y || selectedPlayer.y)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Tactical Duties */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
              <div className="text-volt font-bold uppercase text-[10px] font-mono-code tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-volt" />
                {lang === 'en' ? 'Core Tactical Duty:' : lang === 'pt' ? 'Obrigação Tática Principal:' : 'Obligación Táctica Principal:'}
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {selectedPlayer.duties[lang] || selectedPlayer.duties.es}
              </p>
            </div>

            {/* Offensive Movement Pattern */}
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
              <div className="text-emerald-400 font-bold uppercase text-[10px] font-mono-code flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'en' ? 'Offensive Movement & Spacing:' : lang === 'pt' ? 'Movimento Ofensivo & Espaço:' : 'Movimiento Ofensivo & Desmarques:'}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedPlayer.offensiveMovement[lang] || selectedPlayer.offensiveMovement.es}
              </p>
            </div>

            {/* Defensive Transition & Counter-Press */}
            <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1">
              <div className="text-sky-400 font-bold uppercase text-[10px] font-mono-code flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                {lang === 'en' ? 'Defensive Phase & Pressing:' : lang === 'pt' ? 'Fase Defensiva & Pressão:' : 'Fase Defensiva & Presión:'}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedPlayer.defensiveDuty[lang] || selectedPlayer.defensiveDuty.es}
              </p>
            </div>
          </div>

          {/* Key Tactical Concept with Interactive Glossary Link */}
          <div className="p-4 rounded-xl bg-volt/10 border border-volt/30 space-y-2">
            <div className="text-volt font-bold uppercase text-[10px] font-mono-code flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-volt" />
              {lang === 'en' ? 'Key Concept to Master:' : lang === 'pt' ? 'Conceito Chave para Dominar:' : 'Concepto Clave del Puesto:'}
            </div>
            <p className="text-xs text-slate-200">
              {lang === 'en'
                ? <>Dominate <TacticalTerm termKey={selectedPlayer.keyConceptKey}>{selectedPlayer.keyConceptLabel.en}</TacticalTerm> to excel in this tactical system.</>
                : lang === 'pt'
                ? <>Domine <TacticalTerm termKey={selectedPlayer.keyConceptKey}>{selectedPlayer.keyConceptLabel.pt}</TacticalTerm> para render neste esquema tático.</>
                : <>Domina <TacticalTerm termKey={selectedPlayer.keyConceptKey}>{selectedPlayer.keyConceptLabel.es}</TacticalTerm> para brillar en este sistema de juego.</>}
            </p>
          </div>

          {/* System Description Footer */}
          <div className="pt-2 border-t border-white/10 text-xs text-slate-400 italic leading-relaxed">
            {activeFormation.description[lang] || activeFormation.description.es}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Dumbbell, 
  Calendar, 
  ChevronRight, 
  X, 
  Play, 
  Award, 
  Printer, 
  Layers, 
  Lock, 
  ArrowRight,
  Flame,
  Zap,
  Edit3,
  Cloud,
  CloudCheck,
  Trash2,
  RefreshCw,
  Crown,
  AlertCircle
} from 'lucide-react';
import { 
  AcademyStudent, 
  AcademySquad, 
  AcademyFormation, 
  PositionCategory, 
  SkillScores, 
  AcademyTask,
  PlanType
} from '../types';
import { useAuth } from '../context/AuthContext';
import { TacticalWhiteboard } from './TacticalWhiteboard';
import { TacticalTerm } from './TacticalTerm';
import { Shield, Info } from 'lucide-react';
import { 
  saveStudentToCloud, 
  deleteStudentFromCloud, 
  subscribeToAcademyStudents,
  saveLineupToCloud,
  subscribeToAcademyLineup
} from '../lib/firebase';

interface FormationSlotTemplate {
  slotId: string;
  posCode: PositionCategory;
  label: string;
  number: number;
  x: number;
  y: number;
  roleName: string;
  duties: string;
  tacticalConcept: string;
  tacticalTermKey?: string;
}

const FORMATION_TEMPLATES: Record<AcademyFormation, FormationSlotTemplate[]> = {
  '4-3-3': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero Líbero', duties: 'Salida de balón lavolpiana, blocajes, cobertura a la espalda de centrales y achiques.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-li', posCode: 'LAT', label: 'LI', number: 3, x: 28, y: 18, roleName: 'Lateral Izquierdo Profundo', duties: 'Amplitud en banda, desdobles ofensivos, centros en carrera y repliegue.', tacticalConcept: 'Desdoble Ofensivo', tacticalTermKey: 'desdoble-ofensivo' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 4, x: 22, y: 35, roleName: 'Defensa Central Izquierdo', duties: 'Cierre central, duelos 1v1, coberturas laterales y perfilación de pase.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 5, x: 22, y: 65, roleName: 'Defensa Central Derecho', duties: 'Marcaje en anticipación, juego aéreo dominante y pase vertical entre líneas.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-ld', posCode: 'LAT', label: 'LD', number: 2, x: 28, y: 82, roleName: 'Lateral Derecho Profundo', duties: 'Proyección constante, basculación en defensa y presión al poseedor.', tacticalConcept: 'Basculación', tacticalTermKey: 'basculacion' },
    { slotId: 'pos-mcd', posCode: 'MCD', label: 'MCD', number: 6, x: 42, y: 50, roleName: 'Pivote Ancla / Organizador', duties: 'Equilibrio estructural, recuperación en mediocampo y distribución rápida.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mc1', posCode: 'MC', label: 'MC', number: 8, x: 58, y: 32, roleName: 'Interior Izquierdo Box-to-Box', duties: 'Interiores de ida y vuelta, búsqueda del tercer hombre y ruptura.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-mc2', posCode: 'MPO', label: 'MPO', number: 10, x: 58, y: 68, roleName: 'Interior Creativo / Mediapunta', duties: 'Pases filtrados al espacio, remate exterior y asociación en último tercio.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-exti', posCode: 'EXT', label: 'EXT', number: 11, x: 80, y: 15, roleName: 'Extremo Izquierdo Invertido', duties: 'Diagonal a pierna cambiada, desborde 1v1 y finalización al segundo palo.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-dc', posCode: 'DC', label: 'DC', number: 9, x: 86, y: 50, roleName: 'Delantero Centro Killer', duties: 'Fijar centrales rivales, desmarques de ruptura y remate al primer toque.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' },
    { slotId: 'pos-extd', posCode: 'EXT', label: 'EXT', number: 7, x: 80, y: 85, roleName: 'Extremo Derecho Desbordador', duties: 'Máxima amplitud, desborde exterior y centros tensos al área.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' }
  ],
  '4-2-3-1': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero', duties: 'Atención a balones largos a la espalda y comunicación defensiva.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-li', posCode: 'LAT', label: 'LI', number: 3, x: 28, y: 18, roleName: 'Lateral Izquierdo', duties: 'Cierre de banda y apoyo en salida.', tacticalConcept: 'Desdoble Ofensivo', tacticalTermKey: 'desdoble-ofensivo' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 4, x: 22, y: 36, roleName: 'Defensa Central', duties: 'Marcaje estrecho y coberturas.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 5, x: 22, y: 64, roleName: 'Defensa Central', duties: 'Anticipación y pase seguro.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-ld', posCode: 'LAT', label: 'LD', number: 2, x: 28, y: 82, roleName: 'Lateral Derecho', duties: 'Cierre por derecha y repliegue.', tacticalConcept: 'Basculación', tacticalTermKey: 'basculacion' },
    { slotId: 'pos-mcd1', posCode: 'MCD', label: 'MCD', number: 6, x: 42, y: 35, roleName: 'Pivote Robador', duties: 'Presión asfixiante, robos e intercepciones.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mcd2', posCode: 'MC', label: 'MC', number: 8, x: 42, y: 65, roleName: 'Pivote Distribuidor', duties: 'Cambios de orientación y distribución fluida.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-mpo', posCode: 'MPO', label: 'MPO', number: 10, x: 68, y: 50, roleName: 'Mediapunta Nexo', duties: 'Recepción entre líneas y último pase.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-exti', posCode: 'EXT', label: 'EXT', number: 11, x: 72, y: 20, roleName: 'Extremo Izquierdo', duties: 'Entrada al área desde izquierda y remate.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-extd', posCode: 'EXT', label: 'EXT', number: 7, x: 72, y: 80, roleName: 'Extremo Derecho', duties: 'Presión en banda rival y centros venenosos.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-dc', posCode: 'DC', label: 'DC', number: 9, x: 88, y: 50, roleName: 'Delantero Centro', duties: 'Presión alta, fijación y gol.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' }
  ],
  '4-4-2': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero', duties: 'Seguridad en balones aéreos y juego con los pies.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-li', posCode: 'LAT', label: 'LI', number: 3, x: 28, y: 18, roleName: 'Lateral Izquierdo', duties: 'Doble lateral con el volante exterior.', tacticalConcept: 'Desdoble Ofensivo', tacticalTermKey: 'desdoble-ofensivo' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 4, x: 22, y: 36, roleName: 'Defensa Central', duties: 'Cierre central y contención.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 5, x: 22, y: 64, roleName: 'Defensa Central', duties: 'Anticipación por bajo y despejes.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-ld', posCode: 'LAT', label: 'LD', number: 2, x: 28, y: 82, roleName: 'Lateral Derecho', duties: 'Cobertura de banda y apoyo.', tacticalConcept: 'Basculación', tacticalTermKey: 'basculacion' },
    { slotId: 'pos-mi', posCode: 'EXT', label: 'EXT', number: 11, x: 54, y: 16, roleName: 'Volante Izquierdo', duties: 'Llegada por banda y apoyo defensivo.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-mc1', posCode: 'MC', label: 'MC', number: 6, x: 48, y: 38, roleName: 'Mediocentro Izquierdo', duties: 'Equilibrio táctico y basculación.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mc2', posCode: 'MC', label: 'MC', number: 8, x: 48, y: 62, roleName: 'Mediocentro Derecho', duties: 'Llegada y distribución.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-md', posCode: 'EXT', label: 'EXT', number: 7, x: 54, y: 84, roleName: 'Volante Derecho', duties: 'Desborde y centros cruzados.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-dc1', posCode: 'DC', label: 'DC', number: 10, x: 82, y: 38, roleName: 'Segundo Delantero', duties: 'Flotar entre líneas y enganche con los puntas.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-dc2', posCode: 'DC', label: 'DC', number: 9, x: 88, y: 62, roleName: 'Delantero de Área', duties: 'Remate y presencia en el área rival.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' }
  ],
  '3-5-2': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero', duties: 'Comunicación constante y control de área.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 2, x: 22, y: 25, roleName: 'Central Perfil Izquierdo', duties: 'Cierre del intervalo izquierdo.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfc', posCode: 'DEC', label: 'DEC', number: 4, x: 20, y: 50, roleName: 'Líbero y Mariscal', duties: 'Organización de la línea de 3 y coberturas.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 5, x: 22, y: 75, roleName: 'Central Perfil Derecho', duties: 'Cierre del intervalo derecho.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-cari', posCode: 'LAT', label: 'LAT', number: 3, x: 50, y: 12, roleName: 'Carrilero Izquierdo Total', duties: 'Carrilero de banda completa y llegada.', tacticalConcept: 'Desdoble Ofensivo', tacticalTermKey: 'desdoble-ofensivo' },
    { slotId: 'pos-card', posCode: 'LAT', label: 'LAT', number: 7, x: 50, y: 88, roleName: 'Carrilero Derecho Total', duties: 'Carrilero de banda completa y centros.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-mcd', posCode: 'MCD', label: 'MCD', number: 6, x: 45, y: 50, roleName: 'Pivote Ancla', duties: 'Recuperador y basculación.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mc1', posCode: 'MC', label: 'MC', number: 8, x: 60, y: 35, roleName: 'Interior de Enlace', duties: 'Interior de apoyo y paredes rápidas.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-mc2', posCode: 'MC', label: 'MC', number: 10, x: 60, y: 65, roleName: 'Interior Ofensivo', duties: 'Llegada desde atrás y tiro lejano.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-dc1', posCode: 'DC', label: 'DC', number: 9, x: 84, y: 38, roleName: 'Delantero Móvil', duties: 'Desmarques en diagonal y arrastre de marcas.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-dc2', posCode: 'DC', label: 'DC', number: 19, x: 84, y: 62, roleName: 'Delantero Tanque', duties: 'Juego de espaldas y remates de cabeza.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' }
  ],
  '3-4-3': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero Líbero', duties: 'Inicio de juego combinativo y salidas rápidas.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 3, x: 22, y: 25, roleName: 'Central Izquierdo', duties: 'Salida limpia por izquierda y cierre.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfc', posCode: 'DEC', label: 'DEC', number: 4, x: 19, y: 50, roleName: 'Central Eje', duties: 'Mariscal defensivo y anticipación.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 2, x: 22, y: 75, roleName: 'Central Derecho', duties: 'Salida limpia por derecha y duelos.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-mcd', posCode: 'MCD', label: 'MCD', number: 6, x: 42, y: 50, roleName: 'Pivote Base Rombo', duties: 'Vértice inferior del rombo y equilibrio.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mi', posCode: 'MC', label: 'MC', number: 8, x: 56, y: 22, roleName: 'Interior Izquierdo', duties: 'Circulación rápida y triángulos de pase.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-md', posCode: 'MC', label: 'MC', number: 7, x: 56, y: 78, roleName: 'Interior Derecho', duties: 'Asociación y cambios de juego.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-mpo', posCode: 'MPO', label: 'MPO', number: 10, x: 68, y: 50, roleName: 'Vértice Ofensivo 10', duties: 'Magia entre líneas y asistencia.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-exti', posCode: 'EXT', label: 'EXT', number: 11, x: 82, y: 16, roleName: 'Extremo Izquierdo', duties: '1v1 pegado a la cal y centros rasos.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-extd', posCode: 'EXT', label: 'EXT', number: 17, x: 82, y: 84, roleName: 'Extremo Derecho', duties: 'Desborde explosivo y diagonales.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-dc', posCode: 'DC', label: 'DC', number: 9, x: 88, y: 50, roleName: 'Delantero Centro', duties: 'Finalización clínica y arrastres.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' }
  ],
  '4-1-4-1': [
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', number: 1, x: 10, y: 50, roleName: 'Portero', duties: 'Organización de la línea y seguridad.', tacticalConcept: 'Salida Lavolpiana', tacticalTermKey: 'salida-lavolpiana' },
    { slotId: 'pos-li', posCode: 'LAT', label: 'LI', number: 3, x: 28, y: 18, roleName: 'Lateral Izquierdo', duties: 'Contención y doblaje oportuno.', tacticalConcept: 'Desdoble Ofensivo', tacticalTermKey: 'desdoble-ofensivo' },
    { slotId: 'pos-dfci', posCode: 'DEC', label: 'DEC', number: 4, x: 22, y: 36, roleName: 'Defensa Central', duties: 'Líder defensivo por izquierda.', tacticalConcept: 'Perfilación Corporal', tacticalTermKey: 'perfilacion-corporal' },
    { slotId: 'pos-dfcd', posCode: 'DEC', label: 'DEC', number: 5, x: 22, y: 64, roleName: 'Defensa Central', duties: 'Líder defensivo por derecha.', tacticalConcept: 'Vigilancia Defensiva', tacticalTermKey: 'vigilancia-defensiva' },
    { slotId: 'pos-ld', posCode: 'LAT', label: 'LD', number: 2, x: 28, y: 82, roleName: 'Lateral Derecho', duties: 'Contención y salidas rápidas.', tacticalConcept: 'Basculación', tacticalTermKey: 'basculacion' },
    { slotId: 'pos-mcd', posCode: 'MCD', label: 'MCD', number: 6, x: 42, y: 50, roleName: 'Pivote Solitario', duties: 'Ancla táctica y corte de contragolpes.', tacticalConcept: 'Presión Tras Pérdida', tacticalTermKey: 'presion-tras-perdida' },
    { slotId: 'pos-mi', posCode: 'EXT', label: 'EXT', number: 11, x: 64, y: 18, roleName: 'Interior Izquierdo Alto', duties: 'Presión en bloque medio y llegada.', tacticalConcept: 'Ataque al Espacio', tacticalTermKey: 'ataque-al-espacio' },
    { slotId: 'pos-mc1', posCode: 'MC', label: 'MC', number: 8, x: 60, y: 38, roleName: 'Interior Conector', duties: 'Pase corto y transiciones rápidas.', tacticalConcept: 'Tercer Hombre', tacticalTermKey: 'tercer-hombre' },
    { slotId: 'pos-mc2', posCode: 'MC', label: 'MC', number: 10, x: 60, y: 62, roleName: 'Interior Creador', duties: 'Llegada y pases entre líneas.', tacticalConcept: 'Pase Filtrado', tacticalTermKey: 'pase-filtrado' },
    { slotId: 'pos-md', posCode: 'EXT', label: 'EXT', number: 7, x: 64, y: 82, roleName: 'Interior Derecho Alto', duties: 'Presión alta y desborde.', tacticalConcept: 'Amplitud y Profundidad', tacticalTermKey: 'amplitud-y-profundidad' },
    { slotId: 'pos-dc', posCode: 'DC', label: 'DC', number: 9, x: 88, y: 50, roleName: 'Delantero Solitario', duties: 'Presión al balón y remate.', tacticalConcept: 'Desmarque de Ruptura', tacticalTermKey: 'desmarque-de-ruptura' }
  ]
};

interface AcademyDashboardProps {
  onStartStudentExam: (student: AcademyStudent) => void;
  onOpenPricing: (preferredPlan?: PlanType) => void;
  onOpenDrill?: (drillTitle: string) => void;
}

// Default initial starter roster for coaches
const INITIAL_STUDENTS: AcademyStudent[] = [
  {
    id: 'std-1',
    name: 'Mateo Díaz',
    age: 15,
    category: 'Sub-16',
    dorsal: 10,
    preferredFoot: 'Diestro',
    primaryPosition: 'MPO',
    secondaryPosition: 'EXT',
    matchPercentage: 94,
    skills: {
      speed: 84,
      technique: 92,
      finishing: 80,
      passing: 93,
      defending: 55,
      physical: 72,
      tacticalIQ: 91,
      mental: 88
    },
    coachNotes: 'Visión periférica sobresaliente en el último tercio. Debe acelerar el repliegue defensivo.',
    lastExamDate: '2026-09-14',
    tasks: [
      {
        id: 'tsk-1',
        title: 'Control orientado con pierna lejana bajo presión',
        category: 'Técnica',
        description: 'Repetir 3 series de 20 controles con amago de hombro.',
        assignedToStudentId: 'std-1',
        assignedDate: '2026-09-15',
        dueDate: '2026-09-22',
        status: 'pending'
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'std-2',
    name: 'Lucas Silva',
    age: 16,
    category: 'Sub-16',
    dorsal: 7,
    preferredFoot: 'Diestro',
    primaryPosition: 'EXT',
    secondaryPosition: 'DC',
    matchPercentage: 91,
    skills: {
      speed: 95,
      technique: 88,
      finishing: 82,
      passing: 74,
      defending: 48,
      physical: 86,
      tacticalIQ: 82,
      mental: 85
    },
    coachNotes: 'Pura explosividad por banda. Trabajar la toma de decisiones al pisar línea de fondo.',
    lastExamDate: '2026-09-12',
    tasks: [
      {
        id: 'tsk-2',
        title: 'Recorte "El Látigo" hacia dentro y disparo al segundo palo',
        category: 'Técnica',
        description: 'Practicar 15 remates perfilados con el interior del pie.',
        assignedToStudentId: 'std-2',
        assignedDate: '2026-09-14',
        dueDate: '2026-09-20',
        status: 'completed'
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'std-3',
    name: 'Diego Ramos',
    age: 16,
    category: 'Sub-16',
    dorsal: 4,
    preferredFoot: 'Diestro',
    primaryPosition: 'DEC',
    secondaryPosition: 'MCD',
    matchPercentage: 90,
    skills: {
      speed: 78,
      technique: 75,
      finishing: 50,
      passing: 81,
      defending: 94,
      physical: 90,
      tacticalIQ: 89,
      mental: 92
    },
    coachNotes: 'Líder de la zaga, imbatible en el 1v1 y juego aéreo.',
    lastExamDate: '2026-09-10',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-4',
    name: 'Iker Navarro',
    age: 15,
    category: 'Sub-16',
    dorsal: 1,
    preferredFoot: 'Diestro',
    primaryPosition: 'POR',
    matchPercentage: 92,
    skills: {
      speed: 70,
      technique: 72,
      finishing: 30,
      passing: 84,
      defending: 95,
      physical: 85,
      tacticalIQ: 91,
      mental: 94
    },
    coachNotes: 'Reflejos élite y gran juego con los pies para salida lavolpiana.',
    lastExamDate: '2026-09-08',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-5',
    name: 'Carlos Vega',
    age: 16,
    category: 'Sub-16',
    dorsal: 6,
    preferredFoot: 'Zurdo',
    primaryPosition: 'MCD',
    secondaryPosition: 'MC',
    matchPercentage: 89,
    skills: {
      speed: 76,
      technique: 84,
      finishing: 65,
      passing: 89,
      defending: 88,
      physical: 84,
      tacticalIQ: 92,
      mental: 87
    },
    coachNotes: 'Equilibrio puro. Asegura la basculación y coberturas.',
    lastExamDate: '2026-09-09',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-6',
    name: 'Samuel Eto Junior',
    age: 15,
    category: 'Sub-16',
    dorsal: 9,
    preferredFoot: 'Diestro',
    primaryPosition: 'DC',
    secondaryPosition: 'EXT',
    matchPercentage: 93,
    skills: {
      speed: 91,
      technique: 85,
      finishing: 94,
      passing: 70,
      defending: 42,
      physical: 85,
      tacticalIQ: 86,
      mental: 90
    },
    coachNotes: 'Instinto depredador en el área. Desmarques de ruptura al espacio ciego del central.',
    lastExamDate: '2026-09-15',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-7',
    name: 'Alejandro Balde Jr',
    age: 16,
    category: 'Sub-16',
    dorsal: 3,
    preferredFoot: 'Zurdo',
    primaryPosition: 'LAT',
    matchPercentage: 88,
    skills: {
      speed: 92,
      technique: 81,
      finishing: 60,
      passing: 78,
      defending: 83,
      physical: 87,
      tacticalIQ: 81,
      mental: 80
    },
    coachNotes: 'Carrilero de gran recorrido físico. Precisión de centros en carrera.',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-8',
    name: 'Dani Carvajal Jr',
    age: 16,
    category: 'Sub-16',
    dorsal: 2,
    preferredFoot: 'Diestro',
    primaryPosition: 'LAT',
    matchPercentage: 87,
    skills: {
      speed: 88,
      technique: 80,
      finishing: 62,
      passing: 82,
      defending: 86,
      physical: 89,
      tacticalIQ: 84,
      mental: 91
    },
    coachNotes: 'Intensidad constante, duelos ganados y anticipación.',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-9',
    name: 'Pablo Gaviña',
    age: 15,
    category: 'Sub-16',
    dorsal: 8,
    preferredFoot: 'Diestro',
    primaryPosition: 'MC',
    secondaryPosition: 'MPO',
    matchPercentage: 90,
    skills: {
      speed: 82,
      technique: 89,
      finishing: 75,
      passing: 90,
      defending: 78,
      physical: 86,
      tacticalIQ: 91,
      mental: 95
    },
    coachNotes: 'Garra, presión tras pérdida y llegada de segunda línea.',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-10',
    name: 'Pau Cubarsí Jr',
    age: 15,
    category: 'Sub-16',
    dorsal: 5,
    preferredFoot: 'Diestro',
    primaryPosition: 'DEC',
    matchPercentage: 92,
    skills: {
      speed: 79,
      technique: 87,
      finishing: 52,
      passing: 91,
      defending: 91,
      physical: 81,
      tacticalIQ: 95,
      mental: 91
    },
    coachNotes: 'Salida de balón quirúrgica entre líneas.',
    createdAt: '2026-09-01'
  },
  {
    id: 'std-11',
    name: 'Nico Williams Jr',
    age: 16,
    category: 'Sub-16',
    dorsal: 11,
    preferredFoot: 'Ambidestro',
    primaryPosition: 'EXT',
    matchPercentage: 93,
    skills: {
      speed: 94,
      technique: 90,
      finishing: 83,
      passing: 80,
      defending: 50,
      physical: 84,
      tacticalIQ: 85,
      mental: 88
    },
    coachNotes: 'Desborde bilateral por dentro o fuera.',
    createdAt: '2026-09-01'
  }
];

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  onStartStudentExam,
  onOpenPricing
}) => {
  const { user, isAcademy, isAcademyElite, plan } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'classes' | 'lineup' | 'tasks' | 'tactics'>('roster');
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [students, setStudents] = useState<AcademyStudent[]>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_academy_students');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_STUDENTS;
  });

  // Classroom system states
  const [classesList, setClassesList] = useState<Array<{ id: string; name: string; category: string; inviteCode: string; studentCount: number }>>([
    { id: 'cls-1', name: 'Sub-16 A Táctica Principal', category: 'Sub-16', inviteCode: 'CS-SUB16-9921', studentCount: 11 },
    { id: 'cls-2', name: 'Juvenil Élite Avanzado', category: 'Sub-18', inviteCode: 'CS-ELITE-7784', studentCount: 10 }
  ]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCategory, setNewClassCategory] = useState<'Sub-12' | 'Sub-14' | 'Sub-16' | 'Sub-18' | 'Senior'>('Sub-16');
  const [accountRole, setAccountRole] = useState<'teacher' | 'institutional_student'>('teacher');
  const [elitePlusPacks, setElitePlusPacks] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_elite_plus');
      if (stored) return Number(stored);
    } catch {}
    return 0;
  });

  const baseLimit = isAcademyElite ? 200 : 30;
  const currentLimit = baseLimit + elitePlusPacks * 20;
  const isLimitReached = students.length >= currentLimit;

  // Selected student for detail/task modal
  const [selectedStudent, setSelectedStudent] = useState<AcademyStudent | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number>(15);
  const [newCategory, setNewCategory] = useState<'Sub-12' | 'Sub-14' | 'Sub-16' | 'Sub-18' | 'Senior'>('Sub-16');
  const [newDorsal, setNewDorsal] = useState<number>(10);
  const [newFoot, setNewFoot] = useState<'Diestro' | 'Zurdo' | 'Ambidestro'>('Diestro');
  const [newPos, setNewPos] = useState<PositionCategory>('EXT');
  const [newNotes, setNewNotes] = useState('');

  // Task assignment form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<'Técnica' | 'Táctica' | 'Físico' | 'Mental'>('Técnica');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-30');

  // Squad / Lineup Builder state
  const [formation, setFormation] = useState<AcademyFormation>('4-3-3');
  const [selectedLineupSlotId, setSelectedLineupSlotId] = useState<string>('pos-dc');
  const [lineupSlots, setLineupSlots] = useState<{ slotId: string; posCode: PositionCategory; label: string; studentId: string | null }[]>([
    { slotId: 'pos-por', posCode: 'POR', label: 'POR', studentId: 'std-4' },
    { slotId: 'pos-lat-izq', posCode: 'LAT', label: 'LI', studentId: 'std-7' },
    { slotId: 'pos-dec-izq', posCode: 'DEC', label: 'DFCI', studentId: 'std-10' },
    { slotId: 'pos-dec-der', posCode: 'DEC', label: 'DFCD', studentId: 'std-3' },
    { slotId: 'pos-lat-der', posCode: 'LAT', label: 'LD', studentId: 'std-8' },
    { slotId: 'pos-mcd', posCode: 'MCD', label: 'MCD', studentId: 'std-5' },
    { slotId: 'pos-mc', posCode: 'MC', label: 'MC', studentId: 'std-9' },
    { slotId: 'pos-mpo', posCode: 'MPO', label: 'MPO', studentId: 'std-1' },
    { slotId: 'pos-ext-izq', posCode: 'EXT', label: 'EI', studentId: 'std-11' },
    { slotId: 'pos-dc', posCode: 'DC', label: 'DC', studentId: 'std-6' },
    { slotId: 'pos-ext-der', posCode: 'EXT', label: 'ED', studentId: 'std-2' }
  ]);

  // Real-time Firestore sync for Academy Students & Lineup
  useEffect(() => {
    if (!user) {
      setCloudSyncStatus('local');
      return;
    }

    setCloudSyncStatus('syncing');

    const unsubscribeStudents = subscribeToAcademyStudents(user.uid, (cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents(cloudStudents);
        try {
          localStorage.setItem('coachstrike_academy_students', JSON.stringify(cloudStudents));
        } catch {}
      } else {
        // Initial seed to user's Firestore so they have initial data
        INITIAL_STUDENTS.forEach((st) => {
          saveStudentToCloud(user.uid, st).catch(() => {});
        });
      }
      setCloudSyncStatus('synced');
    });

    const unsubscribeLineup = subscribeToAcademyLineup(user.uid, (cloudLineup) => {
      if (cloudLineup) {
        if (cloudLineup.formation) setFormation(cloudLineup.formation);
        if (cloudLineup.slots) setLineupSlots(cloudLineup.slots);
      }
    });

    return () => {
      unsubscribeStudents();
      unsubscribeLineup();
    };
  }, [user]);

  // Persist students in local storage as backup cache
  useEffect(() => {
    try {
      localStorage.setItem('coachstrike_academy_students', JSON.stringify(students));
    } catch {}
  }, [students]);

  const handleBuyElitePlus = () => {
    if (!isAcademyElite) {
      onOpenPricing('academy_elite');
      return;
    }
    const updated = elitePlusPacks + 1;
    setElitePlusPacks(updated);
    try {
      localStorage.setItem('coachstrike_elite_plus', String(updated));
    } catch {}
    alert(`¡Pack Pro de 20 alumnos adquirido exitosamente ($40/mes extra)! Capacidad Pro ampliada en +20 alumnos.`);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (students.length >= currentLimit) {
      if (!isAcademyElite) {
        setIsAddStudentOpen(false);
        onOpenPricing('academy_elite');
      } else {
        alert(`Has alcanzado el límite máximo de ${currentLimit} alumnos para tu plan.`);
      }
      return;
    }

    const newStudent: AcademyStudent = {
      id: `std-${Date.now()}`,
      name: newName.trim(),
      age: Number(newAge),
      category: newCategory,
      dorsal: Number(newDorsal),
      preferredFoot: newFoot,
      primaryPosition: newPos,
      matchPercentage: 85,
      skills: {
        speed: 75,
        technique: 78,
        finishing: 70,
        passing: 75,
        defending: 70,
        physical: 75,
        tacticalIQ: 78,
        mental: 80
      },
      coachNotes: newNotes.trim() || 'Jugador incorporado a la cantera. Pendiente de evaluación profunda.',
      createdAt: new Date().toISOString()
    };

    setStudents((prev) => [newStudent, ...prev]);
    setNewName('');
    setNewNotes('');
    setIsAddStudentOpen(false);

    if (user) {
      setCloudSyncStatus('syncing');
      try {
        await saveStudentToCloud(user.uid, newStudent);
        setCloudSyncStatus('synced');
      } catch (err) {
        console.error('Error saving student to Firestore:', err);
      }
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este alumno de la cantera?')) return;

    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }

    if (user) {
      setCloudSyncStatus('syncing');
      try {
        await deleteStudentFromCloud(user.uid, studentId);
        setCloudSyncStatus('synced');
      } catch (err) {
        console.error('Error deleting student from Firestore:', err);
      }
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !taskTitle.trim()) return;

    const newTask: AcademyTask = {
      id: `tsk-${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      description: taskDesc.trim(),
      assignedToStudentId: selectedStudent.id,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: taskDueDate,
      status: 'pending'
    };

    const currentTasks = selectedStudent.tasks || [];
    const updatedStudent: AcademyStudent = {
      ...selectedStudent,
      tasks: [newTask, ...currentTasks]
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? updatedStudent : s))
    );

    setSelectedStudent(updatedStudent);
    setTaskTitle('');
    setTaskDesc('');
    setIsAssignTaskOpen(false);

    if (user) {
      try {
        await saveStudentToCloud(user.uid, updatedStudent);
      } catch (err) {
        console.error('Error syncing student task to Firestore:', err);
      }
    }
  };

  const handleToggleTaskStatus = async (studentId: string, taskId: string) => {
    let targetUpdated: AcademyStudent | null = null;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId && s.tasks) {
          const updated: AcademyStudent = {
            ...s,
            tasks: s.tasks.map((t) =>
              t.id === taskId
                ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
                : t
            )
          };
          targetUpdated = updated;
          return updated;
        }
        return s;
      })
    );

    if (selectedStudent && selectedStudent.id === studentId && targetUpdated) {
      setSelectedStudent(targetUpdated);
    }

    if (user && targetUpdated) {
      try {
        await saveStudentToCloud(user.uid, targetUpdated);
      } catch (err) {
        console.error('Error updating task in Firestore:', err);
      }
    }
  };

  const handleFormationChange = (newFormation: AcademyFormation) => {
    setFormation(newFormation);
    const template = FORMATION_TEMPLATES[newFormation] || FORMATION_TEMPLATES['4-3-3'];
    const updated = template.map((temp) => {
      const existing = lineupSlots.find((s) => s.slotId === temp.slotId || s.posCode === temp.posCode);
      return {
        slotId: temp.slotId,
        posCode: temp.posCode,
        label: temp.label,
        studentId: existing?.studentId || null
      };
    });
    setLineupSlots(updated);
    if (!updated.some((u) => u.slotId === selectedLineupSlotId)) {
      setSelectedLineupSlotId(updated[0]?.slotId || 'pos-por');
    }
    if (user) {
      saveLineupToCloud(user.uid, {
        formation: newFormation,
        slots: updated
      }).catch(console.error);
    }
  };

  const autoAlignLineup = () => {
    // Auto-match best students to slots without duplicating players
    const assignedIds = new Set<string>();
    const template = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];

    const updated = template.map((slot) => {
      // Prioritize primary position matches first
      let bestCandidate = students.find(
        (s) => !assignedIds.has(s.id) && s.primaryPosition === slot.posCode
      );

      // Secondary position fallback
      if (!bestCandidate) {
        bestCandidate = students.find(
          (s) => !assignedIds.has(s.id) && s.secondaryPosition === slot.posCode
        );
      }

      // Any available student if needed
      if (!bestCandidate) {
        bestCandidate = students.find((s) => !assignedIds.has(s.id));
      }

      if (bestCandidate) {
        assignedIds.add(bestCandidate.id);
      }

      return {
        slotId: slot.slotId,
        posCode: slot.posCode,
        label: slot.label,
        studentId: bestCandidate ? bestCandidate.id : null
      };
    });

    setLineupSlots(updated);

    if (user) {
      saveLineupToCloud(user.uid, {
        formation,
        slots: updated
      }).catch(console.error);
    }
  };

  const handleSlotStudentChange = (slotId: string, studentId: string | null) => {
    const updated = lineupSlots.map((slot) =>
      slot.slotId === slotId ? { ...slot, studentId } : slot
    );
    setLineupSlots(updated);

    if (user) {
      saveLineupToCloud(user.uid, {
        formation,
        slots: updated
      }).catch(console.error);
    }
  };

  // Paywall lock screen for non-paying users without an active trial
  if (!isAcademy) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-8">
        {/* Main Paywall Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-emerald-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl shadow-emerald-950/40 text-center">
          {/* Background subtle radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

          {/* Locked Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-6">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Función Exclusiva para Directores Técnicos & Clubes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tight font-display max-w-3xl mx-auto leading-tight">
            Desbloquea el <span className="text-emerald-400">Modo Academia</span> UEFA Pro
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            El Modo Academia está diseñado para directores técnicos, formadores y escuelas de fútbol que necesitan gestionar su plantilla, realizar exámenes de ADN táctico a cada futbolista, armar el Once Ideal y asignar tareas personalizadas con seguimiento profesional.
          </p>

          {/* Plan Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto my-8 text-left">
            {/* Academia Básico Card */}
            <div className="p-6 rounded-2xl bg-black/60 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between relative group shadow-lg shadow-emerald-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase italic">Academia Básico</h3>
                      <span className="text-[11px] text-slate-400">Para entrenadores y clubes base</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">
                    3 Días Gratis
                  </span>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-400 font-mono">$70</span>
                    <span className="text-xs text-slate-400 font-mono">USD / mes</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                    $0 hoy durante la prueba de 3 días
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Hasta 30 alumnos</strong> en plantilla</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Examen directo y test de ADN a futbolistas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Armador de Once Ideal con pizarra interactiva</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Asignador de tareas y deberes técnicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sincronización en la nube Firestore</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPricing('academy_basic')}
                className="mt-6 w-full py-3 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic tracking-wider text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Activar Prueba (Básico - $70 USD)</span>
              </button>
            </div>

            {/* Academia Élite Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/20 to-black/60 border-2 border-amber-400/40 hover:border-amber-400 transition-all flex flex-col justify-between relative group shadow-lg shadow-amber-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase italic">Academia Élite</h3>
                      <span className="text-[11px] text-slate-400">Para grandes canteras y federaciones</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-volt text-black text-[10px] font-black uppercase">
                    3 Días Gratis
                  </span>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-400 font-mono">$150</span>
                    <span className="text-xs text-slate-400 font-mono">USD / mes</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                    $0 hoy durante la prueba de 3 días
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Hasta 200 alumnos</strong> en plantilla</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Múltiples categorías y aulas (Sub-12 a Senior)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Once Ideal + Banco completo de suplentes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Exportación de informes Scouting oficiales PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pizarra táctica ilimitada con guardado cloud</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPricing('academy_elite')}
                className="mt-6 w-full py-3 rounded-xl bg-amber-400 hover:bg-white text-black font-black uppercase italic tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Activar Prueba (Élite - $150 USD)</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Prueba gratuita de 3 días
            </span>
            <span>•</span>
            <span>Pagos seguros con Stripe y PayPal</span>
            <span>•</span>
            <span>Cancela cuando quieras sin compromiso</span>
          </div>
        </div>

        {/* Locked Teaser Preview Cards */}
        <div className="relative opacity-35 filter blur-[1px] select-none pointer-events-none space-y-4">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="h-4 w-28 bg-emerald-500/30 rounded" />
              <div className="h-8 w-16 bg-white/20 rounded" />
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="h-4 w-36 bg-emerald-500/30 rounded" />
              <div className="h-8 w-20 bg-white/20 rounded" />
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="h-4 w-24 bg-emerald-500/30 rounded" />
              <div className="h-8 w-14 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Academy Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-black border border-emerald-500/20 p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                MODO ACADEMIA UEFA PRO
              </span>
              {!isAcademy && (
                <span className="px-2.5 py-0.5 rounded-full bg-volt text-black text-[10px] font-black uppercase tracking-wider">
                  Vista Previa / Modo Demo
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight font-display">
              Cantera & Plantilla de <span className="text-emerald-400">Entrenadores</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Gestiona los perfiles de tus futbolistas, realiza exámenes de ADN táctico, sugiere técnicas personalizadas y diseña tu Once Ideal en pizarra interactiva.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Cloud Sync Status Pill */}
            {user ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                {cloudSyncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Sincronizando Firestore...</span>
                  </>
                ) : (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Firestore Cloud Activo</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Cloud className="w-3.5 h-3.5 text-amber-300" />
                <span>Modo Local (Inicia sesión para sincronizar)</span>
              </div>
            )}

            {!isAcademy ? (
              <button
                onClick={() => onOpenPricing('academy_basic')}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Desbloquear Academia (3 Días de Prueba)</span>
              </button>
            ) : (
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 ${
                    isAcademyElite
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isAcademyElite ? 'bg-amber-400' : 'bg-emerald-400'} animate-ping`} />
                    {isAcademyElite ? 'Academia Élite (200 Alumnos)' : 'Academia Básico (30 Alumnos)'}
                  </span>
                  {!isAcademyElite && (
                    <button
                      onClick={() => onOpenPricing('academy_elite')}
                      className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-white text-black text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3 fill-black" />
                      <span>Subir a Élite</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-1">
                  Cupos: <strong className={isLimitReached ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{students.length}</strong> / {currentLimit} Registrados
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">Plantilla / Límite</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{students.length}</span>
              <span className="text-xs text-slate-400 font-mono">/ {currentLimit} máx</span>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">Exámenes Realizados</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {students.filter((s) => s.lastExamDate).length}
            </span>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">Afinidad Promedio</span>
            <span className="text-xl font-black text-volt font-mono">90.8%</span>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">Tareas Asignadas</span>
            <span className="text-xl font-black text-cyan-400 font-mono">
              {students.reduce((acc, s) => acc + (s.tasks?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'roster'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Plantilla & Alumnos ({students.length}/{currentLimit})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('classes')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'classes'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Clases & Cuentas (Classroom)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lineup')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'lineup'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Armador de Once Ideal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'tasks'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Deberes Técnicos</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('tactics');
              const el = document.getElementById('tactical-whiteboard');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'tactics'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pizarra Táctica</span>
          </button>
        </div>

        {activeSubTab === 'roster' && (
          <div className="flex items-center gap-2">
            {isLimitReached && !isAcademyElite && (
              <button
                onClick={() => onOpenPricing('academy_elite')}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 border border-amber-400/40 text-amber-300 hover:text-black text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Ampliar a Élite (200 Alumnos)</span>
              </button>
            )}
            <button
              onClick={() => {
                if (isLimitReached) {
                  if (!isAcademyElite) {
                    onOpenPricing('academy_elite');
                  } else {
                    alert(`Has alcanzado el límite máximo de ${currentLimit} alumnos para tu cuenta.`);
                  }
                  return;
                }
                setIsAddStudentOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isLimitReached
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-volt hover:bg-white text-black'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isLimitReached ? 'Límite Alcanzado' : 'Añadir Alumno'}</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW: CLASSES & CLASSROOM INVITE SYSTEM */}
      {activeSubTab === 'classes' && (
        <div className="space-y-6">
          {/* Account Role Separator Banner */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Sistema de Cuentas Institucionales & Profesor
                </span>
                <h3 className="text-lg font-black text-white uppercase italic font-display mt-2">
                  Gestión de Clases Estilo Classroom & Roles
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Separa tu cuenta de Maestro (Director Técnico) de las cuentas institucionales de tus alumnos, genera códigos de invitación y asigna accesos Pro.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-black/60 p-2 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400 font-bold px-2">Rol Actual:</span>
                <button
                  onClick={() => setAccountRole('teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    accountRole === 'teacher'
                      ? 'bg-emerald-400 text-black shadow-md'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  👨‍🏫 Cuenta de Maestro
                </button>
                <button
                  onClick={() => setAccountRole('institutional_student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    accountRole === 'institutional_student'
                      ? 'bg-volt text-black shadow-md'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  🎓 Alumno Institucional
                </button>
              </div>
            </div>
          </div>

          {/* Elite Academy Plus Packs Section */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Plus Elite Membresía Pro
                  </span>
                  <span className="text-xs text-slate-400 font-mono">($40 USD / mes por cada 20 alumnos)</span>
                </div>
                <h4 className="text-base font-black text-white uppercase italic font-display">
                  Amplía Membresías Pro para tus Alumnos
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Cada plus añade <strong>+20 alumnos</strong> con beneficios de membresía Pro ilimitada. Sin límite de compras mensuales (máximo actual: {currentLimit} alumnos).
                </p>
              </div>

              <div className="bg-black/60 border border-amber-500/40 p-4 rounded-xl flex items-center gap-4 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 block">Plus Activos:</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{elitePlusPacks} Packs (+{elitePlusPacks * 20} Pro)</span>
                </div>
                <button
                  onClick={handleBuyElitePlus}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Comprar Pack +20 Alumnos Pro ($40/mes)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Classes Grid & Create Class */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Class Form */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h4 className="text-sm font-black text-white uppercase italic font-display flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Crear Nueva Clase (Classroom)
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newClassName.trim()) return;
                  const newClass = {
                    id: `cls-${Date.now()}`,
                    name: newClassName.trim(),
                    category: newClassCategory,
                    inviteCode: `CS-${newClassCategory.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    studentCount: 0
                  };
                  setClassesList((prev) => [newClass, ...prev]);
                  setNewClassName('');
                  alert(`¡Clase creada exitosamente! Código de invitación generado: ${newClass.inviteCode}`);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Nombre de la Clase / Equipo</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ej. Sub-16 Táctica Ofensiva"
                    className="w-full bg-black/60 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Categoría</label>
                  <select
                    value={newClassCategory}
                    onChange={(e) => setNewClassCategory(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs outline-hidden"
                  >
                    <option value="Sub-12">Sub-12</option>
                    <option value="Sub-14">Sub-14</option>
                    <option value="Sub-16">Sub-16</option>
                    <option value="Sub-18">Sub-18</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Generar Clase & Código de Invitación
                </button>
              </form>
            </div>

            {/* Active Classes List */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-white uppercase italic font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Clases Activas e Invitaciones de Alumnos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classesList.map((cls) => (
                  <div key={cls.id} className="bg-slate-900/80 border border-white/10 rounded-xl p-5 space-y-3 relative group">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                          {cls.category}
                        </span>
                        <h5 className="font-bold text-white text-sm mt-1">{cls.name}</h5>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{cls.studentCount} Alumnos</span>
                    </div>

                    <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Código de Clase:</span>
                        <span className="font-mono font-bold text-volt text-sm">{cls.inviteCode}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://coachstrike.ai/join/${cls.inviteCode}`);
                          alert(`¡Enlace y código de invitación "${cls.inviteCode}" copiado al portapapeles!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Copiar Enlace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: ROSTER / PLANTILLA */}
      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 font-mono text-base">
                    #{student.dorsal}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{student.category}</span>
                      <span>•</span>
                      <span>{student.age} años</span>
                      <span>•</span>
                      <span className="text-volt font-mono">{student.preferredFoot}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-black/50 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold block mb-1">
                    {student.primaryPosition} ({student.matchPercentage}%)
                  </span>
                </div>
              </div>

              {/* Tactical Coach Notes */}
              <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
                  Informe del Míster:
                </span>
                <p className="line-clamp-2 italic text-[11px]">{student.coachNotes}</p>
              </div>

              {/* Skills Mini-Bar Summary */}
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono text-center">
                <div className="bg-black/40 p-1 rounded">
                  <span className="text-slate-500 block text-[8px]">TÉC</span>
                  <span className="text-white font-bold">{student.skills.technique}</span>
                </div>
                <div className="bg-black/40 p-1 rounded">
                  <span className="text-slate-500 block text-[8px]">VEL</span>
                  <span className="text-white font-bold">{student.skills.speed}</span>
                </div>
                <div className="bg-black/40 p-1 rounded">
                  <span className="text-slate-500 block text-[8px]">VIS</span>
                  <span className="text-white font-bold">{student.skills.passing}</span>
                </div>
                <div className="bg-black/40 p-1 rounded">
                  <span className="text-slate-500 block text-[8px]">IQ</span>
                  <span className="text-emerald-400 font-bold">{student.skills.tacticalIQ}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => onStartStudentExam(student)}
                  className="flex-1 py-1.5 rounded-lg bg-volt/15 hover:bg-volt text-volt hover:text-black font-bold uppercase italic text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Hacer test de ADN táctico al alumno"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Evaluar Alumno</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsAssignTaskOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                  title="Asignar técnica o tarea"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                  title="Eliminar alumno de la plantilla"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: SQUAD & ONCE IDEAL BUILDER */}
      {activeSubTab === 'lineup' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-volt/10 border border-volt/30 text-volt text-[10px] font-bold font-mono uppercase tracking-widest">
                  Cantera Strike • Pizarra Táctica
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight font-display mt-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Once Ideal & Composición Táctica</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribución posicional con curvatura real idéntica a la pizarra táctica interactiva. Selecciona cualquier dorsal para inspeccionar sus deberes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Formation Selector Tabs (Tactical Board Style) */}
              <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10">
                {(['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '4-1-4-1'] as AcademyFormation[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFormationChange(f)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-black italic font-display uppercase transition-all cursor-pointer ${
                      formation === f
                        ? 'bg-volt text-black shadow-md shadow-volt/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={autoAlignLineup}
                className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                title="Alinear automáticamente a los mejores futbolistas según su ADN"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Alinear ADN</span>
              </button>
            </div>
          </div>

          {/* Tactical Pitch & Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Authentic Tactical Pitch Canvas (8 Cols) */}
            <div className="lg:col-span-8 bg-slate-900/50 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-volt font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-volt" />
                  Esquema {formation} • Once Titular
                </span>
                <span className="text-slate-400 text-[11px]">Toca cualquier ficha para ver sus obligaciones tácticas</span>
              </div>

              {/* Pitch Canvas with Realistic Grass & Markings */}
              <div className="relative w-full aspect-[16/10] bg-emerald-950 border-2 border-white/20 rounded-xl overflow-hidden shadow-inner flex items-center justify-center select-none">
                {/* Field Grass Stripes */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:10%_100%]" />

                {/* Pitch Markings */}
                <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none rounded-xs" />
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/20 pointer-events-none" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 border border-white/20 rounded-full pointer-events-none flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                </div>

                {/* Penalty Areas */}
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-[16%] h-[54%] border border-white/20 pointer-events-none" />
                <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-[16%] h-[54%] border border-white/20 pointer-events-none" />
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-[6%] h-[24%] border border-white/20 pointer-events-none" />
                <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-[6%] h-[24%] border border-white/20 pointer-events-none" />

                {/* Attack Direction Arrow Indicator */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400/70 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span>Ataque</span>
                  <span>→</span>
                </div>

                {/* Player Tactical Tokens in Authentic Formation Composition */}
                {(() => {
                  const currentTemplate = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];
                  return currentTemplate.map((slotTemplate) => {
                    const currentSlot = lineupSlots.find((s) => s.slotId === slotTemplate.slotId) || slotTemplate;
                    const assignedStudent = students.find((s) => s.id === currentSlot.studentId);
                    const isSelected = selectedLineupSlotId === slotTemplate.slotId;
                    const displayDorsal = assignedStudent ? assignedStudent.dorsal : slotTemplate.number;

                    return (
                      <motion.div
                        key={slotTemplate.slotId}
                        onClick={() => setSelectedLineupSlotId(slotTemplate.slotId)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ left: `${slotTemplate.x}%`, top: `${slotTemplate.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all flex flex-col items-center ${
                          isSelected ? 'z-30' : ''
                        }`}
                      >
                        {/* Token Circular Chip (Tactical Board Style) */}
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border-2 shadow-lg transition-all ${
                            isSelected
                              ? 'bg-volt text-black border-white ring-4 ring-volt/50 scale-110 shadow-volt/40 font-black'
                              : assignedStudent
                              ? 'bg-black/90 text-white border-emerald-400 hover:border-volt'
                              : 'bg-black/80 text-slate-400 border-dashed border-white/30 hover:border-volt hover:text-white'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-black font-display italic leading-none">
                            {displayDorsal}
                          </span>
                          <span className={`text-[7px] sm:text-[8px] font-mono leading-none font-bold uppercase ${
                            isSelected ? 'text-black' : assignedStudent ? 'text-emerald-400' : 'text-slate-400'
                          }`}>
                            {slotTemplate.label}
                          </span>
                        </div>

                        {/* Player Name Pill */}
                        <div className="mt-1 px-1.5 py-0.5 rounded-md bg-black/90 border border-white/10 text-[8px] sm:text-[9px] font-bold text-white max-w-[70px] sm:max-w-[85px] truncate text-center shadow-md">
                          {assignedStudent ? assignedStudent.name.split(' ')[0] : '(Vacante)'}
                        </div>

                        {/* ADN Match Badge */}
                        {assignedStudent && (
                          <span className="mt-0.5 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[7px] font-mono font-bold">
                            {assignedStudent.matchPercentage}%
                          </span>
                        )}
                      </motion.div>
                    );
                  });
                })()}
              </div>

              {/* Squad Chemistry Summary Bar */}
              {(() => {
                const assignedStudents = lineupSlots
                  .map((s) => students.find((st) => st.id === s.studentId))
                  .filter(Boolean) as AcademyStudent[];
                
                const avgIQ = assignedStudents.length > 0 
                  ? Math.round(assignedStudents.reduce((acc, s) => acc + s.skills.tacticalIQ, 0) / assignedStudents.length)
                  : 0;
                const avgTech = assignedStudents.length > 0 
                  ? Math.round(assignedStudents.reduce((acc, s) => acc + s.skills.technique, 0) / assignedStudents.length)
                  : 0;
                const avgSpeed = assignedStudents.length > 0 
                  ? Math.round(assignedStudents.reduce((acc, s) => acc + s.skills.speed, 0) / assignedStudents.length)
                  : 0;
                const avgADN = assignedStudents.length > 0
                  ? Math.round(assignedStudents.reduce((acc, s) => acc + s.matchPercentage, 0) / assignedStudents.length)
                  : 0;

                return (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Titulares</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {assignedStudents.length} / 11
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">IQ Táctico</span>
                      <span className="text-sm font-black text-volt font-mono">
                        {avgIQ > 0 ? avgIQ : '--'}
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Técnica</span>
                      <span className="text-sm font-black text-white font-mono">
                        {avgTech > 0 ? avgTech : '--'}
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">ADN Colectivo</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {avgADN > 0 ? `${avgADN}%` : '--'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right: Selected Position Duty Card & Student Assignor (4 Cols - TacticalBoard Style) */}
            {(() => {
              const currentTemplate = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];
              const activeSlotConfig = currentTemplate.find((s) => s.slotId === selectedLineupSlotId) || currentTemplate[0];
              const activeLineupSlot = lineupSlots.find((s) => s.slotId === activeSlotConfig.slotId);
              const assignedStudent = students.find((s) => s.id === activeLineupSlot?.studentId);

              // Sort students by affinity for this position
              const sortedCandidates = [...students].sort((a, b) => {
                const aMatch = a.primaryPosition === activeSlotConfig.posCode ? 100 : a.secondaryPosition === activeSlotConfig.posCode ? 70 : 30;
                const bMatch = b.primaryPosition === activeSlotConfig.posCode ? 100 : b.secondaryPosition === activeSlotConfig.posCode ? 70 : 30;
                return bMatch - aMatch;
              });

              return (
                <div className="lg:col-span-4 bg-slate-900/50 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
                  {/* Position Header & Duty Card Title */}
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <span className="w-8 h-8 rounded-lg bg-volt/10 text-volt border border-volt/30 flex items-center justify-center font-bold shrink-0">
                      <Shield className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-base font-black italic text-white font-display uppercase tracking-wide">
                        Ficha Técnica & Deberes
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Puesto: {activeSlotConfig.label} ({activeSlotConfig.posCode})
                      </span>
                    </div>
                  </div>

                  {/* Position Overview Badge */}
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-volt text-black font-black font-display text-xl flex items-center justify-center italic shrink-0">
                        {assignedStudent ? assignedStudent.dorsal : activeSlotConfig.number}
                      </div>
                      <div>
                        <div className="text-sm font-black italic text-white font-display uppercase">
                          {activeSlotConfig.roleName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono font-bold">
                          Posición: {activeSlotConfig.posCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Duties Box */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="text-volt font-bold uppercase text-[10px] font-mono tracking-wider">
                      Obligaciones Tácticas Principales:
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {activeSlotConfig.duties}
                    </p>
                  </div>

                  {/* Key Tactical Concept with TacticalTerm popover */}
                  <div className="p-3 rounded-xl bg-volt/10 border border-volt/30 text-xs space-y-1.5">
                    <div className="text-volt font-bold uppercase text-[10px] font-mono">
                      💡 Concepto Clave del Puesto:
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      {activeSlotConfig.tacticalTermKey ? (
                        <p>
                          Para dominar esta función, el futbolista debe dominar la <TacticalTerm termKey={activeSlotConfig.tacticalTermKey}>{activeSlotConfig.tacticalConcept}</TacticalTerm> en situaciones de partido.
                        </p>
                      ) : (
                        <p>
                          Dominar la <strong>{activeSlotConfig.tacticalConcept}</strong> para mantener la cohesión del bloque.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current Assigned Student Details Card */}
                  {assignedStudent ? (
                    <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/40 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">Titular Asignado</span>
                          <h5 className="font-bold text-white text-xs leading-tight">
                            {assignedStudent.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {assignedStudent.category} • Pie {assignedStudent.preferredFoot}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                          {assignedStudent.matchPercentage}% ADN
                        </span>
                      </div>

                      {/* Mini Attribute Pills */}
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center pt-1 border-t border-white/10">
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[7px]">VEL</span>
                          <span className="text-white font-bold">{assignedStudent.skills.speed}</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[7px]">TÉC</span>
                          <span className="text-white font-bold">{assignedStudent.skills.technique}</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[7px]">IQ</span>
                          <span className="text-emerald-400 font-bold">{assignedStudent.skills.tacticalIQ}</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="text-slate-400 block text-[7px]">PAS</span>
                          <span className="text-white font-bold">{assignedStudent.skills.passing}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onStartStudentExam(assignedStudent)}
                          className="flex-1 py-1.5 rounded-lg bg-volt/15 hover:bg-volt text-volt hover:text-black text-[10px] font-black uppercase italic transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Hacer Test ADN</span>
                        </button>
                        <button
                          onClick={() => handleSlotStudentChange(activeSlotConfig.slotId, null)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                          title="Desasignar puesto"
                        >
                          Vaciar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-black/40 border border-dashed border-white/15 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-300 block">Puesto Actualmente Vacante</span>
                      <p className="text-[11px] text-slate-400">
                        Selecciona a un alumno abajo para colocarlo de titular.
                      </p>
                    </div>
                  )}

                  {/* Candidate Selector List */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Candidatos de Cantera ({sortedCandidates.length}):
                    </span>
                    <div className="max-h-[190px] overflow-y-auto space-y-1.5 pr-1">
                      {sortedCandidates.map((cand) => {
                        const isPrimary = cand.primaryPosition === activeSlotConfig.posCode;
                        const isAssignedHere = assignedStudent?.id === cand.id;

                        return (
                          <div
                            key={cand.id}
                            onClick={() => handleSlotStudentChange(activeSlotConfig.slotId, cand.id)}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isAssignedHere
                                ? 'bg-emerald-500/20 border-emerald-400 shadow-sm'
                                : 'bg-black/40 border-white/5 hover:border-emerald-500/30 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-white/10 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                                #{cand.dorsal}
                              </span>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white block truncate leading-tight">
                                  {cand.name}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono block">
                                  {cand.primaryPosition} • {cand.preferredFoot}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPrimary && (
                                <span className="px-1.5 py-0.5 rounded bg-volt text-black text-[8px] font-black uppercase">
                                  Afinidad
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {cand.matchPercentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* VIEW 3: TASKS / DEBERES TÉCNICOS */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase italic">
                Tareas & Deberes Técnicos Asignados
              </h3>
              <p className="text-xs text-slate-400">
                Monitorea el progreso de los ejercicios que encomendaste a tus alumnos
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {students.flatMap((s) =>
              (s.tasks || []).map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-900 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(s.id, task.id)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-white/20 hover:border-volt text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="px-2 py-0.2 rounded bg-volt/10 text-volt text-[10px] font-mono">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                        <span>Alumno: <strong className="text-slate-300">{s.name}</strong></span>
                        <span>•</span>
                        <span>Vence: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {task.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APARTADO ABAJO: PIZARRA TÁCTICA INTERACTIVA DEL MÍSTER */}
      <div className="pt-8 border-t border-white/10 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-volt animate-pulse" />
              <h2 className="text-xl font-black italic uppercase text-white tracking-tight flex items-center gap-2">
                Pizarra Táctica & Estrategia de Cantera
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Coloca círculos rojos o azules con sus números dorsales, arrastra las fichas para posicionar a tus jugadores y traza planes de juego con flechas de pase y desmarques.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[11px] font-bold">
              🔴 Fichas Rojas
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[11px] font-bold">
              🔵 Fichas Azules
            </span>
          </div>
        </div>

        <TacticalWhiteboard students={students} />
      </div>

      {/* MODAL: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase italic flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Añadir Nuevo Alumno
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {students.length}/{currentLimit}
                </span>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Martín Odegaard"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Sub-12">Sub-12</option>
                    <option value="Sub-14">Sub-14</option>
                    <option value="Sub-16">Sub-16</option>
                    <option value="Sub-18">Sub-18</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Dorsal</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newDorsal}
                    onChange={(e) => setNewDorsal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Pie Dominante</label>
                  <select
                    value={newFoot}
                    onChange={(e: any) => setNewFoot(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Diestro">Diestro</option>
                    <option value="Zurdo">Zurdo</option>
                    <option value="Ambidestro">Ambidestro</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Posición Tentativa</label>
                  <select
                    value={newPos}
                    onChange={(e: any) => setNewPos(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="POR">Portero</option>
                    <option value="DEC">Defensa Central</option>
                    <option value="LAT">Lateral</option>
                    <option value="MCD">Pivote</option>
                    <option value="MC">Centrocampista</option>
                    <option value="MPO">Mediapunta</option>
                    <option value="EXT">Extremo</option>
                    <option value="DC">Delantero</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notas del Entrenador</label>
                <textarea
                  rows={2}
                  placeholder="Observaciones iniciales de velocidad, técnica o actitud..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic tracking-wider mt-2 transition-all cursor-pointer"
              >
                Registrar en Plantilla
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: ASSIGN TASK */}
      {isAssignTaskOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-base font-black text-white uppercase italic">
                  Sugerir Técnica o Deber
                </h3>
                <span className="text-xs text-emerald-400">
                  Para: #{selectedStudent.dorsal} {selectedStudent.name}
                </span>
              </div>
              <button
                onClick={() => setIsAssignTaskOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre del Ejercicio o Regate</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Amago y salida con pierna débil"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Área Táctica</label>
                  <select
                    value={taskCategory}
                    onChange={(e: any) => setTaskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Técnica">Técnica & Regate</option>
                    <option value="Táctica">Inteligencia Táctica</option>
                    <option value="Físico">Físico & Resistencia</option>
                    <option value="Mental">Mentalidad & Presión</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Fecha de Entrega / Revisión</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Instrucciones Detalladas</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Practicar 20 repeticiones contra pared o con compañero, orientando el cuerpo a 45 grados antes de recibir..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic tracking-wider mt-2 transition-all cursor-pointer"
              >
                Asignar al Alumno
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

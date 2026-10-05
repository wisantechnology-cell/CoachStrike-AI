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
  PlanType,
  AttendanceStatus,
  AttendanceRecord,
  ClubBrandConfig
} from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ACADEMY_TRANSLATIONS } from '../data/academyTranslations';
import { TacticalWhiteboard } from './TacticalWhiteboard';
import { TacticalTerm } from './TacticalTerm';
import { PlayerPortal } from './PlayerPortal';
import { 
  Shield, 
  Info, 
  CalendarCheck, 
  Clock, 
  UserX, 
  CheckSquare,
  Building2,
  ExternalLink,
  Share2,
  Palette,
  Check,
  GraduationCap
} from 'lucide-react';
import { 
  saveStudentToCloud, 
  deleteStudentFromCloud, 
  subscribeToAcademyStudents,
  saveLineupToCloud,
  subscribeToAcademyLineup,
  saveClubBrandToCloud,
  subscribeToClubBrand
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
  initialSubTab?: 'roster' | 'attendance' | 'classes' | 'lineup' | 'tasks' | 'tactics' | 'portal';
  initialStudentId?: string | null;
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
  onOpenPricing,
  initialSubTab = 'roster',
  initialStudentId = null
}) => {
  const { user, isAcademy, isAcademyElite, plan } = useAuth();
  const { lang } = useLanguage();
  const tAcad = ACADEMY_TRANSLATIONS[lang] || ACADEMY_TRANSLATIONS.es;
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance' | 'classes' | 'lineup' | 'tasks' | 'tactics' | 'portal'>(initialSubTab);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [selectedSquadCategory, setSelectedSquadCategory] = useState<string>('all');
  const [activePortalStudentId, setActivePortalStudentId] = useState<string | null>(initialStudentId);
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialStudentId) {
      setActivePortalStudentId(initialStudentId);
    }
  }, [initialStudentId]);

  // White-Label Club Brand Config state
  const [clubBrand, setClubBrand] = useState<ClubBrandConfig>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_club_brand');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      clubName: 'ACADEMIA UEFA PRO',
      clubMotto: 'DESARROLLO INTEGRAL Y ALTO RENDIMIENTO',
      primaryColor: '#ccff00',
      directorName: 'Director de Metodología',
      directorTitle: 'Entrenador Licencia UEFA Pro',
      badgePreset: 'shield_volt',
      enableWhiteLabelPdf: true
    };
  });
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandClubName, setBrandClubName] = useState(clubBrand.clubName);
  const [brandMotto, setBrandMotto] = useState(clubBrand.clubMotto || '');
  const [brandDirector, setBrandDirector] = useState(clubBrand.directorName || '');
  const [brandDirectorTitle, setBrandDirectorTitle] = useState(clubBrand.directorTitle || '');
  const [brandColor, setBrandColor] = useState(clubBrand.primaryColor || '#ccff00');
  const [brandPreset, setBrandPreset] = useState(clubBrand.badgePreset || 'shield_volt');

  const [students, setStudents] = useState<AcademyStudent[]>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_academy_students');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_STUDENTS;
  });

  // Attendance Management states
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [attendanceSessionTopic, setAttendanceSessionTopic] = useState<string>('');
  const [attendanceCategoryFilter, setAttendanceCategoryFilter] = useState<string>('all');
  const [quickAttendanceStudent, setQuickAttendanceStudent] = useState<AcademyStudent | null>(null);
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);

  // Foot translation helper
  const formatFoot = (foot?: string) => {
    if (!foot) return '--';
    const f = foot.toLowerCase();
    if (f.includes('die') || f.includes('righ') || f.includes('dest')) {
      return lang === 'en' ? 'Right' : lang === 'pt' ? 'Destro' : 'Diestro';
    }
    if (f.includes('zur') || f.includes('left') || f.includes('canh')) {
      return lang === 'en' ? 'Left' : lang === 'pt' ? 'Canhoto' : 'Zurdo';
    }
    if (f.includes('ambi') || f.includes('both')) {
      return lang === 'en' ? 'Both' : lang === 'pt' ? 'Ambidestro' : 'Ambidestro';
    }
    return foot;
  };

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

    const unsubscribeBrand = subscribeToClubBrand(user.uid, (cloudBrand) => {
      if (cloudBrand) {
        setClubBrand(cloudBrand);
        setBrandClubName(cloudBrand.clubName);
        setBrandMotto(cloudBrand.clubMotto || '');
        setBrandDirector(cloudBrand.directorName || '');
        setBrandDirectorTitle(cloudBrand.directorTitle || '');
        setBrandColor(cloudBrand.primaryColor || '#ccff00');
        setBrandPreset(cloudBrand.badgePreset || 'shield_volt');
        try {
          localStorage.setItem('coachstrike_club_brand', JSON.stringify(cloudBrand));
        } catch {}
      }
    });

    return () => {
      unsubscribeStudents();
      unsubscribeLineup();
      unsubscribeBrand();
    };
  }, [user]);

  // Persist students in local storage as backup cache
  useEffect(() => {
    try {
      localStorage.setItem('coachstrike_academy_students', JSON.stringify(students));
    } catch {}
  }, [students]);

  // Save Club Brand
  const handleSaveBrand = async () => {
    const updated: ClubBrandConfig = {
      clubName: brandClubName.trim() || 'ACADEMIA UEFA PRO',
      clubMotto: brandMotto.trim() || 'DESARROLLO INTEGRAL Y ALTO RENDIMIENTO',
      directorName: brandDirector.trim() || 'Director de Metodología',
      directorTitle: brandDirectorTitle.trim() || 'Entrenador Licencia UEFA Pro',
      primaryColor: brandColor,
      badgePreset: brandPreset as any,
      enableWhiteLabelPdf: true
    };
    setClubBrand(updated);
    try {
      localStorage.setItem('coachstrike_club_brand', JSON.stringify(updated));
    } catch {}
    if (user) {
      try {
        await saveClubBrandToCloud(user.uid, updated);
      } catch (e) {
        console.error(e);
      }
    }
    setIsBrandModalOpen(false);
  };

  // Toggle student task status
  const handleToggleStudentTask = async (studentId: string, taskId: string, completed: boolean) => {
    let targetUpdated: AcademyStudent | null = null;
    const updated = students.map((std) => {
      if (std.id === studentId) {
        const tasks = (std.tasks || []).map((t) => {
          if (t.id === taskId) {
            return { ...t, status: completed ? ('completed' as const) : ('pending' as const) };
          }
          return t;
        });
        const upd = { ...std, tasks };
        targetUpdated = upd;
        return upd;
      }
      return std;
    });
    setStudents(updated);
    try {
      localStorage.setItem('coachstrike_academy_students', JSON.stringify(updated));
    } catch {}
    if (user && targetUpdated) {
      try {
        await saveStudentToCloud(user.uid, targetUpdated);
      } catch (err) {
        console.error(err);
      }
    }
  };

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

  // Record Attendance for a Student (Present, Late, Absent)
  const handleRecordAttendance = async (studentId: string, status: AttendanceStatus, date: string = attendanceDate, notes?: string) => {
    let updatedTargetStudent: AcademyStudent | null = null;

    setStudents((prev) => {
      const nextList = prev.map((std) => {
        if (std.id !== studentId) return std;
        const currentAtt = std.attendance || [];
        const filtered = currentAtt.filter((a) => a.date !== date);
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date,
          status,
          timestamp: new Date().toISOString(),
          notes: notes !== undefined ? notes : (currentAtt.find((a) => a.date === date)?.notes || '')
        };
        const updated = {
          ...std,
          attendance: [newRecord, ...filtered]
        };
        updatedTargetStudent = updated;
        return updated;
      });
      return nextList;
    });

    if (user && updatedTargetStudent) {
      try {
        await saveStudentToCloud(user.uid, updatedTargetStudent);
      } catch (err) {
        console.error('Error saving attendance to Firestore:', err);
      }
    }
  };

  // Bulk mark all students in filtered category
  const handleMarkAllAttendance = async (status: AttendanceStatus = 'present') => {
    const targetStudents = students.filter(
      (s) => attendanceCategoryFilter === 'all' || s.category === attendanceCategoryFilter
    );
    for (const st of targetStudents) {
      await handleRecordAttendance(st.id, status, attendanceDate);
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
            <span>
              {lang === 'en' 
                ? 'Exclusive Feature for Head Coaches & Clubs' 
                : lang === 'pt' 
                ? 'Função Exclusiva para Diretores Técnicos & Clubes' 
                : 'Función Exclusiva para Directores Técnicos & Clubes'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tight font-display max-w-3xl mx-auto leading-tight">
            {lang === 'en' ? (
              <>Unlock <span className="text-emerald-400">Academy Mode</span> UEFA Pro</>
            ) : lang === 'pt' ? (
              <>Desbloqueie o <span className="text-emerald-400">Modo Academia</span> UEFA Pro</>
            ) : (
              <>Desbloquea el <span className="text-emerald-400">Modo Academia</span> UEFA Pro</>
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {lang === 'en'
              ? 'Academy Mode is built for head coaches, youth coordinators, and football schools who need to manage their squad, run tactical DNA tests on players, build Starting XIs, and assign technical drills with progress tracking.'
              : lang === 'pt'
              ? 'O Modo Academia foi concebido para diretores técnicos, formadores e escolas de futebol que precisam de gerir o plantel, realizar testes de ADN tático, montar o Onze Ideal e atribuir tarefas com acompanhamento profissional.'
              : 'El Modo Academia está diseñado para directores técnicos, formadores y escuelas de fútbol que necesitan gestionar su plantilla, realizar exámenes de ADN táctico a cada futbolista, armar el Once Ideal y asignar tareas personalizadas con seguimiento profesional.'}
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
                      <h3 className="text-lg font-black text-white uppercase italic">
                        {lang === 'en' ? 'Academy Basic' : lang === 'pt' ? 'Academia Básico' : 'Academia Básico'}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {lang === 'en' ? 'For grassroots coaches & clubs' : lang === 'pt' ? 'Para treinadores e clubes de formação' : 'Para entrenadores y clubes base'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">
                    {lang === 'en' ? '3-Day Free Trial' : lang === 'pt' ? '3 Dias Grátis' : '3 Días Gratis'}
                  </span>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-400 font-mono">$70</span>
                    <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? 'USD / mo' : lang === 'pt' ? 'USD / mês' : 'USD / mes'}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                    {lang === 'en' ? '$0 today during 3-day trial' : lang === 'pt' ? '$0 hoje durante os 3 dias de teste' : '$0 hoy durante la prueba de 3 días'}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{lang === 'en' ? 'Up to 30 players' : lang === 'pt' ? 'Até 30 alunos' : 'Hasta 30 alumnos'}</strong> {lang === 'en' ? 'in roster' : lang === 'pt' ? 'no plantel' : 'en plantilla'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Direct DNA assessment tests for players' : lang === 'pt' ? 'Exames diretos e testes de ADN a atletas' : 'Examen directo y test de ADN a futbolistas'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Interactive Starting XI Lineup builder' : lang === 'pt' ? 'Montador de Onze Ideal com quadro interativo' : 'Armador de Once Ideal con pizarra interactiva'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Technical task & drill assigner' : lang === 'pt' ? 'Atribuição de tarefas e deveres técnicos' : 'Asignador de tareas y deberes técnicos'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Firestore Cloud real-time sync' : lang === 'pt' ? 'Sincronização em tempo real Firestore' : 'Sincronización en la nube Firestore'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPricing('academy_basic')}
                className="mt-6 w-full py-3 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic tracking-wider text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{lang === 'en' ? 'Start Free Trial (Basic - $70 USD)' : lang === 'pt' ? 'Ativar Teste (Básico - $70 USD)' : 'Activar Prueba (Básico - $70 USD)'}</span>
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
                      <h3 className="text-lg font-black text-white uppercase italic">
                        {lang === 'en' ? 'Academy Elite' : lang === 'pt' ? 'Academia Élite' : 'Academia Élite'}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {lang === 'en' ? 'For major academies & clubs' : lang === 'pt' ? 'Para grandes academias e federações' : 'Para grandes canteras y federaciones'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-volt text-black text-[10px] font-black uppercase">
                    {lang === 'en' ? '3-Day Free Trial' : lang === 'pt' ? '3 Dias Grátis' : '3 Días Gratis'}
                  </span>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-400 font-mono">$150</span>
                    <span className="text-xs text-slate-400 font-mono">{lang === 'en' ? 'USD / mo' : lang === 'pt' ? 'USD / mês' : 'USD / mes'}</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                    {lang === 'en' ? '$0 today during 3-day trial' : lang === 'pt' ? '$0 hoje durante os 3 dias de teste' : '$0 hoy durante la prueba de 3 días'}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>{lang === 'en' ? 'Up to 200 players' : lang === 'pt' ? 'Até 200 alunos' : 'Hasta 200 alumnos'}</strong> {lang === 'en' ? 'in roster' : lang === 'pt' ? 'no plantel' : 'en plantilla'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Multiple squads & classrooms (U12 to Senior)' : lang === 'pt' ? 'Múltiplos escalões e turmas (Sub-12 a Sénior)' : 'Múltiples categorías y aulas (Sub-12 a Senior)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Starting XI + Full substitutes bench' : lang === 'pt' ? 'Onze Ideal + Banco completo de suplentes' : 'Once Ideal + Banco completo de suplentes'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Official PDF Scouting Reports export' : lang === 'pt' ? 'Exportação oficial de relatórios em PDF' : 'Exportación de informes Scouting oficiales PDF'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Unlimited cloud-saved tactical whiteboards' : lang === 'pt' ? 'Quadro tático ilimitado na nuvem' : 'Pizarra táctica ilimitada con guardado cloud'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPricing('academy_elite')}
                className="mt-6 w-full py-3 rounded-xl bg-amber-400 hover:bg-white text-black font-black uppercase italic tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>{lang === 'en' ? 'Start Free Trial (Elite - $150 USD)' : lang === 'pt' ? 'Ativar Teste (Élite - $150 USD)' : 'Activar Prueba (Élite - $150 USD)'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'en' ? '3-day free trial' : lang === 'pt' ? 'Teste grátis de 3 dias' : 'Prueba gratuita de 3 días'}
            </span>
            <span>•</span>
            <span>{lang === 'en' ? 'Secure checkout with Stripe & PayPal' : lang === 'pt' ? 'Pagamentos seguros via Stripe e PayPal' : 'Pagos seguros con Stripe y PayPal'}</span>
            <span>•</span>
            <span>{lang === 'en' ? 'Cancel anytime with zero hassle' : lang === 'pt' ? 'Cancele quando quiser sem fidelização' : 'Cancela cuando quieras sin compromiso'}</span>
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
                {tAcad.bannerBadge}
              </span>
              {!isAcademy && (
                <span className="px-2.5 py-0.5 rounded-full bg-volt text-black text-[10px] font-black uppercase tracking-wider">
                  {tAcad.previewBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight font-display">
              {lang === 'en' ? (
                <>Squad & Coach <span className="text-emerald-400">Academy Roster</span></>
              ) : lang === 'pt' ? (
                <>Plantel & Academia de <span className="text-emerald-400">Treinadores</span></>
              ) : (
                <>Cantera & Plantilla de <span className="text-emerald-400">Entrenadores</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              {tAcad.bannerSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Cloud Sync Status Pill */}
            {user ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                {cloudSyncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>{tAcad.syncing}</span>
                  </>
                ) : (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tAcad.cloudActive}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Cloud className="w-3.5 h-3.5 text-amber-300" />
                <span>{tAcad.localMode}</span>
              </div>
            )}

            {!isAcademy ? (
              <button
                onClick={() => onOpenPricing('academy_basic')}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{tAcad.unlockBtn}</span>
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
                    {isAcademyElite ? tAcad.eliteBadge : tAcad.basicBadge}
                  </span>
                  {!isAcademyElite && (
                    <button
                      onClick={() => onOpenPricing('academy_elite')}
                      className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-white text-black text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3 fill-black" />
                      <span>{tAcad.upgradeElite}</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-1">
                  {tAcad.slotsQuota} <strong className={isLimitReached ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{students.length}</strong> / {currentLimit} {tAcad.registered}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">{tAcad.statRoster}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{students.length}</span>
              <span className="text-xs text-slate-400 font-mono">/ {currentLimit} {tAcad.maxSuffix}</span>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">{tAcad.statExams}</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {students.filter((s) => s.lastExamDate).length}
            </span>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">{tAcad.statAffinity}</span>
            <span className="text-xl font-black text-volt font-mono">90.8%</span>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">{tAcad.statTasks}</span>
            <span className="text-xl font-black text-cyan-400 font-mono">
              {students.reduce((acc, s) => acc + (s.tasks?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'roster'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{tAcad.tabRoster} ({students.length}/{currentLimit})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'attendance'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{tAcad.tabAttendance}</span>
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
            <span>{tAcad.tabClasses}</span>
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
            <span>{tAcad.tabLineup}</span>
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
            <span>{tAcad.tabTasks}</span>
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
            <span>{tAcad.tabTactics}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('portal')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'portal'
                ? 'bg-volt text-black font-black shadow-md shadow-volt/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'en' ? 'Player Portal' : lang === 'pt' ? 'Portal do Jogador' : 'Portal Jugador & Familia'}</span>
          </button>
        </div>

        {/* Right Action Tools: White-Label Customization & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBrandClubName(clubBrand.clubName);
              setBrandMotto(clubBrand.clubMotto || '');
              setBrandDirector(clubBrand.directorName || '');
              setBrandDirectorTitle(clubBrand.directorTitle || '');
              setBrandColor(clubBrand.primaryColor || '#ccff00');
              setBrandPreset(clubBrand.badgePreset || 'shield_volt');
              setIsBrandModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-volt/40"
            title="Personalizar Identidad, Escudo y Marca Blanca del Club"
          >
            <Palette className="w-3.5 h-3.5 text-volt" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Club Brand (White-Label)' : lang === 'pt' ? 'Marca do Clube' : 'Marca del Club'}</span>
            <span className="sm:hidden">Marca</span>
          </button>

          {activeSubTab === 'roster' && (
            <div className="flex items-center gap-2">
              {isLimitReached && !isAcademyElite && (
                <button
                  onClick={() => onOpenPricing('academy_elite')}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 border border-amber-400/40 text-amber-300 hover:text-black text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{tAcad.expandElite}</span>
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
                <span>{isLimitReached ? tAcad.limitReached : tAcad.btnAddStudent}</span>
              </button>
            </div>
          )}

          {activeSubTab === 'attendance' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkAllAttendance('present')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-300 hover:text-black text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Marcar presente a todos los alumnos filtrados"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{tAcad.markAllPresent}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category / Squad Selector Filter Bar */}
      {activeSubTab !== 'portal' && (
        <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 rounded-2xl p-2.5 sm:p-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <Shield className="w-3.5 h-3.5 text-volt" />
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'en' ? 'Squad Filter:' : lang === 'pt' ? 'Escalão:' : 'Categoría:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: lang === 'en' ? 'All Squads' : lang === 'pt' ? 'Todos os Escalões' : 'Todas las Categorías' },
              { id: 'Sub-12', label: 'Sub-12' },
              { id: 'Sub-14', label: 'Sub-14' },
              { id: 'Sub-16', label: 'Sub-16' },
              { id: 'Sub-18', label: 'Sub-18' },
              { id: 'Reserva', label: lang === 'en' ? 'Reserves' : lang === 'pt' ? 'Reservas' : 'Filial / Reserva' },
              { id: 'Primer Equipo', label: lang === 'en' ? 'First Team' : lang === 'pt' ? 'Equipa Principal' : 'Primer Equipo' }
            ].map((cat) => {
              const count = cat.id === 'all' ? students.length : students.filter((s) => s.category === cat.id).length;
              const isSelected = selectedSquadCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSquadCategory(cat.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-volt text-black font-black shadow-sm shadow-volt/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                    isSelected ? 'bg-black/30 text-black font-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: CLASSES & CLASSROOM INVITE SYSTEM */}
      {activeSubTab === 'classes' && (
        <div className="space-y-6">
          {/* Account Role Separator Banner */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {tAcad.classroomBadge}
                </span>
                <h3 className="text-lg font-black text-white uppercase italic font-display mt-2">
                  {tAcad.classroomTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {tAcad.classroomSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-black/60 p-2 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400 font-bold px-2">{tAcad.roleLabel}</span>
                <button
                  onClick={() => setAccountRole('teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    accountRole === 'teacher'
                      ? 'bg-emerald-400 text-black shadow-md'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tAcad.roleTeacher}
                </button>
                <button
                  onClick={() => setAccountRole('institutional_student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    accountRole === 'institutional_student'
                      ? 'bg-volt text-black shadow-md'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tAcad.roleStudent}
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
                    {tAcad.plusBadge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{tAcad.plusPriceTag}</span>
                </div>
                <h4 className="text-base font-black text-white uppercase italic font-display">
                  {tAcad.plusTitle}
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  {tAcad.plusSubtitle} (max: {currentLimit}).
                </p>
              </div>

              <div className="bg-black/60 border border-amber-500/40 p-4 rounded-xl flex items-center gap-4 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 block">{tAcad.plusActive}</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{elitePlusPacks} Packs (+{elitePlusPacks * 20} Pro)</span>
                </div>
                <button
                  onClick={handleBuyElitePlus}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>{tAcad.plusBtn}</span>
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
                {tAcad.createClassTitle}
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
                  alert(`¡Código de invitación generado: ${newClass.inviteCode}!`);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">{tAcad.classNameLabel}</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder={tAcad.classNamePlaceholder}
                    className="w-full bg-black/60 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">{tAcad.classCatLabel}</label>
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
                  {tAcad.generateClassBtn}
                </button>
              </form>
            </div>

            {/* Active Classes List */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-white uppercase italic font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                {tAcad.activeClassesTitle}
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
                      <span className="text-xs text-slate-400 font-mono">{cls.studentCount} {tAcad.studentsCount}</span>
                    </div>

                    <div className="bg-black/50 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">{tAcad.classCodeLabel}</span>
                        <span className="font-mono font-bold text-volt text-sm">{cls.inviteCode}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://coachstrike.ai/join/${cls.inviteCode}`);
                          alert(`¡Código ${cls.inviteCode} copiado!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        {tAcad.copyLinkBtn}
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
          {students.filter((s) => selectedSquadCategory === 'all' || s.category === selectedSquadCategory).map((student) => {
            const todayRecord = (student.attendance || []).find((a) => a.date === attendanceDate);
            const attList = student.attendance || [];
            const presentCount = attList.filter((a) => a.status === 'present').length;
            const totalAtt = attList.length;
            const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

            return (
              <div
                key={student.id}
                className="bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all space-y-3 relative group shadow-lg"
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
                        <span>{student.age} {tAcad.yearsOld}</span>
                        <span>•</span>
                        <span className="text-volt font-mono">{formatFoot(student.preferredFoot)}</span>
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
                    {tAcad.coachReport}
                  </span>
                  <p className="line-clamp-2 italic text-[11px]">{student.coachNotes}</p>
                </div>

                {/* Skills Mini-Bar Summary */}
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono text-center">
                  <div className="bg-black/40 p-1 rounded">
                    <span className="text-slate-500 block text-[8px]">TEC</span>
                    <span className="text-white font-bold">{student.skills.technique}</span>
                  </div>
                  <div className="bg-black/40 p-1 rounded">
                    <span className="text-slate-500 block text-[8px]">VEL</span>
                    <span className="text-white font-bold">{student.skills.speed}</span>
                  </div>
                  <div className="bg-black/40 p-1 rounded">
                    <span className="text-slate-500 block text-[8px]">PAS</span>
                    <span className="text-white font-bold">{student.skills.passing}</span>
                  </div>
                  <div className="bg-black/40 p-1 rounded">
                    <span className="text-slate-500 block text-[8px]">IQ</span>
                    <span className="text-emerald-400 font-bold">{student.skills.tacticalIQ}</span>
                  </div>
                </div>

                {/* Quick Attendance Tracker Row (Horizontal Buttons) */}
                <div className="bg-black/40 px-2.5 py-2 rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                      <CalendarCheck className="w-3 h-3 text-emerald-400" />
                      <span>{tAcad.attendanceRate}</span> <strong className="text-emerald-400 font-bold">{attRate}%</strong>
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {todayRecord ? (todayRecord.status === 'present' ? '✅ Asistió' : todayRecord.status === 'late' ? '⏱ Tardanza' : '❌ Ausente') : 'Pendiente hoy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleRecordAttendance(student.id, 'present')}
                      className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        todayRecord?.status === 'present'
                          ? 'bg-emerald-500 text-black font-black shadow-sm'
                          : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                      }`}
                      title="Marcar Asistió a clases"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>{tAcad.attendancePresent}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRecordAttendance(student.id, 'late')}
                      className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        todayRecord?.status === 'late'
                          ? 'bg-amber-400 text-black font-black shadow-sm'
                          : 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30'
                      }`}
                      title="Marcar Llegó Tarde"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{tAcad.attendanceLate}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRecordAttendance(student.id, 'absent')}
                      className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        todayRecord?.status === 'absent'
                          ? 'bg-rose-500 text-white font-black shadow-sm'
                          : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                      }`}
                      title="Marcar No Asistió / Ausente"
                    >
                      <UserX className="w-3 h-3" />
                      <span>{tAcad.attendanceAbsent}</span>
                    </button>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/10 text-xs">
                  <button
                    onClick={() => onStartStudentExam(student)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-volt/15 hover:bg-volt text-volt hover:text-black font-bold uppercase italic text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Test ADN"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{tAcad.btnEvaluate}</span>
                  </button>

                  {/* Open Player Portal Button */}
                  <button
                    onClick={() => {
                      setActivePortalStudentId(student.id);
                      setActiveSubTab('portal');
                    }}
                    className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 transition-all cursor-pointer"
                    title={lang === 'en' ? 'Open Player & Family Portal' : lang === 'pt' ? 'Abrir Portal do Jogador' : 'Ver Portal Jugador & Familia'}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Portal Link Button */}
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?player=${student.id}`;
                      navigator.clipboard.writeText(url);
                      setCopiedStudentId(student.id);
                      setTimeout(() => setCopiedStudentId(null), 2500);
                    }}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-volt border border-white/10 transition-colors cursor-pointer"
                    title={copiedStudentId === student.id ? '¡Enlace copiado!' : (lang === 'en' ? 'Copy Player Portal Link' : 'Copiar Enlace Portal')}
                  >
                    {copiedStudentId === student.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsAssignTaskOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                    title={tAcad.btnAssign}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                    title={tAcad.btnDelete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: ATTENDANCE REGISTER / CONTROL DE ASISTENCIA */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          {/* Top Attendance Controls Bar */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tAcad.attendanceTitle}</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic font-display mt-2">
                  {lang === 'en' ? 'Class Attendance & Training Register' : lang === 'pt' ? 'Registo de Presenças no Treino' : 'Registro de Asistencia a Clases'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {tAcad.attendanceSubtitle}
                </p>
              </div>

              {/* Date & Bulk Actions Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-black/60 px-3 py-2 rounded-xl border border-white/10">
                  <label className="text-xs font-mono text-slate-400 font-bold">{tAcad.attendanceDate}</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleMarkAllAttendance('present')}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{tAcad.markAllPresent}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills & Session Topic */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1">{tAcad.classCatLabel}:</span>
                {['all', 'Sub-12', 'Sub-14', 'Sub-16', 'Sub-18', 'Senior'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAttendanceCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      attendanceCategoryFilter === cat
                        ? 'bg-emerald-500 text-black font-black shadow-sm'
                        : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat === 'all' ? tAcad.filterAllCategories : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-sm w-full">
                <input
                  type="text"
                  placeholder={tAcad.attendanceSessionPlaceholder}
                  value={attendanceSessionTopic}
                  onChange={(e) => setAttendanceSessionTopic(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Real-time Session Metrics Grid */}
            {(() => {
              const filteredStudents = students.filter(
                (s) => attendanceCategoryFilter === 'all' || s.category === attendanceCategoryFilter
              );
              const presentCount = filteredStudents.filter((s) => {
                const rec = (s.attendance || []).find((a) => a.date === attendanceDate);
                return rec?.status === 'present';
              }).length;
              const lateCount = filteredStudents.filter((s) => {
                const rec = (s.attendance || []).find((a) => a.date === attendanceDate);
                return rec?.status === 'late';
              }).length;
              const absentCount = filteredStudents.filter((s) => {
                const rec = (s.attendance || []).find((a) => a.date === attendanceDate);
                return rec?.status === 'absent';
              }).length;
              const unrecordedCount = filteredStudents.length - presentCount - lateCount - absentCount;
              const totalRecorded = presentCount + lateCount + absentCount;
              const attendanceRate = totalRecorded > 0 ? Math.round(((presentCount + lateCount * 0.7) / totalRecorded) * 100) : 100;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">✓ {tAcad.attendancePresent}</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-emerald-400 font-mono">{presentCount}</span>
                      <span className="text-xs text-slate-400 font-mono">/ {filteredStudents.length}</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-amber-400/20">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">⏱ {tAcad.attendanceLate}</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-amber-400 font-mono">{lateCount}</span>
                      <span className="text-xs text-slate-400 font-mono">alumnos</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-rose-500/20">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">✕ {tAcad.attendanceAbsent}</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-rose-400 font-mono">{absentCount}</span>
                      <span className="text-xs text-slate-400 font-mono">alumnos</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-volt/20">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">📊 {tAcad.attendanceRate}</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-volt font-mono">{attendanceRate}%</span>
                      {unrecordedCount > 0 && (
                        <span className="text-[10px] text-amber-300 font-mono font-bold">({unrecordedCount} por marcar)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Students Attendance List (Table / Card Layout with Horizontal Action Buttons) */}
          <div className="space-y-3">
            {students
              .filter((s) => attendanceCategoryFilter === 'all' || s.category === attendanceCategoryFilter)
              .map((student) => {
                const dayRecord = (student.attendance || []).find((a) => a.date === attendanceDate);
                const currentStatus = dayRecord?.status;

                return (
                  <div
                    key={student.id}
                    className={`bg-slate-900/90 border rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
                      currentStatus === 'present'
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : currentStatus === 'late'
                        ? 'border-amber-400/40 bg-amber-950/10'
                        : currentStatus === 'absent'
                        ? 'border-rose-500/40 bg-rose-950/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3.5 min-w-[260px]">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black font-mono text-base ${
                        currentStatus === 'present'
                          ? 'bg-emerald-500 text-black'
                          : currentStatus === 'late'
                          ? 'bg-amber-400 text-black'
                          : currentStatus === 'absent'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-white border border-white/10'
                      }`}>
                        #{student.dorsal}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{student.name}</h4>
                          <span className="px-2 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono">
                            {student.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{student.primaryPosition}</span>
                          <span>•</span>
                          <span>{formatFoot(student.preferredFoot)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono flex items-center gap-1.5 ${
                        currentStatus === 'present'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : currentStatus === 'late'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : currentStatus === 'absent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-black/50 text-slate-400 border border-white/10'
                      }`}>
                        {currentStatus === 'present' ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{tAcad.attendancePresent}</span>
                          </>
                        ) : currentStatus === 'late' ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{tAcad.attendanceLate}</span>
                          </>
                        ) : currentStatus === 'absent' ? (
                          <>
                            <UserX className="w-3.5 h-3.5 text-rose-400" />
                            <span>{tAcad.attendanceAbsent}</span>
                          </>
                        ) : (
                          <span>Sin registrar</span>
                        )}
                      </span>
                    </div>

                    {/* 3 Horizontal Toggle Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* 1. Asistió */}
                      <button
                        type="button"
                        onClick={() => handleRecordAttendance(student.id, 'present')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 scale-105'
                            : 'bg-slate-800 hover:bg-emerald-500/20 border border-white/10 text-slate-300 hover:text-emerald-300'
                        }`}
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>{tAcad.attendancePresent}</span>
                      </button>

                      {/* 2. Llegó Tarde */}
                      <button
                        type="button"
                        onClick={() => handleRecordAttendance(student.id, 'late')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          currentStatus === 'late'
                            ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 scale-105'
                            : 'bg-slate-800 hover:bg-amber-400/20 border border-white/10 text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{tAcad.attendanceLate}</span>
                      </button>

                      {/* 3. No Asistió */}
                      <button
                        type="button"
                        onClick={() => handleRecordAttendance(student.id, 'absent')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase italic tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          currentStatus === 'absent'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                            : 'bg-slate-800 hover:bg-rose-500/20 border border-white/10 text-slate-300 hover:text-rose-300'
                        }`}
                      >
                        <UserX className="w-4 h-4" />
                        <span>{tAcad.attendanceAbsent}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 2: SQUAD & ONCE IDEAL BUILDER */}
      {activeSubTab === 'lineup' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-volt/10 border border-volt/30 text-volt text-[10px] font-bold font-mono uppercase tracking-widest">
                  {tAcad.lineupTag}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight font-display mt-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>{tAcad.lineupTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {tAcad.lineupSubtitle}
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
                title={tAcad.autoAlignBtn}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tAcad.autoAlignBtn}</span>
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
                  {tAcad.pitchScheme} {formation} • 11
                </span>
                <span className="text-slate-400 text-[11px]">{tAcad.pitchInstruction}</span>
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
                  <span>{tAcad.attackDirection}</span>
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
                          {assignedStudent ? assignedStudent.name.split(' ')[0] : tAcad.vacantSlot}
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
                const avgADN = assignedStudents.length > 0
                  ? Math.round(assignedStudents.reduce((acc, s) => acc + s.matchPercentage, 0) / assignedStudents.length)
                  : 0;

                return (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">{tAcad.startersCount}</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {assignedStudents.length} / 11
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">{tAcad.tacticalIQLbl}</span>
                      <span className="text-sm font-black text-volt font-mono">
                        {avgIQ > 0 ? avgIQ : '--'}
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">{tAcad.techniqueLbl}</span>
                      <span className="text-sm font-black text-white font-mono">
                        {avgTech > 0 ? avgTech : '--'}
                      </span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">{tAcad.teamADNLbl}</span>
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
                        {tAcad.dutyCardTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tAcad.slotPosLabel} {activeSlotConfig.label} ({activeSlotConfig.posCode})
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
                          {tAcad.slotPosLabel} {activeSlotConfig.posCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Duties Box */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="text-volt font-bold uppercase text-[10px] font-mono tracking-wider">
                      {tAcad.mainDutiesLabel}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {activeSlotConfig.duties}
                    </p>
                  </div>

                  {/* Key Tactical Concept with TacticalTerm popover */}
                  <div className="p-3 rounded-xl bg-volt/10 border border-volt/30 text-xs space-y-1.5">
                    <div className="text-volt font-bold uppercase text-[10px] font-mono">
                      {tAcad.keyConceptLabel}
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      {activeSlotConfig.tacticalTermKey ? (
                        <p>
                          <TacticalTerm termKey={activeSlotConfig.tacticalTermKey}>{activeSlotConfig.tacticalConcept}</TacticalTerm>
                        </p>
                      ) : (
                        <p>
                          <strong>{activeSlotConfig.tacticalConcept}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current Assigned Student Details Card */}
                  {assignedStudent ? (
                    <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/40 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">{tAcad.assignedStarterLabel}</span>
                          <h5 className="font-bold text-white text-xs leading-tight">
                            {assignedStudent.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {assignedStudent.category} • {tAcad.footLabel} {assignedStudent.preferredFoot}
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
                          <span className="text-slate-400 block text-[7px]">TEC</span>
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
                          <span>{tAcad.doExamBtn}</span>
                        </button>
                        <button
                          onClick={() => handleSlotStudentChange(activeSlotConfig.slotId, null)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                          title={tAcad.unassignBtn}
                        >
                          {tAcad.unassignBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-black/40 border border-dashed border-white/15 text-center space-y-1">
                      <span className="text-xs font-bold text-slate-300 block">{tAcad.vacantSlotTitle}</span>
                      <p className="text-[11px] text-slate-400">
                        {tAcad.vacantSlotDesc}
                      </p>
                    </div>
                  )}

                  {/* Candidate Selector List */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      {tAcad.candidatesTitle} ({sortedCandidates.length}):
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
                                  {tAcad.affinityBadge}
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
                {tAcad.tasksTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {tAcad.tasksSubtitle}
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
                        <span>{tAcad.taskStudentLabel} <strong className="text-slate-300">{s.name}</strong></span>
                        <span>•</span>
                        <span>{tAcad.taskDueLabel} {task.dueDate}</span>
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
                    {task.status === 'completed' ? tAcad.taskCompleted : tAcad.taskPending}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW: PLAYER & FAMILY COMPANION PORTAL */}
      {activeSubTab === 'portal' && (
        <PlayerPortal
          students={students}
          initialStudentId={activePortalStudentId}
          clubBrand={clubBrand}
          onBackToAcademy={() => setActiveSubTab('roster')}
          onUpdateStudentTask={handleToggleStudentTask}
        />
      )}

      {/* APARTADO ABAJO: PIZARRA TÁCTICA INTERACTIVA DEL MÍSTER */}
      {activeSubTab !== 'portal' && (
        <div className="pt-8 border-t border-white/10 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-volt animate-pulse" />
                <h2 className="text-xl font-black italic uppercase text-white tracking-tight flex items-center gap-2">
                  {tAcad.whiteboardTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {tAcad.whiteboardSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[11px] font-bold">
                {tAcad.redChips}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[11px] font-bold">
                {tAcad.blueChips}
              </span>
            </div>
          </div>

          <TacticalWhiteboard students={students} />
        </div>
      )}

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
                  {tAcad.addStudentTitle}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {students.length}/{currentLimit}
                </span>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{tAcad.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={tAcad.fullNamePlaceholder}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">{tAcad.categoryLabel}</label>
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
                  <label className="text-slate-400 block mb-1">{tAcad.dorsalLabel}</label>
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
                  <label className="text-slate-400 block mb-1">{tAcad.preferredFootLabel}</label>
                  <select
                    value={newFoot}
                    onChange={(e: any) => setNewFoot(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Diestro">{lang === 'en' ? 'Right' : lang === 'pt' ? 'Destro' : 'Diestro'}</option>
                    <option value="Zurdo">{lang === 'en' ? 'Left' : lang === 'pt' ? 'Canhoto' : 'Zurdo'}</option>
                    <option value="Ambidestro">{lang === 'en' ? 'Both' : lang === 'pt' ? 'Ambidestro' : 'Ambidestro'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{tAcad.tentativePosLabel}</label>
                  <select
                    value={newPos}
                    onChange={(e: any) => setNewPos(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="POR">{lang === 'en' ? 'Goalkeeper (GK)' : lang === 'pt' ? 'Guarda-Redes (POR)' : 'Portero (POR)'}</option>
                    <option value="DEC">{lang === 'en' ? 'Center Back (CB)' : lang === 'pt' ? 'Defesa Central (DEC)' : 'Defensa Central (DEC)'}</option>
                    <option value="LAT">{lang === 'en' ? 'Fullback (FB)' : lang === 'pt' ? 'Lateral (LAT)' : 'Lateral (LAT)'}</option>
                    <option value="MCD">{lang === 'en' ? 'Defensive Mid (CDM)' : lang === 'pt' ? 'Médio Defensivo (MCD)' : 'Pivote (MCD)'}</option>
                    <option value="MC">{lang === 'en' ? 'Central Mid (CM)' : lang === 'pt' ? 'Médio Centro (MC)' : 'Centrocampista (MC)'}</option>
                    <option value="MPO">{lang === 'en' ? 'Attacking Mid (CAM)' : lang === 'pt' ? 'Médio Ofensivo (MPO)' : 'Mediapunta (MPO)'}</option>
                    <option value="EXT">{lang === 'en' ? 'Winger (W)' : lang === 'pt' ? 'Extremo (EXT)' : 'Extremo (EXT)'}</option>
                    <option value="DC">{lang === 'en' ? 'Striker (ST)' : lang === 'pt' ? 'Avançado (DC)' : 'Delantero (DC)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{tAcad.coachNotesLabel}</label>
                <textarea
                  rows={2}
                  placeholder={tAcad.coachNotesPlaceholder}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-white text-black font-black uppercase italic tracking-wider mt-2 transition-all cursor-pointer"
              >
                {tAcad.registerBtn}
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
                  {tAcad.assignTaskTitle}
                </h3>
                <span className="text-xs text-emerald-400">
                  {tAcad.forLabel} #{selectedStudent.dorsal} {selectedStudent.name}
                </span>
              </div>
              <button
                onClick={() => setIsAssignTaskOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{tAcad.taskNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={tAcad.taskNamePlaceholder}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">{tAcad.taskAreaLabel}</label>
                  <select
                    value={taskCategory}
                    onChange={(e: any) => setTaskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Técnica">{lang === 'en' ? 'Technique & Dribbling' : lang === 'pt' ? 'Técnica & Drible' : 'Técnica & Regate'}</option>
                    <option value="Táctica">{lang === 'en' ? 'Tactical IQ' : lang === 'pt' ? 'Inteligência Tática' : 'Inteligencia Táctica'}</option>
                    <option value="Físico">{lang === 'en' ? 'Physical & Stamina' : lang === 'pt' ? 'Físico & Resistência' : 'Físico & Resistencia'}</option>
                    <option value="Mental">{lang === 'en' ? 'Mindset & Drive' : lang === 'pt' ? 'Mentalidade & Liderança' : 'Mentalidad & Presión'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{tAcad.dueDateLabel}</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{tAcad.instructionsLabel}</label>
                <textarea
                  rows={3}
                  required
                  placeholder={tAcad.instructionsPlaceholder}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic tracking-wider mt-2 transition-all cursor-pointer"
              >
                {tAcad.assignBtn}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: WHITE-LABEL CLUB BRAND CONFIGURATION */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-volt/10 border border-volt/30 flex items-center justify-center text-volt">
                  <Palette className="w-5 h-5 text-volt" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase italic font-display">
                    {lang === 'en' ? 'Club Brand Identity & White-Label' : lang === 'pt' ? 'Identidade do Clube & White-Label' : 'Identidad del Club & Marca Blanca'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en' 
                      ? 'Customize your academy name, motto, credentials, and PDF report branding' 
                      : 'Personaliza el nombre, lema, director y acreditación oficial que aparece en tus informes PDF'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveBrand(); }} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'Official Club / Academy Name' : 'Nombre Oficial del Club o Academia'}
                </label>
                <input
                  type="text"
                  required
                  value={brandClubName}
                  onChange={(e) => setBrandClubName(e.target.value)}
                  placeholder="Ej. Real Club Deportivo Cantera, FC Barcelona Escola..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-volt"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'Club Methodology Slogan / Motto' : 'Lema o Metodología Formativa'}
                </label>
                <input
                  type="text"
                  value={brandMotto}
                  onChange={(e) => setBrandMotto(e.target.value)}
                  placeholder="Ej. Metodología Pro de Alto Rendimiento, ADN de Campeones..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    {lang === 'en' ? 'Director / Head Coach Name' : 'Nombre Director Deportivo / Entrenador'}
                  </label>
                  <input
                    type="text"
                    value={brandDirector}
                    onChange={(e) => setBrandDirector(e.target.value)}
                    placeholder="Ej. Roberto Martínez, Míster Carlos..."
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    {lang === 'en' ? 'Staff Role / Accreditation' : 'Cargo / Licencia Oficial'}
                  </label>
                  <input
                    type="text"
                    value={brandDirectorTitle}
                    onChange={(e) => setBrandDirectorTitle(e.target.value)}
                    placeholder="Ej. Director Metodología UEFA Pro"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5 uppercase tracking-wider text-[11px]">
                  {lang === 'en' ? 'Institutional Accent Color' : 'Color Institucional de Acento'}
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Volt', color: '#ccff00' },
                    { label: 'Oro Real', color: '#eab308' },
                    { label: 'Azul Élite', color: '#3b82f6' },
                    { label: 'Verde', color: '#10b981' },
                    { label: 'Rojo Pasión', color: '#ef4444' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setBrandColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        brandColor === c.color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-2">{brandColor}</span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-volt uppercase block font-bold">
                  {lang === 'en' ? 'Live PDF Header Preview:' : 'Vista Previa en PDF & Informes:'}
                </span>
                <div className="flex items-center justify-between text-xs font-bold text-white pt-1">
                  <span>{brandClubName || 'ACADEMIA UEFA PRO'}</span>
                  <span className="text-[10px] font-mono text-slate-400">#STK-UEFA-PRO</span>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  {brandMotto || 'DESARROLLO INTEGRAL Y ALTO RENDIMIENTO'}
                </div>
                {brandDirector && (
                  <div className="text-[9px] font-mono text-emerald-400 pt-1">
                    ✓ Validado por: {brandDirector} ({brandDirectorTitle || 'Director Deportivo'})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-volt hover:bg-white text-black font-black uppercase italic text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-volt/20"
                >
                  {lang === 'en' ? 'Save Brand Configuration' : 'Guardar Identidad del Club'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export type PositionCategory = 
  | 'POR' // Portero
  | 'DEC' // Defensa Central
  | 'LAT' // Lateral / Carrilero
  | 'MCD' // Mediocentro Defensivo / Pivote
  | 'MC'  // Mediocentro Mixto / Box-to-Box
  | 'MPO' // Mediapunta / Creador
  | 'EXT' // Extremo / Invertido
  | 'DC'; // Delantero Centro / Mapeador

export interface SkillScores {
  speed: number;       // Velocidad / Explosividad
  technique: number;   // Técnica y Regate
  finishing: number;   // Remate y Gol
  passing: number;     // Pase y Visión
  defending: number;   // Defensa y Recuperación
  physical: number;    // Físico y Resistencia
  tacticalIQ: number;  // Inteligencia Táctica
  mental: number;      // Liderazgo y Mentalidad
}

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  badge?: string;
  weights: Partial<SkillScores>;
  positionAffinity: PositionCategory[];
}

export interface Question {
  id: number;
  category: 'Physical' | 'Technical' | 'Tactical' | 'Mental' | 'Spatial';
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface ProPlayer {
  id: string;
  name: string;
  club: string;
  nationality: string;
  position: string;
  positionCategory: PositionCategory;
  avatarUrl: string;
  quote: string;
  styleDescription: string;
  keySkills: string[];
  stats: SkillScores;
}

export interface Drill {
  id: string;
  title: string;
  category: 'Técnica' | 'Físico' | 'Finalización' | 'Táctica' | 'Visión';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Pro';
  durationMinutes: number;
  sets: string;
  reps: string;
  equipmentNeeded: string[];
  description: string;
  steps: string[];
  proTip: string;
  targetPositions: PositionCategory[];
  diagramType: 'pass-cone' | 'dribble-slalom' | 'shooting-box' | 'pressing-square';
}

export interface TacticalZone {
  pitchX: number; // 0-100 percentage
  pitchY: number; // 0-100 percentage
  radius: number;
  label: string;
  roleDescription: string;
}

export interface AssessmentResult {
  id: string;
  createdAt: string;
  playerName: string;
  preferredFoot: 'Diestro' | 'Zurdo' | 'Ambidestro';
  answers: Record<number, string>;
  
  // Computed evaluation
  primaryPosition: {
    code: PositionCategory;
    title: string;
    subtitle: string;
    roleDescription: string;
    matchPercentage: number;
  };
  secondaryPositions: {
    code: PositionCategory;
    title: string;
    matchPercentage: number;
  }[];
  
  skills: SkillScores;
  
  proComparison: {
    player: ProPlayer;
    matchPercentage: number;
    matchReason: string;
  };

  tacticalZones: TacticalZone[];
  strengths: string[];
  areasToImprove: string[];
  recommendedDrills: Drill[];
  aiPersonalizedNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
}

export type PlanType = 'free' | 'pro' | 'academy' | 'academy_basic' | 'academy_elite';
export type PaymentProvider = 'stripe' | 'paypal';

export interface PaymentRecord {
  id: string;
  userId: string;
  transactionId: string;
  provider: PaymentProvider;
  plan: PlanType;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  hasTrial?: boolean;
  trialDays?: number;
  trialEndsAt?: string;
  amountDueToday?: number;
}

export interface AcademyTask {
  id: string;
  title: string;
  category: 'Técnica' | 'Táctica' | 'Físico' | 'Mental';
  description: string;
  assignedToStudentId: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'completed';
  drillId?: string;
}

export interface AcademyStudent {
  id: string;
  name: string;
  age: number;
  category: 'Sub-12' | 'Sub-14' | 'Sub-16' | 'Sub-18' | 'Senior';
  dorsal: number;
  preferredFoot: 'Diestro' | 'Zurdo' | 'Ambidestro';
  primaryPosition: PositionCategory;
  secondaryPosition?: PositionCategory;
  matchPercentage: number;
  skills: SkillScores;
  coachNotes: string;
  lastExamDate?: string;
  assessmentResultId?: string;
  tasks?: AcademyTask[];
  avatarUrl?: string;
  createdAt: string;
}

export type AcademyFormation = '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2' | '3-4-3' | '4-1-4-1';

export interface AcademySquadSlot {
  slotId: string;
  positionCode: PositionCategory;
  slotLabel: string;
  posX: number; // 0-100% on pitch
  posY: number; // 0-100% on pitch
  studentId: string | null;
}

export interface AcademySquad {
  id: string;
  name: string;
  category: string;
  formation: AcademyFormation;
  slots: AcademySquadSlot[];
  coachNotes?: string;
  updatedAt: string;
}

export type TacticalPieceColor = 'red' | 'blue' | 'yellow' | 'ball';

export interface TacticalPiece {
  id: string;
  color: TacticalPieceColor;
  number: string; // e.g. "1", "10", "4"
  label?: string; // e.g. "Mateo", "DC"
  x: number; // 0-100% position on pitch
  y: number; // 0-100% position on pitch
  studentId?: string;
}

export interface TacticalDrawingLine {
  id: string;
  type: 'freehand' | 'arrow' | 'dashed_arrow';
  points: { x: number; y: number }[];
  color: string;
}

export interface TacticalBoardPlan {
  id: string;
  title: string;
  pieces: TacticalPiece[];
  drawings: TacticalDrawingLine[];
  notes?: string;
  updatedAt: string;
}

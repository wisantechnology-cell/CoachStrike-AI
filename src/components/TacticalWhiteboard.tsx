import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trash2, 
  RotateCcw, 
  Save, 
  Download, 
  ArrowRight, 
  Move, 
  PenTool, 
  Plus, 
  Check, 
  Sparkles, 
  Layers, 
  Sliders, 
  Eye, 
  X,
  Share2,
  Maximize2,
  Minimize2,
  FolderOpen,
  Undo2,
  CircleDot
} from 'lucide-react';
import { 
  TacticalPiece, 
  TacticalPieceColor, 
  TacticalDrawingLine, 
  TacticalBoardPlan, 
  AcademyStudent 
} from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  saveTacticalPlanToCloud, 
  deleteTacticalPlanFromCloud, 
  subscribeToAcademyTactics 
} from '../lib/firebase';

interface TacticalWhiteboardProps {
  students?: AcademyStudent[];
}

// Initial starter setup: 4-3-3 Attack (Red) vs 4-4-2 Defense (Blue)
const DEFAULT_PIECES: TacticalPiece[] = [
  // RED TEAM (Ataque)
  { id: 'r-1', color: 'yellow', number: '1', label: 'POR', x: 8, y: 50 },
  { id: 'r-2', color: 'red', number: '2', label: 'LD', x: 26, y: 82 },
  { id: 'r-4', color: 'red', number: '4', label: 'DEC', x: 22, y: 36 },
  { id: 'r-5', color: 'red', number: '5', label: 'DEC', x: 22, y: 64 },
  { id: 'r-3', color: 'red', number: '3', label: 'LI', x: 26, y: 18 },
  { id: 'r-6', color: 'red', number: '6', label: 'MCD', x: 40, y: 50 },
  { id: 'r-8', color: 'red', number: '8', label: 'MC', x: 54, y: 32 },
  { id: 'r-10', color: 'red', number: '10', label: 'MPO', x: 54, y: 68 },
  { id: 'r-7', color: 'red', number: '7', label: 'EXT', x: 74, y: 82 },
  { id: 'r-11', color: 'red', number: '11', label: 'EXT', x: 74, y: 18 },
  { id: 'r-9', color: 'red', number: '9', label: 'DC', x: 82, y: 50 },

  // BLUE TEAM (Defensa / Rival)
  { id: 'b-1', color: 'blue', number: '1', label: 'POR', x: 92, y: 50 },
  { id: 'b-2', color: 'blue', number: '2', label: 'LD', x: 75, y: 22 },
  { id: 'b-4', color: 'blue', number: '4', label: 'DEC', x: 78, y: 40 },
  { id: 'b-5', color: 'blue', number: '5', label: 'DEC', x: 78, y: 60 },
  { id: 'b-3', color: 'blue', number: '3', label: 'LI', x: 75, y: 78 },
  { id: 'b-7', color: 'blue', number: '7', label: 'MD', x: 62, y: 22 },
  { id: 'b-6', color: 'blue', number: '6', label: 'MC', x: 64, y: 42 },
  { id: 'b-8', color: 'blue', number: '8', label: 'MC', x: 64, y: 58 },
  { id: 'b-11', color: 'blue', number: '11', label: 'MI', x: 62, y: 78 },
  { id: 'b-9', color: 'blue', number: '9', label: 'DC', x: 50, y: 42 },
  { id: 'b-10', color: 'blue', number: '10', label: 'DC', x: 50, y: 58 },

  // BALL
  { id: 'ball-1', color: 'ball', number: '⚽', label: 'Balón', x: 56, y: 50 }
];

export const TacticalWhiteboard: React.FC<TacticalWhiteboardProps> = ({ students = [] }) => {
  const { user } = useAuth();
  const pitchRef = useRef<HTMLDivElement>(null);

  // Board State
  const [pieces, setPieces] = useState<TacticalPiece[]>(() => {
    const saved = localStorage.getItem('coachstrike_tactical_board_pieces');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_PIECES;
  });

  const [drawings, setDrawings] = useState<TacticalDrawingLine[]>(() => {
    const saved = localStorage.getItem('coachstrike_tactical_board_drawings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [planTitle, setPlanTitle] = useState('Salida de Balón & Presión Alta');
  const [activeTool, setActiveTool] = useState<'move' | 'arrow' | 'dashed_arrow' | 'freehand'>('move');
  const [drawingColor, setDrawingColor] = useState<string>('#ffffff');
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [showRosterImport, setShowRosterImport] = useState(false);
  const [showSavedPlansModal, setShowSavedPlansModal] = useState(false);
  const [savedPlans, setSavedPlans] = useState<TacticalBoardPlan[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLinePoints, setCurrentLinePoints] = useState<{ x: number; y: number }[]>([]);

  // Dragging Piece State
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-save local state
  useEffect(() => {
    try {
      localStorage.setItem('coachstrike_tactical_board_pieces', JSON.stringify(pieces));
      localStorage.setItem('coachstrike_tactical_board_drawings', JSON.stringify(drawings));
    } catch {}
  }, [pieces, drawings]);

  // Cloud sync if user is logged in
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToAcademyTactics(user.id, (cloudPlans) => {
      setSavedPlans(cloudPlans as TacticalBoardPlan[]);
    });
    return () => unsub();
  }, [user]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Coordinate conversion: Client Pixels -> Pitch Percentage (0 to 100)
  const getPitchCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!pitchRef.current) return { x: 50, y: 50 };
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(2, Math.min(98, Math.round(x * 10) / 10)),
      y: Math.max(3, Math.min(97, Math.round(y * 10) / 10))
    };
  }, []);

  // TOKEN POINTER DRAG HANDLERS
  const handlePiecePointerDown = (e: React.PointerEvent, piece: TacticalPiece) => {
    if (activeTool !== 'move') return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const coords = getPitchCoordinates(e.clientX, e.clientY);
    setDraggingPieceId(piece.id);
    setSelectedPieceId(piece.id);
    setDragOffset({
      x: coords.x - piece.x,
      y: coords.y - piece.y
    });
  };

  const handlePiecePointerMove = (e: React.PointerEvent) => {
    if (!draggingPieceId || activeTool !== 'move') return;
    e.stopPropagation();

    const coords = getPitchCoordinates(e.clientX, e.clientY);
    const newX = Math.max(2, Math.min(98, coords.x - dragOffset.x));
    const newY = Math.max(3, Math.min(97, coords.y - dragOffset.y));

    setPieces((prev) =>
      prev.map((p) => (p.id === draggingPieceId ? { ...p, x: newX, y: newY } : p))
    );
  };

  const handlePiecePointerUp = (e: React.PointerEvent) => {
    if (draggingPieceId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setDraggingPieceId(null);
    }
  };

  // CANVAS DRAWING POINTER HANDLERS
  const handlePitchPointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'move') {
      setSelectedPieceId(null);
      return;
    }
    const coords = getPitchCoordinates(e.clientX, e.clientY);
    setIsDrawing(true);
    setCurrentLinePoints([coords]);
  };

  const handlePitchPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || activeTool === 'move') return;
    const coords = getPitchCoordinates(e.clientX, e.clientY);

    if (activeTool === 'freehand') {
      setCurrentLinePoints((prev) => [...prev, coords]);
    } else {
      // For straight/dashed arrows, points = [start, end]
      setCurrentLinePoints((prev) => [prev[0] || coords, coords]);
    }
  };

  const handlePitchPointerUp = () => {
    if (!isDrawing || activeTool === 'move') return;
    setIsDrawing(false);

    if (currentLinePoints.length >= 2) {
      const newLine: TacticalDrawingLine = {
        id: `draw-${Date.now()}`,
        type: activeTool === 'freehand' ? 'freehand' : activeTool === 'dashed_arrow' ? 'dashed_arrow' : 'arrow',
        points: currentLinePoints,
        color: drawingColor
      };
      setDrawings((prev) => [...prev, newLine]);
    }
    setCurrentLinePoints([]);
  };

  // PIECE ACTIONS
  const handleAddPiece = (color: TacticalPieceColor) => {
    const countInColor = pieces.filter((p) => p.color === color).length;
    let defaultNum = '1';
    let defaultLabel = 'JUG';

    if (color === 'ball') {
      defaultNum = '⚽';
      defaultLabel = 'Balón';
    } else {
      defaultNum = String(countInColor + 1);
      defaultLabel = color === 'red' ? `R-${defaultNum}` : `A-${defaultNum}`;
    }

    const newPiece: TacticalPiece = {
      id: `p-${Date.now()}`,
      color,
      number: defaultNum,
      label: defaultLabel,
      x: color === 'red' ? 35 : color === 'blue' ? 65 : 50,
      y: 50
    };

    setPieces((prev) => [...prev, newPiece]);
    setSelectedPieceId(newPiece.id);
    showToast(`Ficha ${color === 'red' ? 'Roja' : color === 'blue' ? 'Azul' : color} añadida`);
  };

  const handleImportStudent = (student: AcademyStudent) => {
    const newPiece: TacticalPiece = {
      id: `p-std-${student.id}-${Date.now()}`,
      color: 'red',
      number: String(student.dorsal || 10),
      label: student.name.split(' ')[0],
      x: 45,
      y: 50,
      studentId: student.id
    };
    setPieces((prev) => [...prev, newPiece]);
    setSelectedPieceId(newPiece.id);
    setShowRosterImport(false);
    showToast(`${student.name} (#${student.dorsal}) añadido a la pizarra`);
  };

  const handleDeletePiece = (pieceId: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== pieceId));
    if (selectedPieceId === pieceId) setSelectedPieceId(null);
  };

  const handleUpdateSelectedPiece = (updates: Partial<TacticalPiece>) => {
    if (!selectedPieceId) return;
    setPieces((prev) =>
      prev.map((p) => (p.id === selectedPieceId ? { ...p, ...updates } : p))
    );
  };

  // DRAWING ACTIONS
  const handleUndoDrawing = () => {
    setDrawings((prev) => prev.slice(0, -1));
  };

  const handleClearDrawings = () => {
    setDrawings([]);
    showToast('Trazos borrados');
  };

  const handleClearAll = () => {
    if (confirm('¿Vaciar completamente la pizarra (fichas y trazos)?')) {
      setPieces([]);
      setDrawings([]);
      setSelectedPieceId(null);
      showToast('Pizarra reiniciada');
    }
  };

  // PRESET FORMATIONS
  const handleLoadPreset = (type: 'default' | '433_vs_442' | 'duel_5v5' | 'rondo') => {
    if (type === 'default' || type === '433_vs_442') {
      setPieces(DEFAULT_PIECES);
      setPlanTitle('Ataque 4-3-3 vs Repliegue 4-4-2');
    } else if (type === 'duel_5v5') {
      setPieces([
        // Red 5
        { id: 'r-por', color: 'yellow', number: '1', label: 'POR', x: 10, y: 50 },
        { id: 'r-cierre', color: 'red', number: '4', label: 'CIERRE', x: 25, y: 50 },
        { id: 'r-ala1', color: 'red', number: '7', label: 'ALA D', x: 38, y: 75 },
        { id: 'r-ala2', color: 'red', number: '11', label: 'ALA I', x: 38, y: 25 },
        { id: 'r-pivot', color: 'red', number: '9', label: 'PIVOT', x: 45, y: 50 },
        // Blue 5
        { id: 'b-por', color: 'blue', number: '1', label: 'POR', x: 90, y: 50 },
        { id: 'b-cierre', color: 'blue', number: '3', label: 'CIERRE', x: 75, y: 50 },
        { id: 'b-ala1', color: 'blue', number: '8', label: 'ALA D', x: 62, y: 25 },
        { id: 'b-ala2', color: 'blue', number: '6', label: 'ALA I', x: 62, y: 75 },
        { id: 'b-pivot', color: 'blue', number: '10', label: 'PIVOT', x: 55, y: 50 },
        // Ball
        { id: 'ball', color: 'ball', number: '⚽', label: 'Balón', x: 48, y: 50 }
      ]);
      setPlanTitle('Duelo Reducido 5v5 con Porteros');
    } else if (type === 'rondo') {
      setPieces([
        // 4 Outside (Rojos)
        { id: 'r-1', color: 'red', number: '8', label: 'Exterior', x: 50, y: 22 },
        { id: 'r-2', color: 'red', number: '6', label: 'Exterior', x: 35, y: 50 },
        { id: 'r-3', color: 'red', number: '10', label: 'Exterior', x: 65, y: 50 },
        { id: 'r-4', color: 'red', number: '7', label: 'Exterior', x: 50, y: 78 },
        // 2 Inside (Azules)
        { id: 'b-1', color: 'blue', number: '4', label: 'Presión', x: 46, y: 46 },
        { id: 'b-2', color: 'blue', number: '5', label: 'Presión', x: 54, y: 54 },
        // Ball
        { id: 'ball', color: 'ball', number: '⚽', label: 'Balón', x: 38, y: 48 }
      ]);
      setPlanTitle('Rondo de Posesión y Presión 4v2');
    }
    setDrawings([]);
    setSelectedPieceId(null);
    showToast('Plantilla táctica cargada');
  };

  // SAVE TACTICAL PLAN
  const handleSavePlan = async () => {
    const planId = `tac-${Date.now()}`;
    const newPlan: TacticalBoardPlan = {
      id: planId,
      title: planTitle.trim() || 'Estrategia Táctica',
      pieces,
      drawings,
      updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    // Save locally
    const existing: TacticalBoardPlan[] = JSON.parse(localStorage.getItem('coachstrike_saved_plans') || '[]');
    const updated = [newPlan, ...existing.filter((p) => p.title !== newPlan.title)];
    localStorage.setItem('coachstrike_saved_plans', JSON.stringify(updated));
    setSavedPlans(updated);

    // Save to Firestore if user logged in
    if (user) {
      await saveTacticalPlanToCloud(user.id, newPlan);
    }

    showToast(`"${newPlan.title}" guardado con éxito`);
  };

  const handleLoadSavedPlan = (plan: TacticalBoardPlan) => {
    setPieces(plan.pieces);
    setDrawings(plan.drawings || []);
    setPlanTitle(plan.title);
    setShowSavedPlansModal(false);
    showToast(`Plan "${plan.title}" cargado en la pizarra`);
  };

  const handleDeleteSavedPlan = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    const filtered = savedPlans.filter((p) => p.id !== planId);
    setSavedPlans(filtered);
    localStorage.setItem('coachstrike_saved_plans', JSON.stringify(filtered));
    if (user) {
      await deleteTacticalPlanFromCloud(user.id, planId);
    }
    showToast('Plan eliminado');
  };

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  return (
    <div 
      id="tactical-whiteboard" 
      className={`bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4 sm:p-6 overflow-y-auto' : 'mt-8'
      }`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-volt/10 text-volt border border-volt/20 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
              Pizarra Táctica Interactiva
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Arrastra fichas y traza movimientos en tiempo real
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="text-lg sm:text-2xl font-black italic text-white uppercase bg-transparent border-b border-white/15 focus:border-volt focus:outline-none transition-colors max-w-md w-full"
              placeholder="Nombre de la Jugada / Táctica..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Formations Dropdown */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => handleLoadPreset('433_vs_442')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-bold"
              title="11 Rojos vs 11 Azules"
            >
              11v11 Completo
            </button>
            <button
              onClick={() => handleLoadPreset('duel_5v5')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-bold"
              title="5v5 reducido"
            >
              5v5 Reducido
            </button>
            <button
              onClick={() => handleLoadPreset('rondo')}
              className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-bold"
              title="Rondo 4v2"
            >
              Rondo 4v2
            </button>
          </div>

          {/* Saved Plans */}
          <button
            onClick={() => setShowSavedPlansModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-volt" />
            <span>Planes ({savedPlans.length})</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSavePlan}
            className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-white text-black text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Plan</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-4 bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
        {/* Tool selector */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase">Modo:</span>

          <button
            onClick={() => setActiveTool('move')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'move'
                ? 'bg-volt text-black shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Mover Fichas</span>
          </button>

          <button
            onClick={() => setActiveTool('arrow')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'arrow'
                ? 'bg-emerald-400 text-black shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Flecha Pase</span>
          </button>

          <button
            onClick={() => setActiveTool('dashed_arrow')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'dashed_arrow'
                ? 'bg-cyan-400 text-black shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Desmarque (Punteada)</span>
          </button>

          <button
            onClick={() => setActiveTool('freehand')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'freehand'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Trazo Libre</span>
          </button>

          {/* Color palette for drawing */}
          {activeTool !== 'move' && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10">
              {['#ffffff', '#facc15', '#38bdf8', '#ef4444', '#10b981'].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawingColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                    drawingColor === c ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title="Color de trazo"
                />
              ))}
            </div>
          )}

          {/* Undo drawing */}
          {drawings.length > 0 && (
            <button
              onClick={handleUndoDrawing}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              title="Deshacer último trazo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          {drawings.length > 0 && (
            <button
              onClick={handleClearDrawings}
              className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-[11px] font-mono transition-all cursor-pointer"
            >
              Borrar líneas
            </button>
          )}
        </div>

        {/* Add Tokens Controls */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Añadir Ficha:</span>

          <button
            onClick={() => handleAddPiece('red')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>+ Roja</span>
          </button>

          <button
            onClick={() => handleAddPiece('blue')}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>+ Azul</span>
          </button>

          <button
            onClick={() => handleAddPiece('ball')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 transition-all cursor-pointer border border-white/10"
          >
            <span>⚽ Balón</span>
          </button>

          {students.length > 0 && (
            <button
              onClick={() => setShowRosterImport(!showRosterImport)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Desde Alumnos</span>
            </button>
          )}

          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-all cursor-pointer border border-white/10 ml-1"
            title="Limpiar toda la pizarra"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Student Roster Import Panel */}
      <AnimatePresence>
        {showRosterImport && students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/60 border border-emerald-500/30 rounded-xl p-3 mb-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Haz clic en un alumno para colocarlo en la pizarra táctica:
              </span>
              <button
                onClick={() => setShowRosterImport(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cerrar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {students.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleImportStudent(st)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-black border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                    {st.dorsal || '10'}
                  </span>
                  <span className="font-bold">{st.name}</span>
                  <span className="text-[10px] opacity-70">({st.primaryPosition})</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE PITCH CONTAINER */}
      <div 
        ref={pitchRef}
        onPointerDown={handlePitchPointerDown}
        onPointerMove={handlePitchPointerMove}
        onPointerUp={handlePitchPointerUp}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[720px] bg-[#082a17] rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl select-none touch-none cursor-crosshair"
      >
        {/* Grass Turf Stripes Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#09301a_50%,#0c381f_50%)] opacity-70 bg-[length:5.55%_100%]" />

        {/* Pitch Lines Vector Graphic */}
        <svg 
          viewBox="0 0 1000 600" 
          className="absolute inset-0 w-full h-full pointer-events-none stroke-white/50 fill-none stroke-[2.5]"
        >
          {/* Outer Boundary */}
          <rect x="25" y="25" width="950" height="550" rx="4" />

          {/* Halfway Line */}
          <line x1="500" y1="25" x2="500" y2="575" strokeWidth="2.5" />

          {/* Center Circle & Center Spot */}
          <circle cx="500" cy="300" r="85" />
          <circle cx="500" cy="300" r="5" fill="#ffffff" />

          {/* Left Penalty Area (Area Grande Izquierda) */}
          <rect x="25" y="130" width="160" height="340" />
          {/* Left Goal Area (Area Chica Izquierda) */}
          <rect x="25" y="210" width="55" height="180" />
          {/* Left Penalty Spot */}
          <circle cx="130" cy="300" r="4.5" fill="#ffffff" />
          {/* Left Penalty Arc (Media Luna) */}
          <path d="M 185 235 A 85 85 0 0 1 185 365" />

          {/* Right Penalty Area (Area Grande Derecha) */}
          <rect x="815" y="130" width="160" height="340" />
          {/* Right Goal Area (Area Chica Derecha) */}
          <rect x="920" y="210" width="55" height="180" />
          {/* Right Penalty Spot */}
          <circle cx="870" cy="300" r="4.5" fill="#ffffff" />
          {/* Right Penalty Arc (Media Luna) */}
          <path d="M 815 235 A 85 85 0 0 0 815 365" />

          {/* Left Goal Frame */}
          <rect x="8" y="240" width="17" height="120" stroke="#10b981" strokeWidth="3" fill="#041a0e" />
          {/* Right Goal Frame */}
          <rect x="975" y="240" width="17" height="120" stroke="#10b981" strokeWidth="3" fill="#041a0e" />

          {/* Corner Arcs */}
          <path d="M 25 45 A 20 20 0 0 1 45 25" />
          <path d="M 25 555 A 20 20 0 0 0 45 575" />
          <path d="M 975 45 A 20 20 0 0 0 955 25" />
          <path d="M 975 555 A 20 20 0 0 1 955 575" />

          {/* Attack Direction Guide */}
          <defs>
            <marker id="whiteboard-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
          <line x1="430" y1="45" x2="570" y2="45" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#whiteboard-arrow)" strokeDasharray="6 3" />
          <text x="500" y="38" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            DIRECCIÓN DE ATAQUE →
          </text>
        </svg>

        {/* DRAWN LINES SVG OVERLAY */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            {/* Dynamic arrow markers for each color */}
            {['#ffffff', '#facc15', '#38bdf8', '#ef4444', '#10b981'].map((col) => (
              <marker
                key={col}
                id={`arrow-${col.replace('#', '')}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill={col} />
              </marker>
            ))}
          </defs>

          {/* Saved Drawing Lines */}
          {drawings.map((line) => {
            if (line.points.length < 2) return null;
            const markerId = `arrow-${line.color.replace('#', '')}`;

            if (line.type === 'freehand') {
              const pathData = line.points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
              return (
                <path
                  key={line.id}
                  d={pathData}
                  stroke={line.color}
                  strokeWidth="0.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              );
            }

            const pStart = line.points[0];
            const pEnd = line.points[line.points.length - 1];
            return (
              <line
                key={line.id}
                x1={pStart.x}
                y1={pStart.y}
                x2={pEnd.x}
                y2={pEnd.y}
                stroke={line.color}
                strokeWidth="0.9"
                strokeDasharray={line.type === 'dashed_arrow' ? '1.5 1' : 'none'}
                markerEnd={`url(#${markerId})`}
                opacity="0.95"
              />
            );
          })}

          {/* Current In-Progress Line */}
          {isDrawing && currentLinePoints.length >= 2 && (
            <path
              d={currentLinePoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
              stroke={drawingColor}
              strokeWidth="0.9"
              fill="none"
              strokeDasharray={activeTool === 'dashed_arrow' ? '1.5 1' : 'none'}
              strokeLinecap="round"
              opacity="0.8"
            />
          )}
        </svg>

        {/* PIECES / CIRCLES OVERLAY */}
        {pieces.map((piece) => {
          const isSelected = piece.id === selectedPieceId;
          const isDragging = piece.id === draggingPieceId;

          // Color themes for Red, Blue, Yellow, Ball
          let bgClass = 'bg-rose-600 border-white text-white shadow-rose-900/80';
          if (piece.color === 'blue') {
            bgClass = 'bg-blue-600 border-white text-white shadow-blue-900/80';
          } else if (piece.color === 'yellow') {
            bgClass = 'bg-amber-400 border-black text-black shadow-amber-900/80';
          } else if (piece.color === 'ball') {
            bgClass = 'bg-white border-black text-black shadow-black/80 ring-2 ring-emerald-400';
          }

          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePiecePointerDown(e, piece)}
              onPointerMove={handlePiecePointerMove}
              onPointerUp={handlePiecePointerUp}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPieceId(piece.id);
              }}
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                touchAction: 'none'
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform ${
                isDragging ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              {/* Main Circle Token with Number */}
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm font-mono shadow-xl transition-all ${bgClass} ${
                  isSelected ? 'ring-4 ring-volt scale-110 animate-pulse' : ''
                }`}
              >
                {piece.number}
              </div>

              {/* Name or Role Badge below */}
              {piece.label && (
                <span className="mt-0.5 px-1.5 py-0.2 rounded bg-black/80 border border-white/20 text-white text-[9px] sm:text-[10px] font-bold font-mono tracking-tight whitespace-nowrap shadow-md pointer-events-none">
                  {piece.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Token Inspector & Edit Drawer */}
      <AnimatePresence>
        {selectedPiece && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 bg-slate-950 border border-white/15 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px] uppercase">Ficha Seleccionada:</span>
                <span className="px-2 py-0.5 rounded font-black font-mono text-white text-xs bg-white/10">
                  {selectedPiece.number}
                </span>
              </div>

              {/* Change Color */}
              <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 font-mono">Color:</span>
                <button
                  onClick={() => handleUpdateSelectedPiece({ color: 'red' })}
                  className={`w-5 h-5 rounded-full bg-rose-600 border transition-transform ${
                    selectedPiece.color === 'red' ? 'scale-125 border-white ring-2 ring-rose-400' : 'border-transparent'
                  }`}
                  title="Rojo"
                />
                <button
                  onClick={() => handleUpdateSelectedPiece({ color: 'blue' })}
                  className={`w-5 h-5 rounded-full bg-blue-600 border transition-transform ${
                    selectedPiece.color === 'blue' ? 'scale-125 border-white ring-2 ring-blue-400' : 'border-transparent'
                  }`}
                  title="Azul"
                />
                <button
                  onClick={() => handleUpdateSelectedPiece({ color: 'yellow' })}
                  className={`w-5 h-5 rounded-full bg-amber-400 border transition-transform ${
                    selectedPiece.color === 'yellow' ? 'scale-125 border-white ring-2 ring-amber-400' : 'border-transparent'
                  }`}
                  title="Amarillo (Portero / Especial)"
                />
              </div>

              {/* Change Number */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Dorsal:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={selectedPiece.number}
                  onChange={(e) => handleUpdateSelectedPiece({ number: e.target.value })}
                  className="w-14 bg-slate-900 border border-white/20 rounded px-2 py-1 text-center font-bold text-white font-mono focus:border-volt focus:outline-none"
                />
              </div>

              {/* Change Label */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Nombre/Rol:</span>
                <input
                  type="text"
                  maxLength={16}
                  value={selectedPiece.label || ''}
                  placeholder="Ej. Mateo o DC"
                  onChange={(e) => handleUpdateSelectedPiece({ label: e.target.value })}
                  className="w-28 sm:w-36 bg-slate-900 border border-white/20 rounded px-2 py-1 text-white font-mono text-xs focus:border-volt focus:outline-none"
                />
              </div>
            </div>

            {/* Delete / Deselect */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleDeletePiece(selectedPiece.id)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Ficha</span>
              </button>

              <button
                onClick={() => setSelectedPieceId(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Cerrar inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: SAVED PLANS */}
      {showSavedPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-black text-white uppercase italic flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                Estrategias & Tácticas Guardadas
              </h3>
              <button
                onClick={() => setShowSavedPlansModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedPlans.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No tienes tácticas guardadas aún.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Organiza las fichas en la pizarra y presiona &quot;Guardar Plan&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleLoadSavedPlan(plan)}
                    className="p-3 bg-black/40 hover:bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs group-hover:text-volt transition-colors">
                        {plan.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{plan.pieces?.length || 0} fichas</span>
                        <span>•</span>
                        <span>{plan.drawings?.length || 0} trazos</span>
                        <span>•</span>
                        <span>{plan.updatedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10">
                        Cargar
                      </span>
                      <button
                        onClick={(e) => handleDeleteSavedPlan(e, plan.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

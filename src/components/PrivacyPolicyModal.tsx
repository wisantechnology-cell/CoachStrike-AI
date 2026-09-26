import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, X, AlertTriangle, FileText, CheckCircle2, Award, Smartphone } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-black/60 px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-volt/20 border border-volt/40 flex items-center justify-center text-volt">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-black italic uppercase tracking-wider text-base font-display">
                  Política de Privacidad, Términos y Seguridad de la Aplicación
                </h2>
                <p className="text-xs text-slate-400 font-mono-code">
                  CoachStrike AI — Cumplimiento normativo Google Play, App Store & RGPD
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed">
            {/* Section 1 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-volt font-bold uppercase font-mono-code text-sm">
                <Lock className="w-4 h-4" /> 1. No Recopilación ni Almacenamiento de Datos Personales
              </div>
              <p>
                En <strong>CoachStrike AI</strong> nos tomamos muy en serio la privacidad de entrenadores, jugadores y academias. 
                Garantizamos que <strong>no se recopilan, venden ni almacenan datos de carácter personal</strong> en servidores externos más allá de lo estrictamente necesario para la autenticación segura (vía Firebase Auth) y la sincronización opcional en la nube de perfiles deportivos y plantillas tácticas del propio usuario. Ningún dato privado es cedido a terceros con fines comerciales o publicitarios.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase font-mono-code text-sm">
                <AlertTriangle className="w-4 h-4" /> 2. Política de Baneo y Uso Aceptable de la IA
              </div>
              <p>
                El uso del Asistente de Inteligencia Artificial (CoachStrike AI) y de la plataforma en general está sujeto a un código estricto de comportamiento deportivo y ético:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Queda terminantemente prohibido utilizar el asistente para generar contenido ofensivo, violento, discriminatorio, spam o fuera del ámbito exclusivo del análisis táctico de fútbol.</li>
                <li>Cualquier intento de manipular, extraer de manera automatizada (scraping masivo) o hacer un mal uso abusivo de los límites de mensajes de la IA conllevará el <strong>baneo inmediato y permanente</strong> de la cuenta, así como la revocación de la membresía sin derecho a reembolso.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono-code text-sm">
                <FileText className="w-4 h-4" /> 3. Propiedad Intelectual, Código y Prevención de Clonación
              </div>
              <p>
                Todo el diseño visual, algoritmos de evaluación de ADN futbolístico, código fuente, logotipos, pizarras tácticas y metodologías de entrenamiento integradas en CoachStrike AI están protegidos por derechos de autor internacionales. 
                <strong>No se solicita, autoriza ni permite de ninguna manera el robo de código, extracción de bases de datos, ingeniería inversa o clonación de la aplicación.</strong> Cualquier infracción legal será perseguida legalmente en los tribunales correspondientes.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase font-mono-code text-sm">
                <Smartphone className="w-4 h-4" /> 4. Cumplimiento de Políticas de Google Play y App Store
              </div>
              <p>
                CoachStrike AI cumple rigurosamente con las directrices de seguridad de Google Play Store y Apple App Store:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><strong>Protección de Menores (COPPA):</strong> Las cuentas de menores en academias y clases institucionales están supervisadas por entrenadores autorizados. No se recopilan perfiles publicitarios de menores de 13 años.</li>
                <li><strong>Moderación de Contenidos:</strong> Filtros automáticos en el servidor impiden la recepción de respuestas fuera del ámbito del fútbol o lenguaje inapropiado.</li>
                <li><strong>Gestión de Suscripciones:</strong> Los planes Pro, Academia y los Plus Elite de $40/mes se gestionan de forma transparente con opciones de cancelación y renovación clara.</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/60 px-6 py-4 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-volt text-black font-black uppercase text-xs hover:bg-volt/90 transition-colors cursor-pointer"
            >
              Entendido y Aceptado
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

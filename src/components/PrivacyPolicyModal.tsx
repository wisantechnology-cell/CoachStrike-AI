import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, X, AlertTriangle, FileText, Smartphone, Building2, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  const copy = {
    es: {
      title: 'Política de Privacidad, Términos Comerciales y Protección de Menores',
      subtitle: 'CoachStrike AI — Cumplimiento Normativo Google Play, App Store, RGPD & COPPA',
      s1Title: '1. Privacidad Estricta y No Comercialización de Datos Personales',
      s1Desc:
        'En CoachStrike AI garantizamos la privacidad absoluta de jugadores, familias, entrenadores y academias. No se venden ni ceden datos personales a terceros con fines publicitarios. Toda la información táctica, perfiles deportivos y plantillas de cantera se almacenan bajo cifrado TLS/SSL en infraestructura segura (Firebase Auth & Firestore) bajo control exclusivo del titular de la cuenta.',
      s2Title: '2. Protección de Menores en Academias (Cumplimiento COPPA & RGPD)',
      s2Desc:
        'Para clubes, colegios y escuelas de fútbol (Modo Academia Básico y Élite): las fichas de jugadores menores de edad están gestionadas exclusivamente por el cuerpo técnico autorizado del club. El acceso al Portal Privado del Jugador y Familia está protegido mediante código PIN individual de 4 dígitos y no indexa datos personales en motores de búsqueda públicos.',
      s3Title: '3. Transparencia en Suscripciones, Prueba Gratuita y Reembolsos',
      s3Desc:
        'Todos los planes de pago (Plan Pro, Academia Básico y Academia Élite) incluyen 3 días de prueba gratuita ($0.00 hoy) y garantía de satisfacción de 14 días. El usuario puede cancelar o modificar su suscripción en cualquier momento desde el panel de Membresías con un solo clic, sin penalizaciones ni cargos ocultos.',
      s4Title: '4. Código de Conducta y Uso Aceptable del Asistente Táctico IA',
      s4Bullets: [
        'Queda estrictamente prohibido utilizar el asistente CoachStrike AI para generar contenido ofensivo, discriminatorio o ajeno al análisis táctico y formativo de fútbol.',
        'Cualquier intento de extracción automatizada masiva (scraping) o abuso de los límites del servidor conllevará la suspensión inmediata de la cuenta.'
      ],
      s5Title: '5. Propiedad Intelectual y Licencia de Marca Blanca (White-Label)',
      s5Desc:
        'Los algoritmos de evaluación de ADN futbolístico, motores de afinidad táctica y código fuente son propiedad intelectual de CoachStrike AI. Los clubes suscritos a planes Academia cuentan con licencia oficial para exportar informes PDF y boletines con su propio escudo, nombre y firma institucional (White-Label).',
      btnAccept: 'Entendido y Aceptado'
    },
    en: {
      title: 'Privacy Policy, Commercial Terms & Youth Data Protection',
      subtitle: 'CoachStrike AI — Google Play, App Store, GDPR & COPPA Compliance',
      s1Title: '1. Strict Privacy & Zero Third-Party Data Selling',
      s1Desc:
        'At CoachStrike AI we guarantee the strict privacy of athletes, families, coaches, and academies. Personal data is never sold or shared with third-party advertisers. All tactical profiles, evaluation histories, and squad rosters are encrypted via TLS/SSL in secure cloud infrastructure (Firebase Auth & Firestore) under the exclusive control of the account holder.',
      s2Title: '2. Youth Athlete Protection in Academies (COPPA & GDPR Compliance)',
      s2Desc:
        'For football clubs, schools, and youth academies (Academy Basic & Elite): minor athlete records are managed exclusively by authorized coaching staff. Access to the Private Player & Family Portal is protected by an individual 4-digit PIN code and is never indexed by public search engines.',
      s3Title: '3. Subscription Transparency, 3-Day Free Trial & Refund Guarantee',
      s3Desc:
        'All paid memberships (Pro Plan, Academy Basic, and Academy Elite) include a 3-day free trial ($0.00 due today) plus a 14-day money-back satisfaction guarantee. Users can cancel or switch plans anytime in one click from the Memberships panel with zero hidden fees.',
      s4Title: '4. Code of Conduct & Acceptable AI Tactical Assistant Use',
      s4Bullets: [
        'Using the CoachStrike AI assistant to generate offensive, discriminatory, or non-football tactical content is strictly prohibited.',
        'Automated scraping, reverse engineering, or abuse of rate limits will result in immediate account termination.'
      ],
      s5Title: '5. Intellectual Property & White-Label Club License',
      s5Desc:
        'All football DNA algorithms, tactical affinity engines, and source code are the intellectual property of CoachStrike AI. Clubs subscribed to Academy plans hold an official commercial license to export PDF scouting dossiers and parent reports branded with their own club crest and director signature (White-Label).',
      btnAccept: 'Understood & Accepted'
    },
    pt: {
      title: 'Política de Privacidade, Termos Comerciais e Proteção de Menores',
      subtitle: 'CoachStrike AI — Conformidade Google Play, App Store, RGPD & COPPA',
      s1Title: '1. Privacidade Estrita e Não Comercialização de Dados Pessoais',
      s1Desc:
        'Na CoachStrike AI garantimos a privacidade absoluta de atletas, famílias, treinadores e academias. Nenhum dado pessoal é vendido ou cedido a terceiros para fins publicitários. Todos os perfis táticos, históricos evolutivos e plantéis são armazenados com encriptação TLS/SSL em infraestrutura segura (Firebase Auth & Firestore).',
      s2Title: '2. Proteção de Menores em Academias (Conformidade COPPA & RGPD)',
      s2Desc:
        'Para clubes, escolas e centros de formação (Modo Academia Básico e Elite): as fichas de atletas menores são geridas exclusivamente pela equipa técnica autorizada. O acesso ao Portal Privado do Jogador e Família é protegido por código PIN individual de 4 dígitos.',
      s3Title: '3. Transparência de Subscrição, Teste Grátis e Garantia de Reembolso',
      s3Desc:
        'Todos os planos pagos (Plano Pro, Academia Básico e Academia Elite) incluem 3 dias de teste gratuito ($0.00 hoje) e garantia de satisfação de 14 dias. O utilizador pode cancelar ou alterar a sua subscrição a qualquer momento com um único clique.',
      s4Title: '4. Código de Conduta e Uso Aceitável do Assistente Tático IA',
      s4Bullets: [
        'É estritamente proibido utilizar o assistente CoachStrike AI para gerar conteúdo ofensivo, discriminatório ou fora do âmbito tático do futebol.',
        'Qualquer tentativa de extração automatizada (scraping) ou abuso dos limites do servidor resultará na suspensão imediata da conta.'
      ],
      s5Title: '5. Propriedade Intelectual e Licença de Marca Branca (White-Label)',
      s5Desc:
        'Os algoritmos de avaliação de ADN futebolístico e código-fonte são propriedade intelectual da CoachStrike AI. Os clubes com plano Academia possuem licença oficial para exportar relatórios PDF e boletins com o seu próprio emblema e assinatura institucional (White-Label).',
      btnAccept: 'Compreendido e Aceite'
    }
  }[lang] || {
    title: 'Privacy Policy, Commercial Terms & Youth Data Protection',
    subtitle: 'CoachStrike AI — Google Play, App Store, GDPR & COPPA Compliance',
    s1Title: '1. Strict Privacy & Zero Third-Party Data Selling',
    s1Desc:
      'At CoachStrike AI we guarantee the strict privacy of athletes, families, coaches, and academies.',
    s2Title: '2. Youth Athlete Protection in Academies (COPPA & GDPR Compliance)',
    s2Desc:
      'Minor athlete records are managed exclusively by authorized coaching staff and protected by 4-digit PIN access.',
    s3Title: '3. Subscription Transparency, 3-Day Free Trial & Refund Guarantee',
    s3Desc:
      'All paid memberships include a 3-day free trial ($0.00 due today) plus a 14-day money-back satisfaction guarantee.',
    s4Title: '4. Code of Conduct & Acceptable AI Tactical Assistant Use',
    s4Bullets: [
      'Using the CoachStrike AI assistant to generate offensive or non-football content is strictly prohibited.'
    ],
    s5Title: '5. Intellectual Property & White-Label Club License',
    s5Desc:
      'All football DNA algorithms and source code are the intellectual property of CoachStrike AI.',
    btnAccept: 'Understood & Accepted'
  };

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
                  {copy.title}
                </h2>
                <p className="text-xs text-slate-400 font-mono-code">
                  {copy.subtitle}
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
          <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs leading-relaxed">
            {/* Section 1 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-volt font-bold uppercase font-mono-code text-sm">
                <Lock className="w-4 h-4" /> {copy.s1Title}
              </div>
              <p>{copy.s1Desc}</p>
            </div>

            {/* Section 2 */}
            <div className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase font-mono-code text-sm">
                <Building2 className="w-4 h-4" /> {copy.s2Title}
              </div>
              <p>{copy.s2Desc}</p>
            </div>

            {/* Section 3 */}
            <div className="bg-black/40 border border-sky-500/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold uppercase font-mono-code text-sm">
                <CreditCard className="w-4 h-4" /> {copy.s3Title}
              </div>
              <p>{copy.s3Desc}</p>
            </div>

            {/* Section 4 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase font-mono-code text-sm">
                <AlertTriangle className="w-4 h-4" /> {copy.s4Title}
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {copy.s4Bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Section 5 */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono-code text-sm">
                <FileText className="w-4 h-4" /> {copy.s5Title}
              </div>
              <p>{copy.s5Desc}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/60 px-6 py-4 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-volt text-black font-black uppercase text-xs hover:bg-volt/90 transition-colors cursor-pointer"
            >
              {copy.btnAccept}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

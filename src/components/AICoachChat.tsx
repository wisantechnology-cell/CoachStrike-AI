import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, HelpCircle, BookOpen, AlertCircle } from 'lucide-react';
import { ChatMessage, AssessmentResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TacticalTerm } from './TacticalTerm';
import { detectLanguage } from '../utils/languageDetector';

interface AICoachChatProps {
  playerProfile?: AssessmentResult | null;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({ playerProfile }) => {
  const { lang, setLang, detectAndSetLanguage, t, interpolate } = useLanguage();
  const { plan, isPro } = useAuth();
  const weeklyLimit = isPro ? 10 : 3;

  const getWeeklyUsage = (): number => {
    try {
      const stored = localStorage.getItem('coachstrike_ai_usage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        if (now - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.count;
        }
      }
    } catch {}
    return 0;
  };

  const [usageCount, setUsageCount] = useState<number>(getWeeklyUsage);

  const incrementWeeklyUsage = () => {
    try {
      const current = getWeeklyUsage();
      const updated = current + 1;
      localStorage.setItem('coachstrike_ai_usage', JSON.stringify({
        count: updated,
        timestamp: Date.now()
      }));
      setUsageCount(updated);
    } catch {}
  };

  const getInitialWelcomeMessage = (): string => {
    if (playerProfile) {
      return interpolate(t.coachWelcomeWithProfile, {
        name: playerProfile.playerName,
        position: playerProfile.primaryPosition.title
      });
    }
    return t.coachWelcomeDefault;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: getInitialWelcomeMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update initial message if language or profile changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [
          {
            ...prev[0],
            text: getInitialWelcomeMessage()
          }
        ];
      }
      return prev;
    });
  }, [lang, playerProfile]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Detect language and auto-switch whole app to the user's language
    const detected = detectLanguage(query.trim());
    let currentLang = lang;
    if (detected) {
      currentLang = detected;
      setLang(detected);
    }

    const currentUsage = getWeeklyUsage();
    if (currentUsage >= weeklyLimit) {
      const limitNotice = currentLang === 'en'
        ? `⚠️ You have reached your weekly AI message limit (${currentUsage}/${weeklyLimit} for your ${isPro ? 'Pro / Academy' : 'Free'} plan). Upgrade your plan in the top menu to keep consulting with the UEFA Pro Tactical Assistant.`
        : currentLang === 'pt'
        ? `⚠️ Atingiu o seu limite semanal de mensagens de IA (${currentUsage}/${weeklyLimit} para o seu plano ${isPro ? 'Pro / Academia' : 'Gratuito'}). Atualize o seu plano no menu superior para continuar a consultar o Assistente Tático UEFA Pro.`
        : `⚠️ Has alcanzado tu límite semanal de mensajes con la IA (${currentUsage}/${weeklyLimit} para tu plan ${isPro ? 'Pro / Academia' : 'Gratuito'}). Actualiza tu plan en el menú superior para continuar consultando con el Asistente Táctico UEFA Pro.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `limit-${Date.now()}`,
          sender: 'ai',
          text: limitNotice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    incrementWeeklyUsage();

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          playerProfile,
          lang: currentLang
        })
      });

      const data = await response.json();

      const defaultFallbackReply = currentLang === 'en'
        ? 'Great tactical approach. Remember to keep your head up before receiving the ball to scan your passing angles.'
        : currentLang === 'pt'
        ? 'Excelente abordagem tática. Lembre-se de manter a cabeça erguida antes de receber a bola.'
        : 'Buen planteamiento táctico. Recuerda mantener la cabeza levantada antes de recibir el balón.';

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || defaultFallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error sending message to coach:', err);
      const errorFallback = currentLang === 'en'
        ? 'Maintain tactical focus. In the attacking phase, always position in the half-spaces to receive on the half-turn.'
        : currentLang === 'pt'
        ? 'Mantenha a concentração tática. Na fase ofensiva, posicione-se no meio-espaço para receber orientado.'
        : 'Mantén la concentración táctica. En fase ofensiva busca siempre posicionarte en el carril interior para recibir perfilado.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: errorFallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = lang === 'en'
    ? [
        'How do I overcome a low block 5-3-2 formation?',
        'Give me a 15 min drill for my weak foot.',
        'How should an inverted winger position in defensive transition?',
        'What to do if pressed by 2 defenders at once?'
      ]
    : lang === 'pt'
    ? [
        'Como superar uma formação em bloco baixo 5-3-2?',
        'Dê-me um treino de 15 mins para o meu pé fraco.',
        'Como deve posicionar-se um extremo invertido em transição defensiva?',
        'O que fazer se for pressionado por 2 jogadores?'
      ]
    : [
        '¿Cómo jugar mejor si mi rival usa un bloque bajo 5-3-2?',
        'Dame un ejercicio de 15 mins para mejorar mi pierna mala.',
        '¿Cómo debe posicionarse un extremo invertido en transición defensiva?',
        '¿Qué debo hacer si me presionan 2 jugadores al mismo tiempo?'
      ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[680px]">
        {/* Chat Header */}
        <div className="bg-black/60 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-volt flex items-center justify-center text-black font-black shadow-md shadow-volt/20">
              <Bot className="w-6 h-6" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-volt rounded-full border-2 border-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black italic text-white text-base font-display uppercase tracking-wider">
                  {t.coachTitle}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-volt text-black font-black font-mono-code uppercase">
                  {t.coachStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                UEFA Pro Tactical Assistant & Live Scouting Advisor
              </p>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black/40">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center text-xs font-mono-code text-slate-500 my-2">
                  {msg.text}
                </div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-lg bg-volt-10 border border-volt-30 flex items-center justify-center text-volt shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isAi
                      ? 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                      : 'bg-volt text-black font-bold rounded-tr-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[10px] font-mono-code mt-1.5 ${isAi ? 'text-slate-500' : 'text-black/70'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-2 font-mono-code">
              <div className="w-8 h-8 rounded-lg bg-volt-10 border border-volt-30 flex items-center justify-center text-volt animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span className="animate-pulse">{t.analyzingTactics}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Quick Questions */}
        <div className="p-3 bg-black/60 border-t border-white/10 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[10px] font-bold text-volt uppercase tracking-wider shrink-0 flex items-center gap-1 font-mono-code">
            <HelpCircle className="w-3 h-3 text-volt" /> {t.quickQueries}
          </span>
          {sampleQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(query)}
              className="px-3 py-1 rounded-lg bg-black/40 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium shrink-0 transition-colors cursor-pointer"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-slate-900/80 border-t border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 bg-black/60 border border-white/10 focus:border-volt focus:ring-1 focus:ring-volt rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-hidden text-xs font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
              input.trim() && !loading
                ? 'bg-volt text-black hover:bg-white shadow-md shadow-volt/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

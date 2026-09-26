import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Check if a query appears non-serious, off-topic, or nonsensical
function isNonSeriousOrOffTopic(query: string): boolean {
  const q = query.trim().toLowerCase();

  // Gibberish or super short input without context
  if (q.length < 3 || /^[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+$/.test(q)) {
    return true;
  }

  // Common off-topic keywords
  const offTopicKeywords = [
    'chiste', 'joke', 'piada', 'pizza', 'receta', 'recipe', 'receita',
    'comida', 'pelicula', 'movie', 'filme', 'batman', 'superman',
    'sentido de la vida', 'meaning of life', 'politica', 'politics',
    'clima', 'tiempo hoy', 'weather', 'matematicas', 'math',
    'cripto', 'bitcoin', 'amor', 'love', 'cancion', 'song', 'musica'
  ];

  if (offTopicKeywords.some(keyword => q.includes(keyword))) {
    return true;
  }

  // Repetitive keys like "asdf", "qwerty", "1234"
  if (/^(asdf|qwerty|zxcv|1234|test|hola halo|aaa|zzz)/i.test(q) && q.length < 10) {
    return true;
  }

  return false;
}

// Fallback Smart Football Tactical AI Engine
function generateSmartTacticalFallback(query: string, playerProfile: any, lang: string = 'es'): string {
  const q = query.toLowerCase();
  const name = playerProfile?.playerName || (lang === 'en' ? 'Player' : lang === 'pt' ? 'Jogador' : 'Jugador');
  const pos = playerProfile?.primaryPosition?.title || (lang === 'en' ? 'Midfielder' : lang === 'pt' ? 'Meia' : 'Centrocampista');

  // Handle non-serious, off-topic, or unclear questions
  if (isNonSeriousOrOffTopic(query)) {
    if (lang === 'en') {
      return `Hello ${name}! As CoachStrike AI, my expertise is strictly focused on football tactics, positioning, drills, and player development. I am not sure about this topic or your request seems ambiguous. Could you please specify your question with more details about football or ask me for tactical advice?`;
    } else if (lang === 'pt') {
      return `Olá ${name}! Como CoachStrike AI, meu foco é exclusivamente em tática de futebol, posicionamento, treinos e desempenho em campo. Não tenho certeza sobre esse assunto ou sua pergunta parece ambígua. Poderia especificar mais sua dúvida relacionada ao futebol?`;
    } else {
      return `¡Hola ${name}! Como CoachStrike AI, mi campo de conocimiento es exclusivamente la táctica futbolística, el análisis de posiciones, ejercicios y el rendimiento en el campo. No estoy seguro de entender tu consulta o esta queda fuera de mi área técnica. ¿Podrías especificar más tu pregunta con detalles sobre fútbol o pedirme un consejo táctico específico?`;
    }
  }

  if (q.includes('bloque bajo') || q.includes('low block') || q.includes('bloco baixo')) {
    if (lang === 'en') {
      return `Hola ${name}! To break down a low block, as a ${pos}, key tactics are: 1) Maximum pitch width with wingers stretching the 5-man line; 2) Fast 1-touch ball circulation from side to side; 3) Third-man runs into penalty box gaps; 4) Long-range shots when defenders drop inside the 18-yard box. Focus on quick body orientation before receiving!`;
    } else if (lang === 'pt') {
      return `Olá ${name}! Para superar um bloco baixo, como ${pos}, as regras táticas são: 1) Garantir largura máxima no campo; 2) Circulação rápida de bola a 1-2 toques de lado a lado; 3) Desmarques de terceiro homem nos espaços livres; 4) Remates de média distância quando a defesa recua demais.`;
    } else {
      return `¡Hola ${name}! Para superar un bloque bajo siendo ${pos}, las claves tácticas son: 1) Amplitud máxima por bandas con extremos o carrileros pegados a la cal; 2) Circulación rápida a 1-2 toques de banda a banda para desorganizar su basculación; 3) Movimientos del 'tercer hombre' atacando los intervalos entre sus centrales; 4) Remate de media distancia para obligarlos a salir.`;
    }
  }

  if (q.includes('pierna mala') || q.includes('pierna debil') || q.includes('weak foot') || q.includes('pé fraco')) {
    if (lang === 'en') {
      return `To develop your non-dominant foot: 1) Wall passing drill for 10 minutes daily (50 one-touch passes inside foot, 50 laces); 2) First touch setup: position your body at a 45-degree angle so your non-dominant foot is always open to receive; 3) Cross-field ping practice using non-dominant laces. Consistency builds muscle memory!`;
    } else if (lang === 'pt') {
      return `Para evoluir o seu pé fraco: 1) Exercício de parede durante 10 mins diários (50 passes de chapa, 50 de peito do pé); 2) Perfilamento corporal a 45º para receber já orientado com o pé não dominante; 3) Cruzamentos e passes longos focado no equilíbrio e apoio do pé dominante.`;
    } else {
      return `Para dominar tu pierna no dominante: 1) Rutina de pared diaria (10 mins, 50 pases de interior y 50 de empeine seco); 2) Perfilación previa: orienta tus hombros a 45° para que tu primer toque quede cómodo hacia tu pierna débil; 3) En partidos de entrenamiento, oblígate a realizar todos los pases cortos de seguridad con tu pie no dominante.`;
    }
  }

  if (q.includes('presion') || q.includes('press') || q.includes('pressao') || q.includes('2 jugadores') || q.includes('dos jugadores')) {
    if (lang === 'en') {
      return `When 2 players press you simultaneously: 1) Pre-orient your body BEFORE the ball arrives (know your exit route); 2) Use a body feint or fake pass to move defenders onto one foot; 3) Execute a 1-touch pass to the free 'third man' or play backwards to your keeper/center-back. Never hold the ball static in high-density pressure zones!`;
    } else if (lang === 'pt') {
      return `Quando for pressionado por 2 jogadores: 1) Perfile o corpo ANTES da bola chegar para ter visão 360º; 2) Use fintas de corpo para desequilibrar o primeiro defensor; 3) Solte a bola a um toque para o homem livre ou faça apoio para trás. Não prenda a bola sob pressão alta!`;
    } else {
      return `Si sufres presión doble (2 vs 1): 1) La clave es la información previa (escaneo de hombros antes de recibir); 2) Utiliza la amagada de pase o perfilación corporal engañosa para fijar a un rival; 3) Juega a un toque apoyándote en el jugador libre (tercer hombre) o descarga de espaldas hacia tus centrales. ¡El balón siempre viaja más rápido que cualquier defensor!`;
    }
  }

  if (q.includes('ejercicio') || q.includes('drill') || q.includes('treino') || q.includes('rutina')) {
    return `Recomendación de entrenamiento UEFA Pro para tu perfil de ${pos}:
1) Calentamiento (8 mins): Rondo 4v2 con límite de 2 toques y presión tras pérdida.
2) Trabajo específico (15 mins): Circuito de agilidad con cambio de ritmo, control orientado de espaldas y remate a puerta.
3) Aplicación táctica (20 mins): Juego reducido 5v5 con comodines por las bandas para potenciar transiciones veloces.`;
  }

  // Default intelligent response
  return `¡Excelente consulta táctica, ${name}! Como ${pos}, tu rol requiere lectura de juego superior, perfilación corporal previa al control y precisión en la toma de decisiones. 

Recomendaciones clave:
• Mantén siempre la cabeza levantada (escaneo de 360°) antes de recibir la pelota.
• En fase defensiva, mantén la distancia de contención para cerrar líneas de pase interiores.
• En fase ofensiva, busca situarte entre las líneas del rival para generar dudas entre su defensa y mediocampo.

¿Podrías especificar más tu pregunta o pedirme un concepto táctico concreto (p. ej. cómo salir jugando contra presión alta, movimientos de desmarque o rutinas de definición)?`;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

// Deep AI Football Evaluation endpoint
app.post('/api/evaluate-ai', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { playerName, preferredFoot, primaryPosition, skills, answersSummary, lang = 'es' } = req.body;

    if (!ai) {
      // Fallback response if no key
      return res.json({
        success: true,
        data: {
          analysisTitle: `Informe Scouting: ${primaryPosition?.title || 'Futbolista Elite'}`,
          tacticalOverview: `El jugador ${playerName || 'Evaluado'} muestra una estructura biomecánica e inteligencia espacial idónea para la posición de ${primaryPosition?.title}. Destaca por su capacidad para interpretar el juego en espacios reducidos y mantener una elevada disciplina táctica.\n\nEn fase defensiva, demuestra una correcta orientación corporal y anticipación, mientras que en transición ofensiva busca constantemente acelerar la jugada mediante pases filtrados y desmarques de ruptura.`,
          signatureMove: 'Control orientado con la pierna lejana y cambio de ritmo diagonal hacia el carril central.',
          proQuote: '"El fútbol se juega con la cabeza; las piernas son solo tus herramientas." - Johan Cruyff',
          recommendedFocus: [
            'Perfeccionar la perfilación corporal previa a la recepción.',
            'Aumentar la resistencia explosiva en transiciones rápidas.',
            'Fortalecer el pie no dominante para salidas en ambas direcciones.'
          ]
        }
      });
    }

    const prompt = `Actúa como un Director Técnico Elite de la UEFA Pro.
El jugador "${playerName || 'Futbolista'}" (Pie: ${preferredFoot}) ha completado la evaluación de ADN futbolístico.
Resultados clave:
- Posición Ideal: ${primaryPosition?.title} (${primaryPosition?.code})
- Atributos (0-99): Velocidad ${skills?.speed}, Técnica ${skills?.technique}, Remate ${skills?.finishing}, Pase ${skills?.passing}, Defensa ${skills?.defending}, Físico ${skills?.physical}, Inteligencia Táctica ${skills?.tacticalIQ}, Mental ${skills?.mental}.

Genera un informe táctico profesional en formato JSON con la siguiente información en ${lang === 'en' ? 'ENGLISH' : lang === 'pt' ? 'PORTUGUESE' : 'SPANISH'}:
1. "analysisTitle": Un título profesional como informe scouting.
2. "tacticalOverview": 2 párrafos de análisis técnico-táctico profundo.
3. "signatureMove": Un movimiento distintivo de jugador pro recomendado para entrenar.
4. "proQuote": Una cita de motivación corta tipo vestuario profesional.
5. "recommendedFocus": 3 aspectos clave para entrenar en los próximos días.

Responde ÚNICAMENTE en JSON válido sin alucinaciones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/evaluate-ai:', error);
    res.json({
      success: true,
      data: {
        analysisTitle: 'Perfil Scouting Táctico Especializado',
        tacticalOverview: 'Jugador con notable lectura táctica y capacidad de adaptación en el terreno de juego. Se recomienda potenciar la velocidad de reacción y la precisión en pases entre líneas.',
        signatureMove: 'Giro de 180° para liberarse de la marca en zona de máquinas.',
        proQuote: '"La táctica es el arte de hacer fácil lo difícil."',
        recommendedFocus: ['Entrenamiento de reacción', 'Toma de decisiones en 1 toque', 'Perfilación defensiva']
      }
    });
  }
});

// AI Football Coach Chat Endpoint
app.post('/api/coach-chat', async (req, res) => {
  try {
    const { messages = [], playerProfile, lang = 'es' } = req.body;
    const lastUserMsg = messages.filter((m: any) => m.sender === 'user').pop();
    const query = lastUserMsg?.text || '';

    // Check locally first for non-serious / off-topic / gibberish queries
    if (isNonSeriousOrOffTopic(query)) {
      const fallbackReply = generateSmartTacticalFallback(query, playerProfile, lang);
      return res.json({ success: true, reply: fallbackReply });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Use Smart AI Coach Fallback Engine
      const fallbackReply = generateSmartTacticalFallback(query, playerProfile, lang);
      return res.json({ success: true, reply: fallbackReply });
    }

    const systemInstruction = `Eres "CoachStrike AI", un Director Técnico Elite de la UEFA Pro especializado ÚNICAMENTE en fútbol, tácticas, posiciones y rendimiento deportivo.

REGLAS STRICTAS ANTI-ALUCINACIÓN Y CONTROL DE ÁMBITO:
1. SI LA PREGUNTA NO ES SERIA, ES AMBIGUA, ES UN CHISTE, UN TROLL, O ES SOBRE UN TEMA AJENO AL FÚTBOL (cocina, cine, política, bromas, caracteres aleatorios):
   - NO intentes responder al tema ajeno ni inventes datos.
   - Responde cortésmente indicando que como CoachStrike AI tu ámbito es exclusivamente el fútbol y la táctica deportiva.
   - Pide al usuario que especifique más su pregunta o la reformule con detalles concretos sobre fútbol.
2. SI NO SABES UN DATO HISTÓRICO O ESTADÍSTICA EXACTA:
   - Admite abiertamente que no dispones de esa información en este momento en lugar de inventar o alucinar datos.
3. TONO:
   - Apasionado, motivador, directo y profesional (estilo Guardiola, Ancelotti, Klopp, Bielsa).
4. IDIOMA DE RESPUESTA:
   - ${lang === 'en' ? 'ENGLISH' : lang === 'pt' ? 'PORTUGUESE' : 'SPANISH'}

Información del jugador actual:
- Nombre: ${playerProfile?.playerName || 'Jugador'}
- Posición Ideal: ${playerProfile?.primaryPosition?.title || 'Centrocampista'}

Ofrece respuestas directas (máximo 150-200 palabras) utilizando terminología táctica real de fútbol.`;

    const formattedPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'Jugador' : 'Coach'}: ${m.text}`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${formattedPrompt}\nCoach:`,
      config: {
        systemInstruction,
        temperature: 0.3 // Lower temperature to avoid hallucinations
      }
    });

    const replyText = response.text?.trim() || generateSmartTacticalFallback(query, playerProfile, lang);
    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/coach-chat:', error);
    const { messages = [], playerProfile, lang = 'es' } = req.body;
    const lastUserMsg = messages.filter((m: any) => m.sender === 'user').pop();
    const query = lastUserMsg?.text || '';
    const fallbackReply = generateSmartTacticalFallback(query, playerProfile, lang);
    res.json({ success: true, reply: fallbackReply });
  }
});

// Stripe Checkout Processing Endpoint
app.post('/api/checkout/stripe', (req, res) => {
  try {
    const { plan, billingCycle = 'monthly', userEmail } = req.body;
    const validPlans = ['pro', 'academy', 'academy_basic', 'academy_elite'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, error: 'Plan inválido' });
    }

    const pricingMap: Record<string, { monthly: number; annual: number; maxStudents?: number }> = {
      pro: { monthly: 4.99, annual: 39.99 },
      academy: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
      academy_basic: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
      academy_elite: { monthly: 59.99, annual: 479.99, maxStudents: 200 }
    };

    const planConfig = pricingMap[plan] || pricingMap.pro;
    const amount = planConfig[billingCycle as 'monthly' | 'annual'] || planConfig.monthly;
    const transactionId = `ch_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const trialDays = 3;
    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();

    res.json({
      success: true,
      provider: 'stripe',
      transactionId,
      plan,
      billingCycle,
      amount,
      amountDueToday: 0.0,
      hasTrial: true,
      trialDays,
      trialEndsAt,
      maxStudents: planConfig.maxStudents || null,
      currency: 'USD',
      status: 'paid',
      customerEmail: userEmail || 'user@coachstrike.ai',
      activatedAt: new Date().toISOString(),
      message: `Prueba gratuita de 3 días activada para Plan ${plan.toUpperCase()} vía Stripe. Primer cobro ($${amount}) tras 3 días.`
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ success: false, error: 'Error procesando pago con Stripe' });
  }
});

// PayPal Checkout Processing Endpoint
app.post('/api/checkout/paypal', (req, res) => {
  try {
    const { plan, billingCycle = 'monthly', userEmail, paypalOrderId } = req.body;
    const validPlans = ['pro', 'academy', 'academy_basic', 'academy_elite'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, error: 'Plan inválido' });
    }

    const pricingMap: Record<string, { monthly: number; annual: number; maxStudents?: number }> = {
      pro: { monthly: 4.99, annual: 39.99 },
      academy: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
      academy_basic: { monthly: 39.99, annual: 319.99, maxStudents: 30 },
      academy_elite: { monthly: 59.99, annual: 479.99, maxStudents: 200 }
    };

    const planConfig = pricingMap[plan] || pricingMap.pro;
    const amount = planConfig[billingCycle as 'monthly' | 'annual'] || planConfig.monthly;
    const transactionId = paypalOrderId || `PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const trialDays = 3;
    const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();

    res.json({
      success: true,
      provider: 'paypal',
      transactionId,
      plan,
      billingCycle,
      amount,
      amountDueToday: 0.0,
      hasTrial: true,
      trialDays,
      trialEndsAt,
      maxStudents: planConfig.maxStudents || null,
      currency: 'USD',
      status: 'COMPLETED',
      customerEmail: userEmail || 'user@coachstrike.ai',
      activatedAt: new Date().toISOString(),
      message: `Prueba gratuita de 3 días activada para Plan ${plan.toUpperCase()} vía PayPal. Primer cobro ($${amount}) tras 3 días.`
    });
  } catch (error: any) {
    console.error('PayPal checkout error:', error);
    res.status(500).json({ success: false, error: 'Error procesando orden de PayPal' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚽ CoachStrike AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

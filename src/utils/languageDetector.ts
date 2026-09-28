import { Language } from '../data/translations';

const SPANISH_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'en', 'con', 'por', 'para', 'sin', 'sobre',
  'tras', 'que', 'qué', 'como', 'cómo', 'cuál', 'cuales', 'cuándo', 'donde', 'dónde', 'quién', 'quien', 'quiero',
  'táctica', 'tactica', 'táctico', 'tactico', 'ejercicio', 'ejercicios', 'jugador', 'jugadores', 'entrenamiento',
  'equipo', 'partido', 'gol', 'goles', 'balón', 'balon', 'pelota', 'fútbol', 'futbol', 'hacer', 'jugar', 'puedo',
  'puedes', 'puede', 'debo', 'debes', 'debe', 'dame', 'dime', 'hola', 'gracias', 'bueno', 'buenos', 'buenas', 'bien',
  'mejor', 'pierna', 'débil', 'debil', 'delantero', 'defensa', 'medio', 'campo', 'pase', 'pases', 'disparo', 'centro',
  'marcar', 'presión', 'presion', 'bloque', 'bajo', 'alto', 'mi', 'tu', 'su', 'nuestro', 'soy', 'eres', 'es', 'son',
  'somos', 'tengo', 'tienes', 'tiene', 'hago', 'haces', 'hace', 'más', 'mas', 'menos', 'muy', 'pero', 'si', 'porque',
  'por qué', 'ayuda', 'posición', 'posicion', 'carrilero', 'extremo', 'pivote', 'portero', 'guardameta', 'remate'
]);

const PORTUGUESE_WORDS = new Set([
  'o', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'em', 'com',
  'por', 'para', 'sem', 'sobre', 'que', 'quê', 'como', 'qual', 'quais', 'quando', 'onde', 'quem', 'quero',
  'tática', 'tatica', 'tático', 'tatico', 'exercício', 'exercicio', 'exercícios', 'exercicios', 'jogador',
  'jogadores', 'treino', 'treinos', 'time', 'equipe', 'partida', 'golo', 'golos', 'bola', 'futebol', 'fazer',
  'jogar', 'posso', 'pode', 'devo', 'deve', 'dê-me', 'diz-me', 'olá', 'ola', 'obrigado', 'obrigada', 'valeu',
  'bom', 'boa', 'bem', 'melhor', 'pé', 'fraco', 'forte', 'atacante', 'zagueiro', 'lateral', 'volante', 'meia',
  'goleiro', 'campo', 'passe', 'passes', 'chute', 'finalização', 'pressão', 'pressao', 'bloco', 'meu', 'minha',
  'seu', 'sua', 'nosso', 'nossa', 'sou', 'é', 'são', 'somos', 'tenho', 'tem', 'faço', 'faz', 'mais', 'muito',
  'mas', 'você', 'voce', 'não', 'nao', 'ajuda', 'posição', 'posicao'
]);

const ENGLISH_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as',
  'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will',
  'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which',
  'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
  'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'football', 'soccer', 'drill', 'drills',
  'tactics', 'tactical', 'position', 'striker', 'winger', 'midfielder', 'defender', 'fullback', 'centerback',
  'goalkeeper', 'coach', 'coaching', 'training', 'passing', 'shoot', 'shooting', 'press', 'pressing', 'low', 'block',
  'speed', 'stamina', 'match', 'game', 'hello', 'hi', 'hey', 'thanks', 'please', 'help', 'improve', 'best', 'play',
  'player', 'players', 'weak', 'foot', 'left', 'right', 'score', 'formation', 'why', 'where', 'should'
]);

/**
 * Detect the language of a given text input.
 * Returns 'es' | 'en' | 'pt' if high confidence, or null if uncertain.
 */
export function detectLanguage(text: string): Language | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();
  if (trimmed.length < 2) return null;

  const lower = trimmed.toLowerCase();

  let esScore = 0;
  let ptScore = 0;
  let enScore = 0;

  // 1. Check strong character markers
  if (/[¿¡ñ]/.test(lower)) {
    esScore += 4;
  }
  if (/[ãõçêô]/.test(lower)) {
    ptScore += 4;
  }

  // 2. Multi-word phrase signatures
  if (/(\bhow to\b|\bhow do\b|\bhow can\b|\bwhat is\b|\bwhat are\b|\bgive me\b|\btell me\b|\bi want\b|\bi need\b|\bcan you\b|\bhelp me\b)/i.test(lower)) {
    enScore += 5;
  }
  if (/(\bcómo hacer\b|\bcomo hacer\b|\bcómo jugar\b|\bcomo jugar\b|\bdame un\b|\bdime cómo\b|\bquiero saber\b|\bqué es\b|\bque es\b|\bpor qué\b|\bpara qué\b|\bayúdame\b|\bayudame\b)/i.test(lower)) {
    esScore += 5;
  }
  if (/(\bcomo fazer\b|\bcomo jogar\b|\bdê-me um\b|\bdiz-me como\b|\bquero saber\b|\bo que é\b|\bo que e\b|\bpor que\b|\bpara que\b|\bajuda-me\b|\bvocê pode\b)/i.test(lower)) {
    ptScore += 5;
  }

  // 3. Tokenize words
  const words = lower
    .replace(/[^\w\sáéíóúüñãõçêôà¿¡]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return null;

  for (const word of words) {
    if (SPANISH_WORDS.has(word)) esScore += 2;
    if (PORTUGUESE_WORDS.has(word)) ptScore += 2;
    if (ENGLISH_WORDS.has(word)) enScore += 2;

    // Direct exact word checks for high-impact unique triggers
    if (['hello', 'hi', 'hey', 'please', 'thanks', 'coach', 'drills', 'striker', 'winger', 'match', 'defense'].includes(word)) {
      enScore += 3;
    }
    if (['hola', 'gracias', 'porfa', 'delantero', 'carrilero', 'partido', 'pases', 'futbol', 'fútbol'].includes(word)) {
      esScore += 3;
    }
    if (['olá', 'ola', 'obrigado', 'obrigada', 'valeu', 'zagueiro', 'volante', 'treino'].includes(word)) {
      ptScore += 3;
    }
  }

  // Determine winner with minimum threshold
  const maxScore = Math.max(esScore, ptScore, enScore);
  if (maxScore < 2) return null;

  if (esScore === maxScore && esScore > ptScore && esScore > enScore) {
    return 'es';
  }
  if (enScore === maxScore && enScore > esScore && enScore > ptScore) {
    return 'en';
  }
  if (ptScore === maxScore && ptScore > esScore && ptScore > enScore) {
    return 'pt';
  }

  return null;
}

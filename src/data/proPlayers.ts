import { ProPlayer } from '../types';

export const PRO_PLAYERS: ProPlayer[] = [
  {
    id: 'vinicius',
    name: 'Vinícius Jr.',
    club: 'Real Madrid',
    nationality: 'Brasil',
    position: 'Extremo Invertido Izquierdo',
    positionCategory: 'EXT',
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
    quote: 'El regate es alegría, pero la efectividad en el área es lo que gana títulos.',
    styleDescription: 'Desborde diabólico en 1v1, aceleración imparable, cambio de ritmo y finalización en constante evolución.',
    keySkills: ['Regate en velocidad', 'Aceleración (0-100)', 'Diagonal al área', 'Finalización con rosca'],
    stats: {
      speed: 97,
      technique: 94,
      finishing: 88,
      passing: 82,
      defending: 45,
      physical: 84,
      tacticalIQ: 86,
      mental: 92
    }
  },
  {
    id: 'pedri',
    name: 'Pedri González',
    club: 'FC Barcelona',
    nationality: 'España',
    position: 'Interior Organizador / Mediapunta',
    positionCategory: 'MPO',
    avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
    quote: 'En el fútbol la cabeza va antes que los pies; el espacio se crea antes de recibir.',
    styleDescription: 'Visión periférica elite, giros sobre su eje en espacios reducidos y pase filtrado milimétrico.',
    keySkills: ['Giro en 360°', 'Pase entre líneas', 'Timing de recepción', 'Lectura de espacios'],
    stats: {
      speed: 78,
      technique: 96,
      finishing: 76,
      passing: 96,
      defending: 68,
      physical: 76,
      tacticalIQ: 98,
      mental: 90
    }
  },
  {
    id: 'bellingham',
    name: 'Jude Bellingham',
    club: 'Real Madrid',
    nationality: 'Inglaterra',
    position: 'Centrocampista Box-to-Box / Mediapunta',
    positionCategory: 'MC',
    avatarUrl: 'https://images.unsplash.com/photo-1543351611-72475171ee53?auto=format&fit=crop&w=400&q=80',
    quote: 'El verdadero centrocampista debe dominar ambas áreas con la misma ferocidad.',
    styleDescription: 'Despliegue físico brutal, llegada desde segunda línea con olfato goleador y carácter ganador.',
    keySkills: ['Llegada desde atrás', 'Despliegue físico', 'Juego aéreo', 'Conducción potente'],
    stats: {
      speed: 86,
      technique: 89,
      finishing: 91,
      passing: 88,
      defending: 78,
      physical: 92,
      tacticalIQ: 92,
      mental: 96
    }
  },
  {
    id: 'rodri',
    name: 'Rodri Hernández',
    club: 'Manchester City',
    nationality: 'España',
    position: 'Mediocentro Posicional / Pivote',
    positionCategory: 'MCD',
    avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
    quote: 'Un pivote es el termómetro del equipo: debe equilibrar sin aparecer en las portadas.',
    styleDescription: 'Sostén táctico del equipo, recuperador nato, precisión en pases de seguridad y disparo lejano.',
    keySkills: ['Anticipación y robo', 'Distribución de juego', 'Disparo de larga distancia', 'Posicionamiento táctico'],
    stats: {
      speed: 72,
      technique: 88,
      finishing: 79,
      passing: 94,
      defending: 94,
      physical: 90,
      tacticalIQ: 99,
      mental: 95
    }
  },
  {
    id: 'valverde',
    name: 'Federico Valverde',
    club: 'Real Madrid',
    nationality: 'Uruguay',
    position: 'Centrocampista Todoterreno / Lateral',
    positionCategory: 'MC',
    avatarUrl: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=400&q=80',
    quote: 'No doy un balón por perdido; el orgullo uruguayo se demuestra en cada sprint.',
    styleDescription: 'Velocidad de gacela, potencia de disparo lejana, sacrificio defensivo sin descanso.',
    keySkills: ['Sprint de largo recorrido', 'Potencia de golpeo', 'Presión asfixiante', 'Versatilidad táctica'],
    stats: {
      speed: 93,
      technique: 84,
      finishing: 85,
      passing: 86,
      defending: 82,
      physical: 96,
      tacticalIQ: 89,
      mental: 94
    }
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    club: 'Real Madrid',
    nationality: 'Francia',
    position: 'Delantero Centro / Extremo',
    positionCategory: 'DC',
    avatarUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
    quote: 'Cuando atacas el espacio con convicción, no hay defensa que pueda frenar la velocidad.',
    styleDescription: 'Desmarque al espacio mortífero, velocidad punta imparable y sangre fría ante el portero.',
    keySkills: ['Desmarque a la espalda', 'Velocidad punta', 'Regate seco', 'Definición cruzada'],
    stats: {
      speed: 98,
      technique: 92,
      finishing: 95,
      passing: 80,
      defending: 38,
      physical: 86,
      tacticalIQ: 88,
      mental: 91
    }
  },
  {
    id: 'van-dijk',
    name: 'Virgil van Dijk',
    club: 'Liverpool',
    nationality: 'Países Bajos',
    position: 'Defensa Central',
    positionCategory: 'DEC',
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
    quote: 'El buen defensa no necesita tirarse al suelo; impone su presencia y lee la jugada antes.',
    styleDescription: 'Dominio aéreo absoluto, salida limpia de balón en largo y templanza bajo presión.',
    keySkills: ['Duelos aéreos', 'Despeje y marcaje', 'Pase en largo', 'Liderazgo defensivo'],
    stats: {
      speed: 81,
      technique: 80,
      finishing: 62,
      passing: 84,
      defending: 97,
      physical: 96,
      tacticalIQ: 95,
      mental: 96
    }
  },
  {
    id: 'hakimi',
    name: 'Achraf Hakimi',
    club: 'Paris Saint-Germain',
    nationality: 'Marruecos',
    position: 'Lateral Derecha / Carrilero',
    positionCategory: 'LAT',
    avatarUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=400&q=80',
    quote: 'Ser carrilero es ser el puñal que ataca la banda y el escudo que la defiende.',
    styleDescription: 'Ida y vuelta constante por banda, potencia física, centros precisos y desborde.',
    keySkills: ['Recorrido por banda', 'Centro en carrera', 'Cobro de faltas', 'Repliegue veloz'],
    stats: {
      speed: 95,
      technique: 85,
      finishing: 75,
      passing: 82,
      defending: 80,
      physical: 90,
      tacticalIQ: 86,
      mental: 88
    }
  }
];

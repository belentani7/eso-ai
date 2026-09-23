export interface Language {
  code: 'pt' | 'es' | 'ca' | 'en';
  name: string;
  nativeName: string;
  flag: string;
  color: string;
}

export const LANGUAGES: Language[] = [
  { code: 'pt', name: 'Portugués', nativeName: 'Português', flag: '🇧🇷', color: '#009C3B' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', color: '#AA151B' },
  { code: 'ca', name: 'Catalán', nativeName: 'Català', flag: '🏴', color: '#FFCD00' },
  { code: 'en', name: 'Inglés', nativeName: 'English', flag: '🇬🇧', color: '#00247D' },
];

export interface FalseFriend {
  pt: string;
  esWrong: string;
  esCorrect: string;
  ca: string;
  en: string;
  category: string;
}

export const FALSE_FRIENDS: FalseFriend[] = [
  { pt: 'Embaraçada', esWrong: 'Embarazada', esCorrect: 'Avergonzada', ca: 'Avergonyida', en: 'Embarrassed', category: 'Social' },
  { pt: 'Esquisito', esWrong: 'Exquisito', esCorrect: 'Raro/Extraño', ca: 'Estrany', en: 'Weird/Strange', category: 'Descripción' },
  { pt: 'Oficina', esWrong: 'Oficina', esCorrect: 'Taller mecánico', ca: 'Taller', en: 'Workshop/Garage', category: 'Lugares' },
  { pt: 'Polvo', esWrong: 'Polvo', esCorrect: 'Pols (suciedad)', ca: 'Pols', en: 'Dust', category: 'Cotidiano' },
  { pt: 'Sobrenome', esWrong: 'Sobrenombre', esCorrect: 'Apellido', ca: 'Cognom', en: 'Surname', category: 'Identidad' },
  { pt: 'Rato', esWrong: 'Rato (tiempo)', esCorrect: 'Ratón', ca: 'Ratolí', en: 'Mouse/Rat', category: 'Animales' },
  { pt: 'Vassoura', esWrong: 'Basura', esCorrect: 'Escoba', ca: 'Escombra', en: 'Broom', category: 'Hogar' },
  { pt: 'Propina', esWrong: 'Propina', esCorrect: 'Suborno', ca: 'Suborn', en: 'Bribe', category: 'Legal' },
  { pt: 'Exquisito', esWrong: 'Exquisito', esCorrect: 'Delicioso', ca: 'Exquisit', en: 'Exquisite', category: 'Comida' },
  { pt: 'Borracha', esWrong: 'Borracha', esCorrect: 'Goma de borrar', ca: 'Goma', en: 'Eraser', category: 'Escolar' },
];

export interface VocabularyItem {
  concept: string;
  pt: string;
  es: string;
  ca: string;
  en: string;
  category: string;
}

export const MATH_VOCABULARY: VocabularyItem[] = [
  { concept: 'Ecuación', pt: 'Equação', es: 'Ecuación', ca: 'Equació', en: 'Equation', category: 'Álgebra' },
  { concept: 'Fracción', pt: 'Fração', es: 'Fracción', ca: 'Fracció', en: 'Fraction', category: 'Aritmética' },
  { concept: 'Despejar', pt: 'Isolar o termo', es: 'Despejar', ca: 'Aïllar', en: 'Isolate', category: 'Álgebra' },
  { concept: 'Triángulo', pt: 'Triângulo', es: 'Triángulo', ca: 'Triangle', en: 'Triangle', category: 'Geometría' },
  { concept: 'Porcentaje', pt: 'Porcentagem', es: 'Porcentaje', ca: 'Percentatge', en: 'Percentage', category: 'Aritmética' },
  { concept: 'Eje de coordenadas', pt: 'Eixo de coordenadas', es: 'Eje de coordenadas', ca: 'Eix de coordenades', en: 'Axis', category: 'Geometría' },
  { concept: 'Área', pt: 'Área', es: 'Área', ca: 'Àrea', en: 'Area', category: 'Geometría' },
  { concept: 'Volumen', pt: 'Volume', es: 'Volumen', ca: 'Volum', en: 'Volume', category: 'Geometría' },
  { concept: 'Teorema de Pitágoras', pt: 'Teorema de Pitágoras', es: 'Teorema de Pitágoras', ca: 'Teorema de Pitàgores', en: 'Pythagorean theorem', category: 'Geometría' },
  { concept: 'Ecuación cuadrática', pt: 'Equação quadrática', es: 'Ecuación cuadrática', ca: 'Equació quadràtica', en: 'Quadratic equation', category: 'Álgebra' },
];

export const SCIENCE_VOCABULARY: VocabularyItem[] = [
  { concept: 'Célula', pt: 'Célula', es: 'Célula', ca: 'Cèl·lula', en: 'Cell', category: 'Biología' },
  { concept: 'Átomo', pt: 'Átomo', es: 'Átomo', ca: 'Àtom', en: 'Atom', category: 'Química' },
  { concept: 'Ecosistema', pt: 'Ecossistema', es: 'Ecosistema', ca: 'Ecosistema', en: 'Ecosystem', category: 'Biología' },
  { concept: 'Energía', pt: 'Energia', es: 'Energía', ca: 'Energia', en: 'Energy', category: 'Física' },
  { concept: 'Fotosíntesis', pt: 'Fotossíntese', es: 'Fotosíntesis', ca: 'Fotosíntesi', en: 'Photosynthesis', category: 'Biología' },
  { concept: 'Materia', pt: 'Matéria', es: 'Materia', ca: 'Matèria', en: 'Matter', category: 'Química' },
  { concept: 'Fuerza', pt: 'Força', es: 'Fuerza', ca: 'Força', en: 'Force', category: 'Física' },
  { concept: 'Reacción química', pt: 'Reação química', es: 'Reacción química', ca: 'Reacció química', en: 'Chemical reaction', category: 'Química' },
];

export const SCHOOL_VOCABULARY: VocabularyItem[] = [
  { concept: 'Deberes', pt: 'Tarefa de casa', es: 'Deberes', ca: 'Deures', en: 'Homework', category: 'Escolar' },
  { concept: 'Examen', pt: 'Prova', es: 'Examen', ca: 'Examen/Prova', en: 'Exam', category: 'Escolar' },
  { concept: 'Patio/Recreo', pt: 'Recreio', es: 'Patio/Recreo', ca: 'Pati', en: 'Playground/Break', category: 'Escolar' },
  { concept: 'Director', pt: 'Diretor', es: 'Director', ca: 'Director', en: 'Principal', category: 'Escolar' },
  { concept: 'Profesor', pt: 'Professor', es: 'Profesor', ca: 'Professor', en: 'Teacher', category: 'Escolar' },
  { concept: 'Asignatura', pt: 'Matéria/Disciplina', es: 'Asignatura', ca: 'Assignatura', en: 'Subject', category: 'Escolar' },
  { concept: 'Horario', pt: 'Horário', es: 'Horario', ca: 'Horari', en: 'Schedule', category: 'Escolar' },
  { concept: 'Biblioteca', pt: 'Biblioteca', es: 'Biblioteca', ca: 'Biblioteca', en: 'Library', category: 'Lugares' },
];

export interface PhoneticRule {
  rule: string;
  ptSound: string;
  esSound: string;
  example: string;
  tip: string;
}

export const PHONETIC_RULES: PhoneticRule[] = [
  {
    rule: 'R inicial / RR',
    ptSound: 'Suave (como H aspirada)',
    esSound: 'Vibrante múltiple fuerte',
    example: 'Rato → Rato, Carro → Carro',
    tip: 'Practica: "El perro corre rápido por la carretera"'
  },
  {
    rule: 'J / G (ante e, i)',
    ptSound: 'Suave (como S francesa /ʒ/)',
    esSound: 'Fuerte (Jota /x/)',
    example: 'Gente, Jirafa, Gigante, Juego',
    tip: 'Imagina limpiando la garganta suavemente'
  },
  {
    rule: 'Vocales finales',
    ptSound: 'Nasales o cerradas',
    esSound: 'Abiertas y claras',
    example: 'Casa (no "cas"), Leite → Leche, Pão → Pan',
    tip: 'Abre la boca más, relaja la mandíbula'
  },
  {
    rule: 'L final',
    ptSound: 'Oscura (velarizada) [ɫ]',
    esSound: 'Clara [l]',
    example: 'Brasil → Brasil, Portugal → Portugal',
    tip: 'Punta de la lengua en los alveolos, no atrás'
  },
  {
    rule: 'D entre vocales',
    ptSound: 'Suave [dʒ] o [d]',
    esSound: 'Fricativa sonora [ð] (como "th" en "this")',
    example: 'Nada, Cada, Ciudad',
    tip: 'Lengua entre los dientes, aire suave'
  },
];

export interface CatalanAdvantage {
  feature: string;
  explanation: string;
  ptExample: string;
  caExample: string;
}

export const CATALAN_ADVANTAGES: CatalanAdvantage[] = [
  {
    feature: 'Ç (C trencada)',
    explanation: 'Suena como S fuerte, igual que en portugués',
    ptExample: 'Coração',
    caExample: 'Coració'
  },
  {
    feature: 'X',
    explanation: 'Suena como "Sh" (/ʃ/), igual que en portugués',
    ptExample: 'Xícara',
    caExample: 'Xicra'
  },
  {
    feature: 'NY / LH',
    explanation: 'La "ñ" española es "NY" en catalán y "LH" en portugués',
    ptExample: 'Espanha',
    caExample: 'Espanya'
  },
  {
    feature: 'Vocales abiertas (È, Ò)',
    explanation: 'El catalán, como el portugués, distingue vocales abiertas/cerradas',
    ptExample: 'Avó / Avô',
    caExample: 'Àvia / Avi'
  },
  {
    feature: 'Artículos contraídos',
    explanation: 'Preposición + artículo (del, al, pel, per la) similar a PT',
    ptExample: 'Do, da, no, na',
    caExample: 'Del, de la, pel, per la'
  },
];

export interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  skills: string[];
}

export const GAMES: GameType[] = [
  {
    id: 'false-friends',
    name: 'Caza-Falsos-Amigos',
    description: 'Identifica las trampas léxicas entre portugués y español. Evita situaciones embarazosas.',
    icon: '🎯',
    color: 'from-red-500 to-pink-500',
    difficulty: 'Fácil',
    skills: ['Vocabulario', 'Contraste PT-ES', 'Atención'],
  },
  {
    id: 'mate-escape',
    name: 'Mate-Escape',
    description: 'Resuelve ecuaciones contrarreloj. Escapa de la sala resolviendo matemáticas paso a paso.',
    icon: '🧮',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Medio',
    skills: ['Álgebra', 'Cálculo mental', 'Vocabulario matemático'],
  },
  {
    id: 'trilingue-express',
    name: 'Trilingüe Express',
    description: 'Traduce rápido del portugués al español. Construye rachas y domina el vocabulario básico.',
    icon: '🌍',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Fácil',
    skills: ['Vocabulario trilingüe', 'Velocidad', 'Memoria'],
  },
  {
    id: 'catalan-challenge',
    name: 'Catalán Challenge',
    description: 'Aprende catalán usando tu portugués como puente. Aprovecha las ventajas fonéticas únicas.',
    icon: '🇪🇸',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Medio',
    skills: ['Catalán básico', 'Transferencia PT-CA', 'Inmersión'],
  },
  {
    id: 'super-quiz',
    name: 'Super Quiz Integral',
    description: 'El reto definitivo: matemáticas, idiomas, cultura y ciencia en un solo quiz contrarreloj.',
    icon: '🏆',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Difícil',
    skills: ['Todo el currículo', 'Pensamiento rápido', 'Resistencia'],
  },
];

export interface CulturalBridge {
  id: string;
  title: string;
  description: string;
  brazilConnection: string;
  spainConnection: string;
  vocabulary: { pt: string; es: string; ca: string; en: string }[];
  activity: string;
}

export const CULTURAL_BRIDGES: CulturalBridge[] = [
  {
    id: 'tordesillas',
    title: 'Tratado de Tordesillas (1494)',
    description: 'El acuerdo que dividió el mundo entre España y Portugal, definiendo las fronteras de Brasil.',
    brazilConnection: 'Brasil quedó del lado portugués, definiendo su historia colonial y su idioma.',
    spainConnection: 'España obtuvo la mayor parte de América, moldeando el mapa lingüístico del continente.',
    vocabulary: [
      { pt: 'Tratado', es: 'Tratado', ca: 'Tractat', en: 'Treaty' },
      { pt: 'Divisão', es: 'División', ca: 'Divisió', en: 'Division' },
      { pt: 'Mundo', es: 'Mundo', ca: 'Món', en: 'World' },
      { pt: 'Fronteira', es: 'Frontera', ca: 'Frontera', en: 'Border' },
    ],
    activity: 'Crea una línea de tiempo comparando eventos simultáneos en Brasil y España (1492-1822).'
  },
  {
    id: 'familia-real',
    title: 'Llegada de la Familia Real Portuguesa a Brasil (1808)',
    description: 'La corte portuguesa huye de Napoleón y se establece en Río de Janeiro, transformando Brasil.',
    brazilConnection: 'Río se convierte en capital del Imperio Portugués. Brasil eleva su estatus a Reino Unido.',
    spainConnection: 'España sufre la Guerra de la Independencia (1808-1814) contra la ocupación francesa.',
    vocabulary: [
      { pt: 'Corte', es: 'Corte', ca: 'Cort', en: 'Court' },
      { pt: 'Império', es: 'Imperio', ca: 'Imperi', en: 'Empire' },
      { pt: 'Guerra', es: 'Guerra', ca: 'Guerra', en: 'War' },
      { pt: 'Independência', es: 'Independencia', ca: 'Independència', en: 'Independence' },
    ],
    activity: 'Compara las constituciones de 1812 (Cádiz) y 1824 (Brasil). ¿Similitudes y diferencias?'
  },
  {
    id: 'musica-compartida',
    title: 'Música Compartida: Fado, Flamenco y Rumba',
    description: 'Raíces comunes en la música ibérica y latinoamericana. El ritmo que cruza el Atlántico.',
    brazilConnection: 'Samba, Bossa Nova, Choro - herencia africana, europea e indígena.',
    spainConnection: 'Flamenco, Rumba Catalana, Copla - herencia gitana, árabe, judía y andaluza.',
    vocabulary: [
      { pt: 'Ritmo', es: 'Ritmo', ca: 'Ritme', en: 'Rhythm' },
      { pt: 'Guitarra', es: 'Guitarra', ca: 'Guitarra', en: 'Guitar' },
      { pt: 'Dança', es: 'Baile', ca: 'Ball', en: 'Dance' },
      { pt: 'Alma', es: 'Alma', ca: 'Ànima', en: 'Soul' },
    ],
    activity: 'Escucha "Águas de Março" (Tom Jobim) y "Entre dos aguas" (Paco de Lucía). Compara ritmo y emoción.'
  },
  {
    id: 'futbol-pasion',
    title: 'Fútbol: Pasión Compartida',
    description: 'El deporte que une a Brasil y España. Estilos diferentes, misma devoción.',
    brazilConnection: 'Fútbol arte, "jogo bonito", 5 mundiales, Pelé, Neymar, cancha de tierra.',
    spainConnection: 'Tiki-taka, posesión, 1 mundial (2010), Xavi, Iniesta, La Masia, cantera.',
    vocabulary: [
      { pt: 'Futebol', es: 'Fútbol', ca: 'Futbol', en: 'Football/Soccer' },
      { pt: 'Gol', es: 'Gol', ca: 'Gol', en: 'Goal' },
      { pt: 'Campeonato', es: 'Campeonato', ca: 'Campionat', en: 'Championship' },
      { pt: 'Torcida', es: 'Afición', ca: 'Afició', en: 'Fans' },
    ],
    activity: 'Analiza las tácticas: 4-2-3-1 brasileño vs 4-3-3 español. Vocabulario táctico en 4 idiomas.'
  },
  {
    id: 'comida-fusion',
    title: 'Gastronomía: Del Feijoada al Cocido',
    description: 'Platos de cuchara que cuentan historias de migración, clima y creatividad popular.',
    brazilConnection: 'Feijoada (frijoles negros + cerdo), Moqueca (pescado + leche de coco), Acarajé.',
    spainConnection: 'Cocido madrileño, Fabada asturiana, Escudella catalana, Puchero andaluz.',
    vocabulary: [
      { pt: 'Feijão', es: 'Judía/Alubia', ca: 'Fesol', en: 'Bean' },
      { pt: 'Carne', es: 'Carne', ca: 'Carn', en: 'Meat' },
      { pt: 'Panela', es: 'Olla/Cazuela', ca: 'Cassola', en: 'Pot' },
      { pt: 'Tempero', es: 'Condimento/Sazonar', ca: 'Condiment', en: 'Seasoning' },
    ],
    activity: 'Cocina una "Feijoada Catalana" fusionando judías del ganxet con chorizo y morcilla. Escribe la receta en 4 idiomas.'
  },
];

export interface MusicLesson {
  id: string;
  title: string;
  artist: string;
  language: Language['code'];
  lyrics: { pt?: string; es?: string; ca?: string; en?: string };
  vocabulary: VocabularyItem[];
  grammarFocus: string;
  culturalNote: string;
  youtubeId?: string;
}

export const MUSIC_LESSONS: MusicLesson[] = [
  {
    id: 'aguas-de-marco',
    title: 'Águas de Março',
    artist: 'Tom Jobim & Elis Regina',
    language: 'pt',
    lyrics: {
      pt: 'É pau, é pedra, é o fim do caminho...',
      es: 'Es palo, es piedra, es el fin del camino...',
      ca: 'É fusta, és pedra, és el final del camí...',
      en: 'It\'s a stick, it\'s a stone, it\'s the end of the road...',
    },
    vocabulary: [
      { concept: 'Camino', pt: 'Caminho', es: 'Camino', ca: 'Camí', en: 'Road/Path', category: 'Naturaleza' },
      { concept: 'Agua', pt: 'Água', es: 'Agua', ca: 'Aigua', en: 'Water', category: 'Naturaleza' },
      { concept: 'Fin', pt: 'Fim', es: 'Fin', ca: 'Final', en: 'End', category: 'Tiempo' },
    ],
    grammarFocus: 'Ser/Estar en descripciones / Ser/Estar en catalán (ser/estar/ésser)',
    culturalNote: 'Considerada la mejor canción brasileña de todos los tiempos. Tom Jobim = padre de la Bossa Nova.',
    youtubeId: 'QKQ9zQj8V5M',
  },
  {
    id: 'la-llorona',
    title: 'La Llorona',
    artist: 'Chavela Vargas / Versión tradicional',
    language: 'es',
    lyrics: {
      es: 'Ay de mí, Llorona, Llorona de azul celeste...',
      pt: 'Ai de mim, Llorona, Llorona de azul celeste...',
      ca: 'Ai de mi, Llorona, Llorona de blau celest...',
      en: 'Oh me, Llorona, Llorona of sky blue...',
    },
    vocabulary: [
      { concept: 'Llorar', pt: 'Chorar', es: 'Llorar', ca: 'Plorar', en: 'Cry', category: 'Emociones' },
      { concept: 'Celeste', pt: 'Celeste', es: 'Celeste', ca: 'Celest', en: 'Sky blue', category: 'Colores' },
      { concept: 'Olvido', pt: 'Esquecimento', es: 'Olvido', ca: 'Oblit', en: 'Oblivion', category: 'Abstracto' },
    ],
    grammarFocus: 'Subjuntivo en expresiones emocionales (Ay de mí que...)',
    culturalNote: 'Canción mexicana icónica. Chavela Vargas (costarricense-mexicana) la hizo inmortal con su voz única.',
    youtubeId: 'kZj8J9QxY5M',
  },
  {
    id: 'boig-per-tu',
    title: 'Boig per Tu',
    artist: 'Sau',
    language: 'ca',
    lyrics: {
      ca: 'Em faig vell, em faig vell, pensant en tu...',
      es: 'Me hago viejo, me hago viejo, pensando en ti...',
      pt: 'Fico velho, fico velho, pensando em você...',
      en: 'I get old, I get old, thinking of you...',
    },
    vocabulary: [
      { concept: 'Envejecer', pt: 'Envelhecer', es: 'Envejecer/Hacerse mayor', ca: 'Fer-se vell', en: 'Get old', category: 'Tiempo' },
      { concept: 'Pensar', pt: 'Pensar', es: 'Pensar', ca: 'Pensar', en: 'Think', category: 'Mente' },
      { concept: 'Loco', pt: 'Louco', es: 'Loco', ca: 'Boig', en: 'Crazy', category: 'Emociones' },
    ],
    grammarFocus: 'Verbos reflexivos (em faig) / Perífrasis verbales',
    culturalNote: 'Himno del rock catalán de los 80. Sau = banda legendaria de Barcelona. Carles Sabater, voz inolvidable.',
    youtubeId: 'xYz8J9QxY5M',
  },
  {
    id: 'imagine',
    title: 'Imagine',
    artist: 'John Lennon',
    language: 'en',
    lyrics: {
      en: 'Imagine there\'s no heaven, it\'s easy if you try...',
      es: 'Imagina que no hay cielo, es fácil si lo intentas...',
      pt: 'Imagine que não há céu, é fácil se você tentar...',
      ca: 'Imagina que no hi ha cel, és fàcil si ho intentes...',
    },
    vocabulary: [
      { concept: 'Imaginar', pt: 'Imaginar', es: 'Imaginar', ca: 'Imaginar', en: 'Imagine', category: 'Mente' },
      { concept: 'Cielo', pt: 'Céu', es: 'Cielo', ca: 'Cel', en: 'Heaven/Sky', category: 'Naturaleza' },
      { concept: 'Paz', pt: 'Paz', es: 'Paz', ca: 'Pau', en: 'Peace', category: 'Valores' },
      { concept: 'Mundo', pt: 'Mundo', es: 'Mundo', ca: 'Món', en: 'World', category: 'Sociedad' },
    ],
    grammarFocus: 'Imperativo + condicional (Imagine / Imagina / Imagina) / There is/are',
    culturalNote: 'Himno mundial por la paz. Lennon escribió la letra en 1971. Yoko Ono co-autora no acreditada inicialmente.',
    youtubeId: 'YkgkThdzX-8',
  },
];

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  maxStreak: number;
  gamesPlayed: Record<string, number>;
  gamesWon: Record<string, number>;
  vocabularyLearned: number;
  mathProblemsSolved: number;
  minutesSpent: number;
  achievements: Achievement[];
  lastActive: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-word', name: 'Primera Palabra', description: 'Aprendiste tu primera palabra en catalán', icon: '🌱', rarity: 'common' },
  { id: 'false-friend-master', name: 'Cazador de Falsos Amigos', description: 'Completaste Caza-Falsos-Amigos sin errores', icon: '🎯', rarity: 'rare' },
  { id: 'math-wizard', name: 'Mago de las Matemáticas', description: 'Resolviste 50 ecuaciones correctamente', icon: '🧙', rarity: 'rare' },
  { id: 'polyglot', name: 'Políglota en Formación', description: 'Alcanzaste racha de 10 en Trilingüe Express', icon: '🌍', rarity: 'epic' },
  { id: 'catalan-explorer', name: 'Explorador Catalán', description: 'Completaste todos los niveles de Catalán Challenge', icon: '🇪🇸', rarity: 'epic' },
  { id: 'super-learner', name: 'Super Estudiante', description: 'Ganaste el Super Quiz Integral', icon: '🏆', rarity: 'legendary' },
  { id: 'streak-7', name: 'Semana Perfecta', description: '7 días consecutivos aprendiendo', icon: '🔥', rarity: 'rare' },
  { id: 'streak-30', name: 'Mes Imparable', description: '30 días consecutivos aprendiendo', icon: '⚡', rarity: 'epic' },
  { id: 'culture-bridge', name: 'Constructor de Puentes', description: 'Completaste 5 puentes culturales', icon: '🌉', rarity: 'rare' },
  { id: 'music-lover', name: 'Amante de la Música', description: 'Analizaste 10 canciones en 4 idiomas', icon: '🎵', rarity: 'common' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language: Language['code'];
  audioUrl?: string;
  timestamp: string;
  metadata?: {
    topic?: string;
    corrections?: { original: string; corrected: string; explanation: string }[];
    vocabulary?: VocabularyItem[];
  };
}

export const SYSTEM_PROMPT = `Eres DANI, el tutor de IA de William Danilo (14 años, brasileño, recién llegado a Cataluña).
Tu objetivo: enseñarle Español, Catalán, Inglés y reforzar Matemáticas/Ciencias de 2º/3º ESO.

REGLAS INQUEBRANTABLES:
1. TRANSFERENCIA LINGÜÍSTICA: Aprovecha su portugués. Señala similitudes y falsos amigos explícitamente.
2. CORRECCIÓN SOCRÁTICA: En mates, NUNCA des la respuesta directa. Guía paso a paso con preguntas.
3. TONO: Juvenil, empático, directo. Usa emojis pedagógicos (🧠 concepto, ⚠️ falso amigo, 🎯 objetivo, 💡 pista).
4. INMERSIÓN PROGRESIVA: Responde mayormente en Español. Introduce 1-2 palabras en Catalán por respuesta. Si se bloquea, usa Portugués de apoyo.
5. FORMATO: Respuestas cortas (máx 3-4 frases). Siempre termina con una pregunta para mantener la interacción.
6. VALIDACIÓN EMOCIONAL: Reconoce el esfuerzo. "Sé que aprender 3 idiomas a la vez es duro, pero tu cerebro de hablante de portugués ya tiene el 80% del camino recorrido."

CONTEXTO PEDAGÓGICO:
- Currículo: Decret 175/2022 (Generalitat de Catalunya) - Competencias 2º/3º ESO
- Metodología: AICLE (Aprendizaje Integrado de Contenidos y Lenguas Extranjeras)
- Filtro Afectivo (Krashen): Mantener ansiedad baja, validar constantemente
- Transferencia Positiva PT-ES-CA: ~89% similitud léxica, gestionar con conciencia contrastiva

VOCABULARIO CLAVE INYECTADO: Usa los falsos amigos, reglas fonéticas, ventajas catalanas y glosarios proporcionados en el contexto.`;
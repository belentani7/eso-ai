'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trophy, RotateCcw, Target, Brain, Zap, Award, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { 
  FALSE_FRIENDS, 
  MATH_VOCABULARY, 
  SCIENCE_VOCABULARY, 
  SCHOOL_VOCABULARY,
  CATALAN_ADVANTAGES,
  CULTURAL_BRIDGES,
  MUSIC_LESSONS,
  shuffleArray, 
  generateId, 
  cn,
  LANGUAGES
} from '@/lib/utils';

interface QuizQuestion {
  id: string;
  type: 'math' | 'false-friend' | 'vocabulary' | 'catalan' | 'culture' | 'music' | 'science' | 'school';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  points: number;
  timeLimit: number;
}

const ALL_QUESTIONS: QuizQuestion[] = [
  // Math questions
  ...[
    { q: 'Si 2x + 5 = 15, ¿cuánto vale x?', opts: ['5', '10', '7.5', '3'], correct: 0, exp: '2x = 15-5 = 10, entonces x = 5', cat: 'Álgebra' },
    { q: 'Resuelve: 3x - 7 = 14', opts: ['7', '5', '6', '8'], correct: 0, exp: '3x = 21, x = 7', cat: 'Álgebra' },
    { q: '¿Cuál es el área de un triángulo de base 10 y altura 6?', opts: ['30', '60', '16', '26'], correct: 0, exp: 'Área = (base × altura) / 2 = 30', cat: 'Geometría' },
    { q: 'Teorema de Pitágoras: a² + b² = ?', opts: ['c²', '2c', 'c', 'a+b'], correct: 0, exp: 'En triángulo rectángulo, la hipotenusa al cuadrado', cat: 'Geometría' },
    { q: 'El 20% de 150 es:', opts: ['30', '25', '35', '20'], correct: 0, exp: '150 × 0.20 = 30', cat: 'Porcentajes' },
  ].map((q, i) => ({
    id: `math-${i}`,
    type: 'math' as const,
    question: q.q,
    options: q.opts,
    correctIndex: q.correct,
    explanation: q.exp,
    category: q.cat,
    points: 15,
    timeLimit: 20,
  })),

  // False friends
  ...FALSE_FRIENDS.slice(0, 5).map((ff, i) => ({
    id: `ff-${i}`,
    type: 'false-friend' as const,
    question: `¿Qué significa "${ff.pt}" en español?`,
    options: [ff.esWrong, ff.esCorrect, 'Ninguna de las anteriores'],
    correctIndex: 1,
    explanation: `¡Cuidado! "${ff.pt}" = "${ff.esCorrect}" (no "${ff.esWrong}")`,
    category: 'Falsos amigos',
    points: 10,
    timeLimit: 15,
  })),

  // Vocabulary
  ...[
    { q: '¿Cómo se dice "Deberes" en catalán?', opts: ['Deures', 'Devers', 'Deurs', 'Deveres'], correct: 0, exp: 'Deberes = Deures en catalán', cat: 'Escolar' },
    { q: '"Examen" en portugués es:', opts: ['Prova', 'Teste', 'Exame', 'Prova/Teste'], correct: 3, exp: 'Se usa tanto "Prova" como "Teste"', cat: 'Escolar' },
    { q: '"Patio/Recreo" en catalán:', opts: ['Pati', 'Patiu', 'Patio', 'Pate'], correct: 0, exp: 'Pati = Patio/Recreo', cat: 'Escolar' },
    { q: '"Biblioteca" en los 4 idiomas:', opts: ['Biblioteca / Biblioteca / Biblioteca / Library', 'Biblioteca / Biblioteca / Llibreria / Library', 'Biblioteca / Biblioteca / Biblioteca / Bibliothèque'], correct: 0, exp: 'Es igual en PT, ES, CA', cat: 'Lugares' },
  ].map((q, i) => ({
    id: `vocab-${i}`,
    type: 'vocabulary' as const,
    question: q.q,
    options: q.opts,
    correctIndex: q.correct,
    explanation: q.exp,
    category: q.cat,
    points: 10,
    timeLimit: 15,
  })),

  // Catalan
  ...CATALAN_ADVANTAGES.slice(0, 3).map((ca, i) => ({
    id: `ca-${i}`,
    type: 'catalan' as const,
    question: ca.feature,
    options: [ca.explanation, 'No tiene relación con portugués', 'Es igual que en español'],
    correctIndex: 0,
    explanation: ca.explanation,
    category: 'Catalán',
    points: 15,
    timeLimit: 20,
  })),

  // Culture
  ...CULTURAL_BRIDGES.slice(0, 2).map((cb, i) => ({
    id: `culture-${i}`,
    type: 'culture' as const,
    question: cb.title,
    options: [cb.description.split('.')[0], 'No hay conexión histórica', 'Solo afecta a Portugal'],
    correctIndex: 0,
    explanation: cb.description,
    category: 'Cultura',
    points: 20,
    timeLimit: 25,
  })),

  // Music
  ...MUSIC_LESSONS.slice(0, 2).map((ml, i) => ({
    id: `music-${i}`,
    type: 'music' as const,
    question: `"${ml.title}" - ${ml.artist}`,
    options: [ml.grammarFocus, 'No tiene enfoque gramatical', 'Solo vocabulario'],
    correctIndex: 0,
    explanation: `${ml.culturalNote} Enfoque: ${ml.grammarFocus}`,
    category: 'Música',
    points: 20,
    timeLimit: 25,
  })),

  // Science
  ...[
    { q: '"Célula" en los 4 idiomas:', opts: ['Célula / Célula / Cèl·lula / Cell', 'Célula / Celula / Celula / Cell', 'Cellula / Célula / Cèl·lula / Cell'], correct: 0, exp: 'Raíz latina común', cat: 'Biología' },
    { q: '"Átomo" en catalán:', opts: ['Àtom', 'Atom', 'Átom', 'Atome'], correct: 0, exp: 'Àtom (con acento grave)', cat: 'Química' },
    { q: '"Energía" en portugués:', opts: ['Energia', 'Enerjia', 'Enérgia', 'Enerjía'], correct: 0, exp: 'Energia (sin tilde)', cat: 'Física' },
  ].map((q, i) => ({
    id: `sci-${i}`,
    type: 'science' as const,
    question: q.q,
    options: q.opts,
    correctIndex: q.correct,
    explanation: q.exp,
    category: q.cat,
    points: 15,
    timeLimit: 20,
  })),

  // School
  ...[
    { q: '"Profesor" en catalán:', opts: ['Professor', 'Profe', 'Mestre', 'Docent'], correct: 0, exp: 'Professor (igual que PT)', cat: 'Escolar' },
    { q: '"Horario" en portugués:', opts: ['Horário', 'Horario', 'Orário', 'Horari'], correct: 0, exp: 'Horário (con acento agudo)', cat: 'Escolar' },
  ].map((q, i) => ({
    id: `school-${i}`,
    type: 'school' as const,
    question: q.q,
    options: q.opts,
    correctIndex: q.correct,
    explanation: q.exp,
    category: q.cat,
    points: 10,
    timeLimit: 15,
  })),
];

interface SuperQuizGameProps {
  onComplete: (won: boolean, score: number) => void;
}

export function SuperQuizGame({ onComplete }: SuperQuizGameProps) {
  const { addXp, learnVocabulary, solveMathProblem } = useAppStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const selected = shuffleArray(ALL_QUESTIONS).slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setCorrectCount(0);
    setCategoryScores({});
    startTimer(selected[0]?.timeLimit || 20);
  }, []);

  const startTimer = useCallback((limit: number) => {
    setTimeLeft(limit);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    if (!timerActive || gameOver || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, gameOver, showResult]);

  const handleTimeout = useCallback(() => {
    if (!questions[currentIndex]) return;
    setShowResult(true);
    setIsCorrect(false);
    setSelectedAnswer(-1);
  }, [questions, currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((index: number) => {
    if (showResult || !currentQuestion) return;
    
    setTimerActive(false);
    const correct = index === currentQuestion.correctIndex;
    setSelectedAnswer(index);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const points = currentQuestion.points;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      addXp(points);
      
      setCategoryScores(prev => ({
        ...prev,
        [currentQuestion.category]: (prev[currentQuestion.category] || 0) + points
      }));
      
      // Learn vocabulary based on question type
      if (currentQuestion.type === 'false-friend') {
        const ff = FALSE_FRIENDS.find(f => f.pt === currentQuestion.question.match(/"([^"]+)"/)?.[1]);
        if (ff) learnVocabulary({
          concept: ff.esCorrect, pt: ff.pt, es: ff.esCorrect, ca: ff.ca, en: ff.en, category: ff.category
        });
      } else if (currentQuestion.type === 'math') {
        solveMathProblem();
      }
    }
  }, [showResult, currentQuestion, addXp, learnVocabulary, solveMathProblem]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      startTimer(questions[currentIndex + 1]?.timeLimit || 20);
    } else {
      setGameOver(true);
      const won = score >= 100;
      onComplete(won, score);
    }
  }, [currentIndex, questions, score, startTimer, onComplete]);

  const handleRestart = useCallback(() => {
    const selected = shuffleArray(ALL_QUESTIONS).slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setCorrectCount(0);
    setCategoryScores({});
    startTimer(selected[0]?.timeLimit || 20);
  }, [startTimer]);

  if (!currentQuestion && !gameOver) return null;

  const typeIcons: Record<string, React.ReactNode> = {
    math: <Calculator className="w-4 h-4" />,
    'false-friend': <Target className="w-4 h-4" />,
    vocabulary: <BookOpen className="w-4 h-4" />,
    catalan: <Flag className="w-4 h-4" />,
    culture: <Globe className="w-4 h-4" />,
    music: <Music className="w-4 h-4" />,
    science: <FlaskConical className="w-4 h-4" />,
    school: <GraduationCap className="w-4 h-4" />,
  };

  const typeColors: Record<string, string> = {
    math: 'from-blue-500 to-cyan-500',
    'false-friend': 'from-red-500 to-pink-500',
    vocabulary: 'from-green-500 to-emerald-500',
    catalan: 'from-yellow-500 to-orange-500',
    culture: 'from-purple-500 to-violet-500',
    music: 'from-pink-500 to-rose-500',
    science: 'from-indigo-500 to-blue-500',
    school: 'from-teal-500 to-cyan-500',
  };

  const progress = ((currentIndex) / questions.length) * 100;

  if (gameOver) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto text-center space-y-6"
      >
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Award className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h3 className="text-3xl font-bold mb-2">{percentage >= 80 ? '¡SUPER ESTUDIANTE!' : percentage >= 60 ? '¡MUY BIEN!' : '¡A SEGUIR PRACTICANDO!'}</h3>
          <p className="text-muted-foreground">Puntuación: {score} | Aciertos: {correctCount}/{questions.length} ({percentage}%)</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600">{score}</div>
            <div className="text-sm text-muted-foreground">Puntos totales</div>
          </div>
          <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
            <div className="text-2xl font-bold text-success-600">{correctCount}</div>
            <div className="text-sm text-muted-foreground">Correctas</div>
          </div>
          <div className="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20">
            <div className="text-2xl font-bold text-warning-600">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Precisión</div>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto text-left">
          <h4 className="font-bold mb-2">Desglose por categorías:</h4>
          {Object.entries(categoryScores).map(([cat, pts]) => (
            <div key={cat} className="flex justify-between text-sm py-1 border-b border-border/50">
              <span>{cat}</span>
              <span className="font-bold text-primary-600">{pts} pts</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleRestart} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Jugar de nuevo
          </Button>
          <Button onClick={() => onComplete(score >= 100, score)} size="lg">
            Volver al menú
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn('bg-gradient-to-r', typeColors[currentQuestion.type])}>
            {typeIcons[currentQuestion.type]}
            {currentQuestion.category}
          </Badge>
          <Badge variant="primary">{currentIndex + 1}/{questions.length}</Badge>
        </div>
        <div className="flex items-center gap-2 text-primary-600">
          <Clock className="w-4 h-4" />
          <span className="font-bold tabular-nums">{timeLeft}s</span>
        </div>
      </div>

      <Progress value={progress} showLabel className="mb-6" size="lg" variant="default" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card className={cn('bg-gradient-to-br', typeColors[currentQuestion.type], 'dark:from-gray-800/50 dark:to-gray-700/50')}>
            <CardContent className="p-8">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white/90 mb-2">{currentQuestion.points} pts</div>
                <p className="text-white/70">Tiempo: {currentQuestion.timeLimit}s</p>
              </div>
              <div className="text-xl font-bold text-white leading-relaxed">{currentQuestion.question}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      'relative p-5 rounded-xl border-2 transition-all duration-200 text-left group text-base',
                      showResult
                        ? index === currentQuestion.correctIndex
                          ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-muted bg-muted/50'
                        : 'border-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all',
                          showResult
                            ? index === currentQuestion.correctIndex
                              ? 'bg-success-500 text-white'
                              : index === selectedAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-muted text-muted-foreground'
                            : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                      
                      <AnimatePresence>
                        {showResult && index === currentQuestion.correctIndex && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-success-500"
                          >
                            <Check className="w-6 h-6" />
                          </motion.div>
                        )}
                        {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                          <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-red-500"
                          >
                            <X className="w-6 h-6" />
                          </motion.div>
                        )}
                        {!showResult && (
                          <Target className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary-500 transition-colors" />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {showResult && (
            <Card className={cn(
              'border-l-4',
              isCorrect ? 'border-success-500 bg-success-50 dark:bg-success-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            )}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', isCorrect ? 'bg-success-500' : 'bg-red-500')}>
                    {isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</h4>
                    <p className="text-muted-foreground mt-1">{currentQuestion.explanation}</p>
                    <Badge variant="primary" className="mt-2">
                      +{currentQuestion.points} XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIndex < questions.length - 1 ? 'Siguiente pregunta →' : 'Ver resultados finales'}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Import missing icons
import { BookOpen, Globe, Music, FlaskConical, GraduationCap } from 'lucide-react';
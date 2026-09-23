'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calculator, Zap, Trophy, RotateCcw, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { generateId, cn, MATH_VOCABULARY, VocabularyItem } from '@/lib/utils';

interface Equation {
  text: string;
  solution: number;
  level: number;
}

interface MateEscapeGameProps {
  onComplete: (won: boolean, score: number) => void;
}

export function MateEscapeGame({ onComplete }: MateEscapeGameProps) {
  const { addXp, solveMathProblem, learnVocabulary } = useAppStore();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const generateEquation = useCallback((lvl: number): Equation => {
    let x: number, a: number, b: number, c: number, text: string;
    
    if (lvl === 1) {
      x = Math.floor(Math.random() * 10) + 1;
      a = Math.floor(Math.random() * 9) + 1;
      b = x + a;
      text = `x + ${a} = ${b}`;
    } else if (lvl === 2) {
      x = Math.floor(Math.random() * 8) + 1;
      a = Math.floor(Math.random() * 4) + 2;
      b = Math.floor(Math.random() * 10) + 1;
      c = a * x + b;
      text = `${a}x + ${b} = ${c}`;
    } else {
      x = Math.floor(Math.random() * 9) + 2;
      a = Math.floor(Math.random() * 5) + 2;
      b = Math.floor(Math.random() * 8) + 1;
      c = a * x - b;
      text = `${a}x - ${b} = ${c}`;
    }
    
    return { text, solution: x, level: lvl };
  }, []);

  useEffect(() => {
    const eq = generateEquation(level);
    setCurrentEquation(eq);
    setUserAnswer('');
    setShowResult(false);
    setTimeLeft(15);
    setTimerActive(true);
  }, [level, generateEquation]);

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
    setShowResult(true);
    setIsCorrect(false);
    setLives(prev => prev - 1);
    setStreak(0);
  }, []);

  const handleSubmit = useCallback(() => {
    if (showResult || !currentEquation || !userAnswer) return;
    
    setTimerActive(false);
    const answer = parseInt(userAnswer);
    const correct = answer === currentEquation.solution;
    
    setShowResult(true);
    setIsCorrect(correct);
    
    if (correct) {
      const points = level * 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(Math.max(maxStreak, newStreak));
        return newStreak;
      });
      addXp(points);
      solveMathProblem();
      
      const vocab = MATH_VOCABULARY[Math.floor(Math.random() * MATH_VOCABULARY.length)];
      learnVocabulary(vocab);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
    }
  }, [showResult, currentEquation, userAnswer, level, streak, maxStreak, addXp, solveMathProblem, learnVocabulary]);

  const handleNext = useCallback(() => {
    if (lives <= 0) {
      setGameOver(true);
      const won = score >= 30;
      onComplete(won, score);
      return;
    }
    
    if (level >= 3 && lives > 0) {
      setGameOver(true);
      onComplete(true, score);
      return;
    }
    
    if (isCorrect) {
      setLevel(prev => prev + 1);
    }
    
    setShowResult(false);
  }, [lives, level, isCorrect, score, onComplete]);

  const handleRestart = useCallback(() => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setGameOver(false);
    setShowResult(false);
    setUserAnswer('');
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      handleSubmit();
    } else if (e.key === 'Enter' && showResult && !gameOver) {
      handleNext();
    }
  };

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto text-center space-y-6"
      >
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h3 className="text-3xl font-bold mb-2">{score >= 50 ? '¡GENIO DE LAS MATEMÁTICAS!' : score >= 30 ? '¡MUY BIEN!' : '¡A SEGUIR PRACTICANDO!'}</h3>
          <p className="text-muted-foreground">Puntuación: {score} | Nivel alcanzado: {level}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-muted-foreground">Puntos</div>
          </div>
          <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
            <div className="text-2xl font-bold text-success-600">{maxStreak}</div>
            <div className="text-sm text-muted-foreground">Mejor racha</div>
          </div>
          <div className="p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20">
            <div className="text-2xl font-bold text-accent-600">{lives}</div>
            <div className="text-sm text-muted-foreground">Vidas</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleRestart} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Jugar de nuevo
          </Button>
          <Button onClick={() => onComplete(score >= 30, score)} size="lg">
            Volver al menú
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Mate-Escape</h2>
          <p className="text-muted-foreground">Resuelve ecuaciones antes de que se agote el tiempo</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="primary">Nivel {level}/3</Badge>
          <div className="flex items-center gap-1 text-red-500">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < lives ? 'text-2xl' : 'text-2xl opacity-20'}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Progress value={timeLeft} max={15} className="flex-1" size="lg" variant={timeLeft <= 5 ? 'danger' : 'primary'} />
        <div className={cn('text-2xl font-bold tabular-nums', timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-primary-600')}>
          {timeLeft}s
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`level-${level}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800/50 dark:to-gray-700/50 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Calculator className="w-4 h-4" />
                Ecuación Nivel {level}
              </div>
              <div className="text-5xl font-display font-bold font-mono gradient-text mb-4 font-mono">{currentEquation?.text}</div>
              <div className="text-muted-foreground">Encuentra el valor de x</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={showResult}
                  autoFocus
                  className="w-full text-center text-4xl font-bold py-6 rounded-xl border-2 bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="?"
                  style={{ fontSize: '3rem' }}
                />
                {!showResult && (
                  <div className="absolute bottom-2 right-4 text-sm text-muted-foreground">Presiona Enter</div>
                )}
              </div>
              
              {!showResult && (
                <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!userAnswer}>
                  <Zap className="w-4 h-4 mr-2" />
                  Verificar
                </Button>
              )}
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
                    <p className="text-muted-foreground mt-1">
                      {isCorrect 
                        ? `¡x = ${currentEquation?.solution}! ${level === 1 ? 'Sumamos/restamos al otro lado' : level === 2 ? 'Despejamos la x paso a paso' : 'Cuidado con los signos'}.`
                        : `La solución era x = ${currentEquation?.solution}. ${currentEquation?.level === 1 ? 'Resta al otro lado' : 'Divide al final'}`
                      }
                    </p>
                    {isCorrect && streak > 1 && (
                      <Badge variant="warning" className="mt-2">
                        <Zap className="w-3 h-3 mr-1" />
                        Racha: {streak} 🔥
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full" size="lg" variant={lives <= 0 || level >= 3 ? 'default' : 'outline'}>
              {lives <= 0 || level >= 3 ? 'Ver resultados' : 'Siguiente nivel →'}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 p-4 rounded-xl bg-muted/50">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Vocabulario matemático clave
        </h4>
        <div className="flex flex-wrap gap-2">
          {MATH_VOCABULARY.slice(0, 6).map((v) => (
            <Badge key={v.concept} variant="outline" className="text-xs">
              {v.es} = {v.pt}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Target, Brain, Zap, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { FALSE_FRIENDS, FalseFriend, getLanguageColor, getLanguageFlag, shuffleArray, generateId, cn } from '@/lib/utils';

interface FalseFriendsGameProps {
  onComplete: (won: boolean, score: number) => void;
}

export function FalseFriendsGame({ onComplete }: FalseFriendsGameProps) {
  const { addXp, learnVocabulary, currentLanguage } = useAppStore();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameWords, setGameWords] = useState<FalseFriend[]>([]);
  const [totalRounds] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const words = shuffleArray(FALSE_FRIENDS).slice(0, totalRounds);
    setGameWords(words);
    setCurrentRound(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
  }, []);

  const currentWord = gameWords[currentRound];
  const progress = ((currentRound) / totalRounds) * 100;

  const handleAnswer = useCallback((answer: 'A' | 'B') => {
    if (showResult || !currentWord) return;
    
    const correct = answer === 'B';
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const newScore = score + 10;
      setScore(newScore);
      addXp(10);
      learnVocabulary({
        concept: currentWord.esCorrect,
        pt: currentWord.pt,
        es: currentWord.esCorrect,
        ca: currentWord.ca,
        en: currentWord.en,
        category: currentWord.category,
      });
    }
  }, [currentWord, score, showResult, addXp, learnVocabulary]);

  const handleNext = useCallback(() => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      const won = score >= 30;
      onComplete(won, score);
    }
  }, [currentRound, totalRounds, score, onComplete]);

  const handleRestart = useCallback(() => {
    const words = shuffleArray(FALSE_FRIENDS).slice(0, totalRounds);
    setGameWords(words);
    setCurrentRound(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
  }, [totalRounds]);

  if (!currentWord && !gameOver) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Caza-Falsos-Amigos</h2>
          <p className="text-muted-foreground">Evita las trampas léxicas entre portugués y español</p>
        </div>
        <Badge variant="primary">{currentRound + 1}/{totalRounds}</Badge>
      </div>

      <Progress value={progress} showLabel className="mb-6" size="lg" variant="primary" />

      <AnimatePresence mode="wait">
        {!gameOver && currentWord && (
          <motion.div
            key={`round-${currentRound}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800/50 dark:to-gray-700/50 border-primary-200/50 dark:border-primary-800/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                  <Brain className="w-4 h-4" />
                  Palabra en portugués
                </div>
                <div className="text-5xl font-display font-bold gradient-text mb-4">{currentWord.pt}</div>
                <div className="text-muted-foreground">Categoría: {currentWord.category}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-center text-muted-foreground">Elige la traducción CORRECTA al español:</p>
                
                <div className="grid gap-3">
                  {[
                    { key: 'A', text: currentWord.esWrong, isTrap: true },
                    { key: 'B', text: currentWord.esCorrect, isTrap: false },
                  ].map((option) => (
                    <motion.button
                      key={option.key}
                      onClick={() => handleAnswer(option.key as 'A' | 'B')}
                      disabled={showResult}
                      className={cn(
                        'relative p-6 rounded-xl border-2 transition-all duration-200 text-left group',
                        showResult
                          ? option.key === 'B'
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                            : option.key === selectedAnswer
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-muted bg-muted/50'
                          : 'border-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                      )}
                      style={{ transform: selectedAnswer === option.key && !showResult ? 'scale(1.02)' : undefined }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all',
                            showResult
                              ? option.key === 'B'
                                ? 'bg-success-500 text-white'
                                : option.key === selectedAnswer
                                ? 'bg-red-500 text-white'
                                : 'bg-muted text-muted-foreground'
                              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          )}>
                            {option.key}
                          </div>
                          <span className="text-lg font-medium">{option.text}</span>
                        </div>
                        
                        <AnimatePresence>
                          {showResult && option.key === 'B' && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-success-500"
                            >
                              <Check className="w-6 h-6" />
                            </motion.div>
                          )}
                          {showResult && option.key === selectedAnswer && option.key !== 'B' && (
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
                      
                      {option.isTrap && (
                        <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          ⚠️ TRAMPA
                        </div>
                      )}
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
                      <h4 className="font-bold text-lg">{isCorrect ? '¡Correcto!' : '¡Cuidado, era una trampa!'} <Zap className="w-5 h-5 inline" /></h4>
                      <p className="text-muted-foreground mt-1">
                        {isCorrect 
                          ? `Perfecto. "${currentWord.pt}" significa "${currentWord.esCorrect}" en español.`
                          : `"${currentWord.esWrong}" es un FALSO AMIGO. "${currentWord.pt}" significa "${currentWord.esCorrect}".`
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          🇪🇸 ES: {currentWord.esCorrect}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300">
                          🏴 CA: {currentWord.ca}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
                          🇬🇧 EN: {currentWord.en}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showResult && (
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentRound < totalRounds - 1 ? 'Siguiente ronda →' : 'Ver resultados'}
              </Button>
            )}
          </motion.div>
        )}

        {gameOver && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2">{score >= 40 ? '¡EXCELENTE!' : score >= 25 ? '¡BIEN!' : '¡A PRACTICAR!'}</h3>
              <p className="text-muted-foreground">Puntuación: {score}/50</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <div className="text-2xl font-bold gradient-text">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
                <div className="text-2xl font-bold text-success-600">{Math.floor(score/10)}</div>
                <div className="text-sm text-muted-foreground">Correctas</div>
              </div>
              <div className="p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                <div className="text-2xl font-bold text-accent-600">{5 - Math.floor(score/10)}</div>
                <div className="text-sm text-muted-foreground">Fallos</div>
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
        )}
      </AnimatePresence>
    </div>
  );
}
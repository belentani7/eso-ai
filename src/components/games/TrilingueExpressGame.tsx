import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Globe, Zap, Trophy, RotateCcw, Target, Brain, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { 
  MATH_VOCABULARY, 
  SCIENCE_VOCABULARY, 
  SCHOOL_VOCABULARY, 
  FALSE_FRIENDS,
  VocabularyItem, 
  shuffleArray, 
  generateId, 
  cn, 
  LANGUAGES 
} from '@/lib/utils';

const VOCABULARY = [...MATH_VOCABULARY, ...SCIENCE_VOCABULARY, ...SCHOOL_VOCABULARY, ...FALSE_FRIENDS];

interface TrilingueExpressGameProps {
  onComplete: (won: boolean, score: number) => void;
}

export function TrilingueExpressGame({ onComplete }: TrilingueExpressGameProps) {
  const { addXp, learnVocabulary, currentLanguage } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWords, setGameWords] = useState<VocabularyItem[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const words = shuffleArray(VOCABULARY).slice(0, 10);
    setGameWords(words);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    generateOptions(words[0]);
  }, []);

  const generateOptions = useCallback((word: VocabularyItem) => {
    const correct = word.es;
    const others = VOCABULARY.filter(v => v.es !== correct).map(v => v.es);
    const shuffled = shuffleArray(others).slice(0, 2);
    const allOptions = shuffleArray([correct, ...shuffled]);
    setOptions(allOptions);
  }, []);

  const currentWord = gameWords[currentIndex];
  const progress = ((currentIndex) / gameWords.length) * 100;

  const handleAnswer = useCallback((index: number) => {
    if (showResult || !currentWord) return;
    
    const correct = options[index] === currentWord.es;
    setSelectedAnswer(index);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const bonus = streak > 0 ? 5 : 0;
      const points = 10 + bonus;
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(Math.max(maxStreak, newStreak));
        return newStreak;
      });
      addXp(points);
      learnVocabulary(currentWord);
    } else {
      setStreak(0);
    }
  }, [currentWord, options, showResult, streak, maxStreak, addXp, learnVocabulary]);

  const handleNext = useCallback(() => {
    if (currentIndex < gameWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      generateOptions(gameWords[currentIndex + 1]);
    } else {
      setGameOver(true);
      const won = score >= 70;
      onComplete(won, score);
    }
  }, [currentIndex, gameWords, score, generateOptions, onComplete]);

  const handleRestart = useCallback(() => {
    const words = shuffleArray(VOCABULARY).slice(0, 10);
    setGameWords(words);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    generateOptions(words[0]);
  }, [generateOptions]);

  if (!currentWord && !gameOver) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Trilingüe Express</h2>
          <p className="text-muted-foreground">Traduce rápido del portugués al español</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary">{currentIndex + 1}/{gameWords.length}</Badge>
          {streak > 0 && (
            <Badge variant="warning" className="animate-pulse">
              <Flame className="w-3 h-3 mr-1" />
              Racha: {streak}
            </Badge>
          )}
        </div>
      </div>

      <Progress value={progress} showLabel className="mb-6" size="lg" variant="primary" />

      <AnimatePresence mode="wait">
        {!gameOver && currentWord && (
          <motion.div
            key={`word-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800/50 dark:to-gray-700/50 border-green-200/50 dark:border-green-800/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                  <Globe className="w-4 h-4" />
                  Portugués → Español
                </div>
                <div className="text-5xl font-display font-bold gradient-text mb-4">{currentWord.pt}</div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>Categoría: {currentWord.category}</span>
                  <span>Concepto: {currentWord.concept}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-center text-muted-foreground">Elige la traducción correcta:</p>
                
                <div className="grid gap-3">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={cn(
                        'relative p-6 rounded-xl border-2 transition-all duration-200 text-left group text-xl font-medium',
                        showResult
                          ? option === currentWord.es
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                            : index === selectedAnswer
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-muted bg-muted/50'
                          : 'border-border hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all',
                            showResult
                              ? option === currentWord.es
                                ? 'bg-success-500 text-white'
                                : index === selectedAnswer
                                ? 'bg-red-500 text-white'
                                : 'bg-muted text-muted-foreground'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          )}>
                            {index + 1}
                          </div>
                          <span>{option}</span>
                        </div>
                        
                        <AnimatePresence>
                          {showResult && option === currentWord.es && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-success-500"
                            >
                              <Check className="w-6 h-6" />
                            </motion.div>
                          )}
                          {showResult && index === selectedAnswer && option !== currentWord.es && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="text-red-500"
                            >
                              <X className="w-6 h-6" />
                            </motion.div>
                          )}
                          {!showResult && (
                            <Target className="w-6 h-6 text-muted-foreground/50 group-hover:text-green-500 transition-colors" />
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
                      <p className="text-muted-foreground mt-1">
                        {isCorrect 
                          ? `Perfecto. "${currentWord.pt}" = "${currentWord.es}"`
                          : `"${currentWord.pt}" significa "${currentWord.es}", no "${options[selectedAnswer!]}"`
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {LANGUAGES.map(lang => {
                          const word = currentWord[lang.code as keyof VocabularyItem] as string;
                          return (
                            <span key={lang.code} className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                              backgroundColor: `${lang.color}20`, 
                              color: lang.color,
                              border: `1px solid ${lang.color}40`
                            }}>
                              {lang.flag} {lang.code.toUpperCase()}: {word}
                            </span>
                          );
                        })}
                      </div>
                      {isCorrect && streak > 1 && (
                        <Badge variant="warning" className="mt-2">
                          <Flame className="w-3 h-3 mr-1" />
                          Racha: {streak} 🔥 +{streak > 1 ? 5 : 0} bonus
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showResult && (
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentIndex < gameWords.length - 1 ? 'Siguiente palabra →' : 'Ver resultados'}
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
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2">{score >= 100 ? '¡POLÍGLOTA NATURAL!' : score >= 70 ? '¡MUY BIEN!' : '¡A SEGUIR PRACTICANDO!'}</h3>
              <p className="text-muted-foreground">Puntuación: {score} | Mejor racha: {maxStreak} 🔥</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
                <div className="text-2xl font-bold text-success-600">{Math.floor(score/10)}</div>
                <div className="text-sm text-muted-foreground">Correctas</div>
              </div>
              <div className="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20">
                <div className="text-2xl font-bold text-warning-600">{maxStreak}</div>
                <div className="text-sm text-muted-foreground">Mejor racha</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Jugar de nuevo
              </Button>
              <Button onClick={() => onComplete(score >= 70, score)} size="lg">
                Volver al menú
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
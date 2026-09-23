'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Flag, Zap, Trophy, RotateCcw, Target, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { CATALAN_ADVANTAGES, CatalanAdvantage, shuffleArray, generateId, cn, LANGUAGES } from '@/lib/utils';

const CATALAN_WORDS = [
  { ca: 'Bon dia', es: 'Buenos días', pt: 'Bom dia', en: 'Good morning', type: 'Saludo' },
  { ca: 'Merci / Gràcies', es: 'Gracias', pt: 'Obrigado', en: 'Thank you', type: 'Cortesía' },
  { ca: 'Si us plau', es: 'Por favor', pt: 'Por favor', en: 'Please', type: 'Cortesía' },
  { ca: 'Adéu', es: 'Adiós', pt: 'Tchau', en: 'Goodbye', type: 'Despedida' },
  { ca: 'Institut', es: 'Instituto', pt: 'Escola/Instituto', en: 'High school', type: 'Educación' },
  { ca: 'Deures', es: 'Deberes', pt: 'Tarefa', en: 'Homework', type: 'Educación' },
  { ca: 'Pati', es: 'Patio', pt: 'Pátio', en: 'Playground', type: 'Escuela' },
  { ca: 'Biblioteca', es: 'Biblioteca', pt: 'Biblioteca', en: 'Library', type: 'Lugar' },
  { ca: 'Menjar', es: 'Comer', pt: 'Comer', en: 'Eat', type: 'Verbo' },
  { ca: 'Beure', es: 'Beber', pt: 'Beber', en: 'Drink', type: 'Verbo' },
  { ca: 'Amic', es: 'Amigo', pt: 'Amigo', en: 'Friend', type: 'Relaciones' },
  { ca: 'Familia', es: 'Familia', pt: 'Família', en: 'Family', type: 'Relaciones' },
  { ca: 'Ciutat', es: 'Ciudad', pt: 'Cidade', en: 'City', type: 'Lugares' },
  { ca: 'Cotxe', es: 'Coche', pt: 'Carro', en: 'Car', type: 'Transporte' },
  { ca: 'Finestra', es: 'Ventana', pt: 'Janela', en: 'Window', type: 'Hogar' },
];

interface CatalanChallengeGameProps {
  onComplete: (won: boolean, score: number) => void;
}

export function CatalanChallengeGame({ onComplete }: CatalanChallengeGameProps) {
  const { addXp, learnVocabulary, currentLanguage } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [showAdvantage, setShowAdvantage] = useState(false);
  const [currentAdvantage, setCurrentAdvantage] = useState<CatalanAdvantage | null>(null);

  useEffect(() => {
    const words = shuffleArray(CATALAN_WORDS).slice(0, 10);
    setGameWords(words);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    generateOptions(words[0]);
    // Show a random advantage at start
    setTimeout(() => {
      const adv = CATALAN_ADVANTAGES[Math.floor(Math.random() * CATALAN_ADVANTAGES.length)];
      setCurrentAdvantage(adv);
      setShowAdvantage(true);
    }, 500);
  }, []);

  const generateOptions = useCallback((word: any) => {
    const correct = word.es;
    const others = CATALAN_WORDS.filter(v => v.es !== correct).map(v => v.es);
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
      setScore(prev => prev + 15);
      addXp(15);
      learnVocabulary({
        concept: currentWord.ca,
        pt: currentWord.pt,
        es: currentWord.es,
        ca: currentWord.ca,
        en: currentWord.en,
        category: currentWord.type,
      });
    }
  }, [currentWord, options, showResult, addXp, learnVocabulary]);

  const handleNext = useCallback(() => {
    setShowAdvantage(false);
    if (currentIndex < gameWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      generateOptions(gameWords[currentIndex + 1]);
      // Show new advantage occasionally
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const adv = CATALAN_ADVANTAGES[Math.floor(Math.random() * CATALAN_ADVANTAGES.length)];
          setCurrentAdvantage(adv);
          setShowAdvantage(true);
        }, 800);
      }
    } else {
      setGameOver(true);
      const won = score >= 100;
      onComplete(won, score);
    }
  }, [currentIndex, gameWords, score, generateOptions, onComplete]);

  const handleRestart = useCallback(() => {
    const words = shuffleArray(CATALAN_WORDS).slice(0, 10);
    setGameWords(words);
    setCurrentIndex(0);
    setScore(0);
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
          <h2 className="text-2xl font-bold gradient-text">Catalán Challenge</h2>
          <p className="text-muted-foreground">Aprende catalán usando tu portugués como puente</p>
        </div>
        <Badge variant="secondary">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <Progress value={progress} showLabel className="mb-6" size="lg" variant="secondary" />

      <AnimatePresence mode="wait">
        {showAdvantage && currentAdvantage && (
          <motion.div
            key="advantage"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6"
            onClick={() => setShowAdvantage(false)}
          >
            <Card className="border-yellow-300 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      ¡Ventaja para ti!
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">{currentAdvantage.explanation}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="px-2 py-1 rounded bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                        PT: {currentAdvantage.ptExample}
                      </span>
                      <span className="px-2 py-1 rounded bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                        CA: {currentAdvantage.caExample}
                      </span>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Haz clic para continuar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!gameOver && currentWord && !showAdvantage && (
          <motion.div
            key={`word-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-700/50 border-yellow-200/50 dark:border-yellow-800/50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-4">
                  <Flag className="w-4 h-4" />
                  Catalán → Español
                </div>
                <div className="text-5xl font-display font-bold gradient-text mb-4">{currentWord.ca}</div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>Pista PT: {currentWord.pt}</span>
                  <span>Tipo: {currentWord.type}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-center text-muted-foreground">Elige la traducción al español:</p>
                
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
                          : 'border-border hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10'
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
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
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
                            <Target className="w-6 h-6 text-muted-foreground/50 group-hover:text-yellow-500 transition-colors" />
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
                          ? `¡Bien! "${currentWord.ca}" = "${currentWord.es}"`
                          : `"${currentWord.ca}" significa "${currentWord.es}", no "${options[selectedAnswer!]}"`
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {LANGUAGES.map(lang => {
                          const key = lang.code === 'ca' ? 'ca' : lang.code === 'pt' ? 'pt' : lang.code === 'es' ? 'es' : 'en';
                          const word = currentWord[key];
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showResult && (
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentIndex < gameWords.length - 1 ? 'Siguiente →' : 'Ver resultados'}
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
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2">{score >= 130 ? '¡DOMINAS EL CATALÁN BÁSICO!' : score >= 100 ? '¡BIEN!' : '¡A SEGUIR PRACTICANDO!'}</h3>
              <p className="text-muted-foreground">Puntuación: {score}/150</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <div className="text-2xl font-bold text-yellow-600">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div className="p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
                <div className="text-2xl font-bold text-success-600">{Math.floor(score/15)}</div>
                <div className="text-sm text-muted-foreground">Correctas</div>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <div className="text-2xl font-bold text-orange-600">{10 - Math.floor(score/15)}</div>
                <div className="text-sm text-muted-foreground">Fallos</div>
              </div>
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
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { GAMES, getGameComponent } from '../../../components/games';
import { Gamepad2, Trophy, Zap, Target, Globe, Award, Star, Lock } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { useAppStore } from '../../../lib/store';
import { cn, getXpProgress, calculateLevel } from '../../../lib/utils';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../../../data';

export default function GamesPage() {
  const { progress } = useAppStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const currentLevel = calculateLevel(progress.xp);

  const getGameProgress = (gameId: string) => {
    const played = progress.gamesPlayed[gameId] || 0;
    const won = progress.gamesWon[gameId] || 0;
    return { played, won, winRate: played > 0 ? Math.round((won / played) * 100) : 0 };
  };

  const isUnlocked = (game: typeof GAMES[0]) => {
    if (game.id === 'super-quiz') return currentLevel >= 3;
    return true;
  };

  if (selectedGame) {
    const GameComponent = getGameComponent(selectedGame);
    const gameInfo = GAMES.find(g => g.id === selectedGame);
    
    if (!GameComponent || !gameInfo) return null;

    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setSelectedGame(null)} className="mb-4">
            <span>{'\u2190'}</span> Volver a juegos
          </Button>
          <GameComponent onComplete={(won, score) => setSelectedGame(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">Juegos Educativos</h1>
              <p className="text-muted-foreground">Aprende jugando. Cada partida te da XP y desbloquea logros.</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="primary" className="px-3 py-1.5">
                <Star className="w-3 h-3 mr-1" />
                {progress.xp} XP total
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                <Trophy className="w-3 h-3 mr-1" />
                Nivel {currentLevel}
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800/50 dark:to-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">Progreso general</p>
                  <p className="text-sm text-muted-foreground">
                    {Object.values(progress.gamesPlayed).reduce((a, b) => a + b, 0)} partidas · 
                    {Object.values(progress.gamesWon).reduce((a, b) => a + b, 0)} victorias · 
                    {progress.achievements.filter(a => a.unlockedAt).length}/{ACHIEVEMENTS.length} logros
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold gradient-text">{progress.xp} XP</p>
                  <p className="text-sm text-muted-foreground">Próximo nivel: {getXpProgress(progress.xp).next - getXpProgress(progress.xp).current} XP</p>
                </div>
              </div>
              <Progress value={getXpProgress(progress.xp).progress} size="lg" variant="primary" />
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, index) => {
            const gameProgress = getGameProgress(game.id);
            const unlocked = isUnlocked(game);
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
                    !unlocked && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => unlocked && setSelectedGame(game.id)}
                >
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br',
                    game.color
                  )} />
                  
                  <div className="relative p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-2xl', game.color.replace('from-', 'bg-').replace(' to-', ''))}>
                        {game.icon}
                      </div>
                      <Badge variant={gameProgress.played > 0 ? 'success' : 'outline'} className="text-xs">
                        {gameProgress.played > 0 ? `${gameProgress.winRate}%` : 'Nuevo'}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">{game.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {game.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-white/30 text-white/90" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <span className="px-2 py-0.5 rounded bg-white/10">{game.difficulty}</span>
                        <span className="px-2 py-0.5 rounded bg-white/10">+{game.id === 'super-quiz' ? '20' : '10-15'} XP/partida</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      {unlocked ? (
                        <Button className="w-full" variant="outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Jugar ahora
                        </Button>
                      ) : (
                        <Button className="w-full" variant="outline" disabled style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' }}>
                          <Lock className="w-4 h-4 mr-2" />
                          Nivel 3 requerido
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats overlay */}
                  {gameProgress.played > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm border-t border-white/10">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-white font-bold">{gameProgress.played}</p>
                          <p className="text-xs text-white/60">Jugadas</p>
                        </div>
                        <div>
                          <p className="text-white font-bold">{gameProgress.won}</p>
                          <p className="text-xs text-white/60">Ganadas</p>
                        </div>
                        <div>
                          <p className="text-white font-bold">{gameProgress.winRate}%</p>
                          <p className="text-xs text-white/60">Exito</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-500" />
              Consejos para maximizar tu aprendizaje
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <p className="font-medium text-primary-700 dark:text-primary-300">Falsos Amigos</p>
                <p className="text-muted-foreground">Juega diario 5 min. Evita errores vergonzosos.</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="font-medium text-blue-700 dark:text-blue-300">Mate-Escape</p>
                <p className="text-muted-foreground">Resuelve en voz alta. DANI te guia paso a paso.</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <p className="font-medium text-green-700 dark:text-green-300">Trilingue</p>
                <p className="text-muted-foreground">Construye rachas. +5 XP por racha > 1.</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <p className="font-medium text-yellow-700 dark:text-yellow-300">Super Quiz</p>
                <p className="text-muted-foreground">Desbloquea en nivel 3. Reto completo semanal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
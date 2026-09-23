'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BarChart3, Trophy, Star, Zap, Flame, Target, 
  Brain, BookOpen, Globe, Calculator, Music, Flag,
  TrendingUp, Award, Clock, CheckCircle, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { ACHIEVEMENTS, calculateLevel, getXpProgress, xpForNextLevel } from '@/lib/utils';
import { GAMES } from '@/data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

export default function ProgressPage() {
  const { progress } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const currentLevel = calculateLevel(progress.xp);
  const xpProgress = getXpProgress(progress.xp);
  const nextLevelXp = xpForNextLevel(currentLevel + 1);
  const currentLevelXp = xpForNextLevel(currentLevel);

  const totalGames = Object.values(progress.gamesPlayed).reduce((a, b) => a + b, 0);
  const totalWins = Object.values(progress.gamesWon).reduce((a, b) => a + b, 0);
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  const unlockedAchievements = progress.achievements.filter(a => a.unlockedAt).length;

  // Mock weekly data for charts
  const weeklyData = [
    { day: 'Lun', xp: 120, games: 3, vocab: 15 },
    { day: 'Mar', xp: 80, games: 2, vocab: 10 },
    { day: 'Mié', xp: 200, games: 5, vocab: 25 },
    { day: 'Jue', xp: 150, games: 4, vocab: 18 },
    { day: 'Vie', xp: 300, games: 6, vocab: 30 },
    { day: 'Sáb', xp: 50, games: 1, vocab: 5 },
    { day: 'Dom', xp: 30, games: 1, vocab: 3 },
  ];

  const categoryData = [
    { name: 'Mates', value: progress.mathProblemsSolved * 10, color: '#6366f1' },
    { name: 'Vocabulario', value: progress.vocabularyLearned * 5, color: '#22c55e' },
    { name: 'Juegos', value: totalGames * 15, color: '#f97316' },
    { name: 'Idiomas', value: progress.xp - (progress.mathProblemsSolved * 10) - (progress.vocabularyLearned * 5), color: '#ec4899' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">Tu Progreso</h1>
              <p className="text-muted-foreground">Estadísticas, logros y evolución de tu aprendizaje</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                <Star className="w-5 h-5" />
                <span className="font-bold text-lg">{progress.xp}</span>
                <span className="text-xs opacity-80">XP Total</span>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
              icon={Trophy} 
              value={currentLevel} 
              label="Nivel Actual" 
              color="from-yellow-500 to-orange-500"
              trend="+1 esta semana"
            />
            <StatCard 
              icon={Zap} 
              value={progress.xp} 
              label="XP Total" 
              color="from-purple-500 to-pink-500"
              trend={`${xpProgress.next - xpProgress.current} para siguiente`}
            />
            <StatCard 
              icon={Flame} 
              value={progress.streak} 
              label="Racha Actual" 
              color="from-red-500 to-rose-500"
              trend={`Máx: ${progress.maxStreak}`}
            />
            <StatCard 
              icon={Target} 
              value={`${winRate}%`} 
              label="Tasa de Éxito" 
              color="from-green-500 to-emerald-500"
              trend={`${totalWins}/${totalGames} partidas`}
            />
            <StatCard 
              icon={Award} 
              value={`${unlockedAchievements}/${ACHIEVEMENTS.length}`} 
              label="Logros" 
              color="from-blue-500 to-cyan-500"
              trend={`${ACHIEVEMENTS.length - unlockedAchievements} por desbloquear`}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabTrigger value="overview">Resumen</TabTrigger>
            <TabTrigger value="charts">Gráficos</TabTrigger>
            <TabTrigger value="achievements">Logros</TabTrigger>
            <TabTrigger value="details">Detalles</TabTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-warning-500" />
                        Progreso de Nivel
                      </span>
                      <Badge variant="primary">Nivel {currentLevel}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">XP actual: {xpProgress.current} / {xpProgress.next}</span>
                      <span className="font-bold gradient-text">{xpProgress.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={xpProgress.progress} size="lg" variant="primary" />
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                        <p className="text-2xl font-bold gradient-text">{xpProgress.current}</p>
                        <p className="text-xs text-muted-foreground">XP en este nivel</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary-50 dark:bg-secondary-900/20">
                        <p className="text-2xl font-bold text-secondary-600">{xpProgress.next - xpProgress.current}</p>
                        <p className="text-xs text-muted-foreground">Para siguiente nivel</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                        <p className="text-2xl font-bold text-accent-600">{nextLevelXp}</p>
                        <p className="text-xs text-muted-foreground">XP total nivel {currentLevel + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Actividad Semanal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGames" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                          formatter={(value: number, name: string) => [value, name === 'xp' ? 'XP' : name === 'games' ? 'Partidas' : 'Vocabulario']}
                        />
                        <Area type="monotone" dataKey="xp" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorXp)" />
                        <Area type="monotone" dataKey="games" stroke="#f97316" fillOpacity={1} fill="url(#colorGames)" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-primary-500" />
                        XP ganados
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-accent-500" />
                        Partidas
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Side Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-indigo-500" />
                      Habilidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <SkillBar label="Vocabulario" value={Math.min(100, progress.vocabularyLearned * 2)} color="green" />
                    <SkillBar label="Matemáticas" value={Math.min(100, progress.mathProblemsSolved * 3)} color="indigo" />
                    <SkillBar label="Comprensión oral" value={Math.min(100, currentLevel * 15)} color="blue" />
                    <SkillBar label="Expresión escrita" value={Math.min(100, progress.vocabularyLearned + currentLevel * 5)} color="purple" />
                    <SkillBar label="Catalán" value={Math.min(100, progress.gamesPlayed['catalan-challenge'] ? progress.gamesPlayed['catalan-challenge'] * 10 : 20)} color="yellow" />
                    <SkillBar label="Inglés" value={Math.min(100, progress.gamesPlayed['trilingue-express'] ? progress.gamesPlayed['trilingue-express'] * 8 : 15)} color="cyan" />
                  </CardContent>
                </Card>

                {/* Time Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Tiempo de Estudio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-2xl font-bold text-blue-600">{progress.minutesSpent}</p>
                        <p className="text-xs text-muted-foreground">Minutos totales</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                        <p className="text-2xl font-bold text-green-600">{Math.round(progress.minutesSpent / 60 * 10) / 10}h</p>
                        <p className="text-xs text-muted-foreground">Horas totales</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                        <p className="text-2xl font-bold text-purple-600">{progress.streak}</p>
                        <p className="text-xs text-muted-foreground">Días seguidos</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-warning-50 dark:bg-warning-900/20">
                        <p className="text-2xl font-bold text-warning-600">{progress.maxStreak}</p>
                        <p className="text-xs text-muted-foreground">Mejor racha</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabContent>

          {/* Charts Tab */}
          <TabContent value="charts">
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    XP por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Evolución XP (últimas 7 semanas)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData.map((d, i) => ({ ...d, week: `Sem ${i+1}` }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="xp" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    Rendimiento por Juego
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {GAMES.map(game => {
                      const played = progress.gamesPlayed[game.id] || 0;
                      const won = progress.gamesWon[game.id] || 0;
                      const rate = played > 0 ? Math.round((won / played) * 100) : 0;
                      return (
                        <div key={game.id} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: game.color.replace('from-', '').replace(' to-', ', ') }}>
                            {game.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{game.name}</span>
                              <span className="text-muted-foreground">{rate}% éxito</span>
                            </div>
                            <Progress value={rate} size="sm" />
                            <p className="text-xs text-muted-foreground mt-1">{played} partidas · {won} victorias</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Vocabulario por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Matemáticas', count: MATH_VOCABULARY.length, learned: Math.min(MATH_VOCABULARY.length, Math.floor(progress.vocabularyLearned * 0.3)), color: 'indigo' },
                      { name: 'Ciencias', count: SCIENCE_VOCABULARY.length, learned: Math.min(SCIENCE_VOCABULARY.length, Math.floor(progress.vocabularyLearned * 0.2)), color: 'green' },
                      { name: 'Escolar', count: SCHOOL_VOCABULARY.length, learned: Math.min(SCHOOL_VOCABULARY.length, Math.floor(progress.vocabularyLearned * 0.25)), color: 'blue' },
                      { name: 'Falsos Amigos', count: FALSE_FRIENDS.length, learned: Math.min(FALSE_FRIENDS.length, Math.floor(progress.vocabularyLearned * 0.15)), color: 'red' },
                    ].map(cat => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <Badge variant="outline" className="w-32 text-xs" style={{ borderColor: `${cat.color}60`, color: cat.color }}>
                          {cat.name}
                        </Badge>
                        <Progress value={(cat.learned / cat.count) * 100} className="flex-1" size="sm" variant={cat.color as any} />
                        <span className="text-sm font-medium w-20 text-right">{cat.learned}/{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabContent>

          {/* Achievements Tab */}
          <TabContent value="achievements">
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Logros Desbloqueados: {unlockedAchievements} / {ACHIEVEMENTS.length}</h2>
                  <p className="text-muted-foreground">Completa desafíos para ganar XP extra y insignias</p>
                </div>
                <Progress value={(unlockedAchievements / ACHIEVEMENTS.length) * 100} className="w-48" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'relative p-4 rounded-xl border transition-all',
                      achievement.unlockedAt
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 dark:border-yellow-800/50'
                        : 'bg-muted/30 border-border/50 opacity-60'
                    )}
                  >
                    {achievement.rarity === 'legendary' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ★
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                        achievement.unlockedAt
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                          : 'bg-muted/50'
                      )}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{achievement.name}</h4>
                          <Badge variant="outline" className="text-xs" style={{ 
                            borderColor: `${getRarityColor(achievement.rarity)}60`,
                            color: getRarityColor(achievement.rarity).replace('text-', '')
                          }}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-success-600 dark:text-success-400 mt-2">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {!achievement.unlockedAt && (
                          <Button variant="outline" size="sm" className="mt-2" disabled>
                            <Lock className="w-3 h-3 mr-1" />
                            Bloqueado
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {achievement.unlockedAt && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-2 right-2 text-yellow-500"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </TabContent>

          {/* Details Tab */}
          <TabContent value="details">
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Vocabulario Aprendido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[
                      { category: 'Matemáticas', vocab: MATH_VOCABULARY },
                      { category: 'Ciencias', vocab: SCIENCE_VOCABULARY },
                      { category: 'Escolar', vocab: SCHOOL_VOCABULARY },
                    ].map(({ category, vocab }) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{category}</Badge>
                          <span className="text-sm text-muted-foreground">{vocab.length} términos</span>
                        </h4>
                        <div className="flex flex-wrap gap-1 ml-6">
                          {vocab.slice(0, 8).map((v, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {v.es} = {v.pt}
                            </Badge>
                          ))}
                          {vocab.length > 8 && (
                            <Badge variant="outline" className="text-xs">+{vocab.length - 8} más</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Objetivos Semanales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Partidas jugadas', current: totalGames, target: 10, icon: Gamepad2, color: 'purple' },
                    { label: 'Palabras aprendidas', current: progress.vocabularyLearned, target: 50, icon: BookOpen, color: 'green' },
                    { label: 'Problemas de mates', current: progress.mathProblemsSolved, target: 20, icon: Calculator, color: 'indigo' },
                    { label: 'Minutos de estudio', current: progress.minutesSpent, target: 180, icon: Clock, color: 'blue' },
                    { label: 'Días consecutivos', current: progress.streak, target: 7, icon: Flame, color: 'red' },
                    { label: 'Logros desbloqueados', current: unlockedAchievements, target: 3, icon: Trophy, color: 'yellow' },
                  ].map((goal, i) => (
                    <motion.div
                      key={goal.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <goal.icon className={cn('w-4 h-4', `text-${goal.color}-500`)} />
                          <span className="text-sm font-medium">{goal.label}</span>
                        </div>
                        <span className="text-sm font-bold">{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={Math.min(100, (goal.current / goal.target) * 100)} size="sm" variant={goal.color as any} />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {goal.current >= goal.target ? '✅ Completado' : `${goal.target - goal.current} restantes`}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, value, label, color, trend }: { 
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  color: string;
  trend: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-4 rounded-2xl bg-card border border-border/50 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br" style={{ background: color, opacity: 0.05 }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color, opacity: 0.15 }}>
          <Icon className="w-6 h-6" style={{ color: color.split(' ')[0].replace('from-', '') }} />
        </div>
      </div>
    </motion.div>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <Progress value={value} size="sm" variant={color as any} />
    </div>
  );
}

function Cell({ fill, children }: { fill: string; children?: React.ReactNode }) {
  return <rect fill={fill} />;
}

// Import missing icons
import { Gamepad2 } from 'lucide-react';
import { getRarityColor } from '@/lib/utils';
'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Music, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward,
  Heart, Star, Globe, Brain, Zap, BookOpen, CheckCircle, 
  Mic, MicOff, Activity, ListMusic, Repeat, Shuffle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { MUSIC_LESSONS, MusicLesson, LANGUAGES, VocabularyItem } from '@/data';
import { cn, getLanguageFlag, getLanguageColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AudioPlayerState {
  playing: boolean;
  currentLesson: MusicLesson | null;
  progress: number;
  duration: number;
  volume: number;
}

export default function MusicPage() {
  const { progress, addXp, learnVocabulary } = useAppStore();
  const [activeTab, setActiveTab] = useState('lessons');
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    playing: false,
    currentLesson: null,
    progress: 0,
    duration: 0,
    volume: 0.7,
  });
  const [lyricsView, setLyricsView] = useState<'all' | 'target' | 'comparison'>('comparison');
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const tabs = [
    { id: 'lessons', name: 'Lecciones', icon: ListMusic },
    { id: 'practice', name: 'PrÃ¡ctica', icon: Mic },
    { id: 'progress', name: 'Progreso', icon: TrendingUp },
  ];

  const handlePlayLesson = (lesson: MusicLesson) => {
    if (playerState.currentLesson?.id === lesson.id && playerState.playing) {
      pauseAudio();
    } else {
      playLesson(lesson);
    }
  };

  const playLesson = (lesson: MusicLesson) => {
    // In a real app, this would load actual audio files
    // For demo, we simulate playback
    setPlayerState({
      playing: true,
      currentLesson: lesson,
      progress: 0,
      duration: 180, // 3 minutes default
      volume: 0.7,
    });
    
    // Simulate progress
    progressIntervalRef.current = setInterval(() => {
      setPlayerState(prev => {
        if (prev.progress >= prev.duration) {
          clearInterval(progressIntervalRef.current);
          return { ...prev, playing: false, progress: 0 };
        }
        return { ...prev, progress: prev.progress + 1 };
      });
    }, 1000);
    
    addXp(20);
    learnVocabulary({
      concept: lesson.title,
      pt: lesson.lyrics.pt || '',
      es: lesson.lyrics.es || '',
      ca: lesson.lyrics.ca || '',
      en: lesson.lyrics.en || '',
      category: 'MÃºsica',
    });
  };

  const pauseAudio = () => {
    setPlayerState(prev => ({ ...prev, playing: false }));
    clearInterval(progressIntervalRef.current);
  };

  const handleProgressChange = (value: number) => {
    setPlayerState(prev => ({ ...prev, progress: value }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => clearInterval(progressIntervalRef.current);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">MÃºsica para Aprender</h1>
              <p className="text-muted-foreground">
                Canciones en 4 idiomas. Analiza letras, aprende vocabulario y gramÃ¡tica con ritmo.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="px-3 py-1.5">
                <Music className="w-3 h-3 mr-1" />
                {MUSIC_LESSONS.length} canciones
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                <Globe className="w-3 h-3 mr-1" />
                4 idiomas
              </Badge>
            </div>
          </div>

          {/* Global Player */}
          {playerState.currentLesson && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:static p-4 bg-card/95 backdrop-blur-xl border-t border-border/50"
            >
              <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                      <Music className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{playerState.currentLesson.title}</p>
                      <p className="text-sm text-muted-foreground">{playerState.currentLesson.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatTime(playerState.progress)} / {formatTime(playerState.duration)}
                      </span>
                      <Progress 
                        value={(playerState.progress / playerState.duration) * 100} 
                        className="w-48" 
                        size="sm"
                        onClick={(e) => {
                          const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          handleProgressChange(percent * playerState.duration);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleProgressChange(Math.max(0, playerState.progress - 10))}>
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="default" 
                        size="icon" 
                        className="w-10 h-10 rounded-full"
                        onClick={() => playerState.playing ? pauseAudio() : playLesson(playerState.currentLesson!)}
                      >
                        {playerState.playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleProgressChange(Math.min(playerState.duration, playerState.progress + 10))}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setPlayerState({...playerState, currentLesson: null, playing: false})}>
                      <VolumeX className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lessons" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 gap-1">
            {tabs.map(tab => (
              <TabTrigger key={tab.id} value={tab.id}>
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </TabTrigger>
            ))}
          </TabsList>

          {/* Lessons Tab */}
          <TabContent value="lessons">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {MUSIC_LESSONS.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden hover:shadow-xl transition-all">
                    <div className="aspect-video bg-gradient-to-br relative" style={{ background: lesson.language === 'pt' ? 'linear-gradient(135deg, #009C3B, #006B2A)' : lesson.language === 'es' ? 'linear-gradient(135deg, #AA151B, #7A0F12)' : lesson.language === 'ca' ? 'linear-gradient(135deg, #FFCD00, #E6B800)' : 'linear-gradient(135deg, #00247D, #001A5C)' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          variant="default" 
                          size="xl"
                          onClick={() => handlePlayLesson(lesson)}
                          className={cn(
                            'bg-white/20 backdrop-blur-sm border-white/30 text-white',
                            playerState.currentLesson?.id === lesson.id && playerState.playing && 'ring-2 ring-white'
                          )}
                        >
                          {playerState.currentLesson?.id === lesson.id && playerState.playing ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs border-white/30 text-white" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                            {getLanguageFlag(lesson.language)} {LANGUAGES.find(l => l.code === lesson.language)?.nativeName}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <Star className="w-4 h-4 text-yellow-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-bold">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.artist}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {lesson.vocabulary.slice(0, 4).map((v, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {v.es} = {v.pt}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Enfoque gramatical:</p>
                        <p className="text-sm">{lesson.grammarFocus}</p>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={playerState.currentLesson?.id === lesson.id ? 'default' : 'outline'}
                        onClick={() => handlePlayLesson(lesson)}
                      >
                        {playerState.currentLesson?.id === lesson.id && playerState.playing ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Reproduciendo...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Practicar esta canciÃ³n
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabContent>

          {/* Practice Tab */}
          <TabContent value="practice">
            <div className="mt-6 space-y-6">
              {/* Karaoke Mode */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-purple-500" />
                    Modo Karaoke Interactivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Canta junto con la letra en 4 idiomas. La IA evalÃºa tu pronunciaciÃ³n y fluidez.
                  </p>
                  
                  <div className="grid md:grid-cols-4 gap-3">
                    {LANGUAGES.map(lang => (
                      <Button 
                        key={lang.code}
                        variant="outline"
                        className={cn('flex flex-col items-center gap-2', lyricsView === lang.code && 'bg-primary-500 text-white border-primary-500')}
                        onClick={() => setLyricsView(lang.code as any)}
                        style={{ borderColor: `${lang.color}60` }}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.nativeName}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-center text-muted-foreground">
                      Selecciona una canciÃ³n en la pestaÃ±a "Lecciones" y elige el idioma para ver la letra sincronizada.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pronunciation Practice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    PrÃ¡ctica de PronunciaciÃ³n
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Repite frases clave de las canciones. DANI te corrige la entonaciÃ³n y acento.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {MUSIC_LESSONS.flatMap(lesson => 
                      lesson.vocabulary.slice(0, 2).map((v, i) => (
                        <div key={`${lesson.id}-${i}`} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{v.es}</span>
                            <Badge variant="outline" className="text-xs" style={{ borderColor: `${getLanguageColor(lesson.language)}60` }}>
                              {getLanguageFlag(lesson.language)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                            {LANGUAGES.map(l => (
                              <span key={l.code} className="px-2 py-1 rounded bg-muted" style={{ color: l.color }}>
                                {l.flag} {v[l.code as keyof VocabularyItem] as string}
                              </span>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            <Mic className="w-4 h-4 mr-1" />
                            Grabar y comparar
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Grammar from Lyrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    GramÃ¡tica en las Letras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MUSIC_LESSONS.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getLanguageFlag(lesson.language)}</span>
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">{lesson.grammarFocus}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.culturalNote}</p>
                        <Button variant="outline" size="sm" onClick={() => handlePlayLesson(lesson)}>
                          <Play className="w-4 h-4 mr-1" />
                          Analizar con DANI
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabContent>

          {/* Progress Tab */}
          <TabContent value="progress">
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tu Progreso Musical
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Music} value={MUSIC_LESSONS.length} label="Canciones disponibles" color="purple" />
                    <StatCard icon={Heart} value={progress.achievements.filter(a => a.id === 'music-lover' && a.unlockedAt).length > 0 ? 'SÃ­' : 'No'} label="Amante de la MÃºsica" color="red" />
                    <StatCard icon={Star} value={progress.xp} label="XP de mÃºsica" color="yellow" />
                    <StatCard icon={BookOpen} value={MUSIC_LESSONS.flatMap(l => l.vocabulary).length} label="Palabras en canciones" color="blue" />
                  </div>

                  <div className="space-y-4">
                    {MUSIC_LESSONS.map((lesson, index) => {
                      const learned = lesson.vocabulary.filter(v => 
                        // Simplified check - in real app would track per-song progress
                        progress.vocabularyLearned > index * 2
                      ).length;
                      const total = lesson.vocabulary.length;
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{getLanguageFlag(lesson.language)}</span>
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-sm text-muted-foreground">{lesson.artist}</p>
                              </div>
                            </div>
                            <Badge variant={learned >= total ? 'success' : 'outline'}>
                              {learned}/{total} palabras
                            </Badge>
                          </div>
                          <Progress value={(learned / total) * 100} size="sm" />
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <Button variant="ghost" size="sm" onClick={() => handlePlayLesson(lesson)}>
                              <Play className="w-3 h-3 mr-1" />
                              Repasar
                            </Button>
                            <span>+{20 + learned * 2} XP disponible</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Path */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Ruta Recomendada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { step: 1, title: 'Empieza con "Imagine"', desc: 'InglÃ©s simple, mensaje universal, vocabulario bÃ¡sico', xp: 30 },
                    { step: 2, title: 'Luego "Ãguas de MarÃ§o"', desc: 'PortuguÃ©s nativo, vocabulario naturaleza, ritmo bossa nova', xp: 40 },
                    { step: 3, title: 'DespuÃ©s "La Llorona"', desc: 'EspaÃ±ol emotivo, subjuntivo, cultura mexicana', xp: 40 },
                    { step: 4, title: 'Termina con "Boig per Tu"', desc: 'CatalÃ¡n rock, reflexivos, cultura barcelonesa', xp: 50 },
                  ].map((step) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.step * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                      <Badge variant="primary">+{step.xp} XP</Badge>
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

function StatCard({ icon: Icon, value, label, color }: { 
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: color }} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

import { TrendingUp } from 'lucide-react';

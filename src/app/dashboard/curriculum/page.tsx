'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BookOpen, Globe, Calculator, FlaskConical, Map, 
  Clock, Target, CheckCircle, AlertCircle, Loader2,
  Brain, Zap, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { 
  MATH_VOCABULARY, SCIENCE_VOCABULARY, SCHOOL_VOCABULARY,
  PHONETIC_RULES, CATALAN_ADVANTAGES, FALSE_FRIENDS,
  LANGUAGES
} from '@/data';
import { cn, calculateLevel, getXpProgress } from '@/lib/utils';
import { motion } from 'framer-motion';

const subjects = [
  {
    id: 'espanol',
    name: 'Español (L2)',
    icon: BookOpen,
    color: 'from-red-500 to-rose-500',
    level: 'A2 → B1',
    topics: [
      { name: 'Falsos amigos críticos', vocab: FALSE_FRIENDS.slice(0, 10), xp: 50 },
      { name: 'Fonética contrastiva PT-ES', vocab: PHONETIC_RULES, xp: 40 },
      { name: 'Gramática: Ser/Estar, Pasados', vocab: [], xp: 60 },
      { name: 'Vocabulario escolar', vocab: SCHOOL_VOCABULARY, xp: 40 },
      { name: 'Expresión oral y escrita', vocab: [], xp: 50 },
    ]
  },
  {
    id: 'catalan',
    name: 'Catalán (L3)',
    icon: Globe,
    color: 'from-yellow-500 to-orange-500',
    level: 'A1 → A2',
    topics: [
      { name: 'Ventajas fonéticas PT-CA', vocab: CATALAN_ADVANTAGES, xp: 40 },
      { name: 'Parla.cat A1: Saludos, básico', vocab: [], xp: 50 },
      { name: 'Vocabulario del instituto', vocab: SCHOOL_VOCABULARY, xp: 40 },
      { name: 'Artículos, pronombres, verbos', vocab: [], xp: 50 },
      { name: 'Inmersión diaria 15 min', vocab: [], xp: 30 },
    ]
  },
  {
    id: 'ingles',
    name: 'Inglés (L4)',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    level: 'A2 → B1',
    topics: [
      { name: 'Transferencia metalingüística', vocab: [], xp: 40 },
      { name: 'Present Perfect vs Pasados', vocab: [], xp: 50 },
      { name: 'Vocabulario científico', vocab: SCIENCE_VOCABULARY, xp: 40 },
      { name: 'BBC Learning English Pre-Int', vocab: [], xp: 50 },
      { name: 'Conversación guiada por IA', vocab: [], xp: 40 },
    ]
  },
  {
    id: 'matematicas',
    name: 'Matemáticas (2º/3º ESO)',
    icon: Calculator,
    color: 'from-indigo-500 to-purple-500',
    level: 'Currículo oficial',
    topics: [
      { name: 'Ecuaciones 1º y 2º grado', vocab: MATH_VOCABULARY, xp: 60 },
      { name: 'Geometría: Áreas, Pitágoras', vocab: MATH_VOCABULARY, xp: 50 },
      { name: 'Porcentajes y proporcionalidad', vocab: MATH_VOCABULARY, xp: 40 },
      { name: 'Estadística básica', vocab: MATH_VOCABULARY, xp: 40 },
      { name: 'GeoGebra visual + vocabulario', vocab: MATH_VOCABULARY, xp: 30 },
    ]
  },
  {
    id: 'ciencias',
    name: 'Ciencias (Bio/Geo + Fis/Quim)',
    icon: FlaskConical,
    color: 'from-green-500 to-teal-500',
    level: 'Currículo oficial',
    topics: [
      { name: 'Biología: Célula, ecosistemas', vocab: SCIENCE_VOCABULARY, xp: 50 },
      { name: 'Física: Energía, fuerzas', vocab: SCIENCE_VOCABULARY, xp: 50 },
      { name: 'Química: Átomo, reacciones', vocab: SCIENCE_VOCABULARY, xp: 50 },
      { name: 'Vocabulario internacional (raíces)', vocab: SCIENCE_VOCABULARY, xp: 30 },
      { name: 'Experimentos mentales guiados', vocab: [], xp: 40 },
    ]
  },
  {
    id: 'geohistoria',
    name: 'Geografía e Historia',
    icon: Map,
    color: 'from-amber-500 to-orange-500',
    level: 'Currículo oficial',
    topics: [
      { name: 'España y Cataluña: historia', vocab: [], xp: 50 },
      { name: 'Conexiones Brasil-España', vocab: [], xp: 60 },
      { name: 'Geografía física y humana', vocab: [], xp: 40 },
      { name: 'Líneas de tiempo comparadas', vocab: [], xp: 40 },
      { name: 'Mapas interactivos trilingües', vocab: [], xp: 30 },
    ]
  },
];

export default function CurriculumPage() {
  const { progress, addXp, learnVocabulary } = useAppStore();
  const [activeTab, setActiveTab] = useState('espanol');
  const currentLevel = calculateLevel(progress.xp);

  const getSubjectProgress = (subjectId: string) => {
    // Simulated progress based on vocabulary learned and games played
    const baseProgress = Math.min(100, (progress.vocabularyLearned * 2) + (progress.mathProblemsSolved * 3) + currentLevel * 5);
    return baseProgress;
  };

  const handleTopicComplete = (topic: any) => {
    addXp(topic.xp);
    if (topic.vocab) {
      topic.vocab.forEach((v: any) => learnVocabulary(v));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">Currículo Integral ESO</h1>
              <p className="text-muted-foreground">
                Alineado con Decret 175/2022 (Generalitat de Catalunya) para 2º/3º ESO. 
                Metodología AICLE: aprende contenidos THROUGH idiomas.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="px-3 py-1.5">
                <Brain className="w-3 h-3 mr-1" />
                Nivel {currentLevel}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                {progress.xp} XP
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800/50 dark:to-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">Progreso global del currículo</p>
                  <p className="text-sm text-muted-foreground">
                    {progress.vocabularyLearned} palabras · {progress.mathProblemsSolved} mates · {progress.minutesSpent} min
                  </p>
                </div>
                <Progress value={getXpProgress(progress.xp).progress} size="lg" variant="primary" className="w-64" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Tabs */}
        <Tabs defaultValue="espanol" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {subjects.map((subject) => (
              <TabTrigger 
                key={subject.id} 
                value={subject.id}
                className={cn(
                  'relative overflow-hidden',
                  activeTab === subject.id && 'bg-gradient-to-r text-white'
                )}
                style={{
                  background: activeTab === subject.id ? `linear-gradient(135deg, ${subject.color.replace('from-', '').replace(' to-', ', ')})` : undefined
                }}
              >
                <subject.icon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{subject.name.split(' ')[0]}</span>
              </TabTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabContent key={subject.id} value={subject.id}>
              <div className="space-y-6 mt-6">
                {/* Subject Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('relative overflow-hidden rounded-2xl p-6', `bg-gradient-to-br ${subject.color} dark:from-gray-800/50 dark:to-gray-700/50 text-white`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                          <subject.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{subject.name}</h2>
                          <p className="text-white/80">Nivel objetivo: {subject.level}</p>
                        </div>
                      </div>
                      <Progress 
                        value={getSubjectProgress(subject.id)} 
                        max={100} 
                        size="md" 
                        variant="default" 
                        className="w-48"
                        style={{ '--progress-color': 'white' }}
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{getSubjectProgress(subject.id)}%</p>
                      <p className="text-white/70 text-sm">Completado</p>
                    </div>
                  </div>
                </motion.div>

                {/* Topics */}
                <div className="grid md:grid-cols-2 gap-4">
                  {subject.topics.map((topic, index) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b" style={{ background: subject.color.replace('from-', '').replace(' to-', ', ') }} />
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{topic.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">+{topic.xp} XP al completar</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {topic.vocab?.length || 0} términos
                            </Badge>
                          </div>
                          
                          {topic.vocab && topic.vocab.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {topic.vocab.slice(0, 5).map((v: any, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {v.es || v.concept || v.feature}
                                </Badge>
                              ))}
                              {topic.vocab.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{topic.vocab.length - 5} más
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={Math.min(100, getSubjectProgress(subject.id) + Math.random() * 20)} 
                              size="sm" 
                              className="flex-1"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleTopicComplete(topic)}
                              className="whitespace-nowrap"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Practicar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Study Plan */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Plan de estudio semanal sugerido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { day: 'Lunes', focus: 'Mates + Español', time: '45 min', icon: Calculator },
                        { day: 'Martes', focus: 'Catalán inmersivo', time: '30 min', icon: Globe },
                        { day: 'Miércoles', focus: 'Ciencias + Inglés', time: '45 min', icon: FlaskConical },
                        { day: 'Jueves', focus: 'Geo/Hist + Español', time: '45 min', icon: Map },
                        { day: 'Viernes', focus: 'Repaso gamificado', time: '30 min', icon: Zap },
                        { day: 'Fin de semana', focus: 'Inmersión pasiva', time: 'Libre', icon: Star },
                      ].map((day, i) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <day.icon className="w-4 h-4 text-primary-500" />
                            <span className="font-medium">{day.day}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{day.focus}</p>
                          <p className="text-xs text-primary-500">{day.time}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
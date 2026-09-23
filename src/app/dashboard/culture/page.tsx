'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Globe, Link, Handshake, BookOpen, Map, 
  Utensils, Music, Trophy, Star, Zap, Brain,
  ArrowRight, ArrowLeft, Check, Sparkles, Flag,
  Heart, Calendar, Clock, Target, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { CULTURAL_BRIDGES, CulturalBridge, LANGUAGES, VocabularyItem } from '@/data';
import { cn, getLanguageFlag, getLanguageColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CulturePage() {
  const { progress, addXp, learnVocabulary } = useAppStore();
  const [activeTab, setActiveTab] = useState('bridges');
  const [selectedBridge, setSelectedBridge] = useState<(CulturalBridge & { progress: number; completed: boolean }) | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'pt' | 'es' | 'ca' | 'en'>('es');

const tabs = [
    { id: 'bridges', name: 'Puentes Culturales', icon: Link },
    { id: 'compare', name: 'Comparador', icon: Handshake },
    { id: 'timeline', name: 'Línea de Tiempo', icon: Calendar },
    { id: 'progress', name: 'Mi Progreso', icon: Target },
  ];

  const completedBridges = progress.achievements.filter(a => a.id === 'culture-bridge' && a.unlockedAt).length > 0 ? 5 : 0;
const bridgeProgress = CULTURAL_BRIDGES.map((bridge, index) => ({
    ...bridge,
    completed: index < completedBridges,
    progress: index < completedBridges ? 100 : index === completedBridges ? 50 : 0,
  })) as (CulturalBridge & { progress: number; completed: boolean })[];

const handleCompleteBridge = (bridge: CulturalBridge) => {
    setSelectedBridge(null);
    addXp(100);
    bridge.vocabulary.forEach(v => learnVocabulary({
      concept: v.pt,
      pt: v.pt,
      es: v.es,
      ca: v.ca,
      en: v.en,
      category: 'Cultura',
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">Puentes Culturales Brasil-EspaÃ±a</h1>
              <p className="text-muted-foreground">
                Conecta tu historia con la espaÃ±ola. Cada puente te da 100 XP y vocabulario en 4 idiomas.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="px-3 py-1.5">
                <Link className="w-3 h-3 mr-1" />
                {CULTURAL_BRIDGES.length} puentes
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                <Globe className="w-3 h-3 mr-1" />
                4 idiomas
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">Progreso en puentes culturales</p>
                  <p className="text-sm text-muted-foreground">
                    {completedBridges}/{CULTURAL_BRIDGES.length} completados Â· {bridgeProgress.reduce((sum, b) => sum + b.progress, 0) / CULTURAL_BRIDGES.length | 0}% global
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold gradient-text">{bridgeProgress.filter(b => b.completed).length}</p>
                  <p className="text-sm text-muted-foreground">Puentes cruzados</p>
                </div>
              </div>
              <Progress value={bridgeProgress.reduce((sum, b) => sum + b.progress, 0) / CULTURAL_BRIDGES.length} size="lg" variant="warning" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bridges" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            {tabs.map(tab => (
              <TabTrigger key={tab.id} value={tab.id}>
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </TabTrigger>
            ))}
          </TabsList>

          {/* Bridges Tab */}
          <TabContent value="bridges">
            <AnimatePresence mode="popLayout">
              {selectedBridge ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6"
                >
                  <BridgeDetail 
                    bridge={selectedBridge} 
                    onClose={() => setSelectedBridge(null)}
                    onComplete={handleCompleteBridge}
                    activeLanguage={activeLanguage}
                    setActiveLanguage={setActiveLanguage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {bridgeProgress.map((bridge, index) => (
                      <motion.div
                        key={bridge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BridgeCard 
                          bridge={bridge} 
                          onClick={() => setSelectedBridge(bridge)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabContent>

          {/* Compare Tab */}
          <TabContent value="compare">
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Comparador Cultural Interactivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Explora las similitudes y diferencias entre Brasil y EspaÃ±a en mÃºltiples dimensiones.
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { category: 'Historia', icon: BookOpen, color: 'indigo', bridges: ['tordesillas', 'familia-real'] },
                      { category: 'MÃºsica', icon: Music, color: 'purple', bridges: ['musica-compartida'] },
                      { category: 'Deportes', icon: Trophy, color: 'yellow', bridges: ['futbol-pasion'] },
                      { category: 'GastronomÃ­a', icon: Utensils, color: 'orange', bridges: ['comida-fusion'] },
                    ].map(cat => (
                      <Card key={cat.category} className="cursor-pointer hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}20)` }}>
                            <cat.icon className="w-7 h-7" style={{ color: cat.color }} />
                          </div>
                          <h4 className="font-bold">{cat.category}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{cat.bridges.length} puentes</p>
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            Explorar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

{/* Side-by-side Comparison */}
                  <div className="space-y-4">
                    {bridgeProgress.map(bridge => (
                      <Card key={bridge.id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            {bridge.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50">
                              <h5 className="font-bold flex items-center gap-2 text-green-700 dark:text-green-300">
                                <span className="text-xl">ðŸ‡§ðŸ‡·</span>
                                Brasil
                              </h5>
                              <p className="text-sm mt-2">{bridge.brazilConnection}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50">
                              <h5 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-300">
                                <span className="text-xl">ðŸ‡ªðŸ‡¸</span>
                                EspaÃ±a
                              </h5>
                              <p className="text-sm mt-2">{bridge.spainConnection}</p>
                            </div>
                          </div>
                          
<div className="mt-4 flex flex-wrap gap-2">
                            {bridge.vocabulary.map((v, i) => (
                              <Badge key={i} variant="outline" className="text-xs" style={{ borderColor: `${getLanguageColor('general')}60` }}>
                                {getLanguageFlag('pt')} {v.pt} = {getLanguageFlag('es')} {v.es} = {getLanguageFlag('ca')} {v.ca} = {getLanguageFlag('en')} {v.en}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => setSelectedBridge(bridge)}>
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Ver actividad completa
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabContent>

          {/* Timeline Tab */}
          <TabContent value="timeline">
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    LÃ­nea de Tiempo Comparada: Brasil â†” EspaÃ±a
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Eventos histÃ³ricos simultÃ¡neos que conectan ambas naciones. Usa esto para anclar memorias en clase de historia.
                  </p>
                  
                  <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-orange-500 -translate-x-1/2" />
                    
                    {[
                      { year: 1492, brasil: 'Brasil aÃºn no "descubierto"', espana: 'ColÃ³n llega a AmÃ©rica; fin Reconquista' },
                      { year: 1494, brasil: 'Tratado de Tordesillas divide el mundo', espana: 'Tratado de Tordesillas con Portugal' },
                      { year: 1500, brasil: 'Cabral llega a Brasil (oficialmente)', espana: 'ExpansiÃ³n imperial espaÃ±ola en AmÃ©rica' },
                      { year: 1808, brasil: 'Familia real portuguesa huye a RÃ­o', espana: 'Guerra de la Independencia vs Francia' },
                      { year: 1810, brasil: 'Movimientos independentistas', espana: 'Cortes de CÃ¡diz; ConstituciÃ³n 1812' },
                      { year: 1822, brasil: 'Independencia de Brasil (Pedro I)', espana: 'Trienio Liberal; Fernando VII absolutista' },
                      { year: 1889, brasil: 'RepÃºblica; fin del Imperio', espana: 'RestauraciÃ³n borbÃ³nica; crisis 98' },
                      { year: 1930, brasil: 'Era Vargas; industrializaciÃ³n', espana: 'Segunda RepÃºblica; Guerra Civil' },
                      { year: 1975, brasil: 'Fin de dictadura militar', espana: 'Muerte de Franco; TransiciÃ³n' },
                      { year: 1988, brasil: 'Nueva ConstituciÃ³n democrÃ¡tica', espana: 'Entrada en CEE (actual UE)' },
                    ].map((event, index) => (
                      <motion.div
                        key={event.year}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative flex mb-8"
                      >
                        <div className="w-1/2 pr-8 text-right">
                          <div className="relative">
                            <div className="absolute right-0 top-1/2 w-4 h-4 rounded-full border-4 -translate-y-1/2 -translate-x-1/2 bg-green-500 border-green-500" />
                            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200/50">
                              <p className="font-bold text-green-700 dark:text-green-300">{event.year}</p>
                              <p className="text-sm mt-1">{event.brasil}</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2 pl-8">
                          <div className="relative">
                            <div className="absolute left-0 top-1/2 w-4 h-4 rounded-full border-4 -translate-y-1/2 translate-x-1/2 bg-red-500 border-red-500" />
                            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-200/50">
                              <p className="font-bold text-red-700 dark:text-red-300">{event.year}</p>
                              <p className="text-sm mt-1">{event.espana}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Generator */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    Generador de Actividades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Crea actividades personalizadas conectando cualquier tema de Brasil con EspaÃ±a.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tema en Brasil</label>
                      <select className="w-full input">
                        <option>Independencia (1822)</option>
                        <option>Carnaval de RÃ­o</option>
                        <option>AmazonÃ­a y medio ambiente</option>
                        <option>FÃºtbol: 5 mundiales</option>
                        <option>Bossa Nova</option>
                        <option>Feijoada y gastronomÃ­a</option>
                        <option>Capoeira</option>
                        <option>Literatura: Machado de Assis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Conectar con tema en EspaÃ±a</label>
                      <select className="w-full input">
                        <option>ConstituciÃ³n de 1812 (CÃ¡diz)</option>
                        <option>Fallas de Valencia / Carnaval</option>
                        <option>DoÃ±ana / Pirineos - conservaciÃ³n</option>
                        <option>FÃºtbol: tiki-taka, La Masia</option>
                        <option>Flamenco / Rumba catalana</option>
                        <option>Cocido / Paella / Tapas</option>
                        <option>Jota / Sardana</option>
                        <option>Literatura: Cervantes / Lorca</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="w-full sm:w-auto" onClick={() => addXp(50)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar actividad +50 XP
                  </Button>
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
                    <Target className="w-5 h-5" />
                    Tu Progreso Cultural
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Link} value={bridgeProgress.filter(b => b.completed).length} label="Puentes completados" color="amber" />
                    <StatCard icon={BookOpen} value={bridgeProgress.reduce((sum, b) => sum + b.vocabulary.length, 0)} label="Vocabulario cultural" color="indigo" />
                    <StatCard icon={Star} value={bridgeProgress.filter(b => b.completed).length * 100} label="XP ganados" color="yellow" />
                    <StatCard icon={Heart} value={completedBridges > 0 ? 'Constructor de Puentes' : 'Explorador'} label="TÃ­tulo cultural" color="red" />
                  </div>

                  <div className="space-y-3">
                    {bridgeProgress.map((bridge, index) => (
                      <motion.div
                        key={bridge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-4 rounded-xl border transition-all',
                          bridge.completed 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200/50' 
                            : bridge.progress > 0
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200/50'
                            : 'bg-muted/50 border-border/50'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                              background: bridge.completed 
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                                : bridge.progress > 0 
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                                : 'linear-gradient(135deg, #6b7280, #4b5563)'
                            }}>
                              {bridge.completed ? <Check className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium">{bridge.title}</p>
                              <p className="text-sm text-muted-foreground">{bridge.vocabulary.length} tÃ©rminos Â· +100 XP</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress value={bridge.progress} className="w-32" size="sm" />
                            <Badge variant={bridge.completed ? 'success' : bridge.progress > 0 ? 'warning' : 'outline'}>
                              {bridge.completed ? 'Completado' : bridge.progress > 0 ? 'En progreso' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={bridge.progress} size="sm" variant={bridge.completed ? 'success' : bridge.progress > 0 ? 'warning' : 'default'} />
                        {!bridge.completed && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full sm:w-auto"
                            onClick={() => setSelectedBridge(bridge)}
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Continuar puente
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    PrÃ³ximos Puentes Recomendados
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {bridgeProgress
                    .filter(b => !b.completed)
                    .slice(0, 2)
                    .map(bridge => (
                      <Card key={bridge.id} className="cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setSelectedBridge(bridge)}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <Link className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{bridge.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{bridge.description.split('.')[0]}.</p>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {bridge.vocabulary.slice(0, 3).map((v, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {v.pt} â†’ {v.es}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <Badge variant="warning">+100 XP</Badge>
                            <Button size="sm">Empezar</Button>
                          </div>
                        </CardContent>
                      </Card>
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

const BridgeCard = ({ bridge, onClick }: { bridge: CulturalBridge & { progress: number; completed: boolean }; onClick: () => void }) => {
  return (
    <Card className={cn(
      'relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1',
      bridge.completed && 'ring-2 ring-green-500/50'
    )} onClick={onClick}>
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" style={{ transform: `scaleX(${bridge.progress / 100})`, transformOrigin: 'left' }} />
    
    <CardContent className="p-6 relative h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Link className="w-6 h-6 text-white" />
        </div>
        <Badge variant={bridge.completed ? 'success' : bridge.progress > 0 ? 'warning' : 'outline'}>
          {bridge.completed ? 'âœ…' : bridge.progress > 0 ? 'ðŸ”„' : 'ðŸ”’'}
        </Badge>
      </div>
      
      <h3 className="font-bold text-lg mb-2">{bridge.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bridge.description}</p>
      
      <div className="flex-1">
        <Progress value={bridge.progress} size="sm" className="mb-3" />
        <div className="flex flex-wrap gap-1">
          {bridge.vocabulary.slice(0, 4).map((v, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {getLanguageFlag('pt')} {v.pt} = {getLanguageFlag('es')} {v.es}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <Badge variant="warning">+100 XP</Badge>
        <Button size="sm" variant={bridge.completed ? 'secondary' : 'outline'}>
          {bridge.completed ? 'Repasar' : 'Empezar'}
        </Button>
      </div>
    </CardContent>
  </Card>
  );
};

const BridgeDetail = ({ 
  bridge, 
  onClose, 
  onComplete, 
  activeLanguage, 
  setActiveLanguage 
}: { 
  bridge: CulturalBridge & { progress: number; completed: boolean };
  onClose: () => void;
  onComplete: (bridge: CulturalBridge) => void;
  activeLanguage: 'pt' | 'es' | 'ca' | 'en';
  setActiveLanguage: (lang: 'pt' | 'es' | 'ca' | 'en') => void;
}) => {
  return (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
      
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5 text-amber-500" />
              {bridge.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">{bridge.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">+100 XP</Badge>
            <Badge variant="secondary">{bridge.vocabulary.length} tÃ©rminos</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ver vocabulario en:</span>
          <div className="flex gap-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setActiveLanguage(lang.code as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeLanguage === lang.code
                    ? `text-white shadow-sm` 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ 
                  backgroundColor: activeLanguage === lang.code ? lang.color : 'transparent',
                  border: activeLanguage === lang.code ? 'none' : `1px solid ${lang.color}40`
                }}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
            <TabTrigger value="connections">Conexiones</TabTrigger>
            <TabTrigger value="vocabulary">Vocabulario</TabTrigger>
            <TabTrigger value="activity">Actividad</TabTrigger>
            <TabTrigger value="resources">Recursos</TabTrigger>
          </TabsList>

          <TabContent value="connections">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50">
                <h4 className="font-bold flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                  <span className="text-xl">ðŸ‡§ðŸ‡·</span>
                  ConexiÃ³n Brasil
                </h4>
                <p>{bridge.brazilConnection}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50">
                <h4 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-300 mb-3">
                  <span className="text-xl">ðŸ‡ªðŸ‡¸</span>
                  ConexiÃ³n EspaÃ±a
                </h4>
                <p>{bridge.spainConnection}</p>
              </div>
            </div>
          </TabContent>

          <TabContent value="vocabulary">
            <div className="space-y-3">
              {bridge.vocabulary.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {LANGUAGES.map(lang => (
                      <div key={lang.code} className="p-2 rounded-lg" style={{ backgroundColor: `${lang.color}10` }}>
                        <div className="text-xs text-muted-foreground">{lang.flag} {lang.code.toUpperCase()}</div>
                        <div className="font-medium" style={{ color: lang.color }}>
                          {v[lang.code as keyof typeof v]}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabContent>

          <TabContent value="activity">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50">
              <h4 className="font-bold flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Actividad Sugerida
              </h4>
              <p className="mb-4">{bridge.activity}</p>
              <div className="flex gap-2">
                <Button onClick={() => onComplete(bridge)} disabled={bridge.completed}>
                  <Check className="w-4 h-4 mr-1" />
                  {bridge.completed ? 'Completado âœ“' : 'Marcar como completado +100 XP'}
                </Button>
                <Button variant="outline">Guardar para luego</Button>
              </div>
            </div>
          </TabContent>

          <TabContent value="resources">
            <div className="space-y-3">
              <h4 className="font-medium">Recursos para profundizar:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>â€¢ Wikipedia: Busca "{bridge.title}" en PT, ES, CA, EN</li>
                <li>â€¢ YouTube: Documentales sobre el tema en 4 idiomas</li>
                <li>â€¢ Khan Academy: Historia mundial (disponible en ES/PT/EN)</li>
                <li>â€¢ Parla.cat: Vocabulario histÃ³rico en catalÃ¡n</li>
                <li>â€¢ Biblioteca digital hispÃ¡nica (BNE) / Biblioteca Nacional do Brasil</li>
              </ul>
            </div>
          </TabContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const StatCard = ({ icon: Icon, value, label, color }: { 
  icon: React.ComponentType<{ className?: string; color?: string }>;
  value: string | number;
  label: string;
  color: string;
}) => {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
      <Icon className="w-6 h-6 mx-auto mb-2" color={color} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}


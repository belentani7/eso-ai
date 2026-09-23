'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sparkles, Brain, Zap, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { LANGUAGES } from '@/data';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { currentLanguage, voiceEnabled } = useAppStore();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold gradient-text">Chat con DANI</h1>
          <p className="text-muted-foreground">
            Tu tutor personal de IA. Habla por voz o escribe en español, catalán, portugués o inglés.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary" className="px-3 py-1.5">
            <Sparkles className="w-3 h-3 mr-1" />
            IA con voz natural
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5">
            <Brain className="w-3 h-3 mr-1" />
            Corrección socrática
          </Badge>
          <Badge variant="accent" className="px-3 py-1.5">
            <Zap className="w-3 h-3 mr-1" />
            Falsos amigos detectados
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            <BookOpen className="w-3 h-3 mr-1" />
            Vocabulario automático
          </Badge>
        </div>

        {/* Language Selector */}
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => useAppStore.getState().setCurrentLanguage(lang.code)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all',
                currentLanguage === lang.code
                  ? `bg-white dark:bg-gray-800 shadow-lg shadow-${lang.color.replace('#', '')}/20`
                  : 'bg-muted/50 hover:bg-muted'
              )}
              style={{ 
                borderColor: currentLanguage === lang.code ? lang.color : 'transparent',
                color: currentLanguage === lang.code ? lang.color : 'inherit'
              }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.nativeName}</span>
              {currentLanguage === lang.code && <span className="text-xs text-muted-foreground">(activo)</span>}
            </button>
          ))}
        </div>

        {/* Main Chat */}
        <ChatInterface />

        {/* Tips */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Pide ecuaciones</p>
                  <p className="text-sm text-muted-foreground">"Resuelve 2x+5=15"</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Detecta falsos amigos</p>
                  <p className="text-sm text-muted-foreground">"Embaraçada" → ⚠️</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent-50 dark:bg-accent-900/20 border-accent-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Practica catalán</p>
                  <p className="text-sm text-muted-foreground">"Bon dia" = Buenos días</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-success-50 dark:bg-success-900/20 border-success-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Vocabulario auto</p>
                  <p className="text-sm text-muted-foreground">Se guarda solo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
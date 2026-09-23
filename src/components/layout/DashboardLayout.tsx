'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Mic, Gamepad2, BookOpen, BarChart3, Music, Globe, Settings, Menu, X, ChevronLeft, User, Trophy, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { LANGUAGES, calculateLevel, getXpProgress, ACHIEVEMENTS } from '@/lib/utils';

const navigation = [
  { name: 'Chat', href: '/dashboard/chat', icon: Mic },
  { name: 'Juegos', href: '/dashboard/games', icon: Gamepad2 },
  { name: 'Currículo', href: '/dashboard/curriculum', icon: BookOpen },
  { name: 'Progreso', href: '/dashboard/progress', icon: BarChart3 },
  { name: 'Música', href: '/dashboard/music', icon: Music },
  { name: 'Cultura', href: '/dashboard/culture', icon: Globe },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { progress, userName, xp, level, streak } = useAppStore();
  const { current: xpProgress } = getXpProgress(progress.xp);
  const currentLevel = calculateLevel(progress.xp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-screen w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Link href="/dashboard/chat" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">DANI</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Avatar 
                size="lg" 
                fallback={userName.charAt(0)} 
                className="bg-gradient-to-br from-primary-500 to-secondary-500"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{userName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" className="text-xs">
                    Nivel {currentLevel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {streak}🔥
                  </Badge>
                </div>
              </div>
            </div>
            <Progress value={xpProgress.progress} className="mt-3" size="sm" variant="primary" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {xpProgress.current} / {xpProgress.next} XP para nivel {currentLevel + 1}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-primary-500')} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estadísticas rápidas</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <p className="text-2xl font-bold gradient-text">{progress.gamesPlayed ? Object.values(progress.gamesPlayed).reduce((a, b) => a + b, 0) : 0}</p>
                <p className="text-xs text-muted-foreground">Partidas</p>
              </div>
              <div className="p-3 rounded-xl bg-success-50 dark:bg-success-900/20">
                <p className="text-2xl font-bold text-success-600">{progress.vocabularyLearned}</p>
                <p className="text-xs text-muted-foreground">Palabras</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                <p className="text-2xl font-bold text-accent-600">{progress.mathProblemsSolved}</p>
                <p className="text-xs text-muted-foreground">Mates</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-900/20">
                <p className="text-2xl font-bold text-secondary-600">{progress.achievements.filter(a => a.unlockedAt).length}</p>
                <p className="text-xs text-muted-foreground">Logros</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="p-4 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Idiomas</p>
            <div className="flex flex-wrap gap-1">
              {LANGUAGES.map(lang => (
                <Badge 
                  key={lang.code} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: `${lang.color}60`, color: lang.color }}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 lg:flex-none" />
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50">
                <Star className="w-4 h-4 text-warning-500" />
                <span className="text-sm font-medium">{progress.xp} XP</span>
              </div>
              
              <Avatar 
                size="sm" 
                fallback={userName.charAt(0)} 
                className="bg-gradient-to-br from-primary-500 to-secondary-500"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
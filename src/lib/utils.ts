import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  FALSE_FRIENDS,
  MATH_VOCABULARY,
  SCIENCE_VOCABULARY,
  SCHOOL_VOCABULARY,
  PHONETIC_RULES,
  CATALAN_ADVANTAGES,
  CULTURAL_BRIDGES,
  MUSIC_LESSONS,
  LANGUAGES,
  GAMES,
  ACHIEVEMENTS,
  SYSTEM_PROMPT,
} from '@/data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export all data constants
export {
  FALSE_FRIENDS,
  MATH_VOCABULARY,
  SCIENCE_VOCABULARY,
  SCHOOL_VOCABULARY,
  PHONETIC_RULES,
  CATALAN_ADVANTAGES,
  CULTURAL_BRIDGES,
  MUSIC_LESSONS,
  LANGUAGES,
  GAMES,
  ACHIEVEMENTS,
  SYSTEM_PROMPT,
};

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(level: number): number {
  return (level * level) * 100;
}

export function getXpProgress(xp: number): { current: number; next: number; progress: number } {
  const level = calculateLevel(xp);
  const currentLevelXp = xpForNextLevel(level - 1);
  const nextLevelXp = xpForNextLevel(level);
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return { current: xp - currentLevelXp, next: nextLevelXp - currentLevelXp, progress: Math.min(100, Math.max(0, progress)) };
}

export function getLanguageColor(code: string): string {
  const colors: Record<string, string> = {
    pt: '#009C3B',
    es: '#AA151B',
    ca: '#FFCD00',
    en: '#00247D',
  };
  return colors[code] || '#6366f1';
}

export function getLanguageFlag(code: string): string {
  const flags: Record<string, string> = {
    pt: '🇧🇷',
    es: '🇪🇸',
    ca: '🏴',
    en: '🇬🇧',
  };
  return flags[code] || '🏳️';
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function speakText(text: string, lang: string = 'es-ES'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

export const LANGUAGE_CODES: Record<string, string> = {
  pt: 'pt-BR',
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-GB',
};

export function getSpeechLangCode(code: string): string {
  return LANGUAGE_CODES[code] || 'es-ES';
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(d);
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: 'text-gray-600 dark:text-gray-400',
    rare: 'text-blue-600 dark:text-blue-400',
    epic: 'text-purple-600 dark:text-purple-400',
    legendary: 'text-yellow-600 dark:text-yellow-400',
  };
  return colors[rarity] || colors.common;
}

export function getRarityGlow(rarity: string): string {
  const glows: Record<string, string> = {
    common: 'shadow-gray-200/50 dark:shadow-gray-700/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50',
  };
  return glows[rarity] || glows.common;
}
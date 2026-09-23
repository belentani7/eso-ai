import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, ChatMessage, VocabularyItem, Achievement, Language } from '@/data';

interface AppState {
  // User profile
  userName: string;
  userAge: number;
  nativeLanguage: Language['code'];
  targetLanguages: Language['code'][];
  
  // Progress
  progress: UserProgress;
  
  // Chat
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  currentLanguage: Language['code'];
  
  // Settings
  voiceEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  
  // Current session
  sessionStartTime: number;
  currentGame: string | null;
  gameScore: number;
  
  // Actions
  setUserProfile: (profile: Partial<Pick<AppState, 'userName' | 'userAge' | 'nativeLanguage' | 'targetLanguages'>>) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addXp: (amount: number) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setCurrentLanguage: (lang: Language['code']) => void;
  toggleVoice: () => void;
  setVoiceSettings: (settings: { rate?: number; pitch?: number }) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReducedMotion: (reduced: boolean) => void;
  startSession: () => void;
  endSession: () => void;
  setCurrentGame: (gameId: string | null) => void;
  updateGameScore: (score: number) => void;
  recordGameResult: (gameId: string, won: boolean, score: number) => void;
  unlockAchievement: (achievementId: string) => void;
  learnVocabulary: (word: VocabularyItem) => void;
  solveMathProblem: () => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  maxStreak: 0,
  gamesPlayed: {},
  gamesWon: {},
  vocabularyLearned: 0,
  mathProblemsSolved: 0,
  minutesSpent: 0,
  achievements: [],
  lastActive: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      userName: 'William',
      userAge: 14,
      nativeLanguage: 'pt',
      targetLanguages: ['es', 'ca', 'en'],
      progress: initialProgress,
      messages: [],
      isListening: false,
      isSpeaking: false,
      currentLanguage: 'es',
      voiceEnabled: true,
      voiceRate: 0.9,
      voicePitch: 1,
      theme: 'system',
      reducedMotion: false,
      sessionStartTime: Date.now(),
      currentGame: null,
      gameScore: 0,
      
      // Actions
      setUserProfile: (profile) => set((state) => ({ ...state, ...profile })),
      
      updateProgress: (updates) => set((state) => ({
        progress: { ...state.progress, ...updates, lastActive: new Date().toISOString() }
      })),
      
      addXp: (amount) => set((state) => {
        const newXp = state.progress.xp + amount;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        const leveledUp = newLevel > state.progress.level;
        return {
          progress: {
            ...state.progress,
            xp: newXp,
            level: newLevel,
          },
        };
      }),
      
      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          },
        ],
      })),
      
      setMessages: (messages) => set({ messages }),
      
      setListening: (listening) => set({ isListening: listening }),
      
      setSpeaking: (speaking) => set({ isSpeaking: speaking }),
      
      setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
      
      toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      
      setVoiceSettings: (settings) => set((state) => ({
        voiceRate: settings.rate ?? state.voiceRate,
        voicePitch: settings.pitch ?? state.voicePitch,
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      
      startSession: () => set({ sessionStartTime: Date.now() }),
      
      endSession: () => set((state) => {
        const minutesSpent = Math.floor((Date.now() - state.sessionStartTime) / 60000);
        return {
          progress: {
            ...state.progress,
            minutesSpent: state.progress.minutesSpent + minutesSpent,
            lastActive: new Date().toISOString(),
          },
          sessionStartTime: Date.now(),
        };
      }),
      
      setCurrentGame: (gameId) => set({ currentGame: gameId, gameScore: 0 }),
      
      updateGameScore: (score) => set({ gameScore: score }),
      
      recordGameResult: (gameId, won, score) => set((state) => {
        const gamesPlayed = { ...state.progress.gamesPlayed, [gameId]: (state.progress.gamesPlayed[gameId] || 0) + 1 };
        const gamesWon = { ...state.progress.gamesWon, [gameId]: (state.progress.gamesWon[gameId] || 0) + (won ? 1 : 0) };
        const xpGain = won ? Math.floor(score / 10) * 10 : Math.floor(score / 20) * 5;
        
        return {
          progress: {
            ...state.progress,
            gamesPlayed,
            gamesWon,
            xp: state.progress.xp + xpGain,
            level: Math.floor(Math.sqrt((state.progress.xp + xpGain) / 100)) + 1,
          },
          gameScore: 0,
        };
      }),
      
      unlockAchievement: (achievementId) => set((state) => {
        const achievement = state.progress.achievements.find(a => a.id === achievementId);
        if (achievement?.unlockedAt) return state;
        
        const newAchievement = {
          ...state.progress.achievements.find(a => a.id === achievementId)!,
          unlockedAt: new Date().toISOString(),
        } as Achievement;
        
        const otherAchievements = state.progress.achievements.filter(a => a.id !== achievementId);
        
        return {
          progress: {
            ...state.progress,
            achievements: [...otherAchievements, newAchievement],
            xp: state.progress.xp + (newAchievement.rarity === 'legendary' ? 500 : newAchievement.rarity === 'epic' ? 200 : newAchievement.rarity === 'rare' ? 100 : 50),
          },
        };
      }),
      
      learnVocabulary: (word) => set((state) => ({
        progress: {
          ...state.progress,
          vocabularyLearned: state.progress.vocabularyLearned + 1,
          xp: state.progress.xp + 5,
        },
      })),
      
      solveMathProblem: () => set((state) => ({
        progress: {
          ...state.progress,
          mathProblemsSolved: state.progress.mathProblemsSolved + 1,
          xp: state.progress.xp + 10,
        },
      })),
      
      resetProgress: () => set({
        progress: initialProgress,
        messages: [],
        sessionStartTime: Date.now(),
      }),
    }),
    {
      name: 'william-ai-tutor-storage',
      partialize: (state) => ({
        userName: state.userName,
        userAge: state.userAge,
        nativeLanguage: state.nativeLanguage,
        targetLanguages: state.targetLanguages,
        progress: state.progress,
        voiceEnabled: state.voiceEnabled,
        voiceRate: state.voiceRate,
        voicePitch: state.voicePitch,
        theme: state.theme,
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);
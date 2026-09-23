'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Volume2, VolumeX, Bot, User, Sparkles, Brain, Flag, Globe, Calculator, Music, BookOpen, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { useSpeechRecognition, useSpeechSynthesis } from '@/hooks';
import { ChatMessage, SYSTEM_PROMPT, LANGUAGES, VocabularyItem, FalseFriend } from '@/data';
import { getLanguageFlag, getLanguageColor, cn, generateId } from '@/lib/utils';

interface ChatMessageDisplayProps {
  message: ChatMessage;
  onPlayAudio?: (text: string, lang: string) => void;
  onCopy?: (text: string) => void;
}

export function ChatMessageDisplay({ message, onPlayAudio, onCopy }: ChatMessageDisplayProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  
  const lang = LANGUAGES.find(l => l.code === message.language);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 animate-slide-up', isUser ? 'flex-row-reverse' : '')}
    >
      <Avatar
        size="md"
        fallback={isUser ? 'W' : 'D'}
        alt={isUser ? 'William' : 'DANI'}
        className={cn('flex-shrink-0 mt-1', isUser ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-primary-500 to-secondary-500')}
      />
      
      <div className={cn('flex-1 max-w-[80%]', isUser ? 'text-right' : '')}>
        <div className={cn('flex items-center gap-2 mb-1', isUser ? 'justify-end' : '')}>
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? 'Tú' : 'DANI'}
          </span>
          {lang && (
            <Badge variant="outline" className="text-xs" style={{ borderColor: `${lang.color}60`, color: lang.color }}>
              {lang.flag} {lang.code.toUpperCase()}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={cn(
          'relative rounded-2xl p-4 max-w-[90%] inline-block',
          isUser 
            ? 'bg-primary-600 text-white rounded-tr-sm' 
            : 'bg-muted text-foreground rounded-tl-sm'
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPlayAudio && !isUser && (
              <Button variant="ghost" size="icon" onClick={() => onPlayAudio(message.content, message.language)}>
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => { onCopy?.(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {message.metadata?.vocabulary && message.metadata.vocabulary.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 justify-end">
            {message.metadata.vocabulary.slice(0, 5).map((v) => (
              <Badge key={v.concept} variant="outline" className="text-xs">
                {v.es} = {v.pt}
              </Badge>
            ))}
          </div>
        )}
        
        {message.metadata?.corrections && message.metadata.corrections.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.metadata.corrections.map((c, i) => (
              <Badge key={i} variant="warning" className="text-xs">
                ⚠️ {c.original} → {c.corrected}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ChatInterfaceProps {
  onVocabularyLearned?: (word: VocabularyItem) => void;
}

export function ChatInterface({ onVocabularyLearned }: ChatInterfaceProps) {
  const { 
    messages, 
    addMessage, 
    currentLanguage, 
    setCurrentLanguage, 
    isListening, 
    isSpeaking,
    voiceEnabled,
    addXp,
    learnVocabulary,
  } = useAppStore();
  
  const { speak, cancel } = useSpeechSynthesis();
  const { 
    isListening: isRecListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    setTranscript 
  } = useSpeechRecognition();
  
  const [inputValue, setInputValue] = useState('');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      content: text.trim(),
      language: currentLanguage,
    };
    addMessage(userMessage);
    setInputValue('');
    resetTranscript();
    
    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(text, currentLanguage);
      const aiMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: aiResponse.text,
        language: currentLanguage,
        metadata: aiResponse.metadata,
      };
      addMessage(aiMessage);
      
      if (voiceEnabled) {
        speak(aiResponse.text);
      }
      
      if (aiResponse.metadata?.vocabulary) {
        aiResponse.metadata.vocabulary.forEach(v => {
          learnVocabulary(v);
          onVocabularyLearned?.(v);
        });
      }
      
      if (aiResponse.metadata?.corrections) {
        addXp(5);
      }
    }, 1000);
  }, [currentLanguage, addMessage, voiceEnabled, speak, resetTranscript, learnVocabulary, onVocabularyLearned, addXp]);

  const handleVoiceInput = useCallback(() => {
    if (isRecListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isRecListening, startListening, stopListening]);

  const handleTranscriptChange = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  // Listen for transcript changes
  useEffect(() => {
    if (transcript && !isRecListening) {
      handleTranscriptChange(transcript);
    }
  }, [transcript, isRecListening, handleTranscriptChange]);

  const generateAIResponse = (userText: string, lang: string): { text: string; metadata?: ChatMessage['metadata'] } => {
    const lower = userText.toLowerCase();
    
    // Math detection
    if (lower.includes('ecuación') || lower.includes('resuelve') || lower.includes('x =') || lower.includes('matemática') || /\d+x\s*[+-]/.test(lower)) {
      const vocab = [
        { concept: 'Ecuación', pt: 'Equação', es: 'Ecuación', ca: 'Equació', en: 'Equation', category: 'Álgebra' },
        { concept: 'Despejar', pt: 'Isolar', es: 'Despejar', ca: 'Aïllar', en: 'Isolate', category: 'Álgebra' },
      ];
      return {
        text: `¡Vamos a resolverlo paso a paso! 🧠\n\n${userText.includes('2x') ? 'Tenemos 2x + 5 = 15. Primero, ¿qué hacemos con el +5 para dejar la x sola?' : 'Dime la ecuación y te guío.'}\n\n💡 Pista: La operación contraria a sumar es restar.`,
        metadata: { topic: 'math', vocabulary: vocab, corrections: [] }
      };
    }
    
    // False friend detection
    const ff = FALSE_FRIENDS.find(f => lower.includes(f.pt.toLowerCase()) || lower.includes(f.esWrong.toLowerCase()));
    if (ff) {
      return {
        text: `⚠️ ¡Cuidado! "${ff.pt}" es un FALSO AMIGO.\n\nEn español NO significa "${ff.esWrong}", significa "${ff.esCorrect}".\n\nEn catalán: ${ff.ca} | En inglés: ${ff.en}\n\n💡 Recuerda: Embaraçada = Avergonzada (no embarazada)`,
        metadata: { 
          topic: 'false-friend', 
          vocabulary: [{ concept: ff.esCorrect, pt: ff.pt, es: ff.esCorrect, ca: ff.ca, en: ff.en, category: ff.category }],
          corrections: [{ original: ff.esWrong, corrected: ff.esCorrect, explanation: `Falso amigo: ${ff.pt} ≠ ${ff.esWrong}` }]
        }
      };
    }
    
    // Language practice
    if (lower.includes('catalán') || lower.includes('català')) {
      return {
        text: `¡Genial que quieras practicar catalán! 🇪🇸\n\nTu portugués te da ventaja: la "Ç" suena igual que en "Coração", la "X" como en "Xícara".\n\nEmpecemos fácil: **Bon dia** = Buenos días 🌅\n\n¿Cómo se dice "Gracias" en catalán?`,
        metadata: { topic: 'catalan', vocabulary: [
          { concept: 'Buenos días', pt: 'Bom dia', es: 'Buenos días', ca: 'Bon dia', en: 'Good morning', category: 'Saludo' },
          { concept: 'Gracias', pt: 'Obrigado', es: 'Gracias', ca: 'Gràcies', en: 'Thank you', category: 'Cortesía' },
        ]}
      };
    }
    
    // English practice
    if (lower.includes('inglés') || lower.includes('english')) {
      return {
        text: `¡Practiquemos inglés! 🇬🇧\n\nUsa lo que ya sabes: "Present Perfect" en inglés ≈ "Pretérito Perfeito Composto" en portugués ≈ "Pretérito Perfecto" en español.\n\nEjemplo: **I have studied** = Eu estudei = He estudiado\n\n¿Quieres que hagamos un ejercicio?`,
        metadata: { topic: 'english', vocabulary: [
          { concept: 'He estudiado', pt: 'Estudei', es: 'He estudiado', ca: 'He estudiat', en: 'I have studied', category: 'Gramática' },
        ]}
      };
    }
    
    // Greeting
    if (lower.includes('hola') || lower.includes('oi') || lower.includes('hello') || lower.includes('buenos') || lower.includes('bon dia')) {
      return {
        text: `¡Hola William! 👋 ¿Qué tal? Hoy podemos:\n\n1️⃣ Resolver ecuaciones paso a paso\n2️⃣ Practicar catalán (tu portugués ayuda mucho)\n3️⃣ Detectar falsos amigos ⚠️\n4️⃣ Repasar vocabulario del insti\n5️⃣ Hablar de cultura Brasil-España 🌉\n\n¿Por dónde empezamos?`,
        metadata: { topic: 'greeting' }
      };
    }
    
    // Default supportive response
    const responses = [
      `Entiendo. Cuéntame más... 🤔\n\n¿Quieres que practiquemos algo específico? Mates, catalán, inglés, falsos amigos...`,
      `¡Bien dicho! 🎯 Tu español mejora cada día.\n\n¿Seguimos con mates, idiomas o cultura?`,
      `Me gusta cómo te expresas. 💪\n\n¿Probamos una ecuación rápida o vocabulario nuevo?`,
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      metadata: { topic: 'general' }
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] max-h-[700px] bg-card/50 rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar 
            size="lg" 
            fallback="D" 
            className="bg-gradient-to-br from-primary-500 to-secondary-500"
          />
          <div>
            <h3 className="font-bold gradient-text">DANI</h3>
            <p className="text-xs text-muted-foreground">Tu amigo de estudio · {isSpeaking ? 'Hablando...' : isRecListening ? 'Escuchando...' : 'Listo'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-muted rounded-xl p-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  currentLanguage === lang.code
                    ? `text-white shadow-sm` 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ 
                  backgroundColor: currentLanguage === lang.code ? lang.color : 'transparent',
                  border: currentLanguage === lang.code ? 'none' : `1px solid ${lang.color}40`
                }}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setShowVocabulary(true)}>
            <BookOpen className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessageDisplay
              key={message.id}
              message={message}
              onPlayAudio={speak}
              onCopy={(text) => navigator.clipboard.writeText(text)}
            />
          ))}
        </AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Avatar size="md" fallback="D" className="bg-gradient-to-br from-primary-500 to-secondary-500" />
            <div className="flex-1 max-w-[80%]">
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-2xl p-4 rounded-tl-sm inline-block animate-pulse-soft">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex items-end gap-3">
          <Button
            variant={isRecListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleVoiceInput}
            className={cn('h-12', isRecListening && 'animate-pulse ring-2 ring-red-500')}
            aria-label={isRecListening ? 'Detener grabación' : 'Iniciar grabación'}
          >
            {isRecListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder={isRecListening ? 'Escuchando...' : 'Escribe tu mensaje o habla con el micrófono...'}
              className="w-full min-h-[50px] max-h-[150px] px-4 py-3 rounded-xl border border-border bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none text-sm"
              rows={1}
            />
          </div>
          
          <Button 
            onClick={() => handleSendMessage(inputValue)} 
            disabled={!inputValue.trim() && !isRecListening}
            size="lg"
            className="h-12"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {isRecListening && transcript && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-muted-foreground italic"
          >
            🎤 "{transcript}"
          </motion.p>
        )}
      </div>

      {/* Vocabulary Sidebar */}
      <AnimatePresence>
        {showVocabulary && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-50 flex"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowVocabulary(false)} />
            <div className="w-96 max-w-full bg-card border-l border-border h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Vocabulario Reciente</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowVocabulary(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabTrigger value="all">Todos</TabTrigger>
                  <TabTrigger value="math">Mates</TabTrigger>
                  <TabTrigger value="lang">Idiomas</TabTrigger>
                  <TabTrigger value="false">Falsos Amigos</TabTrigger>
                </TabsList>
                
                <TabContent value="all">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {messages
                      .filter(m => m.metadata?.vocabulary)
                      .flatMap(m => m.metadata!.vocabulary!)
                      .slice(-20)
                      .reverse()
                      .map((v, i) => (
                        <div key={i} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{v.concept}</span>
                            <Badge variant="outline" className="text-xs" style={{ borderColor: `${getLanguageColor(v.category)}60` }}>
                              {v.category}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                            {LANGUAGES.map(l => (
                              <span key={l.code} className="px-2 py-0.5 rounded bg-muted" style={{ color: l.color }}>
                                {l.flag} {v[l.code as keyof VocabularyItem] as string}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabContent>
                
                <TabContent value="math">
                  <div className="space-y-2">
                    {MATH_VOCABULARY.map((v) => (
                      <div key={v.concept} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{v.es}</span>
                          <Badge variant="secondary" className="text-xs">Mates</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                          {LANGUAGES.map(l => (
                            <span key={l.code} className="px-2 py-0.5 rounded bg-muted" style={{ color: l.color }}>
                              {l.flag} {v[l.code as keyof VocabularyItem] as string}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabContent>
                
                <TabContent value="lang">
                  <div className="space-y-2">
                    {SCHOOL_VOCABULARY.map((v) => (
                      <div key={v.concept} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{v.es}</span>
                          <Badge variant="secondary" className="text-xs">Escolar</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                          {LANGUAGES.map(l => (
                            <span key={l.code} className="px-2 py-0.5 rounded bg-muted" style={{ color: l.color }}>
                              {l.flag} {v[l.code as keyof VocabularyItem] as string}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabContent>
                
                <TabContent value="false">
                  <div className="space-y-2">
                    {FALSE_FRIENDS.slice(0, 10).map((ff) => (
                      <div key={ff.pt} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-red-700 dark:text-red-300">{ff.pt}</span>
                          <Badge variant="danger" className="text-xs">FALSO AMIGO</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 text-sm">
                          <span className="text-red-600 dark:text-red-400">❌ {ff.esWrong}</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">✅ {ff.esCorrect}</span>
                          <span className="text-muted-foreground">CA: {ff.ca}</span>
                          <span className="text-muted-foreground">EN: {ff.en}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
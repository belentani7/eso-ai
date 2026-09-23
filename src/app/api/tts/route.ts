import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'es', voice = 'default' } = await request.json();
    
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Texto vacío' }, { status: 400 });
    }

    // In production, this would call ElevenLabs, Azure TTS, or similar
    // For demo, we return a mock response indicating the browser should use Web Speech API
    
    const languageCodes: Record<string, string> = {
      pt: 'pt-BR',
      es: 'es-ES',
      ca: 'ca-ES',
      en: 'en-GB',
    };
    
    return NextResponse.json({
      success: true,
      message: 'Use browser Web Speech API for TTS',
      text,
      language: languageCodes[language] || 'es-ES',
      voice: getVoiceForLanguage(language),
      rate: 0.9,
      pitch: 1,
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function getVoiceForLanguage(language: string): string {
  const voices: Record<string, string> = {
    pt: 'Lucia (Brazilian Portuguese)',
    es: 'Alvaro (Spanish) / Elvira (Spanish)',
    ca: 'Joana (Catalan)',
    en: 'Ryan (British English)',
  };
  return voices[language] || voices.es;
}
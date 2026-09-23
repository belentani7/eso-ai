import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'es';
    
    if (!audioFile) {
      return NextResponse.json({ error: 'Archivo de audio requerido' }, { status: 400 });
    }

    // In production, this would call OpenAI Whisper, Azure Speech, or similar
    // For demo, we return a mock response indicating the browser should use Web Speech API
    
    const languageCodes: Record<string, string> = {
      pt: 'pt-BR',
      es: 'es-ES',
      ca: 'ca-ES',
      en: 'en-GB',
    };
    
    return NextResponse.json({
      success: true,
      message: 'Use browser Web Speech API for STT',
      language: languageCodes[language] || 'es-ES',
      continuous: false,
      interimResults: true,
    });
  } catch (error) {
    console.error('STT API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
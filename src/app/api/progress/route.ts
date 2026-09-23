import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, this would fetch from a database
    // For demo, we return mock progress data
    
    return NextResponse.json({
      xp: 1250,
      level: 4,
      streak: 7,
      maxStreak: 12,
      gamesPlayed: {
        'false-friends': 5,
        'mate-escape': 3,
        'trilingue-express': 4,
        'catalan-challenge': 2,
        'super-quiz': 1,
      },
      gamesWon: {
        'false-friends': 4,
        'mate-escape': 2,
        'trilingue-express': 3,
        'catalan-challenge': 1,
        'super-quiz': 0,
      },
      vocabularyLearned: 45,
      mathProblemsSolved: 12,
      minutesSpent: 180,
      achievements: [
        { id: 'first-word', unlockedAt: '2024-01-15T10:00:00Z' },
        { id: 'streak-7', unlockedAt: '2024-01-20T10:00:00Z' },
        { id: 'false-friend-master', unlockedAt: '2024-01-18T10:00:00Z' },
      ],
      lastActive: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { xp, vocabularyLearned, mathProblemsSolved, gameResult, achievement } = await request.json();
    
    // In production, this would update database
    // For demo, we just acknowledge
    
    return NextResponse.json({
      success: true,
      message: 'Progreso actualizado',
      updates: {
        xp: xp || 0,
        vocabularyLearned: vocabularyLearned || 0,
        mathProblemsSolved: mathProblemsSolved || 0,
        gameResult: gameResult || null,
        achievement: achievement || null,
      },
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
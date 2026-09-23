import { NextRequest, NextResponse } from 'next/server';
import { GAMES } from '@/data';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      games: GAMES,
    });
  } catch (error) {
    console.error('Games API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gameId, score, won, timeSpent } = await request.json();
    
    const game = GAMES.find(g => g.id === gameId);
    if (!game) {
      return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 });
    }
    
    // Calculate XP based on game type and performance
    let xpEarned = 0;
    if (won) {
      xpEarned = game.id === 'super-quiz' ? 50 : 20;
      if (score > 80) xpEarned += 10; // Bonus for high score
    } else {
      xpEarned = Math.floor(score / 10) * 2; // Partial XP for participation
    }
    
    return NextResponse.json({
      success: true,
      xpEarned,
      game: game.name,
      score,
      won,
      message: won ? `¡Ganaste! +${xpEarned} XP` : `Buen intento. +${xpEarned} XP por participar`,
    });
  } catch (error) {
    console.error('Games API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
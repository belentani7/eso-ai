import { FalseFriendsGame } from './FalseFriendsGame';
import { MateEscapeGame } from './MateEscapeGame';
import { TrilingueExpressGame } from './TrilingueExpressGame';
import { CatalanChallengeGame } from './CatalanChallengeGame';
import { SuperQuizGame } from './SuperQuizGame';

export { FalseFriendsGame, MateEscapeGame, TrilingueExpressGame, CatalanChallengeGame, SuperQuizGame };

import { GAMES, GameType } from '@/data';

export const gameComponents: Record<string, React.ComponentType<{ onComplete: (won: boolean, score: number) => void }>> = {
  'false-friends': FalseFriendsGame,
  'mate-escape': MateEscapeGame,
  'trilingue-express': TrilingueExpressGame,
  'catalan-challenge': CatalanChallengeGame,
  'super-quiz': SuperQuizGame,
};

export function getGameComponent(gameId: string) {
  return gameComponents[gameId];
}

export function getGameInfo(gameId: string): GameType | undefined {
  return GAMES.find(g => g.id === gameId);
}

export { GAMES } from '@/data';
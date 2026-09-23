export { FalseFriendsGame } from './FalseFriendsGame';
export { MateEscapeGame } from './MateEscapeGame';
export { TrilingueExpressGame } from './TrilingueExpressGame';
export { CatalanChallengeGame } from './CatalanChallengeGame';
export { SuperQuizGame } from './SuperQuizGame';

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
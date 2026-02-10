import { GameState, Player } from '@/types/game-types';

/**
 * Validate if a raise amount is legal
 */
export function validateRaiseAmount(
  state: GameState,
  player: Player,
  raiseAmount: number
): { valid: boolean; error?: string } {
  const callAmount = state.currentBet - player.currentBet;
  const totalRequired = callAmount + raiseAmount;

  if (totalRequired > player.chips) {
    return {
      valid: false,
      error: 'チップが足りません'
    };
  }

  if (raiseAmount < state.minRaise) {
    return {
      valid: false,
      error: `最小レイズ額は ${state.minRaise} です`
    };
  }

  return { valid: true };
}

/**
 * Calculate call amount for current player
 */
export function getCallAmount(state: GameState, playerId: string): number {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return 0;

  return Math.min(
    state.currentBet - player.currentBet,
    player.chips
  );
}

/**
 * Check if player can check (no bet to call)
 */
export function canCheck(state: GameState, playerId: string): boolean {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return false;

  return player.currentBet === state.currentBet;
}

/**
 * Get minimum raise amount for current bet
 */
export function getMinimumRaise(state: GameState): number {
  return state.minRaise;
}

/**
 * Get maximum raise amount for player (all chips minus call amount)
 */
export function getMaximumRaise(state: GameState, playerId: string): number {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return 0;

  const callAmount = state.currentBet - player.currentBet;
  return player.chips - callAmount;
}

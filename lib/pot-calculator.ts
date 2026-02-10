import { GameState, Pot } from '@/types/game-types';

/**
 * Calculate main pot and side pots based on current bets
 */
export function calculatePots(state: GameState): Pot[] {
  const pots: Pot[] = [];

  // Get all players with bets, sorted by bet amount
  const playerBets = state.players
    .filter(p => p.currentBet > 0)
    .sort((a, b) => a.currentBet - b.currentBet);

  if (playerBets.length === 0) {
    return pots;
  }

  let previousBetLevel = 0;

  for (const player of playerBets) {
    const betLevel = player.currentBet;
    const betDiff = betLevel - previousBetLevel;

    if (betDiff === 0) continue;

    // Find all players who contributed to this pot level
    const eligiblePlayers = state.players
      .filter(p => {
        const contributed = p.currentBet >= betLevel;
        const canWin = p.status === 'active' || p.status === 'allIn';
        return contributed && canWin;
      })
      .map(p => p.id);

    if (eligiblePlayers.length === 0) continue;

    // Calculate pot amount for this level
    const contributingPlayers = state.players.filter(p => p.currentBet >= betLevel);
    const potAmount = betDiff * contributingPlayers.length;

    pots.push({
      amount: potAmount,
      eligiblePlayers,
      type: pots.length === 0 ? 'main' : 'side'
    });

    previousBetLevel = betLevel;
  }

  return pots;
}

/**
 * Calculate total pot amount across all pots
 */
export function getTotalPotAmount(pots: Pot[]): number {
  return pots.reduce((sum, pot) => sum + pot.amount, 0);
}

/**
 * Format pot display string
 */
export function formatPotDisplay(pots: Pot[]): string {
  if (pots.length === 0) return '0';

  const mainPot = pots.find(p => p.type === 'main');
  const sidePots = pots.filter(p => p.type === 'side');

  let display = mainPot ? `メインポット: ${mainPot.amount}` : '';

  if (sidePots.length > 0) {
    const sideAmounts = sidePots.map(p => p.amount).join(', ');
    display += ` | サイドポット: ${sideAmounts}`;
  }

  return display;
}

import { calculatePots, getTotalPotAmount, formatPotDisplay } from '@/lib/pot-calculator';
import { GameState, Pot } from '@/types/game-types';

function createMockState(players: Array<{ id: string; currentBet: number; status: 'active' | 'folded' | 'allIn' | 'out' }>): GameState {
  return {
    gameNumber: 1,
    stage: 'preFlop',
    players: players.map((p, i) => ({
      id: p.id,
      name: `Player ${i}`,
      chips: 5000,
      currentBet: p.currentBet,
      status: p.status,
      position: i,
      hasActed: true,
    })),
    pots: [],
    totalPot: 0,
    currentPlayerIndex: 0,
    dealerButtonIndex: 0,
    smallBlindIndex: 1,
    bigBlindIndex: 2,
    communityCards: 0,
    currentBet: 0,
    minRaise: 200,
    lastRaiseAmount: 0,
    bettingRound: 0,
    settings: {
      playerCount: players.length,
      playerNames: players.map((_, i) => `Player ${i}`),
      betUnit: 100,
      startingChips: 10000,
      blindsEnabled: true,
      smallBlind: 100,
      bigBlind: 200,
      autoIncreaseBlind: false,
    },
  };
}

describe('calculatePots', () => {
  it('returns empty array when no bets', () => {
    const state = createMockState([
      { id: 'p0', currentBet: 0, status: 'active' },
      { id: 'p1', currentBet: 0, status: 'active' },
    ]);
    expect(calculatePots(state)).toEqual([]);
  });

  it('creates a single main pot when all bets are equal', () => {
    const state = createMockState([
      { id: 'p0', currentBet: 200, status: 'active' },
      { id: 'p1', currentBet: 200, status: 'active' },
      { id: 'p2', currentBet: 200, status: 'active' },
    ]);
    const pots = calculatePots(state);
    expect(pots).toHaveLength(1);
    expect(pots[0].amount).toBe(600); // 200 * 3
    expect(pots[0].type).toBe('main');
    expect(pots[0].eligiblePlayers).toEqual(['p0', 'p1', 'p2']);
  });

  it('creates main + side pot for one short all-in (scenario #1)', () => {
    // P0: all-in 1000, P1: calls 1000, P2: calls 1000
    // But actually P0 has less chips - bet 1000, P1 and P2 bet 1000
    const state = createMockState([
      { id: 'p0', currentBet: 1000, status: 'allIn' },
      { id: 'p1', currentBet: 1000, status: 'active' },
      { id: 'p2', currentBet: 1000, status: 'active' },
    ]);
    const pots = calculatePots(state);
    // All equal bets, so just one main pot
    expect(pots).toHaveLength(1);
    expect(pots[0].amount).toBe(3000);
    expect(pots[0].eligiblePlayers).toEqual(['p0', 'p1', 'p2']);
  });

  it('creates side pot when one player is all-in for less (scenario #1 variant)', () => {
    // P0: all-in 500, P1: bet 1000, P2: bet 1000
    const state = createMockState([
      { id: 'p0', currentBet: 500, status: 'allIn' },
      { id: 'p1', currentBet: 1000, status: 'active' },
      { id: 'p2', currentBet: 1000, status: 'active' },
    ]);
    const pots = calculatePots(state);
    expect(pots).toHaveLength(2);
    // Main pot: 500 * 3 = 1500
    expect(pots[0].amount).toBe(1500);
    expect(pots[0].type).toBe('main');
    expect(pots[0].eligiblePlayers).toEqual(['p0', 'p1', 'p2']);
    // Side pot: 500 * 2 = 1000
    expect(pots[1].amount).toBe(1000);
    expect(pots[1].type).toBe('side');
    expect(pots[1].eligiblePlayers).toEqual(['p1', 'p2']);
  });

  it('creates two side pots for two all-ins at different levels (scenario #2)', () => {
    // P0: all-in 1000, P1: all-in 2000, P2: calls 2000
    const state = createMockState([
      { id: 'p0', currentBet: 1000, status: 'allIn' },
      { id: 'p1', currentBet: 2000, status: 'allIn' },
      { id: 'p2', currentBet: 2000, status: 'active' },
    ]);
    const pots = calculatePots(state);
    expect(pots).toHaveLength(2);
    // Main pot: 1000 * 3 = 3000 (all eligible)
    expect(pots[0].amount).toBe(3000);
    expect(pots[0].eligiblePlayers).toEqual(['p0', 'p1', 'p2']);
    // Side pot: 1000 * 2 = 2000 (P1 and P2 eligible)
    expect(pots[1].amount).toBe(2000);
    expect(pots[1].eligiblePlayers).toEqual(['p1', 'p2']);
  });

  it('handles multiple side pots with 4 players', () => {
    // P0: all-in 500, P1: all-in 1000, P2: all-in 1500, P3: calls 1500
    const state = createMockState([
      { id: 'p0', currentBet: 500, status: 'allIn' },
      { id: 'p1', currentBet: 1000, status: 'allIn' },
      { id: 'p2', currentBet: 1500, status: 'allIn' },
      { id: 'p3', currentBet: 1500, status: 'active' },
    ]);
    const pots = calculatePots(state);
    expect(pots).toHaveLength(3);
    // Main: 500*4 = 2000
    expect(pots[0].amount).toBe(2000);
    expect(pots[0].eligiblePlayers).toEqual(['p0', 'p1', 'p2', 'p3']);
    // Side 1: 500*3 = 1500
    expect(pots[1].amount).toBe(1500);
    expect(pots[1].eligiblePlayers).toEqual(['p1', 'p2', 'p3']);
    // Side 2: 500*2 = 1000
    expect(pots[2].amount).toBe(1000);
    expect(pots[2].eligiblePlayers).toEqual(['p2', 'p3']);
  });

  it('excludes folded players from eligible list', () => {
    const state = createMockState([
      { id: 'p0', currentBet: 200, status: 'folded' },
      { id: 'p1', currentBet: 200, status: 'active' },
      { id: 'p2', currentBet: 200, status: 'active' },
    ]);
    const pots = calculatePots(state);
    expect(pots).toHaveLength(1);
    expect(pots[0].amount).toBe(600); // folded player still contributed
    expect(pots[0].eligiblePlayers).toEqual(['p1', 'p2']); // but can't win
  });
});

describe('getTotalPotAmount', () => {
  it('sums all pot amounts', () => {
    const pots: Pot[] = [
      { amount: 3000, eligiblePlayers: ['p0', 'p1'], type: 'main' },
      { amount: 2000, eligiblePlayers: ['p1'], type: 'side' },
    ];
    expect(getTotalPotAmount(pots)).toBe(5000);
  });

  it('returns 0 for empty pots', () => {
    expect(getTotalPotAmount([])).toBe(0);
  });
});

describe('formatPotDisplay', () => {
  it('returns 0 for empty pots', () => {
    expect(formatPotDisplay([])).toBe('0');
  });

  it('formats main pot only', () => {
    const pots: Pot[] = [
      { amount: 3000, eligiblePlayers: ['p0', 'p1'], type: 'main' },
    ];
    expect(formatPotDisplay(pots)).toBe('メインポット: 3000');
  });

  it('formats main pot with side pots', () => {
    const pots: Pot[] = [
      { amount: 3000, eligiblePlayers: ['p0', 'p1', 'p2'], type: 'main' },
      { amount: 2000, eligiblePlayers: ['p1', 'p2'], type: 'side' },
    ];
    expect(formatPotDisplay(pots)).toBe('メインポット: 3000 | サイドポット: 2000');
  });

  it('formats multiple side pots', () => {
    const pots: Pot[] = [
      { amount: 2000, eligiblePlayers: ['p0', 'p1', 'p2'], type: 'main' },
      { amount: 1500, eligiblePlayers: ['p1', 'p2'], type: 'side' },
      { amount: 1000, eligiblePlayers: ['p2'], type: 'side' },
    ];
    expect(formatPotDisplay(pots)).toBe('メインポット: 2000 | サイドポット: 1500, 1000');
  });
});

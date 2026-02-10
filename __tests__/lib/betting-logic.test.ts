import {
  validateRaiseAmount,
  getCallAmount,
  canCheck,
  getMinimumRaise,
  getMaximumRaise
} from '@/lib/betting-logic';
import { GameState, Player } from '@/types/game-types';

function createMockState(overrides: Partial<GameState> = {}): GameState {
  return {
    gameNumber: 1,
    stage: 'preFlop',
    players: [
      { id: 'p0', name: 'Alice', chips: 5000, currentBet: 0, status: 'active', position: 0, hasActed: false },
      { id: 'p1', name: 'Bob', chips: 5000, currentBet: 200, status: 'active', position: 1, hasActed: false },
      { id: 'p2', name: 'Carol', chips: 5000, currentBet: 0, status: 'active', position: 2, hasActed: false },
    ],
    pots: [],
    totalPot: 200,
    currentPlayerIndex: 0,
    dealerButtonIndex: 0,
    smallBlindIndex: 1,
    bigBlindIndex: 2,
    communityCards: 0,
    currentBet: 200,
    minRaise: 200,
    lastRaiseAmount: 0,
    bettingRound: 0,
    settings: {
      playerCount: 3,
      playerNames: ['Alice', 'Bob', 'Carol'],
      betUnit: 100,
      startingChips: 5000,
      blindsEnabled: true,
      smallBlind: 100,
      bigBlind: 200,
      autoIncreaseBlind: false,
    },
    ...overrides,
  };
}

describe('validateRaiseAmount', () => {
  it('returns valid for a legal raise', () => {
    const state = createMockState();
    const player = state.players[0]; // chips=5000, currentBet=0, currentBet=200
    const result = validateRaiseAmount(state, player, 200);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns invalid when raise is below minimum', () => {
    const state = createMockState();
    const player = state.players[0];
    const result = validateRaiseAmount(state, player, 100); // min is 200
    expect(result.valid).toBe(false);
    expect(result.error).toContain('200');
  });

  it('returns invalid when player has insufficient chips', () => {
    const state = createMockState();
    const player: Player = { ...state.players[0], chips: 300 };
    // call=200, raise=200, total=400 > 300
    const result = validateRaiseAmount(state, player, 200);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('チップが足りません');
  });

  it('returns valid when raise exactly equals remaining chips minus call', () => {
    const state = createMockState();
    const player: Player = { ...state.players[0], chips: 400 };
    // call=200, raise=200, total=400 = 400 chips
    const result = validateRaiseAmount(state, player, 200);
    expect(result.valid).toBe(true);
  });
});

describe('getCallAmount', () => {
  it('returns the difference between current bet and player bet', () => {
    const state = createMockState();
    expect(getCallAmount(state, 'p0')).toBe(200); // currentBet=200, playerBet=0
  });

  it('returns 0 when player bet matches current bet', () => {
    const state = createMockState();
    expect(getCallAmount(state, 'p1')).toBe(0); // both 200
  });

  it('caps call amount at player chips', () => {
    const state = createMockState({
      players: [
        { id: 'p0', name: 'Alice', chips: 100, currentBet: 0, status: 'active', position: 0, hasActed: false },
        { id: 'p1', name: 'Bob', chips: 5000, currentBet: 200, status: 'active', position: 1, hasActed: false },
      ],
    });
    expect(getCallAmount(state, 'p0')).toBe(100); // min(200, 100)
  });

  it('returns 0 for unknown player', () => {
    const state = createMockState();
    expect(getCallAmount(state, 'unknown')).toBe(0);
  });
});

describe('canCheck', () => {
  it('returns true when player bet matches current bet', () => {
    const state = createMockState();
    expect(canCheck(state, 'p1')).toBe(true); // both 200
  });

  it('returns false when player bet is below current bet', () => {
    const state = createMockState();
    expect(canCheck(state, 'p0')).toBe(false); // 0 < 200
  });

  it('returns false for unknown player', () => {
    const state = createMockState();
    expect(canCheck(state, 'unknown')).toBe(false);
  });
});

describe('getMinimumRaise', () => {
  it('returns the minRaise from state', () => {
    const state = createMockState({ minRaise: 400 });
    expect(getMinimumRaise(state)).toBe(400);
  });
});

describe('getMaximumRaise', () => {
  it('returns chips minus call amount', () => {
    const state = createMockState();
    // p0: chips=5000, call=200, max raise=4800
    expect(getMaximumRaise(state, 'p0')).toBe(4800);
  });

  it('returns full chips when no call needed', () => {
    const state = createMockState();
    // p1: chips=5000, call=0, max raise=5000
    expect(getMaximumRaise(state, 'p1')).toBe(5000);
  });

  it('returns 0 for unknown player', () => {
    const state = createMockState();
    expect(getMaximumRaise(state, 'unknown')).toBe(0);
  });
});

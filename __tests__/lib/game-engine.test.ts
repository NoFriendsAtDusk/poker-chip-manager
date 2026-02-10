import {
  initializeGame,
  processAction,
  distributeChips,
  startNextGame,
  getAvailableActions
} from '@/lib/game-engine';
import { GameSettings, GameState } from '@/types/game-types';

const defaultSettings: GameSettings = {
  playerCount: 4,
  playerNames: ['Alice', 'Bob', 'Carol', 'Dave'],
  betUnit: 100,
  startingChips: 10000,
  blindsEnabled: true,
  smallBlind: 100,
  bigBlind: 200,
  autoIncreaseBlind: false,
};

function createDeterministicState(overrides: Partial<GameSettings> = {}): GameState {
  const settings = { ...defaultSettings, ...overrides };
  const state = initializeGame(settings);
  // Pin dealer to position 0 for deterministic tests
  state.dealerButtonIndex = 0;
  state.smallBlindIndex = 1;
  state.bigBlindIndex = 2;
  state.currentPlayerIndex = 3;

  // Re-post blinds with deterministic positions
  state.players.forEach(p => {
    p.chips = settings.startingChips;
    p.currentBet = 0;
    p.status = 'active';
    p.hasActed = false;
  });

  if (settings.blindsEnabled) {
    // SB
    state.players[1].chips -= settings.smallBlind;
    state.players[1].currentBet = settings.smallBlind;
    // BB
    state.players[2].chips -= settings.bigBlind;
    state.players[2].currentBet = settings.bigBlind;
    state.totalPot = settings.smallBlind + settings.bigBlind;
    state.currentBet = settings.bigBlind;
    state.minRaise = settings.bigBlind;
  } else {
    state.totalPot = 0;
    state.currentBet = 0;
  }

  return state;
}

describe('initializeGame', () => {
  it('creates correct number of players', () => {
    const state = initializeGame(defaultSettings);
    expect(state.players).toHaveLength(4);
  });

  it('assigns correct player names', () => {
    const state = initializeGame(defaultSettings);
    expect(state.players.map(p => p.name)).toEqual(['Alice', 'Bob', 'Carol', 'Dave']);
  });

  it('gives each player starting chips minus blinds', () => {
    const state = initializeGame(defaultSettings);
    const totalChips = state.players.reduce((sum, p) => sum + p.chips + p.currentBet, 0);
    expect(totalChips).toBe(defaultSettings.startingChips * 4);
  });

  it('sets stage to preFlop', () => {
    const state = initializeGame(defaultSettings);
    expect(state.stage).toBe('preFlop');
  });

  it('posts blinds when enabled', () => {
    const state = initializeGame(defaultSettings);
    expect(state.totalPot).toBe(300); // 100 + 200
    expect(state.currentBet).toBe(200);
  });

  it('does not post blinds when disabled', () => {
    const state = initializeGame({ ...defaultSettings, blindsEnabled: false });
    expect(state.totalPot).toBe(0);
    expect(state.currentBet).toBe(0);
    state.players.forEach(p => {
      expect(p.chips).toBe(10000);
      expect(p.currentBet).toBe(0);
    });
  });

  it('sets game number to 1', () => {
    const state = initializeGame(defaultSettings);
    expect(state.gameNumber).toBe(1);
  });

  it('sets community cards to 0', () => {
    const state = initializeGame(defaultSettings);
    expect(state.communityCards).toBe(0);
  });
});

describe('processAction - fold', () => {
  it('sets player status to folded', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'fold', playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.status).toBe('folded');
  });

  it('does not change pot amount', () => {
    const state = createDeterministicState();
    const potBefore = state.totalPot;
    const result = processAction(state, { type: 'fold', playerId: 'player-3' });
    expect(result.totalPot).toBe(potBefore);
  });

  it('marks player as acted', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'fold', playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.hasActed).toBe(true);
  });
});

describe('processAction - check', () => {
  it('does not change chips', () => {
    const state = createDeterministicState();
    // BB can check (currentBet matches)
    state.currentPlayerIndex = 2; // BB position
    state.players[2].hasActed = false;
    // All others have acted
    state.players[0].hasActed = true;
    state.players[1].hasActed = true;
    state.players[3].hasActed = true;
    // Set all active players to currentBet
    state.players.forEach(p => { p.currentBet = 200; p.chips = 9800; });
    state.currentBet = 200;

    const chipsBefore = state.players[2].chips;
    const result = processAction(state, { type: 'check', playerId: 'player-2' });
    const player = result.players.find(p => p.id === 'player-2')!;
    expect(player.chips).toBe(chipsBefore);
  });
});

describe('processAction - call', () => {
  it('deducts correct amount and adds to pot', () => {
    const state = createDeterministicState();
    // Player 3 (current) calls BB of 200
    const result = processAction(state, { type: 'call', playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.chips).toBe(9800); // 10000 - 200
    expect(player.currentBet).toBe(200);
    expect(result.totalPot).toBe(500); // 300 + 200
  });

  it('sets player to allIn when calling with exact chips', () => {
    const state = createDeterministicState();
    state.players[3].chips = 200; // Exactly enough to call
    const result = processAction(state, { type: 'call', playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.status).toBe('allIn');
    expect(player.chips).toBe(0);
  });
});

describe('processAction - raise', () => {
  it('deducts call + raise amount from chips', () => {
    const state = createDeterministicState();
    // Player 3 raises 200 (call 200 + raise 200 = 400 total)
    const result = processAction(state, { type: 'raise', amount: 200, playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.chips).toBe(9600); // 10000 - 400
    expect(player.currentBet).toBe(400);
  });

  it('updates currentBet and minRaise', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'raise', amount: 200, playerId: 'player-3' });
    expect(result.currentBet).toBe(400); // 200 + 200
    expect(result.minRaise).toBe(200);
  });

  it('resets hasActed for other active players', () => {
    const state = createDeterministicState();
    state.players[0].hasActed = true;
    const result = processAction(state, { type: 'raise', amount: 200, playerId: 'player-3' });
    const dealer = result.players.find(p => p.id === 'player-0')!;
    expect(dealer.hasActed).toBe(false);
  });

  it('ignores invalid raise below minimum', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'raise', amount: 50, playerId: 'player-3' });
    // State should be unchanged (chips not deducted)
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.chips).toBe(10000);
  });

  it('ignores raise when not enough chips', () => {
    const state = createDeterministicState();
    state.players[3].chips = 300; // can call 200 but not raise 200 more
    const result = processAction(state, { type: 'raise', amount: 200, playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.chips).toBe(300); // unchanged
  });
});

describe('processAction - allIn', () => {
  it('sets chips to 0 and status to allIn', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'allIn', playerId: 'player-3' });
    const player = result.players.find(p => p.id === 'player-3')!;
    expect(player.chips).toBe(0);
    expect(player.status).toBe('allIn');
  });

  it('adds all chips to pot', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'allIn', playerId: 'player-3' });
    expect(result.totalPot).toBe(10300); // 300 + 10000
  });

  it('updates currentBet when all-in exceeds it', () => {
    const state = createDeterministicState();
    const result = processAction(state, { type: 'allIn', playerId: 'player-3' });
    expect(result.currentBet).toBe(10000); // player had 10000
  });

  it('resets hasActed for other players when it is a raise', () => {
    const state = createDeterministicState();
    state.players[0].hasActed = true;
    const result = processAction(state, { type: 'allIn', playerId: 'player-3' });
    const dealer = result.players.find(p => p.id === 'player-0')!;
    expect(dealer.hasActed).toBe(false);
  });
});

describe('stage advancement', () => {
  it('advances to showdown when all but one fold', () => {
    const state = createDeterministicState({ playerCount: 3, playerNames: ['A', 'B', 'C'] });
    state.dealerButtonIndex = 0;
    state.smallBlindIndex = 1;
    state.bigBlindIndex = 2;
    state.currentPlayerIndex = 0;
    state.players[0].hasActed = false;

    // Player 0 folds
    let result = processAction(state, { type: 'fold', playerId: 'player-0' });
    // Player 1 (SB) folds
    result = processAction(result, { type: 'fold', playerId: 'player-1' });
    // Only player 2 (BB) remains → auto-win, skip to gameOver
    expect(result.stage).toBe('gameOver');
  });

  it('advances to flop after all players act in preFlop', () => {
    const state = createDeterministicState();
    // Player 3 calls
    let result = processAction(state, { type: 'call', playerId: 'player-3' });
    // Player 0 calls
    result = processAction(result, { type: 'call', playerId: 'player-0' });
    // Player 1 (SB) calls (needs 100 more)
    result = processAction(result, { type: 'call', playerId: 'player-1' });
    // Player 2 (BB) checks
    result = processAction(result, { type: 'check', playerId: 'player-2' });

    expect(result.stage).toBe('flop');
    expect(result.communityCards).toBe(3);
  });

  it('resets currentBet and player bets on stage advance', () => {
    const state = createDeterministicState();
    let result = processAction(state, { type: 'call', playerId: 'player-3' });
    result = processAction(result, { type: 'call', playerId: 'player-0' });
    result = processAction(result, { type: 'call', playerId: 'player-1' });
    result = processAction(result, { type: 'check', playerId: 'player-2' });

    expect(result.currentBet).toBe(0);
    result.players.forEach(p => {
      expect(p.currentBet).toBe(0);
    });
  });
});

describe('distributeChips', () => {
  it('gives full pot to single winner', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.pots = [{ amount: 1000, eligiblePlayers: ['player-0', 'player-1'], type: 'main' }];
    state.players[0].chips = 9000;
    state.players[1].chips = 9000;

    const result = distributeChips(state, [{ potIndex: 0, winners: ['player-0'] }]);
    expect(result.players.find(p => p.id === 'player-0')!.chips).toBe(10000);
    expect(result.players.find(p => p.id === 'player-1')!.chips).toBe(9000);
    expect(result.stage).toBe('gameOver');
  });

  it('splits pot between multiple winners', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.pots = [{ amount: 1000, eligiblePlayers: ['player-0', 'player-1'], type: 'main' }];
    state.players[0].chips = 9000;
    state.players[1].chips = 9000;

    const result = distributeChips(state, [{ potIndex: 0, winners: ['player-0', 'player-1'] }]);
    expect(result.players.find(p => p.id === 'player-0')!.chips).toBe(9500);
    expect(result.players.find(p => p.id === 'player-1')!.chips).toBe(9500);
  });

  it('gives remainder to first winner on odd split', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.pots = [{ amount: 1001, eligiblePlayers: ['player-0', 'player-1'], type: 'main' }];
    state.players[0].chips = 0;
    state.players[1].chips = 0;

    const result = distributeChips(state, [{ potIndex: 0, winners: ['player-0', 'player-1'] }]);
    expect(result.players.find(p => p.id === 'player-0')!.chips).toBe(501); // 500 + 1 remainder
    expect(result.players.find(p => p.id === 'player-1')!.chips).toBe(500);
  });

  it('distributes side pots to different winners', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.pots = [
      { amount: 3000, eligiblePlayers: ['player-0', 'player-1', 'player-2'], type: 'main' },
      { amount: 2000, eligiblePlayers: ['player-1', 'player-2'], type: 'side' },
    ];
    state.players[0].chips = 0;
    state.players[1].chips = 0;
    state.players[2].chips = 0;

    // Main pot winner: player-0 (short stack)
    // Side pot winner: player-1
    const result = distributeChips(state, [
      { potIndex: 0, winners: ['player-0'] },
      { potIndex: 1, winners: ['player-1'] },
    ]);
    expect(result.players.find(p => p.id === 'player-0')!.chips).toBe(3000); // full main pot
    expect(result.players.find(p => p.id === 'player-1')!.chips).toBe(2000); // full side pot
    expect(result.players.find(p => p.id === 'player-2')!.chips).toBe(0);
  });

  it('resets totalPot and pots after distribution', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.totalPot = 1000;
    state.pots = [{ amount: 1000, eligiblePlayers: ['player-0', 'player-1'], type: 'main' }];

    const result = distributeChips(state, [{ potIndex: 0, winners: ['player-0'] }]);
    expect(result.totalPot).toBe(0);
    expect(result.pots).toEqual([]);
  });

  it('conserves total chips across distribution', () => {
    const state = createDeterministicState();
    state.stage = 'showdown';
    state.pots = [
      { amount: 900, eligiblePlayers: ['player-0', 'player-1', 'player-2'], type: 'main' },
      { amount: 1400, eligiblePlayers: ['player-1', 'player-2'], type: 'side' },
    ];
    state.players[0].chips = 0;
    state.players[1].chips = 9300;
    state.players[2].chips = 9300;
    state.players[3].chips = 10000;
    state.totalPot = 2300;

    const totalBefore = state.players.reduce((sum, p) => sum + p.chips, 0) + state.totalPot;

    const result = distributeChips(state, [
      { potIndex: 0, winners: ['player-0'] },
      { potIndex: 1, winners: ['player-2'] },
    ]);

    const totalAfter = result.players.reduce((sum, p) => sum + p.chips, 0) + result.totalPot;
    expect(totalAfter).toBe(totalBefore);
  });
});

describe('startNextGame', () => {
  it('increments game number', () => {
    const state = createDeterministicState();
    state.stage = 'gameOver';
    state.gameNumber = 1;
    const result = startNextGame(state);
    expect(result.gameNumber).toBe(2);
  });

  it('removes players with 0 chips', () => {
    const state = createDeterministicState();
    state.stage = 'gameOver';
    state.players[3].chips = 0;
    const result = startNextGame(state);
    expect(result.players).toHaveLength(3);
  });

  it('returns same state when fewer than 2 players have chips', () => {
    const state = createDeterministicState();
    state.stage = 'gameOver';
    state.players[0].chips = 0;
    state.players[1].chips = 0;
    state.players[2].chips = 0;
    // Only player 3 has chips
    const result = startNextGame(state);
    expect(result).toBe(state); // exact same reference
  });

  it('increases blinds when autoIncreaseBlind is enabled', () => {
    const state = createDeterministicState({ autoIncreaseBlind: true });
    state.stage = 'gameOver';
    const result = startNextGame(state);
    expect(result.settings.smallBlind).toBe(150); // 100 * 1.5
    expect(result.settings.bigBlind).toBe(300); // 200 * 1.5
  });

  it('does not increase blinds when autoIncreaseBlind is disabled', () => {
    const state = createDeterministicState({ autoIncreaseBlind: false });
    state.stage = 'gameOver';
    const result = startNextGame(state);
    expect(result.settings.smallBlind).toBe(100);
    expect(result.settings.bigBlind).toBe(200);
  });

  it('resets stage to preFlop', () => {
    const state = createDeterministicState();
    state.stage = 'gameOver';
    const result = startNextGame(state);
    expect(result.stage).toBe('preFlop');
  });
});

describe('getAvailableActions', () => {
  it('includes fold and allIn always', () => {
    const state = createDeterministicState();
    const actions = getAvailableActions(state);
    expect(actions).toContain('fold');
    expect(actions).toContain('allIn');
  });

  it('includes call when player bet is below current bet', () => {
    const state = createDeterministicState();
    // Player 3 has currentBet=0, state.currentBet=200
    const actions = getAvailableActions(state);
    expect(actions).toContain('call');
    expect(actions).not.toContain('check');
  });

  it('includes check when player bet matches current bet', () => {
    const state = createDeterministicState();
    state.currentPlayerIndex = 2; // BB with currentBet=200
    state.currentBet = 200;
    const actions = getAvailableActions(state);
    expect(actions).toContain('check');
    expect(actions).not.toContain('call');
  });

  it('includes raise when player has enough chips', () => {
    const state = createDeterministicState();
    // Player 3: chips=10000, call=200, minRaise=200, needs 400 < 10000
    const actions = getAvailableActions(state);
    expect(actions).toContain('raise');
  });

  it('excludes raise when player cannot afford it', () => {
    const state = createDeterministicState();
    state.players[3].chips = 200; // exactly enough to call, not raise
    const actions = getAvailableActions(state);
    expect(actions).not.toContain('raise');
  });
});

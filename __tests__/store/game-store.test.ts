import { useGameStore } from '@/store/game-store';
import { GameSettings } from '@/types/game-types';

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

function setupGame(settings: GameSettings = defaultSettings) {
  const store = useGameStore.getState();
  store.setSettings(settings);
  store.startGame();
  return useGameStore.getState();
}

beforeEach(() => {
  // Reset store between tests
  useGameStore.setState({
    gameState: null,
    settings: null,
    undoHistory: [],
  });
});

describe('Undo feature — undoHistory tracking', () => {
  it('starts with empty undoHistory', () => {
    setupGame();
    expect(useGameStore.getState().undoHistory).toHaveLength(0);
  });

  it('pushes snapshot to undoHistory on performAction', () => {
    setupGame();
    const stateBefore = useGameStore.getState().gameState!;
    const currentPlayerId = stateBefore.players[stateBefore.currentPlayerIndex].id;

    useGameStore.getState().performAction({ type: 'fold', playerId: currentPlayerId });

    const { undoHistory } = useGameStore.getState();
    expect(undoHistory).toHaveLength(1);
    // The snapshot should have the pre-action stage
    expect(undoHistory[0].stage).toBe('preFlop');
  });

  it('caps undoHistory at 20 entries', () => {
    setupGame();

    // Perform 25 actions (fold repeatedly — game will end and restart)
    for (let i = 0; i < 25; i++) {
      const state = useGameStore.getState().gameState!;
      if (state.stage === 'gameOver') {
        useGameStore.getState().nextGame();
      }
      if (state.stage === 'showdown') break;

      const currentState = useGameStore.getState().gameState!;
      if (currentState.stage === 'gameOver' || currentState.stage === 'showdown') break;

      const player = currentState.players[currentState.currentPlayerIndex];
      if (player.status === 'active') {
        useGameStore.getState().performAction({ type: 'fold', playerId: player.id });
      }
    }

    expect(useGameStore.getState().undoHistory.length).toBeLessThanOrEqual(20);
  });
});

describe('Undo feature — undoLastAction', () => {
  it('restores previous state on undo', () => {
    setupGame();
    const stateBeforeAction = structuredClone(useGameStore.getState().gameState!);
    const currentPlayerId = stateBeforeAction.players[stateBeforeAction.currentPlayerIndex].id;

    useGameStore.getState().performAction({ type: 'fold', playerId: currentPlayerId });

    // Verify the action happened
    const stateAfterAction = useGameStore.getState().gameState!;
    const foldedPlayer = stateAfterAction.players.find(p => p.id === currentPlayerId)!;
    expect(foldedPlayer.status).toBe('folded');

    // Undo
    useGameStore.getState().undoLastAction();

    // Verify state is restored
    const stateAfterUndo = useGameStore.getState().gameState!;
    const restoredPlayer = stateAfterUndo.players.find(p => p.id === currentPlayerId)!;
    expect(restoredPlayer.status).toBe('active');
    expect(stateAfterUndo.currentPlayerIndex).toBe(stateBeforeAction.currentPlayerIndex);
  });

  it('pops from undoHistory on undo', () => {
    setupGame();
    const state = useGameStore.getState().gameState!;
    const player1 = state.players[state.currentPlayerIndex];

    useGameStore.getState().performAction({ type: 'fold', playerId: player1.id });
    expect(useGameStore.getState().undoHistory).toHaveLength(1);

    useGameStore.getState().undoLastAction();
    expect(useGameStore.getState().undoHistory).toHaveLength(0);
  });

  it('is a no-op when undoHistory is empty', () => {
    setupGame();
    const stateBefore = structuredClone(useGameStore.getState().gameState!);

    useGameStore.getState().undoLastAction();

    const stateAfter = useGameStore.getState().gameState!;
    expect(stateAfter.currentPlayerIndex).toBe(stateBefore.currentPlayerIndex);
    expect(stateAfter.totalPot).toBe(stateBefore.totalPot);
  });

  it('can undo across a stage boundary', () => {
    setupGame();

    // Have all 4 players call/check through preflop to trigger advanceStage
    const actions: string[] = [];
    for (let i = 0; i < 10; i++) {
      const state = useGameStore.getState().gameState!;
      if (state.stage !== 'preFlop') break;

      const player = state.players[state.currentPlayerIndex];
      if (player.status !== 'active') break;

      if (player.currentBet < state.currentBet) {
        useGameStore.getState().performAction({ type: 'call', playerId: player.id });
        actions.push(`call:${player.id}`);
      } else {
        useGameStore.getState().performAction({ type: 'check', playerId: player.id });
        actions.push(`check:${player.id}`);
      }
    }

    // Check if stage advanced past preFlop
    const stateAfterRound = useGameStore.getState().gameState!;
    if (stateAfterRound.stage !== 'preFlop') {
      // Undo the last action — should revert to preFlop
      useGameStore.getState().undoLastAction();
      const stateAfterUndo = useGameStore.getState().gameState!;
      expect(stateAfterUndo.stage).toBe('preFlop');
    }
  });
});

describe('Undo feature — history clearing', () => {
  it('clears undoHistory on startGame', () => {
    setupGame();
    const state = useGameStore.getState().gameState!;
    const player = state.players[state.currentPlayerIndex];
    useGameStore.getState().performAction({ type: 'fold', playerId: player.id });
    expect(useGameStore.getState().undoHistory.length).toBeGreaterThan(0);

    // Start a new game
    useGameStore.getState().startGame();
    expect(useGameStore.getState().undoHistory).toHaveLength(0);
  });

  it('clears undoHistory on nextGame', () => {
    setupGame();

    // Quick game: fold 3 times to reach gameOver
    for (let i = 0; i < 3; i++) {
      const state = useGameStore.getState().gameState!;
      if (state.stage === 'gameOver' || state.stage === 'showdown') break;
      const player = state.players[state.currentPlayerIndex];
      useGameStore.getState().performAction({ type: 'fold', playerId: player.id });
    }

    // Handle showdown if needed
    const currentState = useGameStore.getState().gameState!;
    if (currentState.stage === 'showdown') {
      const activePlayers = currentState.players.filter(
        p => p.status === 'active' || p.status === 'allIn'
      );
      useGameStore.getState().selectWinners([{
        potIndex: 0,
        winners: [activePlayers[0].id],
      }]);
    }

    expect(useGameStore.getState().undoHistory.length).toBeGreaterThan(0);

    useGameStore.getState().nextGame();
    expect(useGameStore.getState().undoHistory).toHaveLength(0);
  });

  it('clears undoHistory on resetGame', () => {
    setupGame();
    const state = useGameStore.getState().gameState!;
    const player = state.players[state.currentPlayerIndex];
    useGameStore.getState().performAction({ type: 'fold', playerId: player.id });

    useGameStore.getState().resetGame();
    expect(useGameStore.getState().undoHistory).toHaveLength(0);
  });
});

describe('Undo feature — selectWinners isolation', () => {
  it('selectWinners does NOT push to undoHistory', () => {
    setupGame();

    // Fold 3 times to reach gameOver or showdown
    for (let i = 0; i < 3; i++) {
      const state = useGameStore.getState().gameState!;
      if (state.stage === 'gameOver' || state.stage === 'showdown') break;
      const player = state.players[state.currentPlayerIndex];
      useGameStore.getState().performAction({ type: 'fold', playerId: player.id });
    }

    const historyLengthBeforeWinners = useGameStore.getState().undoHistory.length;
    const state = useGameStore.getState().gameState!;

    if (state.stage === 'showdown') {
      const activePlayers = state.players.filter(
        p => p.status === 'active' || p.status === 'allIn'
      );
      useGameStore.getState().selectWinners([{
        potIndex: 0,
        winners: [activePlayers[0].id],
      }]);

      // History should NOT have grown
      expect(useGameStore.getState().undoHistory.length).toBe(historyLengthBeforeWinners);
    }
  });
});

describe('Undo feature — deep copy integrity', () => {
  it('undo snapshot is not affected by later state mutations', () => {
    setupGame();
    const state = useGameStore.getState().gameState!;
    const currentPlayerId = state.players[state.currentPlayerIndex].id;

    // Perform action (this saves a snapshot)
    useGameStore.getState().performAction({ type: 'fold', playerId: currentPlayerId });

    // Get the snapshot's totalPot before any further changes
    const snapshotPot = useGameStore.getState().undoHistory[0].totalPot;

    // Perform another action (modifies current gameState further)
    const state2 = useGameStore.getState().gameState!;
    if (state2.stage !== 'gameOver' && state2.stage !== 'showdown') {
      const player2 = state2.players[state2.currentPlayerIndex];
      useGameStore.getState().performAction({ type: 'fold', playerId: player2.id });
    }

    // The original snapshot should still have the same totalPot
    expect(useGameStore.getState().undoHistory[0].totalPot).toBe(snapshotPot);
  });
});

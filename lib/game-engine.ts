import { GameState, GameSettings, Player, BettingAction, GameStage, ActionType, PotWinner } from '@/types/game-types';
import { calculatePots } from './pot-calculator';

/**
 * Initialize a new game with the given settings
 */
export function initializeGame(settings: GameSettings): GameState {
  const players: Player[] = Array.from({ length: settings.playerCount }, (_, i) => ({
    id: `player-${i}`,
    name: settings.playerNames[i] || `Player ${i + 1}`,
    chips: settings.startingChips,
    currentBet: 0,
    status: 'active',
    position: i,
    hasActed: false
  }));

  const dealerButtonIndex = Math.floor(Math.random() * settings.playerCount);
  const smallBlindIndex = (dealerButtonIndex + 1) % settings.playerCount;
  const bigBlindIndex = (dealerButtonIndex + 2) % settings.playerCount;
  const firstPlayerIndex = (bigBlindIndex + 1) % settings.playerCount;

  const gameState: GameState = {
    gameNumber: 1,
    stage: 'preFlop',
    players,
    pots: [],
    totalPot: 0,
    currentPlayerIndex: firstPlayerIndex,
    dealerButtonIndex,
    smallBlindIndex,
    bigBlindIndex,
    communityCards: 0,
    currentBet: 0,
    minRaise: settings.bigBlind,
    lastRaiseAmount: 0,
    bettingRound: 0,
    settings
  };

  if (settings.blindsEnabled) {
    postBlinds(gameState);
  }

  return gameState;
}

/**
 * Post small blind and big blind
 */
function postBlinds(state: GameState): void {
  const { players, smallBlindIndex, bigBlindIndex, settings } = state;

  // Small blind
  const sbPlayer = players[smallBlindIndex];
  const sbAmount = Math.min(sbPlayer.chips, settings.smallBlind);
  sbPlayer.chips -= sbAmount;
  sbPlayer.currentBet = sbAmount;
  if (sbPlayer.chips === 0) sbPlayer.status = 'allIn';

  // Big blind
  const bbPlayer = players[bigBlindIndex];
  const bbAmount = Math.min(bbPlayer.chips, settings.bigBlind);
  bbPlayer.chips -= bbAmount;
  bbPlayer.currentBet = bbAmount;
  if (bbPlayer.chips === 0) bbPlayer.status = 'allIn';

  state.totalPot = sbAmount + bbAmount;
  state.currentBet = Math.max(sbAmount, bbAmount);
  state.minRaise = settings.bigBlind;
}

/**
 * Process a betting action and update game state
 */
export function processAction(state: GameState, action: BettingAction): GameState {
  const newState = { ...state, players: state.players.map(p => ({ ...p })) };
  const player = newState.players.find(p => p.id === action.playerId);

  if (!player || player.status !== 'active') {
    return newState;
  }

  player.hasActed = true;

  switch (action.type) {
    case 'fold':
      player.status = 'folded';
      break;

    case 'check':
      break;

    case 'call': {
      const callAmount = newState.currentBet - player.currentBet;
      const actualCall = Math.min(callAmount, player.chips);
      player.chips -= actualCall;
      player.currentBet += actualCall;
      newState.totalPot += actualCall;
      if (player.chips === 0) player.status = 'allIn';
      break;
    }

    case 'raise': {
      if (!action.amount || action.amount < newState.minRaise) {
        return newState;
      }

      const totalToCall = newState.currentBet - player.currentBet;
      const raiseAmount = action.amount;
      const totalToAdd = totalToCall + raiseAmount;

      if (totalToAdd > player.chips) {
        return newState;
      }

      player.chips -= totalToAdd;
      player.currentBet += totalToAdd;
      newState.totalPot += totalToAdd;
      newState.currentBet += raiseAmount;
      newState.lastRaiseAmount = raiseAmount;
      newState.minRaise = raiseAmount;

      if (player.chips === 0) player.status = 'allIn';

      // Reset hasActed for all other players
      newState.players.forEach(p => {
        if (p.id !== player.id && p.status === 'active') {
          p.hasActed = false;
        }
      });
      break;
    }

    case 'allIn': {
      const allInAmount = player.chips;
      player.chips = 0;
      player.currentBet += allInAmount;
      newState.totalPot += allInAmount;
      player.status = 'allIn';

      if (player.currentBet > newState.currentBet) {
        const raiseAmt = player.currentBet - newState.currentBet;
        newState.currentBet = player.currentBet;
        newState.minRaise = Math.max(newState.minRaise, raiseAmt);

        newState.players.forEach(p => {
          if (p.id !== player.id && p.status === 'active') {
            p.hasActed = false;
          }
        });
      }
      break;
    }
  }

  if (isBettingComplete(newState)) {
    advanceStage(newState);
  } else {
    newState.currentPlayerIndex = getNextActivePlayer(newState, newState.currentPlayerIndex);
  }

  return newState;
}

/**
 * Check if betting round is complete
 */
function isBettingComplete(state: GameState): boolean {
  const activePlayers = state.players.filter(p =>
    p.status === 'active' || p.status === 'allIn'
  );

  if (activePlayers.length <= 1) {
    return true;
  }

  const playersCanAct = activePlayers.filter(p => p.status === 'active');

  if (playersCanAct.length === 0) {
    return true;
  }

  const allHaveActed = playersCanAct.every(p => p.hasActed);
  const allBetsEqual = playersCanAct.every(p => p.currentBet === state.currentBet);

  return allHaveActed && allBetsEqual;
}

/**
 * Get the next active player index
 */
function getNextActivePlayer(state: GameState, currentIndex: number): number {
  const { players } = state;
  let nextIndex = (currentIndex + 1) % players.length;
  let checked = 0;

  while (checked < players.length) {
    const player = players[nextIndex];
    if (player.status === 'active') {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % players.length;
    checked++;
  }

  return currentIndex;
}

/**
 * Advance to the next stage of the game
 */
function advanceStage(state: GameState): void {
  // Accumulate current round's bets into the running pot collection
  const roundPots = calculatePots(state);
  for (const roundPot of roundPots) {
    // Try to merge into an existing pot with the same eligible players
    const existingPot = state.pots.find(p =>
      p.eligiblePlayers.length === roundPot.eligiblePlayers.length &&
      p.eligiblePlayers.every(id => roundPot.eligiblePlayers.includes(id))
    );
    if (existingPot) {
      existingPot.amount += roundPot.amount;
    } else {
      state.pots.push(roundPot);
    }
  }

  state.players.forEach(p => {
    p.currentBet = 0;
    p.hasActed = false;
  });
  state.currentBet = 0;

  const remainingPlayers = state.players.filter(p =>
    p.status === 'active' || p.status === 'allIn'
  );

  if (remainingPlayers.length === 1) {
    // Auto-award totalPot to the sole remaining player
    const winner = remainingPlayers[0];
    winner.chips += state.totalPot;
    state.totalPot = 0;
    state.pots = [];
    state.stage = 'gameOver';
    return;
  }

  const stageOrder: GameStage[] = ['preFlop', 'flop', 'turn', 'river', 'showdown'];
  const currentIndex = stageOrder.indexOf(state.stage);

  if (currentIndex < stageOrder.length - 1) {
    state.stage = stageOrder[currentIndex + 1];
  }

  if (state.stage === 'flop') state.communityCards = 3;
  if (state.stage === 'turn') state.communityCards = 4;
  if (state.stage === 'river') state.communityCards = 5;

  // If fewer than 2 players can act (rest are all-in or folded),
  // skip through remaining stages to showdown automatically
  if (state.stage !== 'showdown') {
    const playersCanAct = remainingPlayers.filter(p => p.status === 'active');
    if (playersCanAct.length < 2) {
      // No meaningful betting possible — advance again
      advanceStage(state);
      return;
    }

    state.currentPlayerIndex = getFirstPlayerToActPostFlop(state);
    state.minRaise = state.settings.bigBlind;
    state.lastRaiseAmount = 0;
  }

  state.bettingRound++;
}

/**
 * Get first player to act post-flop (first active player after dealer)
 */
function getFirstPlayerToActPostFlop(state: GameState): number {
  const { players, dealerButtonIndex } = state;
  let index = (dealerButtonIndex + 1) % players.length;
  let checked = 0;

  while (checked < players.length) {
    if (players[index].status === 'active') {
      return index;
    }
    index = (index + 1) % players.length;
    checked++;
  }

  return dealerButtonIndex;
}

/**
 * Distribute chips to winners (per-pot winner selection)
 */
export function distributeChips(state: GameState, potWinners: PotWinner[]): GameState {
  const newState = { ...state, players: state.players.map(p => ({ ...p })), pots: [...state.pots] };

  for (const { potIndex, winners } of potWinners) {
    const pot = newState.pots[potIndex];
    if (!pot || winners.length === 0) continue;

    const winnerShare = Math.floor(pot.amount / winners.length);
    const remainder = pot.amount % winners.length;

    winners.forEach((winnerId, index) => {
      const player = newState.players.find(p => p.id === winnerId);
      if (player) {
        player.chips += winnerShare;
        if (index === 0) player.chips += remainder;
      }
    });
  }

  newState.totalPot = 0;
  newState.pots = [];
  newState.stage = 'gameOver';

  return newState;
}

/**
 * Start the next game
 */
export function startNextGame(state: GameState): GameState {
  const { settings, players, gameNumber } = state;

  const activePlayers = players.filter(p => p.chips > 0);

  if (activePlayers.length < 2) {
    return state;
  }

  let newSmallBlind = settings.smallBlind;
  let newBigBlind = settings.bigBlind;

  if (settings.autoIncreaseBlind) {
    newSmallBlind = Math.floor(settings.smallBlind * 1.5);
    newBigBlind = Math.floor(settings.bigBlind * 1.5);
  }

  const newSettings: GameSettings = {
    ...settings,
    smallBlind: newSmallBlind,
    bigBlind: newBigBlind,
    playerCount: activePlayers.length,
    playerNames: activePlayers.map(p => p.name)
  };

  const newGameState = initializeGame(newSettings);

  // Restore chip counts and reset bet state from initializeGame's postBlinds
  newGameState.players.forEach((player, index) => {
    player.chips = activePlayers[index].chips;
    player.currentBet = 0;
    player.status = 'active';
    player.hasActed = false;
  });
  newGameState.totalPot = 0;
  newGameState.currentBet = 0;

  // Move dealer button
  newGameState.dealerButtonIndex = (state.dealerButtonIndex + 1) % activePlayers.length;
  newGameState.smallBlindIndex = (newGameState.dealerButtonIndex + 1) % activePlayers.length;
  newGameState.bigBlindIndex = (newGameState.dealerButtonIndex + 2) % activePlayers.length;

  // Set first player to act (after BB)
  newGameState.currentPlayerIndex = (newGameState.bigBlindIndex + 1) % activePlayers.length;

  newGameState.gameNumber = gameNumber + 1;

  if (newSettings.blindsEnabled) {
    postBlinds(newGameState);
  }

  return newGameState;
}

/**
 * Get available actions for current player
 */
export function getAvailableActions(state: GameState): ActionType[] {
  const player = state.players[state.currentPlayerIndex];
  const actions: ActionType[] = ['fold', 'allIn'];

  if (player.currentBet === state.currentBet) {
    actions.push('check');
  } else {
    actions.push('call');
  }

  const callAmount = state.currentBet - player.currentBet;
  if (player.chips > callAmount + state.minRaise) {
    actions.push('raise');
  }

  return actions;
}

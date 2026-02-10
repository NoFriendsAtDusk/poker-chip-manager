// Game stages
export type GameStage = 'preFlop' | 'flop' | 'turn' | 'river' | 'showdown' | 'gameOver';

// Player status types
export type PlayerStatus = 'active' | 'folded' | 'allIn' | 'out';

// Action types
export type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allIn';

// Player interface
export interface Player {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  status: PlayerStatus;
  position: number;
  hasActed: boolean;
}

// Game settings from setup screen
export interface GameSettings {
  playerCount: number;
  playerNames: string[];
  betUnit: number;
  startingChips: number;
  blindsEnabled: boolean;
  smallBlind: number;
  bigBlind: number;
  autoIncreaseBlind: boolean;
}

// Pot structure for main and side pots
export interface Pot {
  amount: number;
  eligiblePlayers: string[];
  type: 'main' | 'side';
}

// Complete game state
export interface GameState {
  gameNumber: number;
  stage: GameStage;
  players: Player[];
  pots: Pot[];
  totalPot: number;
  currentPlayerIndex: number;
  dealerButtonIndex: number;
  smallBlindIndex: number;
  bigBlindIndex: number;
  communityCards: number;
  currentBet: number;
  minRaise: number;
  lastRaiseAmount: number;
  bettingRound: number;
  settings: GameSettings;
}

// Betting action structure
export interface BettingAction {
  type: ActionType;
  amount?: number;
  playerId: string;
}

// Per-pot winner mapping for showdown distribution
export interface PotWinner {
  potIndex: number;
  winners: string[];
}

// History entry for game log
export interface ActionHistory {
  gameNumber: number;
  stage: GameStage;
  playerId: string;
  playerName: string;
  action: ActionType;
  amount?: number;
  timestamp: number;
}

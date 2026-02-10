# Poker Chip Manager - Complete Development Plan

## Project Overview

**Application Name:** Poker Chip Manager  
**Type:** Web Application (Next.js SPA)  
**Purpose:** Digital poker chip tracking system for games with physical cards but no chips  
**Target Users:** Casual poker players in Japan  
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand  

---

## Table of Contents

1. [Technical Architecture](#technical-architecture)
2. [Data Models & Types](#data-models--types)
3. [File Structure](#file-structure)
4. [Core Game Engine Logic](#core-game-engine-logic)
5. [State Management](#state-management)
6. [Component Implementation](#component-implementation)
7. [Styling Guidelines](#styling-guidelines)
8. [Implementation Phases](#implementation-phases)
9. [Testing Scenarios](#testing-scenarios)
10. [Deployment Instructions](#deployment-instructions)

---

## Technical Architecture

### Application Flow

```
Setup Screen → Pre-flop → Flop → Turn → River → Showdown → Game Over
     ↓                                                           ↓
  Configure                                                 Next Game
  Players                                                   (Loop back)
  Blinds
  Stakes
```

### Key Features

**Game Setup:**
- 2-10 player support
- Customizable player names
- Configurable bet units
- Starting chip amounts
- Optional blind system (SB/BB)
- Optional auto-blind increase

**Game Play:**
- Automatic blind posting
- Dealer button rotation
- Action buttons: Fold, Check, Call, Raise, All-in
- Raise validation (minimum raise enforcement)
- Community cards display (placeholder cards)
- Pot tracking (main pot + side pots)
- Player status tracking (active/folded/all-in)
- Stage progression (pre-flop → flop → turn → river → showdown)

**Game Completion:**
- Winner selection (supports split pots)
- Automatic chip distribution
- Game continuation with blind rotation
- Player elimination (0 chips)

---

## Data Models & Types

### File: `types/game-types.ts`

```typescript
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
  position: number; // 0-based position at table
  hasActed: boolean; // Track if player has acted this betting round
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
  eligiblePlayers: string[]; // player IDs who can win this pot
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
  communityCards: number; // 0, 3, 4, or 5
  currentBet: number; // highest bet in current betting round
  minRaise: number; // minimum raise amount
  lastRaiseAmount: number; // track last raise for min raise calculation
  bettingRound: number; // 0 = preflop, 1 = flop, 2 = turn, 3 = river
  settings: GameSettings;
}

// Betting action structure
export interface BettingAction {
  type: ActionType;
  amount?: number; // Required for 'raise'
  playerId: string;
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
```

---

## File Structure

```
poker-chip-manager/
├── app/
│   ├── page.tsx                           # Setup screen (home)
│   ├── game/
│   │   └── page.tsx                       # Main game screen
│   ├── how-to-play/
│   │   └── page.tsx                       # How to play instructions
│   ├── rules/
│   │   └── page.tsx                       # Poker rules explanation
│   ├── faq/
│   │   └── page.tsx                       # Frequently asked questions
│   ├── legal/
│   │   ├── privacy/
│   │   │   └── page.tsx                   # Privacy policy
│   │   ├── terms/
│   │   │   └── page.tsx                   # Terms of service
│   │   └── specified-commercial-transactions/
│   │       └── page.tsx                   # Japanese commercial law page
│   ├── layout.tsx                         # Root layout
│   └── globals.css                        # Global styles
│
├── components/
│   ├── setup/
│   │   ├── GameSettingsForm.tsx           # Main setup form
│   │   ├── PlayerNameInputs.tsx           # Dynamic player name inputs
│   │   ├── BlindSettings.tsx              # Blind configuration
│   │   └── NavigationButtons.tsx          # Header navigation
│   │
│   ├── game/
│   │   ├── GameHeader.tsx                 # Game info (number, stage, blinds, pot)
│   │   ├── CommunityCards.tsx             # Card display area
│   │   ├── PlayerTable.tsx                # Main player table
│   │   ├── PlayerRow.tsx                  # Individual player row
│   │   ├── ActionPanel.tsx                # Betting action controls
│   │   ├── ShowdownPanel.tsx              # Winner selection UI
│   │   └── GameOverPanel.tsx              # Game over screen with results
│   │
│   └── ui/
│       ├── Button.tsx                     # Reusable button component
│       ├── Input.tsx                      # Reusable input component
│       ├── Checkbox.tsx                   # Reusable checkbox
│       └── Badge.tsx                      # Badge for SB/BB indicators
│
├── lib/
│   ├── game-engine.ts                     # Core game logic
│   ├── pot-calculator.ts                  # Pot and side pot calculations
│   ├── betting-logic.ts                   # Betting validation and rules
│   └── utils.ts                           # Helper/utility functions
│
├── store/
│   └── game-store.ts                      # Zustand state management
│
├── types/
│   └── game-types.ts                      # TypeScript type definitions
│
├── public/
│   ├── poker-chips.svg                    # App logo/icon
│   └── card-placeholder.svg               # Playing card back image
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Core Game Engine Logic

### File: `lib/game-engine.ts`

This is the most critical file containing all poker game logic.

```typescript
import { GameState, GameSettings, Player, BettingAction, GameStage, Pot } from '@/types/game-types';
import { calculatePots } from './pot-calculator';

/**
 * Initialize a new game with the given settings
 */
export function initializeGame(settings: GameSettings): GameState {
  // Create players
  const players: Player[] = Array.from({ length: settings.playerCount }, (_, i) => ({
    id: `player-${i}`,
    name: settings.playerNames[i] || `Player ${i + 1}`,
    chips: settings.startingChips,
    currentBet: 0,
    status: 'active',
    position: i,
    hasActed: false
  }));

  // Random dealer button position for first game
  const dealerButtonIndex = Math.floor(Math.random() * settings.playerCount);
  
  // Calculate blind positions
  const smallBlindIndex = (dealerButtonIndex + 1) % settings.playerCount;
  const bigBlindIndex = (dealerButtonIndex + 2) % settings.playerCount;
  
  // Calculate first player to act (after BB in preflop)
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

  // Post blinds if enabled
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

  // Update game state
  state.totalPot = sbAmount + bbAmount;
  state.currentBet = bbAmount;
  state.minRaise = settings.bigBlind;
}

/**
 * Process a betting action and update game state
 */
export function processAction(state: GameState, action: BettingAction): GameState {
  const newState = { ...state };
  const player = newState.players.find(p => p.id === action.playerId);
  
  if (!player || player.status !== 'active') {
    return newState; // Invalid action
  }

  player.hasActed = true;

  switch (action.type) {
    case 'fold':
      player.status = 'folded';
      break;

    case 'check':
      // No chip movement, just mark as acted
      break;

    case 'call':
      const callAmount = newState.currentBet - player.currentBet;
      const actualCall = Math.min(callAmount, player.chips);
      player.chips -= actualCall;
      player.currentBet += actualCall;
      newState.totalPot += actualCall;
      if (player.chips === 0) player.status = 'allIn';
      break;

    case 'raise':
      if (!action.amount || action.amount < newState.minRaise) {
        return newState; // Invalid raise amount
      }
      
      const totalToCall = newState.currentBet - player.currentBet;
      const raiseAmount = action.amount;
      const totalToAdd = totalToCall + raiseAmount;
      
      if (totalToAdd > player.chips) {
        return newState; // Not enough chips
      }
      
      player.chips -= totalToAdd;
      player.currentBet += totalToAdd;
      newState.totalPot += totalToAdd;
      newState.currentBet += raiseAmount;
      newState.lastRaiseAmount = raiseAmount;
      newState.minRaise = raiseAmount; // Next raise must match or exceed
      
      if (player.chips === 0) player.status = 'allIn';
      
      // Reset hasActed for all other players (they need to respond to raise)
      newState.players.forEach(p => {
        if (p.id !== player.id && p.status === 'active') {
          p.hasActed = false;
        }
      });
      break;

    case 'allIn':
      const allInAmount = player.chips;
      player.chips = 0;
      player.currentBet += allInAmount;
      newState.totalPot += allInAmount;
      player.status = 'allIn';

      // Update current bet if all-in is a raise
      if (player.currentBet > newState.currentBet) {
        const raiseAmt = player.currentBet - newState.currentBet;
        newState.currentBet = player.currentBet;
        newState.minRaise = Math.max(newState.minRaise, raiseAmt);
        
        // Reset hasActed for other players
        newState.players.forEach(p => {
          if (p.id !== player.id && p.status === 'active') {
            p.hasActed = false;
          }
        });
      }
      break;
  }

  // Check if betting round is complete
  if (isBettingComplete(newState)) {
    advanceStage(newState);
  } else {
    // Move to next active player
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

  // Only one player left (everyone else folded)
  if (activePlayers.length <= 1) {
    return true;
  }

  const playersCanAct = activePlayers.filter(p => p.status === 'active');

  // All remaining players are all-in
  if (playersCanAct.length === 0) {
    return true;
  }

  // Check if all active players have acted and have matching bets
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

  // No active players found (shouldn't happen)
  return currentIndex;
}

/**
 * Advance to the next stage of the game
 */
function advanceStage(state: GameState): void {
  // Calculate pots from current bets
  const newPots = calculatePots(state);
  state.pots = newPots;

  // Reset current bets and hasActed flags
  state.players.forEach(p => {
    p.currentBet = 0;
    p.hasActed = false;
  });
  state.currentBet = 0;

  // Check if only one player remains (everyone else folded)
  const remainingPlayers = state.players.filter(p => 
    p.status === 'active' || p.status === 'allIn'
  );

  if (remainingPlayers.length === 1) {
    // Skip to showdown
    state.stage = 'showdown';
    return;
  }

  // Progress to next stage
  const stageOrder: GameStage[] = ['preFlop', 'flop', 'turn', 'river', 'showdown'];
  const currentIndex = stageOrder.indexOf(state.stage);
  
  if (currentIndex < stageOrder.length - 1) {
    state.stage = stageOrder[currentIndex + 1];
  }

  // Update community cards
  if (state.stage === 'flop') state.communityCards = 3;
  if (state.stage === 'turn') state.communityCards = 4;
  if (state.stage === 'river') state.communityCards = 5;

  // Set next player to act
  if (state.stage !== 'showdown') {
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
 * Distribute chips to winners
 */
export function distributeChips(state: GameState, winners: string[]): GameState {
  const newState = { ...state };

  // Distribute each pot
  for (const pot of newState.pots) {
    // Filter winners who are eligible for this pot
    const eligibleWinners = winners.filter(w => pot.eligiblePlayers.includes(w));
    
    if (eligibleWinners.length === 0) continue;

    const winnerShare = Math.floor(pot.amount / eligibleWinners.length);
    const remainder = pot.amount % eligibleWinners.length;

    // Distribute chips
    eligibleWinners.forEach((winnerId, index) => {
      const player = newState.players.find(p => p.id === winnerId);
      if (player) {
        player.chips += winnerShare;
        // Give remainder to first winner (earliest position)
        if (index === 0) player.chips += remainder;
      }
    });
  }

  // Move to game over stage
  newState.stage = 'gameOver';
  
  return newState;
}

/**
 * Start the next game
 */
export function startNextGame(state: GameState): GameState {
  const { settings, players, gameNumber } = state;

  // Remove players with 0 chips
  const activePlayers = players.filter(p => p.chips > 0);

  if (activePlayers.length < 2) {
    // Game is over, need at least 2 players
    return state;
  }

  // Increase blinds if auto-increase is enabled
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

  // Create new game state
  const newGameState = initializeGame(newSettings);
  
  // Restore chip counts
  newGameState.players.forEach((player, index) => {
    player.chips = activePlayers[index].chips;
  });

  // Move dealer button
  newGameState.dealerButtonIndex = (state.dealerButtonIndex + 1) % activePlayers.length;
  newGameState.smallBlindIndex = (newGameState.dealerButtonIndex + 1) % activePlayers.length;
  newGameState.bigBlindIndex = (newGameState.dealerButtonIndex + 2) % activePlayers.length;
  
  newGameState.gameNumber = gameNumber + 1;

  // Post new blinds
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

  // Can raise if player has chips after calling
  const callAmount = state.currentBet - player.currentBet;
  if (player.chips > callAmount + state.minRaise) {
    actions.push('raise');
  }

  return actions;
}
```

### File: `lib/pot-calculator.ts`

```typescript
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
 * Format pot display string (e.g., "Main: 1200 | Side: 600, 400")
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
```

### File: `lib/betting-logic.ts`

```typescript
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

  // Not enough chips
  if (totalRequired > player.chips) {
    return { 
      valid: false, 
      error: 'チップが足りません' 
    };
  }

  // Raise amount too small
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
```

### File: `lib/utils.ts`

```typescript
/**
 * Format chip amount with commas
 */
export function formatChips(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/**
 * Generate unique player ID
 */
export function generatePlayerId(index: number): string {
  return `player-${index}-${Date.now()}`;
}

/**
 * Get player position label (for display)
 */
export function getPositionLabel(
  index: number,
  dealerIndex: number,
  sbIndex: number,
  bbIndex: number
): string {
  if (index === dealerIndex) return 'BTN';
  if (index === sbIndex) return 'SB';
  if (index === bbIndex) return 'BB';
  return '';
}

/**
 * Get status display text in Japanese
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    active: '参加中',
    folded: 'フォールド',
    allIn: 'オールイン',
    out: '脱落'
  };
  return statusMap[status] || status;
}

/**
 * Get stage display text in Japanese
 */
export function getStageText(stage: string): string {
  const stageMap: Record<string, string> = {
    preFlop: 'Pre-flop',
    flop: 'Flop',
    turn: 'Turn',
    river: 'River',
    showdown: 'Showdown',
    gameOver: 'GameOver'
  };
  return stageMap[stage] || stage;
}
```

---

## State Management

### File: `store/game-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, BettingAction } from '@/types/game-types';
import {
  initializeGame,
  processAction,
  distributeChips,
  startNextGame
} from '@/lib/game-engine';

interface GameStore {
  gameState: GameState | null;
  settings: GameSettings | null;
  
  // Actions
  setSettings: (settings: GameSettings) => void;
  startGame: () => void;
  performAction: (action: BettingAction) => void;
  selectWinners: (winners: string[]) => void;
  nextGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      settings: null,

      setSettings: (settings) => {
        set({ settings });
      },

      startGame: () => {
        const { settings } = get();
        if (!settings) return;

        const gameState = initializeGame(settings);
        set({ gameState });
      },

      performAction: (action) => {
        const { gameState } = get();
        if (!gameState) return;

        const newState = processAction(gameState, action);
        set({ gameState: newState });
      },

      selectWinners: (winners) => {
        const { gameState } = get();
        if (!gameState || gameState.stage !== 'showdown') return;

        const newState = distributeChips(gameState, winners);
        set({ gameState: newState });
      },

      nextGame: () => {
        const { gameState } = get();
        if (!gameState) return;

        const newState = startNextGame(gameState);
        set({ gameState: newState });
      },

      resetGame: () => {
        set({ gameState: null, settings: null });
      }
    }),
    {
      name: 'poker-game-storage', // LocalStorage key
      partialize: (state) => ({
        gameState: state.gameState,
        settings: state.settings
      })
    }
  )
);
```

---

## Component Implementation

### Setup Screen Components

#### File: `app/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { GameSettings } from '@/types/game-types';
import Link from 'next/link';

export default function SetupScreen() {
  const router = useRouter();
  const { setSettings, startGame } = useGameStore();

  const [formData, setFormData] = useState<GameSettings>({
    playerCount: 4,
    playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
    betUnit: 100,
    startingChips: 10000,
    blindsEnabled: true,
    smallBlind: 100,
    bigBlind: 200,
    autoIncreaseBlind: false
  });

  const handlePlayerCountChange = (count: number) => {
    const newNames = Array.from({ length: count }, (_, i) => 
      formData.playerNames[i] || `Player ${i + 1}`
    );
    setFormData({ ...formData, playerCount: count, playerNames: newNames });
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...formData.playerNames];
    newNames[index] = name;
    setFormData({ ...formData, playerNames: newNames });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    startGame();
    router.push('/game');
  };

  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500 border-4 border-white"></div>
            <div className="w-16 h-16 rounded-full bg-green-500 border-4 border-white"></div>
            <div className="w-16 h-16 rounded-full bg-blue-500 border-4 border-white"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            トランプだけで遊べる！
          </h1>
          <h2 className="text-2xl text-white">
            ポーカーチップアプリ
          </h2>
          <div className="flex justify-center gap-2 mt-4 text-2xl">
            <span>♠️</span>
            <span>♥️</span>
            <span>♦️</span>
            <span>♣️</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link 
            href="/how-to-play"
            className="px-6 py-2 bg-white text-green-800 rounded-lg hover:bg-gray-100"
          >
            遊び方ガイド
          </Link>
          <Link 
            href="/rules"
            className="px-6 py-2 bg-white text-green-800 rounded-lg hover:bg-gray-100"
          >
            ルール解説
          </Link>
          <Link 
            href="/faq"
            className="px-6 py-2 bg-white text-green-800 rounded-lg hover:bg-gray-100"
          >
            このアプリについて
          </Link>
        </div>

        {/* Game Settings Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <span>♦️</span>
            ゲーム設定
            <span>♠️</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Count */}
            <div>
              <label className="block text-green-800 font-semibold mb-2">
                プレイ人数
              </label>
              <input
                type="number"
                min="2"
                max="10"
                value={formData.playerCount}
                onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Player Names */}
            {formData.playerNames.map((name, index) => (
              <div key={index}>
                <label className="block text-green-800 font-semibold mb-2">
                  プレイヤー {index + 1} の名前
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            ))}

            {/* Bet Unit */}
            <div>
              <label className="block text-green-800 font-semibold mb-2">
                ベット単位
              </label>
              <input
                type="number"
                min="1"
                value={formData.betUnit}
                onChange={(e) => setFormData({ ...formData, betUnit: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Starting Chips */}
            <div>
              <label className="block text-green-800 font-semibold mb-2">
                初期チップ
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={formData.startingChips}
                onChange={(e) => setFormData({ ...formData, startingChips: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Blinds Toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.blindsEnabled}
                  onChange={(e) => setFormData({ ...formData, blindsEnabled: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-green-800 font-semibold">ブラインドあり</span>
              </label>
            </div>

            {/* Blind Settings (conditional) */}
            {formData.blindsEnabled && (
              <>
                <div>
                  <label className="block text-green-800 font-semibold mb-2">
                    Small Blind
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.smallBlind}
                    onChange={(e) => setFormData({ ...formData, smallBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-green-800 font-semibold mb-2">
                    Big Blind
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bigBlind}
                    onChange={(e) => setFormData({ ...formData, bigBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoIncreaseBlind}
                      onChange={(e) => setFormData({ ...formData, autoIncreaseBlind: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-green-800 font-semibold">ブラインド自動増加</span>
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              ゲーム開始
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-white text-sm bg-green-900 bg-opacity-50 p-4 rounded-lg">
          <p>
            本アプリは、ポーカーのゲーム進行を補助する目的でチップ計算を管理するツールです。
            金銭や換金可能な物品を賭ける行為は法律で禁止されており、本アプリはこれを一切認めません。
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-white text-sm">
          <Link href="/legal/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/legal/terms" className="hover:underline">利用規約</Link>
          <Link href="/legal/specified-commercial-transactions" className="hover:underline">
            特定商取引法に関する表示
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-4 text-center text-white text-sm">
          <Link href="/contact" className="hover:underline">お問い合わせ</Link>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-white text-sm">
          © 2025 Poker Chips Manager. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
```

### Game Screen Components

#### File: `app/game/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import GameHeader from '@/components/game/GameHeader';
import CommunityCards from '@/components/game/CommunityCards';
import PlayerTable from '@/components/game/PlayerTable';
import ActionPanel from '@/components/game/ActionPanel';
import ShowdownPanel from '@/components/game/ShowdownPanel';
import GameOverPanel from '@/components/game/GameOverPanel';

export default function GameScreen() {
  const router = useRouter();
  const { gameState } = useGameStore();

  useEffect(() => {
    // Redirect to setup if no game state
    if (!gameState) {
      router.push('/');
    }
  }, [gameState, router]);

  if (!gameState) {
    return null;
  }

  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Game Header */}
        <GameHeader gameState={gameState} />

        {/* Community Cards */}
        {gameState.communityCards > 0 && (
          <CommunityCards count={gameState.communityCards} />
        )}

        {/* Player Table */}
        <PlayerTable
          players={gameState.players}
          dealerIndex={gameState.dealerButtonIndex}
          sbIndex={gameState.smallBlindIndex}
          bbIndex={gameState.bigBlindIndex}
          currentPlayerIndex={gameState.currentPlayerIndex}
        />

        {/* Action Panel (conditional) */}
        {gameState.stage !== 'showdown' && gameState.stage !== 'gameOver' && (
          <ActionPanel gameState={gameState} />
        )}

        {/* Showdown Panel */}
        {gameState.stage === 'showdown' && (
          <ShowdownPanel gameState={gameState} />
        )}

        {/* Game Over Panel */}
        {gameState.stage === 'gameOver' && (
          <GameOverPanel gameState={gameState} />
        )}

        {/* Contact Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-white hover:underline">
            お問い合わせ
          </a>
        </div>
      </div>
    </div>
  );
}
```

#### File: `components/game/GameHeader.tsx`

```typescript
import { GameState } from '@/types/game-types';
import { getStageText, formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';

interface GameHeaderProps {
  gameState: GameState;
}

export default function GameHeader({ gameState }: GameHeaderProps) {
  const { gameNumber, stage, settings, totalPot, pots } = gameState;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            ゲーム {gameNumber}
          </h1>
          <p className="text-lg text-gray-700">
            ステージ: <span className="font-semibold">{getStageText(stage)}</span>
          </p>
        </div>

        <div className="text-right">
          {settings.blindsEnabled && (
            <div className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">
                SB: {formatChips(settings.smallBlind)} / BB: {formatChips(settings.bigBlind)}
              </span>
            </div>
          )}
          
          <div className="text-xl font-bold text-green-800">
            ポット合計: {formatChips(totalPot)}
          </div>
          
          {pots.length > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              {formatPotDisplay(pots)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### File: `components/game/CommunityCards.tsx`

```typescript
interface CommunityCardsProps {
  count: number; // 3, 4, or 5
}

export default function CommunityCards({ count }: CommunityCardsProps) {
  return (
    <div className="mb-6">
      <div className="bg-green-900 rounded-lg p-6">
        <div className="flex items-center justify-center gap-4">
          <span className="text-white text-xl font-semibold">Community Cards:</span>
          <div className="flex gap-3">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-28 bg-white rounded-lg border-4 border-gray-300 flex items-center justify-center shadow-lg"
              >
                <div className="text-4xl">♠️</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### File: `components/game/PlayerTable.tsx`

```typescript
import { Player } from '@/types/game-types';
import PlayerRow from './PlayerRow';

interface PlayerTableProps {
  players: Player[];
  dealerIndex: number;
  sbIndex: number;
  bbIndex: number;
  currentPlayerIndex: number;
}

export default function PlayerTable({
  players,
  dealerIndex,
  sbIndex,
  bbIndex,
  currentPlayerIndex
}: PlayerTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-4 py-3 text-left text-gray-700 font-semibold">#</th>
            <th className="px-4 py-3 text-left text-gray-700 font-semibold">プレイヤー</th>
            <th className="px-4 py-3 text-right text-gray-700 font-semibold">チップ</th>
            <th className="px-4 py-3 text-right text-gray-700 font-semibold">ベット額</th>
            <th className="px-4 py-3 text-center text-gray-700 font-semibold">ステータス</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              position={index + 1}
              isSB={index === sbIndex}
              isBB={index === bbIndex}
              isDealer={index === dealerIndex}
              isCurrent={index === currentPlayerIndex}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### File: `components/game/PlayerRow.tsx`

```typescript
import { Player } from '@/types/game-types';
import { formatChips, getStatusText } from '@/lib/utils';

interface PlayerRowProps {
  player: Player;
  position: number;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
}

export default function PlayerRow({
  player,
  position,
  isSB,
  isBB,
  isDealer,
  isCurrent
}: PlayerRowProps) {
  const rowClass = isCurrent
    ? 'bg-blue-100 border-l-4 border-blue-500'
    : player.status === 'folded'
    ? 'bg-gray-50 text-gray-400'
    : '';

  return (
    <tr className={`border-b border-gray-200 ${rowClass}`}>
      <td className="px-4 py-4 font-medium">{position}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{player.name}</span>
          {isSB && (
            <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
              SB
            </span>
          )}
          {isBB && (
            <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
              BB
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-right font-semibold">
        {formatChips(player.chips)}
      </td>
      <td className="px-4 py-4 text-right">
        {player.currentBet > 0 ? formatChips(player.currentBet) : '0'}
      </td>
      <td className="px-4 py-4 text-center">
        {getStatusText(player.status)}
      </td>
    </tr>
  );
}
```

#### File: `components/game/ActionPanel.tsx`

```typescript
import { useState } from 'react';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { 
  canCheck, 
  getCallAmount, 
  getMinimumRaise,
  validateRaiseAmount 
} from '@/lib/betting-logic';
import { formatChips } from '@/lib/utils';

interface ActionPanelProps {
  gameState: GameState;
}

export default function ActionPanel({ gameState }: ActionPanelProps) {
  const { performAction } = useGameStore();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  const [raiseAmount, setRaiseAmount] = useState(getMinimumRaise(gameState));

  const canPlayerCheck = canCheck(gameState, currentPlayer.id);
  const callAmount = getCallAmount(gameState, currentPlayer.id);
  const minRaise = getMinimumRaise(gameState);

  const handleRaise = () => {
    const validation = validateRaiseAmount(gameState, currentPlayer, raiseAmount);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    performAction({
      type: 'raise',
      amount: raiseAmount,
      playerId: currentPlayer.id
    });
  };

  return (
    <div className="bg-green-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-white text-xl font-bold mb-4">
        {currentPlayer.name} のアクション
      </h3>

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => performAction({ type: 'fold', playerId: currentPlayer.id })}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          フォールド
        </button>

        {canPlayerCheck ? (
          <button
            onClick={() => performAction({ type: 'check', playerId: currentPlayer.id })}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            チェック
          </button>
        ) : (
          <button
            onClick={() => performAction({ type: 'call', playerId: currentPlayer.id })}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            コール({formatChips(callAmount)})
          </button>
        )}

        <button
          onClick={() => performAction({ type: 'allIn', playerId: currentPlayer.id })}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          オールイン
        </button>
      </div>

      {/* Raise Controls */}
      <div className="flex gap-3">
        <input
          type="number"
          value={raiseAmount}
          onChange={(e) => setRaiseAmount(Number(e.target.value))}
          min={minRaise}
          step={gameState.settings.betUnit}
          className="flex-1 px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-yellow-500 focus:outline-none"
        />
        <button
          onClick={handleRaise}
          disabled={raiseAmount < minRaise}
          className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          レイズ (min: {formatChips(minRaise)})
        </button>
      </div>
    </div>
  );
}
```

#### File: `components/game/ShowdownPanel.tsx`

```typescript
import { useState } from 'react';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';

interface ShowdownPanelProps {
  gameState: GameState;
}

export default function ShowdownPanel({ gameState }: ShowdownPanelProps) {
  const { selectWinners } = useGameStore();
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

  // Get players who can win (not folded)
  const eligiblePlayers = gameState.players.filter(
    p => p.status === 'active' || p.status === 'allIn'
  );

  const toggleWinner = (playerId: string) => {
    setSelectedWinners(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleConfirm = () => {
    if (selectedWinners.length === 0) {
      alert('勝者を選択してください');
      return;
    }

    selectWinners(selectedWinners);
  };

  return (
    <div className="bg-green-900 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-white text-2xl font-bold mb-4">
        勝者を選択してください
      </h3>

      <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
        <p className="text-white font-semibold mb-2">
          {formatPotDisplay(gameState.pots)}
        </p>
        <p className="text-white text-sm">
          対象プレイヤーから勝者を選択 (複数選択可):
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {eligiblePlayers.map(player => (
          <button
            key={player.id}
            onClick={() => toggleWinner(player.id)}
            className={`w-full px-6 py-4 text-left rounded-lg font-semibold transition-colors ${
              selectedWinners.includes(player.id)
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        勝者を確定
      </button>
    </div>
  );
}
```

#### File: `components/game/GameOverPanel.tsx`

```typescript
import { useRouter } from 'next/navigation';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';

interface GameOverPanelProps {
  gameState: GameState;
}

export default function GameOverPanel({ gameState }: GameOverPanelProps) {
  const router = useRouter();
  const { nextGame, resetGame } = useGameStore();

  const handleNextGame = () => {
    nextGame();
  };

  const handleSaveAndQuit = () => {
    // In a real app, could save game history to database
    router.push('/');
  };

  return (
    <div className="bg-green-900 rounded-lg shadow-lg p-6">
      <h2 className="text-white text-3xl font-bold mb-4">
        ゲーム終了
      </h2>

      <p className="text-white text-lg mb-6">
        勝者にチップが配分されました。
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleNextGame}
          className="flex-1 px-6 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>▶</span>
          次のゲームに進む
        </button>

        <button
          onClick={handleSaveAndQuit}
          className="flex-1 px-6 py-4 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>💾</span>
          保存して中断する
        </button>
      </div>
    </div>
  );
}
```

---

## Styling Guidelines

### File: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --poker-green: #1a4d2e;
  --poker-felt: #0f3d26;
  --poker-light-green: #2d7a4f;
}

.poker-table {
  background: linear-gradient(
    135deg,
    var(--poker-green) 0%,
    var(--poker-felt) 100%
  );
  min-height: 100vh;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Card animation */
@keyframes cardDeal {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: cardDeal 0.3s ease-out;
}

/* Chip animation */
@keyframes chipMove {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.chip-update {
  animation: chipMove 0.2s ease-out;
}

/* Button hover effects */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}
```

### File: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          green: '#1a4d2e',
          felt: '#0f3d26',
          'light-green': '#2d7a4f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Implementation Phases

### Phase 1: Project Setup (Day 1)

```bash
# Initialize Next.js project
npx create-next-app@latest poker-chip-manager \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd poker-chip-manager

# Install dependencies
npm install zustand
npm install zustand/middleware

# Create directory structure
mkdir -p lib components/{setup,game,ui} store types public
```

**Tasks:**
- ✅ Create all directories
- ✅ Set up TypeScript configuration
- ✅ Configure Tailwind CSS
- ✅ Create base layout

### Phase 2: Data Models & Core Logic (Day 2-3)

**Tasks:**
- ✅ Implement `types/game-types.ts`
- ✅ Implement `lib/game-engine.ts`
- ✅ Implement `lib/pot-calculator.ts`
- ✅ Implement `lib/betting-logic.ts`
- ✅ Implement `lib/utils.ts`
- ✅ Write unit tests for core logic

**Testing:**
- Test blind posting
- Test betting actions (fold, check, call, raise, all-in)
- Test pot calculations
- Test side pot scenarios
- Test stage advancement
- Test game completion

### Phase 3: State Management (Day 4)

**Tasks:**
- ✅ Implement `store/game-store.ts`
- ✅ Add localStorage persistence
- ✅ Test state updates
- ✅ Test action dispatch

### Phase 4: UI Components - Setup Screen (Day 5)

**Tasks:**
- ✅ Implement `app/page.tsx`
- ✅ Implement setup form components
- ✅ Add form validation
- ✅ Style setup screen
- ✅ Test responsive design

### Phase 5: UI Components - Game Screen (Day 6-7)

**Tasks:**
- ✅ Implement `app/game/page.tsx`
- ✅ Implement GameHeader
- ✅ Implement CommunityCards
- ✅ Implement PlayerTable
- ✅ Implement PlayerRow
- ✅ Implement ActionPanel
- ✅ Implement ShowdownPanel
- ✅ Implement GameOverPanel
- ✅ Test all game flows

### Phase 6: Information Pages (Day 8)

**Tasks:**
- ✅ Create How to Play page
- ✅ Create Rules page
- ✅ Create FAQ page
- ✅ Create Privacy Policy page
- ✅ Create Terms of Service page
- ✅ Create Commercial Transactions page

### Phase 7: Polish & Optimization (Day 9-10)

**Tasks:**
- ✅ Add animations
- ✅ Improve mobile responsiveness
- ✅ Add loading states
- ✅ Add error handling
- ✅ Performance optimization
- ✅ Accessibility improvements
- ✅ Cross-browser testing

### Phase 8: Testing & Deployment (Day 11-12)

**Tasks:**
- ✅ End-to-end testing
- ✅ Fix bugs
- ✅ Deploy to Vercel
- ✅ Configure custom domain
- ✅ Set up analytics (optional)

---

## Testing Scenarios

### Critical Test Cases

1. **Basic 4-Player Game**
   - All players fold except one → Winner gets pot immediately
   - Verify chip distribution
   - Verify stage progression

2. **Pre-flop All-in (2 players)**
   - SB goes all-in
   - BB calls
   - Progress through all stages without betting
   - Declare winner at showdown

3. **Side Pot Scenario #1**
   - Player 1: 1000 chips, all-in
   - Player 2: 5000 chips, calls
   - Player 3: 5000 chips, calls
   - Main pot: 3000 (1000 × 3)
   - All eligible for main pot

4. **Side Pot Scenario #2**
   - Player 1: 1000 chips, all-in
   - Player 2: 2000 chips, all-in
   - Player 3: 5000 chips, calls both
   - Main pot: 3000 (1000 × 3) - eligible: P1, P2, P3
   - Side pot: 2000 (1000 × 2) - eligible: P2, P3

5. **Multiple Side Pots**
   - 4 players with different stack sizes
   - All go all-in at different amounts
   - Verify correct pot calculation
   - Verify winner selection works for each pot

6. **Split Pot**
   - Two players tie
   - Verify pot is split evenly
   - Verify odd chip goes to earliest position

7. **Blind Increase**
   - Complete one game
   - Start next game
   - Verify blinds doubled (if auto-increase enabled)
   - Verify dealer button moved

8. **Player Elimination**
   - Player loses all chips
   - Verify player removed from next game
   - Game continues with remaining players

9. **Heads-up (2 players)**
   - Special case: SB is also dealer
   - Verify blind posting
   - Verify action order

10. **Raise Minimum Enforcement**
    - Player bets 200
    - Next player must raise at least 200 more (to 400)
    - Verify validation

---

## Deployment Instructions

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (auto-detected for Next.js):
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Click "Deploy"

3. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed
   - Wait for SSL certificate provisioning

### Environment Variables

If you add features requiring API keys or secrets:

```bash
# In Vercel Dashboard → Settings → Environment Variables
# Add any needed variables:
# NEXT_PUBLIC_API_URL=https://your-api.com
# DATABASE_URL=your-database-connection-string
```

---

## Additional Features (Optional Enhancements)

### Priority Enhancements

1. **Hand History Log**
   - Track all actions per hand
   - Display hand summary
   - Export hand history

2. **Game Statistics**
   - Hands played
   - Biggest pot
   - Most chips won/lost
   - Win rate per player

3. **Sound Effects**
   - Chip sounds
   - Card dealing sounds
   - Button click sounds
   - Win celebration sound

4. **Themes**
   - Different felt colors
   - Card back designs
   - Light/dark mode

5. **Multi-language Support**
   - English
   - Japanese (current)
   - Other languages

6. **Tutorial Mode**
   - Interactive walkthrough
   - Explain each action
   - Practice mode

---

## Maintenance & Updates

### Regular Maintenance

- Update dependencies monthly
- Monitor for security vulnerabilities
- Review and respond to user feedback
- Fix reported bugs
- Add requested features

### Performance Monitoring

- Track page load times
- Monitor error rates
- Analyze user engagement
- Optimize bundle size

---

## Support & Documentation

### User Support

- FAQ page (already included)
- Contact form
- Email support
- Social media channels

### Developer Documentation

- Code comments
- API documentation
- Contributing guidelines
- Changelog

---

## Legal Compliance

### Required Pages (Already Included)

- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Specified Commercial Transactions Act (Japanese law)
- ✅ Gambling Disclaimer

### Important Legal Notes

The app must clearly state:
- **Not for real money gambling**
- **Educational/entertainment purposes only**
- **No real money or valuable items can be wagered**
- Compliance with Japanese gambling laws

---

## Final Checklist

Before launch:

- [ ] All core features working
- [ ] Responsive on mobile, tablet, desktop
- [ ] Tested on Chrome, Safari, Firefox, Edge
- [ ] Legal pages complete
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Analytics setup (Google Analytics)
- [ ] Error tracking (Sentry)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place

---

## Success Metrics

Track these metrics:

- Daily/Monthly Active Users
- Average session duration
- Games played per user
- Completion rate
- User retention rate
- Page load time
- Error rate
- User feedback ratings

---

## Contact & Support

For development questions or issues:
- GitHub Issues: [your-repo/issues]
- Email: support@your-domain.com
- Discord: [your-discord-server]

---

## Version History

- v1.0.0 - Initial release
  - Core poker chip management
  - Blind system
  - Side pots
  - Multi-player support (2-10 players)
  - Japanese language interface

---

**End of Development Plan**

Good luck with your poker chip manager project! 🎰♠️♥️♦️♣️

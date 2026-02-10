# Phase 1: Project Setup — Development Log

**Date:** 2026-02-09
**Phase:** 1 — Project Setup
**Status:** Complete

---

## Overview

Initialized the Poker Chip Manager project from scratch. The project directory previously contained only the development plan document (`POKER_CHIP_MANAGER_DEVELOPMENT_PLAN.md`). All scaffolding, core logic, state management, and styling were set up in this phase.

---

## Steps Completed

### 1. Next.js Project Initialization

- Created a Next.js 14 project using `create-next-app@14` with the following options:
  - TypeScript
  - Tailwind CSS
  - App Router (`--app`)
  - No `src` directory (`--no-src-dir`)
  - Import alias `@/*`
  - ESLint
  - npm as package manager
- The existing directory had files that conflicted with `create-next-app`, so the project was scaffolded in a temp directory and files were copied over, then the temp directory was removed.

### 2. Dependency Installation

- Installed `zustand` for state management.
- All npm dependencies installed successfully (378 packages total).

### 3. Directory Structure Created

```
lib/
components/setup/
components/game/
components/ui/
store/
types/
```

### 4. Type Definitions — `types/game-types.ts`

Defined all TypeScript types and interfaces:
- `GameStage` — `'preFlop' | 'flop' | 'turn' | 'river' | 'showdown' | 'gameOver'`
- `PlayerStatus` — `'active' | 'folded' | 'allIn' | 'out'`
- `ActionType` — `'fold' | 'check' | 'call' | 'raise' | 'allIn'`
- `Player` — id, name, chips, currentBet, status, position, hasActed
- `GameSettings` — playerCount, playerNames, betUnit, startingChips, blinds config
- `Pot` — amount, eligiblePlayers, type (main/side)
- `GameState` — full game state including players, pots, stage, indices, settings
- `BettingAction` — type, amount, playerId
- `ActionHistory` — game log entry structure

### 5. Core Game Engine — `lib/game-engine.ts`

Implemented all core poker game logic:
- `initializeGame()` — creates players, assigns random dealer, calculates blind positions, posts blinds
- `processAction()` — handles fold, check, call, raise, and all-in actions with proper state immutability
- `isBettingComplete()` — checks if all active players have acted with matching bets
- `getNextActivePlayer()` — finds next active player in rotation
- `advanceStage()` — progresses through preFlop → flop → turn → river → showdown
- `getFirstPlayerToActPostFlop()` — first active player after dealer
- `distributeChips()` — distributes pot winnings to selected winners (supports split pots)
- `startNextGame()` — rotates dealer, optionally increases blinds (1.5x), eliminates busted players
- `getAvailableActions()` — returns valid actions for current player

### 6. Pot Calculator — `lib/pot-calculator.ts`

- `calculatePots()` — calculates main pot and side pots based on player bet levels (handles all-in scenarios)
- `getTotalPotAmount()` — sums all pots
- `formatPotDisplay()` — formats pot info in Japanese (メインポット / サイドポット)

### 7. Betting Logic — `lib/betting-logic.ts`

- `validateRaiseAmount()` — validates raise against minimum raise and available chips
- `getCallAmount()` — calculates how much a player needs to call
- `canCheck()` — checks if player's bet matches current bet
- `getMinimumRaise()` — returns current minimum raise
- `getMaximumRaise()` — returns max raise (chips minus call amount)

### 8. Utility Functions — `lib/utils.ts`

- `formatChips()` — formats numbers with Japanese locale commas
- `generatePlayerId()` — creates unique player IDs
- `getPositionLabel()` — returns BTN/SB/BB labels
- `getStatusText()` — Japanese status labels (参加中, フォールド, オールイン, 脱落)
- `getStageText()` — stage display text (Pre-flop, Flop, Turn, River, Showdown, GameOver)

### 9. State Management — `store/game-store.ts`

- Zustand store with `persist` middleware (saves to localStorage under key `poker-game-storage`)
- Store actions: `setSettings`, `startGame`, `performAction`, `selectWinners`, `nextGame`, `resetGame`
- Partialized persistence (only `gameState` and `settings` are persisted)

### 10. Tailwind Configuration — `tailwind.config.ts`

- Added custom poker color palette:
  - `poker-green`: `#1a4d2e`
  - `poker-felt`: `#0f3d26`
  - `poker-light-green`: `#2d7a4f`

### 11. Global Styles — `app/globals.css`

- CSS custom properties for poker colors
- `.poker-table` class with gradient background
- Custom webkit scrollbar styling
- `cardDeal` keyframe animation (fade + slide down)
- `chipMove` keyframe animation (fade + scale)
- Button active state scale transform

### 12. Layout — `app/layout.tsx`

- Set `lang="ja"` on html element
- Metadata: title "ポーカーチップマネージャー", description "トランプだけで遊べるポーカーチップ管理アプリ"
- Removed default Next.js fonts (Geist), using system fonts

### 13. Placeholder Home Page — `app/page.tsx`

- Minimal placeholder with poker table background and Japanese heading
- Will be replaced with the full setup form in Phase 2

---

## Build Verification

```
npm run build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (5/5)

Route (app)              Size     First Load JS
┌ ○ /                    137 B    87.4 kB
└ ○ /_not-found          875 B    88.1 kB
```

Zero TypeScript errors. Zero lint errors. Build passed.

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `types/game-types.ts` | Created | All TypeScript type definitions |
| `lib/game-engine.ts` | Created | Core poker game logic |
| `lib/pot-calculator.ts` | Created | Pot and side pot calculations |
| `lib/betting-logic.ts` | Created | Betting validation and rules |
| `lib/utils.ts` | Created | Helper/utility functions |
| `store/game-store.ts` | Created | Zustand state management store |
| `tailwind.config.ts` | Modified | Added poker color palette |
| `app/globals.css` | Modified | Poker table styles and animations |
| `app/layout.tsx` | Modified | Japanese metadata and lang |
| `app/page.tsx` | Modified | Minimal placeholder page |
| `package.json` | Generated | Next.js 14 + Zustand |
| `tsconfig.json` | Generated | TypeScript config with `@/*` alias |

---

## Next Steps — Phase 2

Phase 2 will implement the UI components:
- Setup screen with game settings form (`app/page.tsx`)
- Game screen with player table, action panel, showdown, and game over panels
- All components under `components/setup/` and `components/game/`

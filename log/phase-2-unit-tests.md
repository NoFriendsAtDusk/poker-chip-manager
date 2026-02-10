# Phase 2: Unit Tests for Core Logic — Development Log

**Date:** 2026-02-09
**Phase:** 2 — Data Models & Core Logic (Unit Tests)
**Status:** Complete

---

## Overview

Phase 1 already created all core logic files (types, game engine, pot calculator, betting logic, utils) and the Zustand store. Phase 2's remaining work was setting up a test framework and writing comprehensive unit tests for all core logic modules.

---

## Steps Completed

### 1. Testing Framework Setup

- Installed `jest`, `ts-jest`, and `@types/jest` as dev dependencies
- Created `jest.config.js` with:
  - `ts-jest` preset for TypeScript compilation
  - `moduleNameMapper` to resolve `@/*` path aliases
  - Test match pattern for `__tests__/**/*.test.ts`
- Added `"test": "jest"` script to `package.json`

### 2. Test Files Created

#### `__tests__/lib/utils.test.ts` — 14 tests
- `formatChips`: small numbers, thousands with commas, zero, large numbers
- `generatePlayerId`: format validation, contains index
- `getPositionLabel`: BTN, SB, BB, empty for other positions, BTN priority in heads-up
- `getStatusText`: all 4 Japanese status labels + unknown fallback
- `getStageText`: all 6 stage labels + unknown fallback

#### `__tests__/lib/betting-logic.test.ts` — 14 tests
- `validateRaiseAmount`: valid raise, below minimum (error message), insufficient chips (error message), exact chips match
- `getCallAmount`: standard call, no call needed, capped at player chips, unknown player
- `canCheck`: matching bet (true), below current (false), unknown player (false)
- `getMinimumRaise`: returns state.minRaise
- `getMaximumRaise`: chips minus call, full chips when no call, unknown player

#### `__tests__/lib/pot-calculator.test.ts` — 12 tests
- `calculatePots`: no bets, equal bets (single main pot), one short all-in, two all-ins at different levels, 4-player multiple side pots, folded player exclusion from eligible list
- `getTotalPotAmount`: sum of multiple pots, empty pots
- `formatPotDisplay`: empty, main only, main + side, multiple side pots (Japanese strings)

#### `__tests__/lib/game-engine.test.ts` — 52 tests
- `initializeGame`: player count, names, total chips conservation, stage, blind posting, no blinds, game number, community cards
- `processAction - fold`: status change, pot unchanged, hasActed flag
- `processAction - check`: no chip change
- `processAction - call`: chip deduction, pot increase, all-in on exact chips
- `processAction - raise`: chip deduction, currentBet/minRaise update, hasActed reset, invalid raise ignored, insufficient chips ignored
- `processAction - allIn`: chips to 0, status change, pot update, currentBet update, hasActed reset
- Stage advancement: all fold → showdown, preFlop → flop with community cards, currentBet reset
- `distributeChips`: single winner, split pot, odd chip remainder, side pot distribution
- `startNextGame`: game number increment, player elimination, insufficient players, blind increase (1.5x), no increase, stage reset
- `getAvailableActions`: fold/allIn always, call vs check, raise inclusion/exclusion

---

## Test Results

```
Test Suites: 4 passed, 4 total
Tests:       92 passed, 92 total
Time:        3.145 s
```

All 92 tests pass. Build also succeeds with zero errors.

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `jest.config.js` | Created | Jest configuration with ts-jest and path aliases |
| `package.json` | Modified | Added "test": "jest" script |
| `__tests__/lib/utils.test.ts` | Created | 14 tests for utility functions |
| `__tests__/lib/betting-logic.test.ts` | Created | 14 tests for betting validation |
| `__tests__/lib/pot-calculator.test.ts` | Created | 12 tests for pot calculations |
| `__tests__/lib/game-engine.test.ts` | Created | 52 tests for core game engine |

---

## Next Steps — Phase 3 (State Management)

Phase 3 in the dev plan covers state management, which was already implemented in Phase 1 (`store/game-store.ts` with Zustand persist middleware). The next actionable phase is **Phase 4: UI Components — Setup Screen**.

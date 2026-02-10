# Phase 7: Bug Fixes — Development Log

**Date:** 2026-02-10
**Phase:** 7 — Bug Fixes (Post-Testing)
**Status:** Complete

---

## Overview

After Phase 7 polish was complete, comprehensive manual and automated testing revealed 3 bugs in the game engine. All bugs have been fixed, tests updated, and the build verified.

---

## Bug 1 (Critical): Side Pot Chip Leakage When Short-Stack Wins

**Problem:** When a short-stack player went all-in and won the main pot at showdown, the side pot between remaining players had no winner selection mechanism. The UI only asked for one global set of winners, so side pot chips vanished permanently.

**Root Cause:** `distributeChips` accepted a flat `string[]` of winner IDs and applied them to all pots. If a winner wasn't eligible for a side pot, that pot was skipped and chips were lost.

**Fix:**
- Added `PotWinner` type to `types/game-types.ts` (`{ potIndex: number; winners: string[] }`)
- Changed `distributeChips` signature from `(state, winners: string[])` to `(state, potWinners: PotWinner[])`
- Redesigned `ShowdownPanel.tsx` with per-pot winner selection:
  - Iterates through pots one at a time
  - Shows pot type/amount and only eligible players for each pot
  - Auto-awards pots with single eligible player
  - Displays pot progress indicator when multiple pots exist
- Updated `game-store.ts` `selectWinners` to accept `PotWinner[]`

## Bug 2 (Medium): `totalPot` Not Zeroed After Distribution

**Problem:** After chips were distributed (fold-out auto-win or showdown), `totalPot` retained its old value. `GameHeader.tsx` displayed a stale pot amount on the gameOver screen.

**Fix:**
- In `advanceStage` auto-win path: added `state.totalPot = 0` and `state.pots = []`
- In `distributeChips`: added `newState.totalPot = 0` and `newState.pots = []`

## Bug 3 (Low): Partial Blind When BB Can't Afford Full Amount

**Problem:** When BB had fewer chips than the big blind (e.g., 50 chips with BB=200), `state.currentBet` was set to `bbAmount` (50). But SB may have posted 100, meaning `currentBet < SB's contribution`. Other players would only need to match 50 to "call".

**Fix:** Changed `state.currentBet = bbAmount` to `state.currentBet = Math.max(sbAmount, bbAmount)` in `postBlinds`.

---

## Build Results

```
✓ Compiled successfully
Route (app)                                   Size     First Load JS
┌ ○ /                                         2.15 kB         101 kB
├ ○ /faq                                      189 B          96.1 kB
├ ○ /game                                     3.63 kB        94.1 kB
├ ○ /how-to-play                              189 B          96.1 kB
├ ○ /legal/privacy                            188 B          96.1 kB
├ ○ /legal/specified-commercial-transactions  189 B          96.1 kB
├ ○ /legal/terms                              189 B          96.1 kB
└ ○ /rules                                    189 B          96.1 kB
```

All 128 tests pass (5 suites). Game page size increased slightly (3.32 kB → 3.63 kB) due to per-pot winner selection logic.

---

## Files Modified

| File | Changes |
|------|---------|
| `types/game-types.ts` | Added `PotWinner` interface |
| `lib/game-engine.ts` | `distributeChips` per-pot winners, `advanceStage` totalPot reset, `postBlinds` currentBet fix |
| `components/game/ShowdownPanel.tsx` | Per-pot winner selection UI with progress tracking |
| `store/game-store.ts` | Updated `selectWinners` to accept `PotWinner[]` |
| `__tests__/lib/game-engine.test.ts` | Updated distributeChips tests for new signature, added chip conservation test |
| `__tests__/lib/scenarios.test.ts` | Updated all distributeChips calls, fixed bug-asserting tests |

---

## Next Steps — Phase 8 (Testing & Deployment)

Phase 8 covers:
- End-to-end testing
- Deploy to Vercel
- Configure custom domain
- Set up analytics (optional)

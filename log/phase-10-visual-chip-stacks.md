# Phase 10: Visual Chip Stacks on the Poker Table

**Branch:** `update/casino-dark-theme`
**Date:** 2026-02-11

---

## Overview

Added visual poker chip representations to the elliptical table using a PNG chip image. Chips appear as stacked images in player bet areas and as a scattered pile in the center pot, with quantities based on a fixed 1 chip = 100 units ratio.

---

## Changes

### New Files

| File | Description |
|------|-------------|
| `public/chip.png` | Blue poker chip PNG image (3D isometric view) used for all chip visuals |
| `lib/chip-visuals.ts` | Pure utility functions for calculating chip disc positions |
| `components/game/ChipStack.tsx` | Reusable component rendering a stack of chip images |

### Modified Files

| File | Description |
|------|-------------|
| `components/game/SeatPanel.tsx` | Removed player chip stack display; chips only appear as bets on the felt |
| `components/game/PokerTableView.tsx` | Added bet chip stacks between players and center, pot chip pile in center |
| `app/globals.css` | Added `.chip-disc` class for image-based chip rendering |

---

## Chip Visual System

### Design Decisions

- **1 chip = 100 units**: A bet of 500 shows 5 chip images, a pot of 2,000 shows 20 chips
- **Single chip image**: All chips use the same `chip.png` (blue poker chip with white edge markings)
- **Next.js `<Image>` component**: Used instead of `<img>` for automatic optimization
- **No player stack display**: Player chip totals are shown as text only in the seat panel; chip images only appear when players bet

### Three Chip Locations

1. **Bet Chips** (between player seat and table center)
   - Appear when `player.currentBet > 0`
   - Positioned at 40% interpolation from player seat toward center
   - Vertical stack, 3px offset per chip, capped at 10 chips
   - Size: 20x12px per chip

2. **Pot Pile** (center of table, behind pot text)
   - Shows only chips from **completed betting rounds** (not current round's bets)
   - Calculated as `totalPot - sum of all players' currentBet`
   - Scattered layout using golden angle (137.508°) for natural distribution
   - Capped at 20 chips, size: 22x13px per chip

3. **Player Stack** (removed)
   - Originally showed chips above each seat panel proportional to player's total chips
   - Removed per user preference — chips only appear as bets

### Pot Display Logic

The pot chip pile only updates at the end of each betting round:
- **Pre-flop start**: SB=100, BB=200, totalPot=300, currentBets=300 → collectedPot=0 → no chips in center
- **After pre-flop round**: currentBets reset to 0 → collectedPot=300 → 3 chips appear in center
- **Subsequent rounds**: pile grows only when betting rounds complete and bets are swept in

---

## Key Files

### `lib/chip-visuals.ts`

```typescript
export interface ChipDisc {
  offsetX: number; // px
  offsetY: number; // px
}

export function getBetChips(betAmount: number, maxDiscs?: number): ChipDisc[]
export function getChipPile(potAmount: number, maxChips?: number): ChipDisc[]
```

- `getBetChips`: Vertical stack, `Math.ceil(amount / 100)` chips, max 10
- `getChipPile`: Scattered pile using golden angle, `Math.ceil(amount / 100)` chips, max 20

### `components/game/ChipStack.tsx`

Renders an array of `ChipDisc` objects as absolutely positioned `<Image>` elements. Two size variants: `sm` (20x12px) and `md` (28x17px).

---

## Verification

- `npx tsc --noEmit` — zero type errors
- `npm test` — 140 tests pass
- `npm run build` — compiles successfully
- Manual testing: bet chips appear correctly, pot pile updates only after rounds complete

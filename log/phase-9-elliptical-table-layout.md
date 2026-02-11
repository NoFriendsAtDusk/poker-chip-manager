# Phase 4 (UI): Elliptical Poker Table Layout — Development Log

**Date:** 2026-02-11
**Phase:** Casino UI Phase 4 — Elliptical Table Layout
**Branch:** `update/casino-dark-theme`
**Status:** Complete

---

## Overview

Replaced the vertical card-list game layout with a top-down elliptical poker table view. Players are now positioned around an oval green felt surface, with pot and community cards displayed in the center. The game header is a compact bar at the top, and action buttons are docked at the bottom. No game logic was changed.

---

## What Changed

### New Files

| File | Purpose |
|------|---------|
| `lib/table-layout.ts` | Pure utility that calculates seat positions (x%, y%) around an ellipse using trigonometry. Supports 2-10 players with dynamic radii to reduce overlap on mobile. |
| `components/game/SeatPanel.tsx` | Compact player info panel (~80px wide on mobile) showing badges, name, chips, and current bet. Visual states: current (gold glow), folded (dimmed), all-in (red badge). |
| `components/game/PokerTableView.tsx` | Main table component rendering the oval felt surface, rail border, centered pot display, community cards with deal animation, and players positioned around the ellipse. |

### Modified Files

| File | Changes |
|------|---------|
| `app/game/page.tsx` | Switched from vertical scroll layout to three-zone flexbox: compact header (top), poker table (center), action panel (bottom dock). Removed `CommunityCards` and `PlayerTable` imports, replaced with `PokerTableView`. |
| `components/game/GameHeader.tsx` | Made compact: single-row bar with semi-transparent background. Removed pot display (now shown on the table center). Reduced font sizes. |
| `components/game/ActionPanel.tsx` | Made compact for bottom dock: reduced padding, smaller buttons, raise input on same row as raise button. Removed player name heading. |
| `components/game/ShowdownPanel.tsx` | Added `max-h-[30vh] overflow-y-auto` to player button list for scroll constraint. Reduced padding. |
| `components/game/GameOverPanel.tsx` | Wrapped in fixed full-screen overlay (`bg-black/60`) with centered modal. Added scroll constraint to standings list. |
| `app/globals.css` | Added `.poker-felt-surface` class (radial gradient for felt). |
| `lib/animation-variants.ts` | Added `tableAppear` variant for table surface fade-in. |

### Preserved Files (Not Modified)

- `PlayerCard.tsx`, `PlayerTable.tsx` — kept for potential reuse
- All game logic files (`lib/game-engine.ts`, `lib/betting-logic.ts`, `lib/pot-calculator.ts`)
- All types, store, and unit tests

---

## Technical Details

### Elliptical Positioning Algorithm

Players are distributed evenly around an ellipse using:
```
angle = π/2 + (i × 2π / playerCount)
x = 50% + radiusX × cos(angle)
y = 50% + radiusY × sin(angle)
```

Player index 0 is at the bottom (6 o'clock), proceeding clockwise. Dynamic radii prevent overlap with many players:
- 2-6 players: rx=42%, ry=38%
- 7-8 players: rx=45%, ry=42%
- 9-10 players: rx=48%, ry=45%

### CSS Table Construction

- **Oval shape:** `border-radius: 50%` on a wider-than-tall container
- **Felt:** Radial gradient from `casino-felt-light` to `casino-felt-dark`
- **Rail:** `border-amber-900` (6-10px) with layered box-shadow for depth and gold outer ring
- **Inner line:** Subtle decorative border inside the felt
- **Overflow:** Visible, so player panels can sit at the table edge

### Responsive Sizing

| Breakpoint | Table Size | Panel Width |
|------------|-----------|-------------|
| Mobile (<640px) | 340×220px | 80px |
| Tablet (sm) | 520×320px | 100px |
| Desktop (md+) | 700×420px | 120px |

### Layout Architecture

```
h-screen flex flex-col overflow-hidden
├── flex-shrink-0: GameHeader (z-30)
├── flex-1 items-center justify-center: PokerTableView (z-10)
└── flex-shrink-0: Undo + Panels (z-30)
```

---

## Verification

- `npx tsc --noEmit` — zero type errors
- `npm test` — 140/140 tests passed
- `npm run build` — all 12 pages compiled successfully
- Visual check: table renders correctly with players around the ellipse

---

## Files Summary

| Action | Count |
|--------|-------|
| New files | 3 |
| Modified files | 7 |
| Deleted files | 0 |
| Game logic changes | 0 |
| Test changes | 0 |

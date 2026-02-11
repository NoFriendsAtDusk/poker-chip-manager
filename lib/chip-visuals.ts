// Visual chip disc calculations for the poker table.
// Pure functions — no React dependency.
// 1 chip image = 100 units.

const UNITS_PER_CHIP = 100;

export interface ChipDisc {
  offsetX: number; // px
  offsetY: number; // px
}

/**
 * Generate a vertical chip stack for a bet amount.
 * 1 chip per 100 units, capped at maxDiscs for visual clarity.
 */
export function getBetChips(
  betAmount: number,
  maxDiscs: number = 10
): ChipDisc[] {
  if (betAmount <= 0) return [];

  const chipCount = Math.min(
    Math.max(1, Math.ceil(betAmount / UNITS_PER_CHIP)),
    maxDiscs
  );
  const discs: ChipDisc[] = [];

  for (let i = 0; i < chipCount; i++) {
    discs.push({
      offsetX: 0,
      offsetY: -i * 3, // stack upward, 3px per disc
    });
  }

  return discs;
}

/**
 * Generate a scattered chip pile for the pot.
 * 1 chip per 100 units, capped at maxChips.
 * Uses golden angle for natural-looking scatter.
 */
export function getChipPile(
  potAmount: number,
  maxChips: number = 20
): ChipDisc[] {
  if (potAmount <= 0) return [];

  const chipCount = Math.min(
    Math.max(1, Math.ceil(potAmount / UNITS_PER_CHIP)),
    maxChips
  );
  const discs: ChipDisc[] = [];

  for (let i = 0; i < chipCount; i++) {
    // Deterministic scatter using golden angle
    const angle = (i * 137.508) * (Math.PI / 180);
    const radius = 3 + (i % 3) * 4; // 3-11px from center
    discs.push({
      offsetX: Math.cos(angle) * radius,
      offsetY: Math.sin(angle) * radius - i * 1, // slight upward stacking
    });
  }

  return discs;
}

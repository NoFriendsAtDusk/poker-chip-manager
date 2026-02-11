// Utility to calculate player seat positions around an elliptical poker table.
// Returns percentage-based coordinates for CSS absolute positioning.

export interface SeatPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

/**
 * Calculate seat positions for N players around an ellipse.
 * Index 0 is placed at the bottom center (6 o'clock), then clockwise.
 */
export function calculateSeatPositions(
  playerCount: number,
  radiusX: number = 42,
  radiusY: number = 38
): SeatPosition[] {
  const positions: SeatPosition[] = [];
  const startAngle = Math.PI / 2; // bottom center

  for (let i = 0; i < playerCount; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / playerCount;
    positions.push({
      x: 50 + radiusX * Math.cos(angle),
      y: 50 + radiusY * Math.sin(angle),
    });
  }

  return positions;
}

/**
 * Get dynamic radii based on player count to reduce overlap on mobile.
 */
export function getRadiiForPlayerCount(
  playerCount: number,
  portrait = false
): { rx: number; ry: number } {
  let rx: number, ry: number;
  if (playerCount <= 6) { rx = 42; ry = 38; }
  else if (playerCount <= 8) { rx = 45; ry = 42; }
  else { rx = 48; ry = 45; }

  return portrait ? { rx: ry, ry: rx } : { rx, ry };
}

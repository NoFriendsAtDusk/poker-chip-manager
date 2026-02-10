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

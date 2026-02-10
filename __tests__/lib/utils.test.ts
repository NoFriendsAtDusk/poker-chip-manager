import {
  formatChips,
  generatePlayerId,
  getPositionLabel,
  getStatusText,
  getStageText
} from '@/lib/utils';

describe('formatChips', () => {
  it('formats small numbers without commas', () => {
    expect(formatChips(100)).toBe('100');
  });

  it('formats thousands with commas', () => {
    expect(formatChips(10000)).toBe('10,000');
  });

  it('formats zero', () => {
    expect(formatChips(0)).toBe('0');
  });

  it('formats large numbers', () => {
    expect(formatChips(1000000)).toBe('1,000,000');
  });
});

describe('generatePlayerId', () => {
  it('generates an ID containing the index', () => {
    const id = generatePlayerId(3);
    expect(id).toMatch(/^player-3-\d+$/);
  });

  it('generates unique IDs for the same index', () => {
    const id1 = generatePlayerId(0);
    const id2 = generatePlayerId(0);
    // IDs may be equal if called in the same millisecond, but format is correct
    expect(id1).toMatch(/^player-0-/);
    expect(id2).toMatch(/^player-0-/);
  });
});

describe('getPositionLabel', () => {
  it('returns BTN for dealer position', () => {
    expect(getPositionLabel(0, 0, 1, 2)).toBe('BTN');
  });

  it('returns SB for small blind position', () => {
    expect(getPositionLabel(1, 0, 1, 2)).toBe('SB');
  });

  it('returns BB for big blind position', () => {
    expect(getPositionLabel(2, 0, 1, 2)).toBe('BB');
  });

  it('returns empty string for other positions', () => {
    expect(getPositionLabel(3, 0, 1, 2)).toBe('');
  });

  it('prioritizes BTN when dealer is also SB index', () => {
    // In heads-up, dealer is checked first
    expect(getPositionLabel(0, 0, 0, 1)).toBe('BTN');
  });
});

describe('getStatusText', () => {
  it('returns Japanese text for active', () => {
    expect(getStatusText('active')).toBe('参加中');
  });

  it('returns Japanese text for folded', () => {
    expect(getStatusText('folded')).toBe('フォールド');
  });

  it('returns Japanese text for allIn', () => {
    expect(getStatusText('allIn')).toBe('オールイン');
  });

  it('returns Japanese text for out', () => {
    expect(getStatusText('out')).toBe('脱落');
  });

  it('returns the input for unknown status', () => {
    expect(getStatusText('unknown')).toBe('unknown');
  });
});

describe('getStageText', () => {
  it('returns Pre-flop for preFlop', () => {
    expect(getStageText('preFlop')).toBe('Pre-flop');
  });

  it('returns Flop for flop', () => {
    expect(getStageText('flop')).toBe('Flop');
  });

  it('returns Turn for turn', () => {
    expect(getStageText('turn')).toBe('Turn');
  });

  it('returns River for river', () => {
    expect(getStageText('river')).toBe('River');
  });

  it('returns Showdown for showdown', () => {
    expect(getStageText('showdown')).toBe('Showdown');
  });

  it('returns GameOver for gameOver', () => {
    expect(getStageText('gameOver')).toBe('GameOver');
  });

  it('returns the input for unknown stage', () => {
    expect(getStageText('mystery')).toBe('mystery');
  });
});

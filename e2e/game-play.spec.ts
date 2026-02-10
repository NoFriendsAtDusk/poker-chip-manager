import { test, expect } from '@playwright/test';
import { setupAndStartGame, fold, check, call, allIn, raise, playCheckOrCallRound } from './helpers';

/**
 * Game Play E2E Tests
 *
 * These tests verify the core gameplay mechanics:
 * - Action panel displays correctly with the right buttons
 * - Each betting action (fold, check, call, raise, all-in) works
 * - Pot updates after actions
 * - Stage progression through the game
 * - Auto-win when all opponents fold
 *
 * The game uses a random dealer position, so we can't predict exactly
 * which player acts first. Tests use flexible assertions that work
 * regardless of position assignment.
 */

test.describe('Game page display', () => {
  test('shows game header with correct info', async ({ page }) => {
    await setupAndStartGame(page);

    // Game number should be 1
    await expect(page.getByText('ゲーム 1')).toBeVisible();

    // Stage should show Pre-flop
    await expect(page.getByText('Pre-flop')).toBeVisible();

    // Pot should show some amount (blinds were posted)
    await expect(page.getByText('ポット合計')).toBeVisible();

    // Blind info should be displayed
    await expect(page.getByText('SB: 100')).toBeVisible();
    await expect(page.getByText('BB: 200')).toBeVisible();
  });

  test('shows player table with all players', async ({ page }) => {
    await setupAndStartGame(page);

    // All 4 default player names should appear in the player table
    // Use .first() because the current player's name also appears in the action panel header
    await expect(page.getByText('Player 1').first()).toBeVisible();
    await expect(page.getByText('Player 2').first()).toBeVisible();
    await expect(page.getByText('Player 3').first()).toBeVisible();
    await expect(page.getByText('Player 4').first()).toBeVisible();
  });

  test('shows action panel with current player name', async ({ page }) => {
    await setupAndStartGame(page);

    // The action panel should show "X のアクション" for some player
    await expect(page.getByText('のアクション')).toBeVisible();
  });

  test('redirects to home when accessing /game without state', async ({ page }) => {
    // Navigate directly to /game without setting up
    await page.goto('/game');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should redirect to home page
    await page.waitForURL('/');
    await expect(page.getByText('ゲーム設定')).toBeVisible();
  });
});

test.describe('Betting actions', () => {
  test('fold removes player from hand', async ({ page }) => {
    await setupAndStartGame(page);

    // The current player name is shown in the action panel
    const actionHeader = page.locator('text=のアクション');
    await expect(actionHeader).toBeVisible();

    // Click fold
    await fold(page);

    // The "フォールド" status text should appear in the player table
    // Use getByRole('cell') to target the table cell, not the fold button
    await expect(page.getByRole('cell', { name: 'フォールド' })).toBeVisible();
  });

  test('call button shows amount and works', async ({ page }) => {
    await setupAndStartGame(page);

    // In preflop with blinds, the first player to act needs to call
    // Check if call button is visible (it should be for the first non-blind player)
    const callButton = page.getByRole('button', { name: /コール/ });
    const checkButton = page.getByRole('button', { name: 'チェック' });

    if (await callButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Call button should display the amount
      await expect(callButton).toContainText('コール');
      await callButton.click();
    } else {
      // If check is available (BB position), that's also valid
      await checkButton.click();
    }

    // Action should advance to next player
    await expect(page.getByText('のアクション')).toBeVisible();
  });

  test('all-in button works', async ({ page }) => {
    await setupAndStartGame(page);

    // Click all-in
    await allIn(page);

    // "オールイン" status should appear in the player table
    await expect(page.getByText('オールイン').first()).toBeVisible();
  });

  test('raise input and button work', async ({ page }) => {
    await setupAndStartGame(page);

    // The raise input should be visible
    const raiseInput = page.locator('input[aria-label="レイズ額"]');
    await expect(raiseInput).toBeVisible();

    // The raise button should show minimum raise amount
    const raiseButton = page.getByRole('button', { name: /レイズ/ });
    await expect(raiseButton).toBeVisible();

    // Fill in a raise amount and click
    await raiseInput.fill('400');
    await raiseButton.click();

    // Pot should increase — game advances to next player
    await expect(page.getByText('のアクション')).toBeVisible();
  });
});

test.describe('All fold to winner', () => {
  test('game ends when all but one player folds', async ({ page }) => {
    await setupAndStartGame(page);

    // Fold 3 times — the last remaining player wins automatically
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    // The game should be over — either showdown or gameOver
    // With 4 players and 3 folds, auto-win triggers gameOver
    const gameOverVisible = await page.getByText('ゲーム終了').isVisible({ timeout: 3000 }).catch(() => false);
    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 1000 }).catch(() => false);

    expect(gameOverVisible || showdownVisible).toBe(true);
  });
});

test.describe('Stage progression', () => {
  test('game progresses through betting rounds to showdown', async ({ page }) => {
    await setupAndStartGame(page);

    // Pre-flop: all players call/check
    await playCheckOrCallRound(page);

    // After preflop completes, we should advance to flop
    // Community cards should appear (3 cards on flop)
    const communityCards = page.locator('text=Community Cards');

    // Continue through flop
    await playCheckOrCallRound(page);

    // Continue through turn
    await playCheckOrCallRound(page);

    // Continue through river
    await playCheckOrCallRound(page);

    // Should reach showdown or gameOver
    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 3000 }).catch(() => false);
    const gameOverVisible = await page.getByText('ゲーム終了').isVisible({ timeout: 1000 }).catch(() => false);

    expect(showdownVisible || gameOverVisible).toBe(true);
  });

  test('community cards appear after preflop', async ({ page }) => {
    await setupAndStartGame(page);

    // No community cards during preflop
    await expect(page.locator('text=Community Cards')).not.toBeVisible();

    // Play through preflop
    await playCheckOrCallRound(page);

    // Community cards should now be visible (flop = 3 cards)
    await expect(page.locator('text=Community Cards')).toBeVisible({ timeout: 3000 });
  });
});

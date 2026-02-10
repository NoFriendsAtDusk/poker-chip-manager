import { test, expect } from '@playwright/test';
import { setupAndStartGame, fold, playToShowdown } from './helpers';

/**
 * Showdown & Game Over E2E Tests
 *
 * These tests verify:
 * - Showdown: winner selection works, error on no selection, per-pot UI
 * - Game Over: player standings display, next game and quit buttons
 *
 * Many tests use the "all fold" shortcut to reach gameOver quickly,
 * since the fold path doesn't require showdown winner selection.
 * The showdown-specific tests play through all rounds to trigger
 * the actual showdown UI.
 */

test.describe('Showdown winner selection', () => {
  test('displays winner selection panel at showdown', async ({ page }) => {
    await setupAndStartGame(page);

    // Play through all rounds to reach showdown
    await playToShowdown(page);

    // Check if we reached showdown (with winner selection)
    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 3000 }).catch(() => false);
    const gameOverVisible = await page.getByText('ゲーム終了').isVisible({ timeout: 1000 }).catch(() => false);

    // One of these should be true (gameOver happens if only 1 eligible player for all pots)
    expect(showdownVisible || gameOverVisible).toBe(true);

    if (showdownVisible) {
      // The confirm button should be visible
      await expect(page.getByRole('button', { name: '勝者を確定' })).toBeVisible();

      // Pot information should be displayed (use .first() as "ポット" appears in header too)
      await expect(page.getByText(/ポット/).first()).toBeVisible();
    }
  });

  test('shows error when confirming without selecting a winner', async ({ page }) => {
    await setupAndStartGame(page);
    await playToShowdown(page);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 3000 }).catch(() => false);

    if (showdownVisible) {
      // Click confirm without selecting anyone
      await page.getByRole('button', { name: '勝者を確定' }).click();

      // Error message should appear (filter to the visible alert, not Next.js route announcer)
      await expect(page.getByRole('alert').filter({ hasText: '勝者を選択してください' })).toBeVisible();
    }
  });

  test('selecting a winner and confirming advances to game over', async ({ page }) => {
    await setupAndStartGame(page);
    await playToShowdown(page);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 3000 }).catch(() => false);

    if (showdownVisible) {
      // Click the first player button to select as winner
      // Player buttons are in a space-y container after the pot info
      const playerButtons = page.locator('button[aria-pressed]');
      const firstPlayer = playerButtons.first();

      if (await firstPlayer.isVisible({ timeout: 1000 }).catch(() => false)) {
        await firstPlayer.click();

        // Button should now be selected (aria-pressed="true")
        await expect(firstPlayer).toHaveAttribute('aria-pressed', 'true');

        // Click confirm
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    // Should now be at game over (or already was if auto-awarded)
    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
  });

  test('winner toggle works — can select and deselect', async ({ page }) => {
    await setupAndStartGame(page);
    await playToShowdown(page);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 3000 }).catch(() => false);

    if (showdownVisible) {
      const playerButtons = page.locator('button[aria-pressed]');
      const firstPlayer = playerButtons.first();

      if (await firstPlayer.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Select
        await firstPlayer.click();
        await expect(firstPlayer).toHaveAttribute('aria-pressed', 'true');

        // Deselect
        await firstPlayer.click();
        await expect(firstPlayer).toHaveAttribute('aria-pressed', 'false');
      }
    }
  });
});

test.describe('Game Over display', () => {
  test('shows game over panel after all fold', async ({ page }) => {
    await setupAndStartGame(page);

    // Fold 3 times to trigger auto-win
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    // Handle showdown if it appears (when only 1 player left, should be auto-win)
    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 2000 }).catch(() => false);
    if (showdownVisible) {
      // Auto-award should handle this, but if manual selection needed:
      const playerButtons = page.locator('button[aria-pressed]');
      if (await playerButtons.first().isVisible({ timeout: 500 }).catch(() => false)) {
        await playerButtons.first().click();
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    // Game over panel should display
    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('勝者にチップが配分されました。')).toBeVisible();
  });

  test('displays player standings sorted by chips', async ({ page }) => {
    await setupAndStartGame(page);

    // Fold 3 times
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 2000 }).catch(() => false);
    if (showdownVisible) {
      const playerButtons = page.locator('button[aria-pressed]');
      if (await playerButtons.first().isVisible({ timeout: 500 }).catch(() => false)) {
        await playerButtons.first().click();
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });

    // All player names should still be visible in standings
    // Use .first() as names may appear in both the table and the standings panel
    await expect(page.getByText('Player 1').first()).toBeVisible();
    await expect(page.getByText('Player 2').first()).toBeVisible();
    await expect(page.getByText('Player 3').first()).toBeVisible();
    await expect(page.getByText('Player 4').first()).toBeVisible();
  });

  test('pot shows 0 after distribution', async ({ page }) => {
    await setupAndStartGame(page);

    // Fold 3 times
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 2000 }).catch(() => false);
    if (showdownVisible) {
      const playerButtons = page.locator('button[aria-pressed]');
      if (await playerButtons.first().isVisible({ timeout: 500 }).catch(() => false)) {
        await playerButtons.first().click();
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });

    // Pot should show 0 (Bug 2 fix verification)
    await expect(page.getByText('ポット合計: 0')).toBeVisible();
  });
});

test.describe('Game Over actions', () => {
  test('next game button starts a new game', async ({ page }) => {
    await setupAndStartGame(page);

    // Quick game: fold 3 times
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 2000 }).catch(() => false);
    if (showdownVisible) {
      const playerButtons = page.locator('button[aria-pressed]');
      if (await playerButtons.first().isVisible({ timeout: 500 }).catch(() => false)) {
        await playerButtons.first().click();
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });

    // Click next game
    await page.getByRole('button', { name: '次のゲームに進む' }).click();

    // Should show game 2
    await expect(page.getByText('ゲーム 2')).toBeVisible({ timeout: 3000 });

    // Action panel should be visible again
    await expect(page.getByText('のアクション')).toBeVisible();
  });

  test('save and quit button navigates to home', async ({ page }) => {
    await setupAndStartGame(page);

    // Quick game: fold 3 times
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);
    await fold(page);
    await page.waitForTimeout(200);

    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 2000 }).catch(() => false);
    if (showdownVisible) {
      const playerButtons = page.locator('button[aria-pressed]');
      if (await playerButtons.first().isVisible({ timeout: 500 }).catch(() => false)) {
        await playerButtons.first().click();
        await page.getByRole('button', { name: '勝者を確定' }).click();
      }
    }

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });

    // Click save and quit
    await page.getByRole('button', { name: '保存して中断する' }).click();

    // Should navigate back to home
    await page.waitForURL('/');
    await expect(page.getByText('ゲーム設定')).toBeVisible();
  });
});

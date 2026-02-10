import { Page, expect } from '@playwright/test';

/**
 * Options for game setup. All fields are optional — defaults match
 * the app's built-in defaults (4 players, 10000 chips, blinds 100/200).
 */
interface SetupOptions {
  playerCount?: number;
  playerNames?: string[];
  startingChips?: number;
  betUnit?: number;
  blindsEnabled?: boolean;
  smallBlind?: number;
  bigBlind?: number;
}

/**
 * Fills out the setup form on the home page and navigates to the game page.
 *
 * How it works:
 * 1. Navigates to the home page (/)
 * 2. Clears localStorage to ensure a fresh game state (no stale data from previous tests)
 * 3. Fills in form fields with the provided options (or leaves defaults)
 * 4. Clicks "ゲーム開始" to submit the form
 * 5. Waits for navigation to /game and verifies the game page loaded
 */
export async function setupAndStartGame(page: Page, options: SetupOptions = {}) {
  await page.goto('/');

  // Clear any previous game state from localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Change player count if specified
  if (options.playerCount !== undefined) {
    const playerCountInput = page.locator('label:has-text("プレイ人数") + input, label:has-text("プレイ人数") ~ input').first();
    await playerCountInput.fill(String(options.playerCount));
    // Wait for the player name fields to update
    await page.waitForTimeout(300);
  }

  // Fill player names if specified
  if (options.playerNames) {
    for (let i = 0; i < options.playerNames.length; i++) {
      const nameInput = page.locator(`input[type="text"]`).nth(i);
      await nameInput.fill(options.playerNames[i]);
    }
  }

  // Change starting chips if specified
  if (options.startingChips !== undefined) {
    const chipsLabel = page.getByText('初期チップ');
    const chipsInput = chipsLabel.locator('..').locator('input');
    await chipsInput.fill(String(options.startingChips));
  }

  // Change bet unit if specified
  if (options.betUnit !== undefined) {
    const betLabel = page.getByText('ベット単位');
    const betInput = betLabel.locator('..').locator('input');
    await betInput.fill(String(options.betUnit));
  }

  // Toggle blinds if specified
  if (options.blindsEnabled === false) {
    const blindsCheckbox = page.locator('text=ブラインドあり').locator('..').locator('input[type="checkbox"]');
    await blindsCheckbox.uncheck();
  }

  // Set blind amounts if specified
  if (options.smallBlind !== undefined) {
    const sbLabel = page.getByText('Small Blind', { exact: true });
    const sbInput = sbLabel.locator('..').locator('input');
    await sbInput.fill(String(options.smallBlind));
  }

  if (options.bigBlind !== undefined) {
    const bbLabel = page.getByText('Big Blind', { exact: true });
    const bbInput = bbLabel.locator('..').locator('input');
    await bbInput.fill(String(options.bigBlind));
  }

  // Submit the form
  await page.getByRole('button', { name: 'ゲーム開始' }).click();

  // Wait for navigation to game page
  await page.waitForURL('/game');
  await expect(page.getByText('ゲーム 1')).toBeVisible();
}

/**
 * Clicks the fold button for the current player.
 * The fold button always says "フォールド".
 */
export async function fold(page: Page) {
  await page.getByRole('button', { name: 'フォールド' }).click();
}

/**
 * Clicks the check button (available when the player has already matched the current bet).
 */
export async function check(page: Page) {
  await page.getByRole('button', { name: 'チェック' }).click();
}

/**
 * Clicks the call button (matches the current bet).
 * The call button text includes the amount, e.g., "コール(200)".
 */
export async function call(page: Page) {
  await page.getByRole('button', { name: /コール/ }).click();
}

/**
 * Clicks the all-in button (bets all remaining chips).
 */
export async function allIn(page: Page) {
  await page.getByRole('button', { name: 'オールイン' }).click();
}

/**
 * Performs a raise action:
 * 1. Clears the raise input field
 * 2. Types the new raise amount
 * 3. Clicks the raise button
 */
export async function raise(page: Page, amount: number) {
  const raiseInput = page.locator('input[aria-label="レイズ額"]');
  await raiseInput.fill(String(amount));
  await page.getByRole('button', { name: /レイズ/ }).click();
}

/**
 * Plays all active players through one betting round by having them
 * check (if allowed) or call. This advances the game through a betting round
 * without any folds or raises.
 *
 * Useful for quickly progressing to showdown.
 * Stops when the stage changes (e.g., from flop to turn).
 */
export async function playCheckOrCallRound(page: Page) {
  // Keep clicking check or call until the action panel is no longer visible
  // or the stage changes
  for (let i = 0; i < 12; i++) {
    const checkButton = page.getByRole('button', { name: 'チェック' });
    const callButton = page.getByRole('button', { name: /コール/ });
    const actionPanel = page.locator('text=のアクション');

    if (await actionPanel.isVisible({ timeout: 1000 }).catch(() => false)) {
      if (await checkButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await checkButton.click();
      } else if (await callButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await callButton.click();
      } else {
        break;
      }
      await page.waitForTimeout(200);
    } else {
      break;
    }
  }
}

/**
 * Plays through all betting rounds (preFlop → flop → turn → river)
 * to reach showdown. Uses check/call for all players.
 *
 * Warning: This assumes the game has been properly set up and
 * the action panel is visible. It will stop when showdown is reached
 * or after a safety limit to prevent infinite loops.
 */
export async function playToShowdown(page: Page) {
  for (let round = 0; round < 4; round++) {
    await playCheckOrCallRound(page);
    // Check if we've reached showdown
    const showdownVisible = await page.getByText('勝者を選択してください').isVisible({ timeout: 1000 }).catch(() => false);
    if (showdownVisible) break;
    const gameOverVisible = await page.getByText('ゲーム終了').isVisible({ timeout: 500 }).catch(() => false);
    if (gameOverVisible) break;
  }
}

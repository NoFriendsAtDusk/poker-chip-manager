import { test, expect } from '@playwright/test';

/**
 * Setup Flow E2E Tests
 *
 * These tests verify the home/setup page works correctly:
 * - Page loads with the correct title and form
 * - Player count changes dynamically update name fields
 * - Blinds toggle shows/hides blind settings
 * - Form submission navigates to the game page
 * - Navigation links work correctly
 */

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test to prevent stale game state
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState('networkidle');
});

test.describe('Home page', () => {
  test('displays the app title and form', async ({ page }) => {
    // The main heading should show the app name
    await expect(page.getByText('トランプだけで遊べる！')).toBeVisible();
    await expect(page.getByText('ポーカーチップアプリ')).toBeVisible();

    // The game settings form should be visible
    await expect(page.getByText('ゲーム設定')).toBeVisible();

    // The submit button should exist
    await expect(page.getByRole('button', { name: 'ゲーム開始' })).toBeVisible();
  });

  test('has correct page title in browser tab', async ({ page }) => {
    await expect(page).toHaveTitle('ポーカーチップマネージャー');
  });

  test('shows default form values', async ({ page }) => {
    // Default player count is 4
    const playerCountInput = page.locator('input[type="number"]').first();
    await expect(playerCountInput).toHaveValue('4');

    // Should show 4 player name inputs
    const nameInputs = page.locator('input[type="text"]');
    await expect(nameInputs).toHaveCount(4);

    // Blinds should be enabled by default
    const blindsCheckbox = page.locator('text=ブラインドあり').locator('..').locator('input[type="checkbox"]');
    await expect(blindsCheckbox).toBeChecked();
  });
});

test.describe('Player count changes', () => {
  test('reducing player count removes name inputs', async ({ page }) => {
    // Change count from 4 to 2
    const playerCountInput = page.locator('input[type="number"]').first();
    await playerCountInput.fill('2');
    await page.waitForTimeout(300);

    // Should now show only 2 name inputs
    const nameInputs = page.locator('input[type="text"]');
    await expect(nameInputs).toHaveCount(2);
  });

  test('increasing player count adds name inputs', async ({ page }) => {
    const playerCountInput = page.locator('input[type="number"]').first();
    await playerCountInput.fill('6');
    await page.waitForTimeout(300);

    const nameInputs = page.locator('input[type="text"]');
    await expect(nameInputs).toHaveCount(6);
  });
});

test.describe('Blinds toggle', () => {
  test('unchecking blinds hides blind settings', async ({ page }) => {
    // Blind settings should be visible initially
    await expect(page.getByText('Small Blind', { exact: true })).toBeVisible();
    await expect(page.getByText('Big Blind', { exact: true })).toBeVisible();

    // Uncheck blinds
    const blindsCheckbox = page.locator('text=ブラインドあり').locator('..').locator('input[type="checkbox"]');
    await blindsCheckbox.uncheck();

    // Blind settings should be hidden
    await expect(page.getByText('Small Blind', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Big Blind', { exact: true })).not.toBeVisible();
  });

  test('re-checking blinds shows blind settings again', async ({ page }) => {
    const blindsCheckbox = page.locator('text=ブラインドあり').locator('..').locator('input[type="checkbox"]');

    // Uncheck then re-check
    await blindsCheckbox.uncheck();
    await expect(page.getByText('Small Blind', { exact: true })).not.toBeVisible();

    await blindsCheckbox.check();
    await expect(page.getByText('Small Blind', { exact: true })).toBeVisible();
    await expect(page.getByText('Big Blind', { exact: true })).toBeVisible();
  });
});

test.describe('Game start', () => {
  test('submitting form navigates to game page', async ({ page }) => {
    // Click the start button with default settings
    await page.getByRole('button', { name: 'ゲーム開始' }).click();

    // Should navigate to /game
    await page.waitForURL('/game');

    // Game header should show game 1
    await expect(page.getByText('ゲーム 1')).toBeVisible();

    // Action panel should be visible (game is in progress)
    await expect(page.getByText('のアクション')).toBeVisible();
  });

  test('custom player names appear in game', async ({ page }) => {
    // Set custom player names
    const nameInputs = page.locator('input[type="text"]');
    await nameInputs.nth(0).fill('太郎');
    await nameInputs.nth(1).fill('花子');

    await page.getByRole('button', { name: 'ゲーム開始' }).click();
    await page.waitForURL('/game');

    // Custom names should appear on the game page
    // Use .first() because the active player's name also appears in the action panel
    await expect(page.getByText('太郎').first()).toBeVisible();
    await expect(page.getByText('花子').first()).toBeVisible();
  });

  test('2-player game starts correctly', async ({ page }) => {
    const playerCountInput = page.locator('input[type="number"]').first();
    await playerCountInput.fill('2');
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'ゲーム開始' }).click();
    await page.waitForURL('/game');

    await expect(page.getByText('ゲーム 1')).toBeVisible();
  });
});

test.describe('Navigation links', () => {
  test('how-to-play link navigates correctly', async ({ page }) => {
    await page.getByText('遊び方ガイド').click();
    await page.waitForURL('/how-to-play');
  });

  test('rules link navigates correctly', async ({ page }) => {
    await page.getByText('ルール解説').click();
    await page.waitForURL('/rules');
  });

  test('FAQ link navigates correctly', async ({ page }) => {
    await page.getByText('このアプリについて').click();
    await page.waitForURL('/faq');
  });
});

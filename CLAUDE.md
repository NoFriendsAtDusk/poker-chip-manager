# Poker Chip Manager — Claude Code Instructions

## Project Overview

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand (state management)
- **Language:** Japanese UI throughout
- **Deployed at:** Vercel (auto-deploys from `main` branch)
- **Repository:** https://github.com/NoFriendsAtDusk/poker-chip-manager

## Version Control Workflow

**IMPORTANT:** Always follow this branching workflow when making changes. Never commit directly to `main`.

### Before Making Any Changes

1. Make sure you're on `main` and it's up to date:
   ```
   git checkout main
   git pull origin main
   ```

2. Create a feature branch with a descriptive name:
   ```
   git checkout -b <type>/<short-description>
   ```
   Branch naming conventions:
   - `feature/...` — new features (e.g., `feature/dark-mode`)
   - `fix/...` — bug fixes (e.g., `fix/pot-calculation`)
   - `update/...` — visual/display changes (e.g., `update/player-ui`)
   - `refactor/...` — code restructuring (e.g., `refactor/game-engine`)

### While Working

- Commit frequently with clear messages describing **why**, not just what
- Stage specific files by name (`git add file1 file2`), not `git add .`
- Run tests before committing: `npm test` (unit) or `npm run test:all` (unit + E2E)

### When Done

1. Push the branch to GitHub:
   ```
   git push -u origin <branch-name>
   ```

2. Ask the user if they want to merge to `main`. If yes:
   ```
   git checkout main
   git merge <branch-name>
   git push origin main
   ```
   This triggers an automatic Vercel redeploy.

3. Clean up the merged branch:
   ```
   git branch -d <branch-name>
   git push origin --delete <branch-name>
   ```

### Rules

- **Never commit directly to `main`** — always use a feature branch
- **Never force push** (`git push --force`) without explicit user approval
- **Always confirm with the user** before merging to `main` (merging triggers a live deployment)
- **Run `npm run build`** before merging to ensure the build passes

## Project Structure

```
app/              — Next.js pages (App Router)
  page.tsx        — Setup/home page
  game/page.tsx   — Game page
  faq/            — FAQ page
  how-to-play/    — How to play guide
  rules/          — Rules page
  legal/          — Privacy, terms, commercial transactions
components/game/  — Game UI components (ActionPanel, ShowdownPanel, GameOverPanel, etc.)
lib/              — Core game logic (game-engine, betting-logic, pot-calculator, utils)
store/            — Zustand game store
types/            — TypeScript type definitions
__tests__/        — Jest unit tests (128 tests)
e2e/              — Playwright E2E tests (33 tests)
log/              — Development phase logs
```

## Testing

- **Unit tests:** `npm test` (Jest, 128 tests)
- **E2E tests:** `npm run test:e2e` (Playwright, 33 tests)
- **All tests:** `npm run test:all`
- **Build check:** `npm run build`

## User Preferences

- The user is a beginner with Git and version control — explain git operations in plain language when performing them
- The user prefers detailed explanations of what is being done and why
- Development logs should be created in `log/` for significant changes

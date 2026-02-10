import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, BettingAction, PotWinner } from '@/types/game-types';
import {
  initializeGame,
  processAction,
  distributeChips,
  startNextGame
} from '@/lib/game-engine';

const MAX_UNDO_HISTORY = 20;

interface GameStore {
  gameState: GameState | null;
  settings: GameSettings | null;
  undoHistory: GameState[];

  setSettings: (settings: GameSettings) => void;
  startGame: () => void;
  performAction: (action: BettingAction) => void;
  undoLastAction: () => void;
  selectWinners: (potWinners: PotWinner[]) => void;
  nextGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      settings: null,
      undoHistory: [],

      setSettings: (settings) => {
        set({ settings });
      },

      startGame: () => {
        const { settings } = get();
        if (!settings) return;

        const gameState = initializeGame(settings);
        set({ gameState, undoHistory: [] });
      },

      performAction: (action) => {
        const { gameState, undoHistory } = get();
        if (!gameState) return;

        const newHistory = [...undoHistory, structuredClone(gameState)];
        if (newHistory.length > MAX_UNDO_HISTORY) {
          newHistory.shift();
        }

        const newState = processAction(gameState, action);
        set({ gameState: newState, undoHistory: newHistory });
      },

      undoLastAction: () => {
        const { undoHistory } = get();
        if (undoHistory.length === 0) return;

        const newHistory = [...undoHistory];
        const previousState = newHistory.pop()!;
        set({ gameState: previousState, undoHistory: newHistory });
      },

      selectWinners: (potWinners) => {
        const { gameState } = get();
        if (!gameState || gameState.stage !== 'showdown') return;

        const newState = distributeChips(gameState, potWinners);
        set({ gameState: newState });
      },

      nextGame: () => {
        const { gameState } = get();
        if (!gameState) return;

        const newState = startNextGame(gameState);
        set({ gameState: newState, undoHistory: [] });
      },

      resetGame: () => {
        set({ gameState: null, settings: null, undoHistory: [] });
      }
    }),
    {
      name: 'poker-game-storage',
      partialize: (state) => ({
        gameState: state.gameState,
        settings: state.settings,
        undoHistory: state.undoHistory
      })
    }
  )
);

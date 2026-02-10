import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, BettingAction, PotWinner } from '@/types/game-types';
import {
  initializeGame,
  processAction,
  distributeChips,
  startNextGame
} from '@/lib/game-engine';

interface GameStore {
  gameState: GameState | null;
  settings: GameSettings | null;

  setSettings: (settings: GameSettings) => void;
  startGame: () => void;
  performAction: (action: BettingAction) => void;
  selectWinners: (potWinners: PotWinner[]) => void;
  nextGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      settings: null,

      setSettings: (settings) => {
        set({ settings });
      },

      startGame: () => {
        const { settings } = get();
        if (!settings) return;

        const gameState = initializeGame(settings);
        set({ gameState });
      },

      performAction: (action) => {
        const { gameState } = get();
        if (!gameState) return;

        const newState = processAction(gameState, action);
        set({ gameState: newState });
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
        set({ gameState: newState });
      },

      resetGame: () => {
        set({ gameState: null, settings: null });
      }
    }),
    {
      name: 'poker-game-storage',
      partialize: (state) => ({
        gameState: state.gameState,
        settings: state.settings
      })
    }
  )
);

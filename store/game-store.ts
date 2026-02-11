import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, BettingAction, PotWinner, MultiplayerSession } from '@/types/game-types';
import {
  initializeGame,
  processAction,
  distributeChips,
  startNextGame
} from '@/lib/game-engine';
import { createRoom, updateRoom, deleteRoom } from '@/lib/room-manager';

const MAX_UNDO_HISTORY = 20;

interface GameStore {
  gameState: GameState | null;
  settings: GameSettings | null;
  undoHistory: GameState[];
  multiplayerSession: MultiplayerSession | null;

  setSettings: (settings: GameSettings) => void;
  startGame: () => void;
  performAction: (action: BettingAction) => void;
  undoLastAction: () => void;
  selectWinners: (potWinners: PotWinner[]) => void;
  nextGame: () => void;
  resetGame: () => void;
  renamePlayer: (playerId: string, newName: string) => void;
  buyIn: (playerId: string, amount: number) => void;
  createMultiplayerRoom: () => Promise<string>;
  leaveMultiplayer: () => void;
}

// Sync game state to Supabase when host has an active session
function syncToSupabase(gameState: GameState | null, session: MultiplayerSession | null) {
  if (session && session.role === 'host' && gameState) {
    updateRoom(session.roomCode, gameState).catch(console.error);
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      settings: null,
      undoHistory: [],
      multiplayerSession: null,

      setSettings: (settings) => {
        set({ settings });
      },

      startGame: () => {
        const { settings, multiplayerSession } = get();
        if (!settings) return;

        const gameState = initializeGame(settings);
        set({ gameState, undoHistory: [] });
        syncToSupabase(gameState, multiplayerSession);
      },

      performAction: (action) => {
        const { gameState, undoHistory, multiplayerSession } = get();
        if (!gameState) return;

        const newHistory = [...undoHistory, structuredClone(gameState)];
        if (newHistory.length > MAX_UNDO_HISTORY) {
          newHistory.shift();
        }

        const newState = processAction(gameState, action);
        set({ gameState: newState, undoHistory: newHistory });
        syncToSupabase(newState, multiplayerSession);
      },

      undoLastAction: () => {
        const { undoHistory, multiplayerSession } = get();
        if (undoHistory.length === 0) return;

        const newHistory = [...undoHistory];
        const previousState = newHistory.pop()!;
        set({ gameState: previousState, undoHistory: newHistory });
        syncToSupabase(previousState, multiplayerSession);
      },

      selectWinners: (potWinners) => {
        const { gameState, multiplayerSession } = get();
        if (!gameState || gameState.stage !== 'showdown') return;

        const newState = distributeChips(gameState, potWinners);
        set({ gameState: newState });
        syncToSupabase(newState, multiplayerSession);
      },

      nextGame: () => {
        const { gameState, multiplayerSession } = get();
        if (!gameState) return;

        const newState = startNextGame(gameState);
        set({ gameState: newState, undoHistory: [] });
        syncToSupabase(newState, multiplayerSession);
      },

      renamePlayer: (playerId, newName) => {
        const { gameState, multiplayerSession } = get();
        if (!gameState) return;
        const trimmed = newName.trim();
        if (!trimmed) return;

        const newState: GameState = {
          ...gameState,
          players: gameState.players.map((p) =>
            p.id === playerId ? { ...p, name: trimmed } : p
          ),
        };
        set({ gameState: newState });
        syncToSupabase(newState, multiplayerSession);
      },

      buyIn: (playerId, amount) => {
        const { gameState, multiplayerSession } = get();
        if (!gameState || gameState.stage !== 'gameOver') return;
        if (amount <= 0) return;

        const player = gameState.players.find((p) => p.id === playerId);
        if (!player || player.chips !== 0) return;

        const newState: GameState = {
          ...gameState,
          players: gameState.players.map((p) =>
            p.id === playerId ? { ...p, chips: amount } : p
          ),
        };
        set({ gameState: newState });
        syncToSupabase(newState, multiplayerSession);
      },

      resetGame: () => {
        const { multiplayerSession } = get();
        if (multiplayerSession && multiplayerSession.role === 'host') {
          deleteRoom(multiplayerSession.roomCode).catch(console.error);
        }
        set({ gameState: null, settings: null, undoHistory: [], multiplayerSession: null });
      },

      createMultiplayerRoom: async () => {
        const { gameState } = get();
        if (!gameState) throw new Error('ゲームが開始されていません');

        const roomCode = await createRoom(gameState);
        set({ multiplayerSession: { roomCode, role: 'host' } });
        return roomCode;
      },

      leaveMultiplayer: () => {
        const { multiplayerSession } = get();
        if (multiplayerSession && multiplayerSession.role === 'host') {
          deleteRoom(multiplayerSession.roomCode).catch(console.error);
        }
        set({ multiplayerSession: null });
      },
    }),
    {
      name: 'poker-game-storage',
      partialize: (state) => ({
        gameState: state.gameState,
        settings: state.settings,
        undoHistory: state.undoHistory
        // multiplayerSession is NOT persisted — sessions are temporary
      })
    }
  )
);

import { supabase } from './supabase';
import { GameState } from '@/types/game-types';

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

export async function createRoom(gameState: GameState): Promise<string> {
  const roomCode = generateRoomCode();

  const { error } = await supabase
    .from('game_rooms')
    .insert({ room_code: roomCode, game_state: gameState });

  if (error) throw new Error(`ルーム作成に失敗しました: ${error.message}`);
  return roomCode;
}

export async function updateRoom(roomCode: string, gameState: GameState): Promise<void> {
  const { error } = await supabase
    .from('game_rooms')
    .update({ game_state: gameState, updated_at: new Date().toISOString() })
    .eq('room_code', roomCode);

  if (error) throw new Error(`状態の更新に失敗しました: ${error.message}`);
}

export async function fetchRoom(roomCode: string): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('game_rooms')
    .select('game_state')
    .eq('room_code', roomCode.toUpperCase())
    .single();

  if (error || !data) return null;
  return data.game_state as GameState;
}

export function subscribeToRoom(
  roomCode: string,
  onUpdate: (gameState: GameState) => void
): () => void {
  const channel = supabase
    .channel(`room-${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `room_code=eq.${roomCode}`,
      },
      (payload) => {
        const newState = (payload.new as { game_state: GameState }).game_state;
        onUpdate(newState);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function deleteRoom(roomCode: string): Promise<void> {
  await supabase.from('game_rooms').delete().eq('room_code', roomCode);
}

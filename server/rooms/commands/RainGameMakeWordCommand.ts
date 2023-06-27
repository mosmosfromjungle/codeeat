import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { GameState, KeywordRain, RainGameState } from '../schema/GameState';
import mongoose from 'mongoose';

type Payload = {
  room: GameRoom;
  clientId: string;
};

export class MakeWordCommand extends Command<GameState, Payload> {
  async execute({ room, clientId }: Payload) {
    try {
      
      const raingamewords = mongoose.connection.collection('raingamewords');
      const randomWord = await raingamewords.aggregate([{ $sample: { size: 1 } }]).toArray();

      const keyword = randomWord[0].word;
      const keywordRain = new KeywordRain(keyword);

      // RainGameState 목록을 반복하여 owner가 clientId와 일치하는 경우 찾기
      for (const [owner, rainGameState] of room.state.rainGameStates.entries()) {
        if (owner === clientId) { // owner가 clientId와 일치하면
          rainGameState.words.push(keywordRain); // 단어 추가
          break; // 일치하는 항목을 찾았으므로 루프 종료
        }
      }
      
    } catch (error) {
      console.error('Failed to generate keywords:', error);
    }
  }
}
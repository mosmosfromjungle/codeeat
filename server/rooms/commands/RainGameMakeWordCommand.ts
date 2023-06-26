import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { OfficeState, KeywordRain, RainGameState } from '../schema/OfficeState';
import mongoose from 'mongoose';

type Payload = {
  room: GameRoom;
};

export class MakeWordCommand extends Command<OfficeState, Payload> {
  async execute({ room }: Payload) {
    try {
      
      const raingamewords = mongoose.connection.collection('raingamewords');
      const randomWord = await raingamewords.aggregate([{ $sample: { size: 1 } }]).toArray();

      const keyword = randomWord[0].word;
      const keywordRain = new KeywordRain(keyword);

     // owner가 'A'인 RainGameState 찾기
     const rainGameStateA = room.state.rainGameStates.get('A');
     if (rainGameStateA) {
       rainGameStateA.words.push(keywordRain);
     }

     // owner가 'B'인 RainGameState 찾기
     const rainGameStateB = room.state.rainGameStates.get('B');
     if (rainGameStateB) {
       rainGameStateB.words.push(keywordRain);
     }  
    } catch (error) {
      console.error('Failed to generate keywords:', error);
    }
  }
}
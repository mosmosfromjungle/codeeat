import { Command } from '@colyseus/command';
import {IOfficeState } from '../../../types/IOfficeState';
import mongoose from 'mongoose';
import { Client } from 'colyseus';
import { RainGameState } from '../schema/OfficeState';


type Payload = {
    client: Client;
  };
  
export class RainGameStartCommand extends Command<IOfficeState, Payload> {
  private static ownersInUse: Set<string> = new Set();
    async execute(data: Payload) {
      try {
         // MongoDB 연결 설정
         await mongoose.set('strictQuery', false);
         await mongoose.connect('mongodb://127.0.0.1:27017/mosmos', {
           dbName: 'mosmos',
           useNewUrlParser: true,
           useUnifiedTopology: true,
         });

        // 사용 가능한 owner (A 또는 B) 선택
        let selectedOwner = this.selectAvailableOwner();

        // 선택된 owner로 새 RainGameState 추가
        const newRainGameState = new RainGameState();
        newRainGameState.owner = selectedOwner;

        // owner 값에 따라 다른 객체로 설정
        if (selectedOwner === 'A') {
            this.state.rainGameStates.set('A', newRainGameState);
        } else if (selectedOwner === 'B') {
            this.state.rainGameStates.set('B', newRainGameState);
        }
 
       } catch (error) {
         console.error('Failed to start rain game:', error);
      }
    }
    private selectAvailableOwner(): string {
      if (!RainGameStartCommand.ownersInUse.has('A')) {
          RainGameStartCommand.ownersInUse.add('A');
          return 'A';
      } else if (!RainGameStartCommand.ownersInUse.has('B')) {
          RainGameStartCommand.ownersInUse.add('B');
          return 'B';
      } else {
          throw new Error('Both A and B are in use.');
      }
  }

}
  
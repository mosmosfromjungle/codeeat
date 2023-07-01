import { Command } from '@colyseus/command';
import { IGameState } from '../../../types/IGameState';
import mongoose from 'mongoose';
import { Client } from 'colyseus';
import { GameState ,RainGameState } from '../schema/GameState';
import { config } from "../../envconfig"

type Payload = {
    client: Client;
  };
  
// export class RainGameStartCommand extends Command<IOfficeState, Payload> {
//   private static ownersInUse: Set<string> = new Set();
//   private static mutex: Promise<any> = Promise.resolve();

//   async execute(data: Payload) {
//     try {
        
//         // 뮤텍스
//         await this.acquireMutex();

//         // MongoDB 연결 설정
//         await mongoose.set('strictQuery', false);
//         await mongoose.connect('mongodb://127.0.0.1:27017/mosmos', {
//            dbName: 'mosmos',
//            useNewUrlParser: true,
//            useUnifiedTopology: true,
//          });

//         // 사용 가능한 owner (A 또는 B) 선택
//         let selectedOwner = this.selectAvailableOwner();

//         // 선택된 owner로 새 RainGameState 추가
//         const newRainGameState = new RainGameState();
//         newRainGameState.owner = selectedOwner;

//         console.log('Selected owner:', selectedOwner);
//         console.log('New RainGameState:', newRainGameState);

//         // owner 값에 따라 다른 객체로 설정
//         if (selectedOwner === 'A') {
//             this.state.rainGameStates.set('A', newRainGameState);
//         } else if (selectedOwner === 'B') {
//             this.state.rainGameStates.set('B', newRainGameState);
//         }

//        } catch (error) {
//          console.error('Failed to start rain game:', error);
//       } finally {
//         this.releaseMutex();
//       }
//     }
//     private selectAvailableOwner(): string {
//       if (!RainGameStartCommand.ownersInUse.has('A')) {
//           RainGameStartCommand.ownersInUse.add('A');
//           return 'A';
//       } else if (!RainGameStartCommand.ownersInUse.has('B')) {
//           RainGameStartCommand.ownersInUse.add('B');
//           return 'B';
//       } else {
//           throw new Error('Both A and B are in use.');
//       }
//     }  

//     private acquireMutex() {
//         let release;
//         const acquirePromise = new Promise(resolve => release = resolve);
//         const lockPromise = RainGameStartCommand.mutex.then(() => release);
//         RainGameStartCommand.mutex = acquirePromise;
//         console.log('Mutex acquired')
//         return lockPromise;
//     }

//     private releaseMutex() {
//         RainGameStartCommand.mutex = Promise.resolve();
//         console.log('Mutex released');
      
//   }

// }
  
// export class RainGameStartCommand extends Command<GameState, Payload> {

//   async execute(data: Payload) {
//       try {

//           // MongoDB 연결 설정
//           await mongoose.set('strictQuery', false);
//           await mongoose.connect(config.db.host, {
//               dbName: 'mosmos',
//               useNewUrlParser: true,
//               useUnifiedTopology: true,
//           });

//           // 현재 상태를 기반으로 사용 가능한 owner (A 또는 B) 선택
//           let selectedOwner;
//           if (!this.state.rainGameStates.has('A')) {
//               selectedOwner = 'A';
//           } else if (!this.state.rainGameStates.has('B')) {
//               selectedOwner = 'B';
//           } else {
//               console.log("Both A and B are already created.");
//               return; // 이미 A와 B가 모두 생성되어 있다면 더 이상 생성하지 않음.
//           }

//           // 선택된 owner로 새 RainGameState 추가
//           const newRainGameState = new RainGameState();
//           newRainGameState.owner = selectedOwner;

//           // 선택된 owner를 기반으로 rainGameStates에 추가
//           this.state.rainGameStates.set(selectedOwner, newRainGameState);

//           console.log('Selected owner:', selectedOwner);
//           console.log('New RainGameState:', newRainGameState);

//       } catch (error) {
//           console.error('Failed to start rain game:', error);
//       }
//   }
// }
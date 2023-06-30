import { Command } from '@colyseus/command';
import { IGameState } from '../../../types/IGameState';
import mongoose from 'mongoose';
import { Client } from 'colyseus';
import { GameState ,RainGameState } from '../schema/GameState';



export class RainGameStartCommand extends Command<GameState> {

  async execute() {
      try {
          // MongoDB 연결 설정
          await mongoose.set('strictQuery', false);
          await mongoose.connect('mongodb://127.0.0.1:27017/mosmos', {
              dbName: 'mosmos',
              useNewUrlParser: true,
              useUnifiedTopology: true,
          });

      } catch (error) {
          console.error('Failed to start rain game:', error);
      }
  }
}
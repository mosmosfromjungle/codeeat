import fs from 'fs';
import { config } from '../envconfig';
// import Chat from '../models/Chat';
// import LastChat from '../models/LastChat';
import User from '../models/MoleUser';
const mongoose = require('mongoose');

export async function connectDB() {
  mongoose.set('strictQuery', false);
  mongoose.connect('mongodb://localhost:27017/mosmos', {
    dbName: 'mosmos',
    useNewUrlParser: true,
  })

  createCollection('user');
}

export const createCollection = (modelName : string) => {
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName);
  }

  switch (modelName) {
    case 'user':
      new User();
      break;
    // case 'chat':
    //   new Chat();
    //   break;
    // case 'lastchat':
    //   new LastChat();
    //   break;
  }
};

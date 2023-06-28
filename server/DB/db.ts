import { config } from '../envconfig'
import User from '../models/User'
import Friends from '../models/Friends'
import FriendRequest from '../models/FriendRequest'
import { KeywordRainModel } from '../models/RainGame'
import LastDM from '../models/LastDM'
import DM from '../models/DM'
import MoleGame from '../models/MoleGame'

import { defaultProblems } from '../controllers/MoleGameControllers/index'

const mongoose = require('mongoose')

export async function connectDB() {
  mongoose.set('strictQuery', false)
  mongoose.connect('mongodb://127.0.0.1:27017/mosmos', {
    dbName: 'mosmos',
    useNewUrlParser: true,
  })

  createCollection('user')
  createCollection('friends')
  createCollection('friendrequest')
  createCollection('lastdm')
  createCollection('dm')
  createCollection('raingame')
  createCollection('molegame')

  // Insert default mole game problems at first
  // defaultProblems()
}

export const createCollection = (modelName : string) => {
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName)
  }

  switch (modelName) {
    case 'user':
      new User();
      break
    case 'friends':
      new Friends();
      break
    case 'friendrequest':
      new FriendRequest();
      break
    case 'lastdm':
      new LastDM();
      break;
    case 'dm':
      new DM();
      break;
    case 'raingame':
      new KeywordRainModel();
      break
    case 'molegame':
      new MoleGame()
      break
  }
}

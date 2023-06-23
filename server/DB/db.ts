import User from '../models/User'
import Friends from '../models/Friends'
import FriendRequest from '../models/FriendRequest'
import DM from '../models/DM'
import LastDM from '../models/LastDM'

const mongoose = require('mongoose')

export async function connectDB() {
  mongoose.set('strictQuery', false)
  mongoose.connect(process.env.DB_HOST, {
    dbName: 'mosmos',
    useNewUrlParser: true,
  })

  createCollection('user')
  createCollection('friends')
  createCollection('friendrequest')
  createCollection('dm')
  createCollection('lastdm')
}

export const createCollection = (modelName : string) => {
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName)
  }

  switch (modelName) {
    case 'user':
      new User()
      break
    case 'friends':
      new Friends()
      break
    case 'friendrequest':
      new FriendRequest()
      break
    case 'chat':
      new DM()
      break
    case 'lastchat':
      new LastDM()
      break
  }
}

import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IRain } from '../controllers/RainGameControllers/types'

const rain = new Schema<IRain>({
  playerId: { type: String, required: true },
  playerScore: { type: Number, required: true}
})

const Rain = model<IRainDocument>('rain', rain)

export interface IRainDocument extends IRain, Document {}
export interface IRainModel extends Model<IRainDocument> {}
export default Rain
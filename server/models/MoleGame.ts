import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IMole } from '../controllers/MoleGameControllers/types'

const mole = new Schema<IMole>({
  playerId: { type: String, required: true },
  playerScore: { type: Number, required: true}
})

const Mole = model<IMoleDocument>('mole', mole)

export interface IMoleDocument extends IMole, Document {}
export interface IMoleModel extends Model<IMoleDocument> {}
export default Mole
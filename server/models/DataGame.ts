import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IData } from '../controllers/DataGameControllers/types'

const data = new Schema<IData>({
  playerId: { type: String, required: true },
  playerScore: { type: Number, required: true}
})

const Data = model<IDataDocument>('data', data)

export interface IDataDocument extends IData, Document {}
export interface IDataModel extends Model<IDataDocument> {}
export default Data
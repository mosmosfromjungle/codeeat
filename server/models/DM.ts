import { Schema, model, Document, Model } from 'mongoose'
import { IDM } from '../controllers/DMControllers/types'

const dm = new Schema<IDM>({
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  message: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
})

const DM = model<IDMDocument>('dm', dm)

export interface IDMDocument extends IDM, Document {}
export interface IDMModel extends Model<IDMDocument> {}
export default DM
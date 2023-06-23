import { config } from '../envconfig'
import { Schema, model, Document, Model } from 'mongoose'
import { IDM } from '../controllers/DMControllers/types'

const dm = new Schema<IDM>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
})

const DM = model<IDMDocument>('dm', dm)
// create new User document

export interface IDMDocument extends IDM, Document {}
export interface IDMModel extends Model<IDMDocument> {}
export default DM

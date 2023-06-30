import { IUser } from 'colyseus.js/lib/Auth';
import { Schema, model, Document, Model } from 'mongoose';
import { ILastDM } from '../controllers/LastDMControllers/type';

const lastdm = new Schema<ILastDM>({
  senderName: { type: String, required: true },
  receiverName:{ type: String, required: true },
  message: { type: String, required: false },
  roomId: { type: String, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const LastDM = model<ILastDM>('lastdm', lastdm);

export interface ILastDMDocument extends ILastDM, Document {}
export interface ILastDMModel extends Model<ILastDMDocument> {}
export default LastDM;
import { IUser } from 'colyseus.js/lib/Auth';
import { Schema, model, Document, Model } from 'mongoose';
import { ILastDM } from '../controllers/LastDMControllers/type';

const lastdm = new Schema<ILastDM>({
  senderInfo: {
    userId: String,
    username: String,
  },
  receiverInfo: {
    userId: String,
    username: String,
  },
  message: { type: String, required: false },
  roomId: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const LastDM = model<ILastDM>('lastdm', lastdm);

export interface ILastDMDocument extends ILastDM, Document {}
export interface ILastDMModel extends Model<ILastDMDocument> {}
export default LastDM;
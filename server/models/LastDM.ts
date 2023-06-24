import { IUser } from 'colyseus.js/lib/Auth';
import { Schema, model, Document, Model } from 'mongoose';
import { ILastDM, UserResponseDto } from '../controllers/LastDMControllers/type';

const URD = new Schema<UserResponseDto>();

const lastdm = new Schema<ILastDM>({
  myInfo: {
    userId: String,
    username: String,
  },
  friendInfo: {
    userId: String,
    username: String,
  },
  message: { type: String, required: false },
  status: { type: Number, required: true },
  roomId: { type: String, required: false },
  unreadCount: { type: Number, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const LastDM = model<ILastDM>('lastdm', lastdm);
// create new User document

export interface ILastDMDocument extends ILastDM, Document {}
export interface ILastDMModel extends Model<ILastDMDocument> {}
export default LastDM;

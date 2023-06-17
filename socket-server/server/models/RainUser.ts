import { Schema, model, Document, Model } from 'mongoose';
import { IRain } from '../controllers/RainGameControllers/types';

const user = new Schema<IRain>({
    senderId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, required: false },
})

const RainUser = model<IUserDocument>('user', user);

export interface IUserDocument extends IRain, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default RainUser;
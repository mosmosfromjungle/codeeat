import { Schema, model, Document, Model } from 'mongoose';
import { IMole } from '../controllers/MoleGameControllers/types';

const user = new Schema<IMole>({
    senderId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, required: false },
})

const MoleUser = model<IUserDocument>('user', user);

export interface IUserDocument extends IMole, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default MoleUser;
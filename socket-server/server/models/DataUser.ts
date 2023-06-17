import { Schema, model, Document, Model } from 'mongoose';
import { IData } from '../controllers/DataGameControllers/types';

const user = new Schema<IData>({
    senderId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, required: false },
})

const DataUser = model<IUserDocument>('user', user);

export interface IUserDocument extends IData, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default DataUser;

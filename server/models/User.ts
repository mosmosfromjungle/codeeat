import { Schema, model, Document, Model } from 'mongoose';
import { IUserInfo } from '../controllers/UserControllers/types';

const user = new Schema<IUserInfo>({
    userId: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    userProfile: {
        character: { type: String, required: true },
        userLevel: { type: Number, required: true },
        currentExp: { type: Number, required: true },
        requiredExp: { type: Number, required: true },
        grade: { type: String, required: false },
        school: { type: String, required: false },
        profileMessage: { type: String, required: false },
    },
    refreshToken: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: false },
})

const User = model<IUserDocument>('user', user);

export interface IUserDocument extends IUserInfo, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default User;
import { Schema, model, Document, Model } from 'mongoose';
import { IUserInfo } from '../controllers/UserControllers/types';

const user = new Schema<IUserInfo>({
    userId: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    userProfile: {
        userCharacter: { type: String, required: true },
        userLevel: { type: String, required: true },
        contactGit: { type: String, required: false },
        contactEmail: { type: String, required: false },
        profileMessage: { type: String, required: false },
    },
    refreshToken: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: false },
})

// TODO: 비밀번호 변경이 있을 때에만 해싱을 해주는 코드 추가 
// user.pre('save', (next) => {
//     const user = this;

//     if (user.isModified('password')) {
        
//     }
// })

const User = model<IUserDocument>('user', user);

export interface IUserDocument extends IUserInfo, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default User;
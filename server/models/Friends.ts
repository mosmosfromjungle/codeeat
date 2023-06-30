import { Schema, model, Document, Model } from 'mongoose';
import { IFriends } from '../controllers/FriendsControllers/types';

const friends = new Schema<IFriends>({
    requester: {
        username: { type: String, required: true },
        userObj: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    },
    recipient: {
        username: { type: String, required: true },
        userObj: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    }, 
    createdAt: { type: Date, default: Date.now, required: true },
})

const Friends = model<IFriends>('Friends', friends)

export interface IFriendsDocument extends IFriends, Document {}
export interface IFriendsModel extends Model<IFriendsDocument> {}
export default Friends
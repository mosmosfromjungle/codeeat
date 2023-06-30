import { Schema, model, Document, Model } from 'mongoose';
import { IFriendRequest } from '../controllers/FriendsControllers/types';

const friendRequest = new Schema<IFriendRequest>({
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

const FriendRequest = model<IFriendRequest>('FriendRequest', friendRequest)

export interface IFriendRequestDocument extends IFriendRequest, Document {}
export interface IFriendRequestModel extends Model<IFriendRequestDocument> {}
export default FriendRequest
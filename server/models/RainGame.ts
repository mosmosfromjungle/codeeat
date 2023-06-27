import { Schema, model, Document, Model } from 'mongoose';
import { IRainGameUser } from '../controllers/RainGameControllers/types';

const raingameuser = new Schema<IRainGameUser>({
    nickname: { type: String, required: true, unique: true},
    totalgame: {type: Number}, 
    RainGame: {type: Number},
    character: {type: String},
    gamedata: {
        //게임 화면 정보
    },
    ItemEvent: {
        // 아이템 정보
    }
})

const raingameUser = model<IRainGameDocument>('raingameuser', raingameuser);

export interface IRainGameDocument extends IRainGameUser, Document {}
export interface IRainGameModel extends Model<IRainGameDocument> {}
export default raingameUser;


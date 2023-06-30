import { Schema, model, Document, Model } from 'mongoose'
import { IBrickGame } from '../controllers/BrickGameControllers/types'; 

const brickGame = new Schema<IBrickGame>({
    quizId: { type: Number, required: true, unique: true },
    quizType: { type: String, required: true },
    count: { type: Number, required: true },
    place: { type: String, required: true },
})

const BrickGame = model<IBrickGameDocument>('BrickGame', brickGame);

export interface IBrickGameDocument extends IBrickGame, Document {}
export interface IBrickGameModel extends Model<IBrickGameDocument> {}
export default BrickGame
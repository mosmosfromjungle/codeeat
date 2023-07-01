import { Schema, model, Document, Model } from 'mongoose'
import { IBrickGamePoint } from '../controllers/BrickGameControllers/types'; 

const brickGamePoint = new Schema<IBrickGamePoint>({
    quizId: { type: Number, required: true },
    dsType: { type: String, required: true },
    point: { type: Number, required: true },
})

const BrickGamePoint = model<IBrickGamePointDocument>('BrickGamePoint', brickGamePoint);

export interface IBrickGamePointDocument extends IBrickGamePoint, Document {}
export interface IBrickGamePointModel extends Model<IBrickGamePointDocument> {}
export default BrickGamePoint
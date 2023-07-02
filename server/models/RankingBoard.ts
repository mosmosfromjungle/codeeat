import { Schema, model, Document, Model } from 'mongoose'
import { IRankingBoard } from '../controllers/RankingBoardControllers/types'

const rankingBoard = new Schema<IRankingBoard>({
})

const RankingBoard = model<IRankingBoardDocument>('RankingBoard', rankingBoard);

export interface IRankingBoardDocument extends IRankingBoard, Document {}
export interface IRankingBoardModel extends Model<IRankingBoardDocument> {}
export default RankingBoard
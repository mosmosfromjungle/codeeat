import { Schema, model, Document, Model } from 'mongoose'
import { IMoleGame } from '../controllers/MoleGameControllers/types'

const moleGame = new Schema<IMoleGame>({
    question: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    answer1: { type: String, required: true },
    answer2: { type: String, required: true },
    answer3: { type: String, required: true },
})

const MoleGame = model<IMoleGameDocument>('MoleGame', moleGame);

export interface IMoleGameDocument extends IMoleGame, Document {}
export interface IMoleGameModel extends Model<IMoleGameDocument> {}
export default MoleGame
import { Schema, model, Document, Model } from 'mongoose'
import { ICodingRun } from '../controllers/CodingRunControllers/types'

const codingRun = new Schema<ICodingRun>({
})

const CodingRun = model<ICodingRunDocument>('CodingRun', codingRun);

export interface ICodingRunDocument extends ICodingRun, Document {}
export interface ICodingRunModel extends Model<ICodingRunDocument> {}
export default CodingRun
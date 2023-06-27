import mongoose, { Schema, Document, Model } from 'mongoose';
import { IKeywordRain } from '../../types/IOfficeState';

const keywordRainSchema = new Schema<IKeywordRain>({
    keyword: { type: String, required: true },
});

const KeywordRainModel = mongoose.model<IKeywordRain>('KeywordRain', keywordRainSchema);

export {KeywordRainModel}
import { Schema, model, Document, Model } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true },
})

const User = model('user', userSchema);

export default User;
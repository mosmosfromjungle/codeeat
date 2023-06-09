import 'express'
import User from '../../models/User'

export const update = async (req, res) => {
    const user = req.body;

    console.log('reached')
    
    const result = await User.collection.insertOne({username: user.name});
    if (!result) {
        return res.json({success: false, message: '유저 등록 실패'})
    }
    return res.status(200).send(result)
}
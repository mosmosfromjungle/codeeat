import 'express'
import bcrypt from 'bcrypt'
import User from '../../models/User'
import { IUserInfo } from './types'
import { config } from '../../envconfig'

/* 비밀번호 암호화 */
const hashPassword = async (password: string) => {
    const saltRounds = config.bcrypt.saltRounds;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
    return hashedPassword;
};

/* 회원가입 */
export const signUp = async (req, res) => {
    const user = req.body

    /* 누락 정보 확인 (프론트에서 걸러주는 정보) */
    if (!user.userId) {
        return res.status(400).json({
            status: 400,
            message: 'error - email id missing',
        })
    }
    if (!user.password) {
        return res.status(400).json({
            status: 400,
            message: 'error - password missing',
        })
    }
    
    /* 이메일 아이디 중복확인 */
    const foundUser = await User.findOne({userId: user.userId})
    if (foundUser) {
        return res.status(409).json({
            status: 409,
            message: '이미 사용중인 이메일입니다.'
        })
    }

    /* 닉네임 중복확인 */
    const foundUsername = await User.findOne({username: user.username})
    if (foundUsername) {
        return res.status(410).json({
            status: 410,
            message: '이미 사용중인 닉네임입니다.'
        })
    }

    /* 비밀번호 암호화 */
    user.password = await hashPassword(user.password);

    /* DB에 유저 데이터 저장 */
    const result = await User.collection.insertOne({
        userId: user.userId,
        password: user.password,
        username: user.username,
        userProfile: {
            userCharacter: user.character,
            userLevel: 0,
            contactGit: '',
            contactEmail: '',
            profileMessage: '',
        },
        createdAt: new Date(),
    })

    if (!result) {
        return res.status(411).json({
            status: 411,
            message: '회원가입 실패'
        })
    }

    return res.status(200).json({
        status: 200,
        message: '회원가입 완료!',
    });
}

// TODO: For testing NEED TO FIX 
export const update = async (req, res) => {
    const user = req.body;

    console.log('reached')
    
    const result = await User.collection.insertOne({username: user.name});
    if (!result) {
        return res.json({success: false, message: '유저 등록 실패'})
    }
    return res.status(200).send(result)
}

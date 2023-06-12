import 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import User, { IUserDocument } from '../../models/User'
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

/* Middleware for authenticating token */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, config.jwt.accessSecretKey!, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.decoded = decoded
        next()
    })
}

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
    if (!user.username) {
        return res.status(400).json({
            status: 400,
            message: 'error - username missing',
        })
    }
    if (!user.character) {
        return res.status(400).json({
            status: 400,
            message: 'error - character missing',
        })
    }
    
    /* 이메일 아이디 중복확인 */
    const foundUser = await User.findOne({ userId: user.userId })
    if (foundUser) {
        return res.status(409).json({
            status: 409,
            message: '이미 사용중인 이메일입니다.'
        })
    }

    /* 닉네임 중복확인 */
    const foundUsername = await User.findOne({ username: user.username })
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
        hashedPassword: user.password,
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

/* 로그인 */
export const login = async (req, res) => {
    const user = req.body

    /* 누락 정보 확인 */
    if (!user.userId) {
        return res.status(400).json({
            status: 400,
            message: 'error - id missing',
        })
    }
    if (!user.password) {
        return res.status(400).json({
            status: 400,
            message: 'error - password missing',
        })
    }

    const foundUser = await User.collection.findOne({ userId: user.userId })
    if (!foundUser) {
        return res.status(409).json({
            status: 409,
            message: '아이디를 확인해주세요.',
        })
    }

    const isPasswordCorrect = await bcrypt.compare(user.password, foundUser.hashedPassword)
    if (!isPasswordCorrect) {
        return res.status(410).json({
            status: 410,
            message: '비밀번호가 틀렸습니다.'
        })
    }

    const accessToken = jwt.sign(
        {
            userId: foundUser.userId,
            uuid: v4(),
        },
        config.jwt.accessSecretKey!,
        {
            expiresIn: config.jwt.accessExpiresIn,
        }
    )

    const refreshToken = jwt.sign(
        {
            userId: foundUser.userId,
            uuid1: v4(),
            uuid2: v4(),
        },
        config.jwt.refreshSecretKey!,
        {
            expiresIn: config.jwt.refreshExpiresIn,
        }
    )

    await User.collection.updateOne( { userId: foundUser.userId }, 
        {
            $set: {
                refreshToken: refreshToken,
                lastUpdated: new Date(),    
            }
        }
    )

    res.cookie('refreshToken', refreshToken, { path: '/', secure: true })
    res.status(200).json({
        status: 200,
        payload: {
            userId: foundUser.userId,
            accessToken: accessToken,
        }
    })
}

/* 내 정보 조회 */
export const userProfile = async (req, res) => {
    const decoded = req.decoded
    const foundUser = await User.collection.findOne({ userId: decoded.userId })
    
    if (foundUser) {
        return res.status(200).json({
            status: 200,
            payload: {
                userId: foundUser.userId,
                username: foundUser.username,
                character: foundUser.userProfile.character,
                userLevel: foundUser.userProfile.userLevel,
                contactGit: foundUser.userProfile.contactGit,
                contactEmail: foundUser.userProfile.contactEmail,
                profileMessage: foundUser.userProfile.profileMessage,
            }
        })
    }

    return res.status(404).json({
        status: 404,
        message: '데이터 조회 실패'
    })
}


// TODO: For testing NEED TO FIX 
export const update = async (req, res) => {
    const user = req.body;

    console.log('reached')
    
    const result = await User.collection.insertOne({ username: user.name });
    if (!result) {
        return res.json({success: false, message: '유저 등록 실패'})
    }
    return res.status(200).send(result)
}

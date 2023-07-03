import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import User from '../../models/User'
import { config } from '../../envconfig'

const AUTH_ERROR = { message: 'Authentication Error' }

interface CustomRequest extends Request {
    decoded?: any;
}

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
export const authenticateToken = (req: CustomRequest, res: Response, next: any) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json(AUTH_ERROR)
    
    jwt.verify(token, config.jwt.accessSecretKey!, (err: any, decoded: any) => {
        if (err) return res.status(403).json(AUTH_ERROR)
        req.decoded = decoded
        next()
    })
}

/* Middleware for verifying refresh token */
const verifyRefreshToken = async (refreshToken: string): Promise<any> => {
    return jwt.verify(refreshToken, config.jwt.refreshSecretKey!, (err, decoded: any) => {
        if (err) return false
        return decoded
    })
}

/* 회원가입 */
export const signUp = async (req: Request, res: Response) => {
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
    
    /* 아이디 아이디 중복확인 */
    const foundUser = await User.findOne({ userId: user.userId })
    if (foundUser) {
        return res.status(409).json({
            status: 409,
            message: '이미 사용중인 아이디입니다.'
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
            character: user.character,
            userLevel: 0,
            currentExp: 0,
            requiredExp: getRequiredExp(0),
            grade: '',
            school: '',
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
export const login = async (req: Request, res: Response) => {
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

    res.cookie('refreshToken', refreshToken, { 
        path: '/',
        // httpOnly: false,
        // secure: false,
        // sameSite: 'strict',
    })

    res.status(200).json({
        status: 200,
        payload: {
            userId: foundUser.userId,
            username: foundUser.username,
            character: foundUser.userProfile.character,
            userLevel: foundUser.userProfile.userLevel,
            accessToken: accessToken,
        }
    })
}

/* 토큰 기반 회원 정보 조회 */
export const myProfile = async (req: CustomRequest, res: Response) => {
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
                currentExp: foundUser.userProfile.currentExp,
                requiredExp: foundUser.userProfile.requiredExp,
                grade: foundUser.userProfile.grade,
                school: foundUser.userProfile.school,
                profileMessage: foundUser.userProfile.profileMessage,
            }
        })
    }
    

    return res.status(404).json({
        status: 404,
        message: '유저 데이터 조회 실패'
    })
}

/* 토큰 기반 회원 정보 수정 */
export const updateProfile = async (req: CustomRequest, res: Response) => {
    const decoded = req.decoded
    const newUserData = req.body
    
    const foundUser = await User.findOne({ userId: decoded.userId })
    if (!foundUser) return res.status(404).json({
        status: 404,
        message: '유저 데이터 조회 실패'
    })

    // foundUser.userProfile!.character = newUserData.character
    foundUser.userProfile!.grade = newUserData.grade
    foundUser.userProfile!.school = newUserData.school
    foundUser.userProfile!.profileMessage = newUserData.profileMessage

    const updateUser = await foundUser.save()

    if (updateUser) {
        return res.status(200).json({
            status: 200,
            payload: newUserData,
        })
    }

    return res.status(500).json({
        status: 500,
        message: '정보 변경 실패',
    })
}

/* Access token 재발급 및 refresh token 갱신 */
export const refreshAccessToken = async (req: Request, res: Response) => {
    let refreshToken
    
    refreshToken = req.headers.authorization?.split(' ')[1]

    if (!refreshToken) {
        return res.status(400).json({
            status: 400,
            message: 'error - refresh token missing',
        })
    }

    try {
        const decoded = await verifyRefreshToken(refreshToken)
        if (!decoded) return res.status(403).json(AUTH_ERROR)

        const foundUser = await User.collection.findOne({ userId: decoded.userId })
        if (!foundUser) return res.status(401).json(AUTH_ERROR)

        if (refreshToken !== foundUser.refreshToken) {
            return res.status(403).json({
                status: 403,
                message: 'Invalid refresh token',
            })
        }

        refreshToken = jwt.sign(
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

        res.cookie('refreshToken', refreshToken, { 
            path: '/',
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
        })

        res.status(200).json({
            status: 200,
            payload: {
                userId: foundUser.userId,
                accessToken: accessToken,
            },
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 500,
            message: `Server Error: ${err}`,
        })
    }
}

/* 토큰 기반 사용자 인증 */
export const authenticateUser = async (req: CustomRequest, res: Response) => {
    const decoded = req.decoded
    if (!decoded) return res.status(405).json(AUTH_ERROR)
    const foundUser = await User.collection.findOne({ userId: decoded.userId })
    if (!foundUser) {
        return res.status(404).json(AUTH_ERROR)
    } else {
        return res.status(200).json({
            status: 200, 
            payload: {
                userId: foundUser.userId,
                username: foundUser.username,
                character: foundUser.userProfile.character,
                userLevel: foundUser.userProfile.userLevel,
            }
        })
    }
}

/* 닉네임 기반 유저 정보 조회 */
export const userProfile = async (req: Request, res: Response) => {
    const foundUser = await User.collection.findOne({ username: req.params.username })
    
    if (foundUser) {
        return res.status(200).json({
            status: 200,
            payload: {
                username: foundUser.username,
                character: foundUser.userProfile.character,
                userLevel: foundUser.userProfile.userLevel,
                currentExp: foundUser.userProfile.currentExp,
                requiredExp: foundUser.userProfile.requiredExp,
                grade: foundUser.userProfile.grade,
                school: foundUser.userProfile.school,
                profileMessage: foundUser.userProfile.profileMessage,
            }
        })
    }

    return res.status(404).json({
        status: 404,
        message: '유저 데이터 조회 실패'
    })
}

/* 유저 경험치 추가 */
export const gainExp = async (req: CustomRequest, res: Response) => {
    // const decoded = req.decoded
    // if (!decoded) return res.status(405).json(AUTH_ERROR)
    // const foundUser = await User.collection.findOne({ userId: decoded.userId })
    const foundUser = await User.collection.findOne({ userId: req.body.username })
    if (!foundUser) return res.status(404).json({ message: '유저 데이터 조회 실패' })

    const oldUserLevel = foundUser.userProfile.userLevel
    const oldUserExp = foundUser.userProfile.currentExp
    const oldRequiredExp = foundUser.userProfile.requiredExp

    foundUser.userProfile.currentExp += req.body.exp

    let levelUp = 0
    while (foundUser.userProfile.currentExp >= foundUser.userProfile.requiredExp) {
        levelUp += 1
        foundUser.userProfile.userLevel += 1
        foundUser.userProfile.currentExp -= foundUser.userProfile.requiredExp
        foundUser.userProfile.requiredExp = getRequiredExp(foundUser.userProfile.userLevel)
    }

    const updateUser = await foundUser.save()

    if (!updateUser) return res.status(500).json({ message: '정보 변경 실패' })

    return res.status(200).json({
        status: 200,
        payload: {
            levelUp: levelUp,
            oldUserLevel: oldUserLevel,
            oldUserExp: oldUserExp,
            oldRequiredExp: oldRequiredExp,
            newUserLevel: foundUser.userProfile.userLevel,
            newUserExp: foundUser.userProfile.currentExp,
            newRequiredExp: foundUser.userProfile.requiredExp,
        }
    })
}

function getRequiredExp(level: number) {
    return 10 + (level * 5)
}

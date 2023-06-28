import { Request, Response } from 'express';
import LastDM, { ILastDMDocument } from '../../models/LastDM' 
import { UserResponseDto } from './type';
import {userMap} from '../..'
const time_diff = 9 * 60 * 60 * 1000;
/* last dm 가져오기 */
export const loadData = async (req: Request, res: Response) => {
    const userId = req.body;
    if (!userId)
      return res.status(404).json({
        status: 404,
        message: 'not found',
    });
  
    getLastDM(userId)
      .then((result) => {
        console.log(result)
        res.status(200).json({
          status: 200,
          payload: result,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          status: 500,
          message: '서버 오류',
        });
      });
  };
export const firstdata = async (req: Request, res: Response) => {
  const user = req.body
  console.log(user) // 🐱
  await addLastDM({
    senderInfo: user.senderInfo,
    receiverInfo: user.receiverInfo,
    message: user.message,
  })
  console.log(userMap.get(user.receiverInfo.userId),'에게 dm요청') // 🐱
  return res.status(200).json({
    status: 200,
    payload: {
      senderInfo: user.senderInfo,
      receiverInfo: user.receiverInfo,
    },
  })
}


export const getLastDM = async (userId: string) => {
  let result = new Array();
  try {
    await LastDM.collection
    .find({$or:[
      { 'senderInfo.userId': userId },
      {'receiverInfo.userId': userId}]
    })
    .sort({ _id: -1 })
    .toArray()
    .then((elem) => {
      elem.forEach((json) => {
        result.push(json);
        });
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const addLastDM = async (obj: {
  senderInfo: UserResponseDto;
  receiverInfo: UserResponseDto;
  message: string;
}) => {
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    LastDM.collection.insertOne({
      senderInfo: obj.senderInfo,
      receiverInfo: obj.receiverInfo,
      message: obj.message,
      updatedAt: updatedAt,
    });
    LastDM.collection.insertOne({
      senderInfo: obj.receiverInfo,
      receiverInfo: obj.senderInfo,
      message: obj.message,
      updatedAt: updatedAt,
    });
  
    return true;
}

export const updateLastDM = async (obj: { senderId: string; receiverId: string; message: string }) => {
    const { senderId, receiverId, message } = obj;
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    await LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderInfo.userId': senderId }, { 'receiverInfo.userId': receiverId }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
    await LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderInfo.userId': receiverId }, { 'receiverInfo.userId': senderId }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
  };
  export const updateRoomId = async (obj: { senderId: string; receiverId: string; roomId: string }) => {
    const { senderId, receiverId, roomId } = obj;
  
    LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderInfo.userId': senderId }, { 'receiverInfo.userId': receiverId }] },
      { $set: { roomId: roomId } }
    );
    LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderInfo.userId': receiverId }, { 'receiverInfo.userId': senderId }] },
      { $set: { roomId: roomId } }
    );
  };
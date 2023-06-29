import { Request, Response } from 'express';
import LastDM, { ILastDMDocument } from '../../models/LastDM' 
import { UserResponseDto } from './type';
import {userMap} from '../..'
const time_diff = 9 * 60 * 60 * 1000;
/* last dm 가져오기 */
export const loadData = async (req: Request, res: Response) => {
    const userName = req.body;
    // console.log(userName)
    if (!userName)
      return res.status(404).json({
        status: 404,
        message: 'not found',
    });
  
    getLastDM(userName)
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
    senderName: user.senderName,
    receiverName: user.receiverName,
    message: user.message,
  })
  return res.status(200).json({
    status: 200,
    payload: {
      senderName: user.senderName,
      receiverName: user.receiverName,
    },
  })
}


export const getLastDM = async (obj:{senderName: string} ) => {
  let result = new Array();
  console.log(obj)
  try {
    await LastDM.collection
    .find({$or:[
      { 'senderName': obj.senderName },
      {'receiverName': obj.senderName}]
    })
    .sort({ _id: -1 })
    .toArray()
    .then((elem) => {
      elem.forEach((json) => {
        console.log(elem)
        result.push(json);
        });
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const addLastDM = async (obj: {
  senderName: string;
  receiverName: string;
  message: string;
}) => {
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    LastDM.collection.insertOne({
      senderName: obj.senderName,
      receiverName: obj.receiverName,
      message: obj.message,
      updatedAt: updatedAt,
    });
    LastDM.collection.insertOne({
      senderName: obj.receiverName,
      receiverName: obj.senderName,
      message: obj.message,
      updatedAt: updatedAt,
    });
  
    return true;
}

export const updateLastDM = async (obj: { senderName: string; receiverName: string; message: string }) => {
    const { senderName, receiverName, message } = obj;
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    await LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderName': senderName }, { 'receiverName': receiverName }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
    await LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderName': receiverName }, { 'receiverName': senderName }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
  };
  export const updateRoomId = async (obj: { senderName: string; receiverName: string; roomId: string }) => {
    const { senderName, receiverName, roomId } = obj;
  
    LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderName': senderName }, { 'receiverName': receiverName }] },
      { $set: { roomId: roomId } }
    );
    LastDM.collection.findOneAndUpdate(
      { $and: [{ 'senderName': receiverName }, { 'receiverName': senderName }] },
      { $set: { roomId: roomId } }
    );
  };
import { Request, Response } from 'express';
import LastDM, { ILastDMDocument } from '../../models/LastDM' 

const time_diff = 9 * 60 * 60 * 1000;
/* last dm 가져오기 */
export const loadData = async (req: Request, res: Response) => {
    const user  = req.body;
    if (!user.userId)
      return res.status(404).json({
        status: 404,
        message: 'not found',
    });
  
    getLastDM(user.userId)
      .then((result) => {
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

export const getLastDM = async (userId: string) => {
  let result = new Array();
  try {
    await LastDM.collection
    .find({$or:[
      { "senderInfo.userId": userId },
      {"receiverInfo.userId": userId}]
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
  senderId: String;
  receiverId: String;
  message: string;
}) => {
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    LastDM.collection.insertOne({
      senderInfo: obj.senderId,
      receiverId: obj.receiverId,
      message: obj.message,
      updatedAt: updatedAt,
    });
    LastDM.collection.insertOne({
      senderId: obj.receiverId,
      receiverId: obj.senderId,
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
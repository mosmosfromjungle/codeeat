import { Request, Response } from 'express';
import LastDM, { ILastDMDocument } from '../../models/LastDM' 
import {userMap} from '../..'
const time_diff = 9 * 60 * 60 * 1000;
/* last dm 가져오기 */
export const loadData = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.senderName){
      return res.status(404).json({
        status: 404,
        message: 'not found',
      });
    }
    getLastDM(body.senderName)
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

export const getLastDM = async (senderName: string) => {
  let result = new Array();
  try {
    await LastDM.collection
    // .find({$or:[{$and:[{ senderName: senderName }, { message: {$ne:' '}}]},{$and:[{ receiverName: senderName }, { message: {$ne:' '}}]}]})
    .find({$and:[{$or:[{senderName : senderName}, {receiverName: senderName}]},{message: {$ne:' '}}]})
    // .find({$and:[{senderName : senderName},{message: {$ne:' '}}]})
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
  senderName: string;
  receiverName: string;
  message: string;
  roomId: string;
}) => {
  console.log('add Last DM - s: ', obj.senderName, 'r:', obj.receiverName)
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    if(obj.senderName == obj.receiverName) return false
      LastDM.collection.insertOne({
        senderName: obj.senderName,
        receiverName: obj.receiverName,
        message: obj.message,
        roomId: 'first',
        updatedAt: updatedAt,
      });
      LastDM.collection.insertOne({
        senderName: obj.receiverName,
        receiverName: obj.senderName,
        message: obj.message,
        roomId: 'first',
        updatedAt: updatedAt,
      });
    return true;
}

export const updateLastDM = async (obj: { senderName: string; receiverName: string; message: string }) => {
    const { senderName, receiverName, message } = obj;
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let updatedAt = utc + time_diff;
    await LastDM.collection
    .findOneAndUpdate(
      { $and: [{ senderName: senderName }, { receiverName: receiverName }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
    await LastDM.collection
    .findOneAndUpdate(
      { $and: [{ senderName: receiverName }, { receiverName: senderName }] },
      { $set: { message: message, updatedAt: updatedAt } }
    );
  };
  export const updateRoomId = async (obj: { senderName: string; receiverName: string; roomId: string }) => {
    const { senderName, receiverName, roomId } = obj;
  
    LastDM.collection.findOneAndUpdate(
      { $and: [{ senderName: senderName }, { receiverName: receiverName }] },
      { $set: { roomId: roomId } }
    );
    LastDM.collection.findOneAndUpdate(
      { $and: [{ senderName: receiverName }, { receiverName: senderName }] },
      { $set: { roomId: roomId } }
    );
  };

  export const checkLast = async (body:{senderName: string, receiverName: string}) => {
    try {
      const result = await LastDM.collection.countDocuments({
        $or: [
          { $and: [{ senderName: body.senderName }, { receiverName: body.receiverName }] },
          { $and: [{ senderName: body.receiverName }, { receiverName: body.senderName }] }
        ]
      });
      if (!result) {
        LastDM.collection.insertOne({
          senderName: body.senderName,
          receiverName: body.receiverName,
          message: ''
        })
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  export const deleteLastDM = async (body:{ senderName: string, receiverName: string, message: string }) => {
    try {
      await LastDM.collection.deleteMany({
        $and: [
          {
            $or: [
              { $and: [{ senderName: body.senderName }, { receiverName: body.receiverName }] },
              { $and: [{ senderName: body.receiverName }, { receiverName: body.senderName }] }
            ]
          },
          { message: ' ' }
        ]
      })
    } catch (err) {
      console.error(err)
    }
  }
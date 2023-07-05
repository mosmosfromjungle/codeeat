import { Request, Response } from 'express';
import LastDM, { ILastDMDocument } from '../../models/LastDM' 
import {userMap} from '../..'
const time_diff = 9 * 60 * 60 * 1000;
/* last dm 가져오기 */
export const loadData = (req: Request, res: Response) => {
  const body = req.body;
  if (!body.senderName) {
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

  export const getLastDM = async (myName: string) => {
    try {
      const result = await LastDM.collection
        .aggregate([
          { $match: { senderName: myName, message: { $ne: ' ' } } },
          { $sort: { _id: -1 } },
        ])
        .toArray();
        
      return result;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

export const addLastDM = async (obj: {
  senderName: string;
  receiverName: string;
  message: string;
  roomId: string;
}) => {
  console.log('add Last DM - s:', obj.senderName, 'r:', obj.receiverName);
  const cur_date = new Date();
  const utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  const updatedAt = utc + time_diff;

  if (obj.senderName === obj.receiverName) {
    return false;
  }

  try {
    await LastDM.collection.insertMany([
      {
        senderName: obj.senderName,
        receiverName: obj.receiverName,
        message: obj.message,
        roomId: 'first',
        unreadCount: 0,
        updatedAt,
      },
      {
        senderName: obj.receiverName,
        receiverName: obj.senderName,
        message: obj.message,
        roomId: 'first',
        unreadCount: 1,
        updatedAt,
      },
    ]);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const updateLastDM = async (obj: { senderName: string; receiverName: string; message: string }) => {
  const { senderName, receiverName, message } = obj;
  const cur_date = new Date();
  const updatedAt = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000 + time_diff;

  try {
    await LastDM.collection.updateOne(
      { senderName, receiverName },
      { $set: { message, updatedAt } }
    );

    await LastDM.collection.updateOne(
      { senderName: receiverName, receiverName: senderName },
      { $set: { message, updatedAt } }
    );
  } catch (err) {
    console.error(err);
  }
};

export const updateRoomId = async (obj: { senderName: string; receiverName: string; roomId: string }) => {
  const { senderName, receiverName, roomId } = obj;

  try {
    await LastDM.collection.updateOne(
      { senderName, receiverName },
      { $set: { roomId, unreadCount: 0 } }
    );

    await LastDM.collection.updateOne(
      { senderName: receiverName, receiverName: senderName },
      { $set: { roomId } }
    );
  } catch (err) {
    console.error(err);
  }
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

export const updateUnread = async (obj: { myName: string; receiverName: string; }, targetCnt: number = 0) => {
  const { myName, receiverName } = obj;
  
  try {
    await LastDM.collection.updateOne(
      { senderName: myName, receiverName: receiverName },
      { $set: { unreadCount: targetCnt } }
    );
  } catch (err) {
    console.error(err);
  }
};

export const deleteLastDM = async (body: { senderName: string, receiverName: string, message: string }) => {
  try {
    const query = {
      $or: [
        { senderName: body.senderName, receiverName: body.receiverName },
        { senderName: body.receiverName, receiverName: body.senderName }
      ],
      message: ' '
    };

    await LastDM.collection.deleteMany(query);
  } catch (err) {
    console.error(err);
  }
};  

  export const getThatRoom = async (body: { myName: string, targetName: string }) => {
    try {
      const query = {
        $or: [
          { senderName: body.myName, receiverName: body.targetName },
          { senderName: body.targetName, receiverName: body.myName }
        ]
      };
  
      const result = await LastDM.collection.findOne(query, { projection: { roomId: 1 } });
      return result?.roomId || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
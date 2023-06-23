import DM from '../../models/DM';
import { userMap } from '../..';
import LastDM from '../../models/LastDM';
import { UserResponseDto, IDMRoomStatus } from './type';
import { Request, Response } from 'express';
import User from '../../models/User';

const time_diff = 9 * 60 * 60 * 1000;

export const loaddata = async (req: Request, res: Response) => {
  const user = req.body;

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

export const firstdata = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'not found',
      });
    }
    if (!(user.myInfo && user.friendInfo && user.message)) {
      return res.status(400).json({
        status: 400,
        message: 'invalid input',
      });
    }

    const alreadyFriend = await checkLast(user.myInfo.userId, user.friendInfo.userId);

    if (alreadyFriend) {
      // 이미 친구였다면
      return res.status(200).json({
        status: 409,
        message: '이미 친구입니다.',
      });
    }

    const result = await addLastDM({
      myInfo: user.myInfo,
      friendInfo: user.friendInfo,
      status: user.status,
      message: user.message,
    });

    if (!result) {
      // 친구맺기 실패 -> 다양한 이유를 포괄하도록 해야 함
      return res.status(200).json({
        status: 404,
        message: '친구맺기 실패',
      });
    }
    
    return res.status(200).json({
      status: 200,
      payload: {
        myInfo: user.myInfo,
        friendInfo: user.friendInfo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: `서버 오류: ${error}`,
    });
  }
};

export const setfriend = async (req: Request, res: Response) => {
  const { myInfo, friendInfo } = req.body;
  if (!myInfo || !friendInfo) return res.status(404).send('not found');

  acceptFriend({ myId: myInfo.userId, friendId: friendInfo.userId }).then(
    (resultStatus) => {
      res.status(200).json({
        status: 200,
        payload: {
          resultStatus: resultStatus,
          myInfo: myInfo,
          friendInfo: friendInfo,
        },
      });

      //for alarm
      // userMap.get(friendInfo.userId)?.emit('accept-friend', myInfo.username);
      // res.status(200).send(resultStatus)
    }
  );
};
const addLastDM = async (obj: {
  myInfo: UserResponseDto;
  friendInfo: UserResponseDto;
  status: IDMRoomStatus;
  message: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  if (obj.myInfo.userId === obj.friendInfo.userId) return false;
  const alreadyFriend = await checkLast(obj.myInfo.userId, obj.friendInfo.userId);

  try {
    if (alreadyFriend) {
      return false;
    }
    // 이제 처음 친구 요청한 경우
    LastDM.collection.insertOne({
      myInfo: obj.myInfo,
      friendInfo: obj.friendInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unreadCount: 0,
      updatedAt: createAt,
    });
    LastDM.collection.insertOne({
      myInfo: obj.friendInfo,
      friendInfo: obj.myInfo,
      status: obj.status,
      message: obj.message,
      roomId: 'start',
      unreadCount: 1,
      updatedAt: createAt,
    });

    return true;
  } catch (err) {
    console.error(err);
  }
};

const acceptFriend = async (obj: { myId: string; friendId: string; }) => {
  const { myId, friendId } = obj;
  let status = IDMRoomStatus.SOCKET_OFF;
  await updateRoomStatus({ myId, friendId, status });
  return status;
};

export const updateRoomStatus = async (obj: {
  myId: string;
  friendId: string;
  status: IDMRoomStatus;
}) => {
  const { myId, friendId, status } = obj;

  updateUnread({ myId: myId, friendId: friendId }, 0);

  LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { status: status } }
  );
  LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { status: status } }
  );
};

const deleteDMRoom = async (obj: { myId: string; friendId: string }) => {
  const { myId, friendId } = obj;
  let docs = await LastDM.collection.findOne({
    $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }],
  });
  // 삭제한 상대방에게 상대방이 채팅방에서 나갔음을 알림.
};

export const updateLastDM = async (obj: { myId: string; friendId: string; message: string }) => {
  const { myId, friendId, message } = obj;
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  await LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { message: message, updatedAt: createAt } }
  );
  let docs = await LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { message: message, updatedAt: createAt }, $inc: { unreadCount: 1 } }
  );
};

export const updateRoomId = async (obj: { myId: string; friendId: string; roomId: string }) => {
  const { myId, friendId, roomId } = obj;

  LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { roomId: roomId, unreadCount: 0 } }
  );
  LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': friendId }, { 'friendInfo.userId': myId }] },
    { $set: { roomId: roomId } }
  );
};

export const updateUnread = async (
  obj: {
    myId: string;
    friendId: string;
  },
  targetCnt: number = 0
) => {
  const { myId, friendId } = obj;

  LastDM.collection.findOneAndUpdate(
    { $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }] },
    { $set: { unreadCount: targetCnt } }
  );
};

export const getLastDM = async (myId: string) => {
  let result = new Array();
  try {
    await LastDM.collection
      .find({ 'myInfo.userId': myId })
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

export const checkLast = async (myId: string, friendId: string) => {
  try {
    const res = await LastDM.collection.countDocuments({
      $and: [{ 'myInfo.userId': myId }, { 'friendInfo.userId': friendId }],
    });

    return res;
  } catch (err) {
    console.error(err);
  }
};

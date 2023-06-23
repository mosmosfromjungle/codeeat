import DM from '../../models/DM';
import { Socket } from 'socket.io';
import { io } from '../..';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import { updateLastDM, updateRoomId, updateUnread } from '../LastDMControllers';
import { userMap } from '../..';
import LastDM from '../../models/LastDM';
import User from '../../models/User';

const rooms: Record<string, string[]> = {};
interface IRoomParams {
  roomId: string;
  userId: string;
  friendId: string;
}

const time_diff = 9 * 60 * 60 * 1000;

const createRoom = () => {
  const roomId = uuidV4();
  rooms[roomId] = [];

  return roomId;
};

export const DMController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; userId: string; friendId: string }) => {
    let { roomId } = host;
    const { userId, friendId } = host;

    if (rooms[roomId]) {
      rooms[roomId].push(userId);
      updateUnread({ myId: userId, friendId: friendId }, 0);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      updateRoomId({ myId: userId, friendId: friendId, roomId: roomId }).then(() => {
        rooms[roomId].push(userId);
      });
    }
    readMessage({ roomId, userId, friendId });
    socket.on('disconnect', () => {
      leaveRoom({ roomId, userId: userId, friendId });
    });
  };

  const leaveRoom = ({ roomId, userId: userId, friendId: guestId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
    socket.to(roomId).emit('user-disconnected', userId);
  };
  const startDM = ({ roomId, userId: userId, friendId: guestId }: IRoomParams) => {
    socket.to(roomId).emit('uesr-started-dm', userId);
  };
  const stopDM = (roomId: string) => {
    socket.to(roomId).emit('user-stopped-dm');
  };

  const sendMessage = (obj: {
    roomId: string;
    userId: string;
    friendId: string;
    message: string;
  }) => {
    const { roomId, userId, friendId, message } = obj;
    if (message) {
      addDMMessage({ senderId: userId, receiverId: friendId, message: message });
      updateLastDM({ myId: userId, friendId: friendId, message: message });

      userMap.get(friendId)?.emit('message', obj);
    }
  };

  const requestFriend = async (body: {
    myInfo: any;
    friendInfo: any;
  }) => {
    const { myInfo, friendInfo } = body;

    userMap.get(friendInfo?.userId)?.emit('request-friend-res', myInfo.username);
  };

  const acceptFriend = async (body: {
    myInfo: any;
    friendInfo: any;
  }) => {
    const { myInfo, friendInfo } = body;

    userMap.get(friendInfo?.userId)?.emit('accept-friend-res', myInfo?.username);
  };

  // room이 살아 있을 경우.
  // Array를 만들고 거기에 푸쉬. Array를 만들어서 룸 데이터로 가지고 있는다.
  // 메시지를 읽으려 할때 그 array를 리턴.
  // room에 처음 참여하는 경우는 db에서 불러온 값을 그대로 보여줌.
  const readMessage = (message: { roomId: string; userId: string; friendId: string }) => {
    const { roomId, userId, friendId } = message;

    getDMMessage(userId, friendId)
      .then((DMMessage) => {
        socket.emit('old-messages', DMMessage);
      })
      .catch((error) => {
        console.error('readMessage', error);
      });
  };

  socket.on('join-room', joinRoom);
  socket.on('message', sendMessage);
  socket.on('request-friend-req', requestFriend);
  socket.on('accept-friend-req', acceptFriend);
};
export const addDMMessage = (message: {
  senderId: string;
  receiverId: string;
  message: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createAt = utc + time_diff;
  DM.collection.insertOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
    message: message.message,
    createdAt: createAt,
  });
};

export const getDMMessage = async (sender: string, recipient: string) => {
  let result = new Array();
  await DM.collection
    .find({
      $or: [
        { $and: [{ senderId: sender }, { receiverId: recipient }] },
        { $and: [{ senderId: recipient }, { receiverId: sender }] },
      ],
    })
    .limit(200)
    .sort({ _id: 1 })
    .toArray()
    .then((elem) => {
      elem.forEach((json) => {
        result.push(json);
      });
    });
  LastDM.collection.find();
  return result;
};

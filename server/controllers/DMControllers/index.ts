import dm from '../../models/DM';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import LastDM from '../../models/LastDM';
import { updateLastDM, updateRoomId } from '../LastDMControllers';
import { userMap } from '../..';
const rooms: Record<string, string[]> = {}
interface IRoomParams {
  roomId: string;
  userId: string;
  receiverId: string;
}
const time_diff = 9 * 60 * 60 * 1000;
const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    console.log('chatroom[', roomId, '] created')
    return roomId
}

export const DMController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; userId: string; receiverId: string }) => {
    let { roomId } = host;
    const { userId, receiverId } = host;
  
    if (rooms[roomId]) {
      console.log('대화방 유저 입장') // 🐱
      rooms[roomId].push(userId);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      rooms[roomId].push(userId);
      updateRoomId({ roomId: roomId, senderId: userId, receiverId: receiverId })
      rooms[roomId].push(userId);
    }
    readMessage({ roomId, userId, receiverId });
    socket.on('disconnect', () => {
      console.log(' 유저 퇴장 ')
      leaveRoom({ roomId, userId: userId, receiverId })
    })
  };

  const leaveRoom = ({ roomId, userId: userId, receiverId: receiverId}: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== userId)
    socket.to(roomId).emit('player-disconnected:', userId)
  }

  const sendMessage = (obj: {
    roomId: string;
    senderId: string;
    receiverId: string;
    message: string;
  }) => {
  const { roomId, senderId, receiverId, message } = obj;
    if (message) {
      addDM({ senderId: senderId, receiverId: receiverId, message: message });
        
      userMap.get(receiverId)?.emit('message', obj);
    }
  };

  const readMessage = (message: { roomId: string; userId: string; receiverId: string; }) => {
    const { roomId, userId, receiverId } = message;
  
    getDMMessage(userId, receiverId)
    .then((dmMessage) => {
      socket.emit('old-messages', dmMessage);
    })
    .catch((error) => {
      console.error('readMessage', error);
    });
  };
  socket.on('join-room', joinRoom);
  socket.on('message', sendMessage);
}


export const addDM = (message: {
  senderId: string;
  receiverId: string;
  message: string;
}) => {
  let cur_date = new Date();
  let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
  let createdAt = utc + time_diff;
  dm.collection.insertOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
    message: message.message,
    createdAt: createdAt
  });
};

  
export const getDMMessage = async (senderId: string, receiverId: string) => {
    let result = new Array();
    await dm.collection
      .find({
        $or: [
          { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
          { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
        ],
      })
      .limit(100)
      .sort({ _id: 1 })
      .toArray()
      .then((elem) => {
        elem.forEach((json) => {
          result.push(json);
        });
      });
    // LastDM.collection.find();
    console.log('dm컨트롤러 114번줄- dm컬렉션에서 이전 dm들 모아서 배열로 리턴 하기 바로직전',result) // 🐱
    return result;
  };
import dm from '../../models/DM';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import LastDM from '../../models/LastDM';
import { updateLastDM, updateRoomId } from '../LastDMControllers';
import { userMap } from '../..';

const rooms: Record<string, string[]> = {}

const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];

    return roomId
}

export const DMController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; senderId: string; receiverId: string }) => {
    let { roomId } = host;
    const { senderId, receiverId } = host;
  
    if (rooms[roomId]) {
      rooms[roomId].push(senderId);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      rooms[roomId].push(senderId);
      updateRoomId({ roomId: roomId, senderId: senderId, receiverId: receiverId })
      .then(() => {
      rooms[roomId].push(senderId);
      })
    }
    readMessage({ senderId, receiverId, roomId });
  };

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

  const readMessage = (message: { senderId: string; receiverId: string; roomId: string; }) => {
    const { senderId, receiverId, roomId } = message;
  
    getDMMessage(senderId, receiverId)
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
  dm.collection.insertOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
    message: message.message,
  });
};

  
export const getDMMessage = async (sender: string, receiver: string) => {
    let result = new Array();
    await dm.collection
      .find({
        $or: [
          { $and: [{ senderId: sender }, { receiverId: receiver }] },
          { $and: [{ senderId: receiver }, { receiverId: sender }] },
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
    LastDM.collection.find();
    return result;
  };
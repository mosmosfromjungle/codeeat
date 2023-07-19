import dm from '../../models/DM';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import LastDM from '../../models/LastDM';
import { updateLastDM, updateRoomId, addLastDM, deleteLastDM } from '../LastDMControllers';
import { userMap } from '../..';
const rooms: Record<string, string[]> = {}
interface IRoomParams {
  roomId: string;
  username: string;
  receiverName: string;
}
const time_diff = 9 * 60 * 60 * 1000;
export const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    console.log('chatroom[', roomId, '] created')
    return roomId
}

export const DMController = (socket: Socket) => {
  const joinRoom = async (host: { roomId: string; username: string; receiverName: string }) => {
    const { roomId, username, receiverName } = host;

    if (rooms[roomId]) {
      rooms[roomId].push(username);
      socket.join(roomId);
    } else {
      try {
        const newRoomId = await createRoom();
        await addLastDM({ senderName: username, receiverName: receiverName, message: ' ', roomId: newRoomId });
        await updateRoomId({ senderName: username, receiverName: receiverName, roomId: newRoomId });
        rooms[newRoomId] = [username];
        socket.join(newRoomId);
      } catch (error) {
        console.error('joinRoom', error);
        return;
      }
    }
    readMessage({ roomId, username, receiverName });
  };

  const sendMessage = (obj: {
    roomId: string;
    senderName: string;
    receiverName: string;
    message: string;
  }) => {
  const { roomId, senderName, receiverName, message } = obj;
    if (message) {
      addDM({ senderName: senderName, receiverName: receiverName, message: message });
      updateLastDM({ senderName: senderName, receiverName: receiverName, message: message })
      userMap.get(receiverName)?.emit('message', obj);
      console.log('@DMcontrollers/sendMessage -',senderName,'가',receiverName,'에게',obj.message, '라고 보냄')
    }
  };

  const readMessage = async (message: { roomId: string; username: string; receiverName: string; }) => {
    const { roomId, username, receiverName } = message;
    getDMMessage(username,receiverName)
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


export const addDM = async (message: {
  senderName: string;
  receiverName: string;
  message: string;
}) => {
  try {
    const createdAt = Date.now() + time_diff;

    await dm.collection.insertOne({
      ...message,
      createdAt,
    });

    return true;
  } catch (error) {
    console.error('addDM', error);
    return false;
  }
};

  
export const getDMMessage = async (senderName: string, receiverName: string) => {
  try {
    const query = {
      $or: [
        { senderName, receiverName },
        { senderName: receiverName, receiverName: senderName },
      ],
    };

    const messages = await dm.collection
      .find(query)
      .sort({ _id: 1 })
      .limit(50)
      .toArray();

    return messages;
  } catch (error) {
    console.error('getDMMessage', error);
    return [];
  }
};
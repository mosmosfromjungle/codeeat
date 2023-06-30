import dm from '../../models/DM';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import LastDM from '../../models/LastDM';
import { updateLastDM, updateRoomId, checkLast } from '../LastDMControllers';
import { userMap } from '../..';
const rooms: Record<string, string[]> = {}
interface IRoomParams {
  roomId: string;
  userName: string;
  receiverName: string;
}
const time_diff = 9 * 60 * 60 * 1000;
const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    console.log('chatroom[', roomId, '] created')
    return roomId
}

export const DMController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; userName: string; receiverName: string }) => {
    let { roomId } = host;
    const { userName, receiverName } = host;
  
    if (rooms[roomId]) {
      console.log('대화방 유저 입장') // 🐱
      rooms[roomId].push(userName);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      rooms[roomId].push(userName);
      updateRoomId({ roomId: roomId, senderName: userName, receiverName: receiverName })
      rooms[roomId].push(userName);
    }
    readMessage({ roomId, userName, receiverName });
    socket.on('disconnect', () => {
      console.log(' 유저 퇴장 ')
      leaveRoom({ roomId, userName: userName, receiverName })
    })
  };

  const leaveRoom = ({ roomId, userName: userName, receiverName: receiverName}: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== userName)
    socket.to(roomId).emit('player-disconnected:', userName)
  }

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
    }
  };

  const readMessage = (message: { roomId: string; userName: string; receiverName: string; }) => {
    const { roomId, userName, receiverName } = message;
  
    getDMMessage({senderName:userName, receiverName:receiverName})
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
  senderName: string;
  receiverName: string;
  message: string;
}) => {
  const notFirst = (checkLast({senderName: message.senderName, receiverName: message.receiverName}))
  if (!notFirst) {
    let cur_date = new Date();
    let utc = cur_date.getTime() + cur_date.getTimezoneOffset() * 60 * 1000;
    let createdAt = utc + time_diff;
    dm.collection.insertOne({
      senderName: message.senderName,
      receiverName: message.receiverName,
      message: message.message,
      createdAt: createdAt,
      roomId: 'first'
    });
    updateLastDM(message)
  }
};

  
export const getDMMessage = async (obj:{senderName: string, receiverName: string}) => {
    let result = new Array();
    await dm.collection
      .find({
        $or: [
          { $and: [{ senderName: obj.senderName }, { receiverName: obj.receiverName }] },
          { $and: [{ senderName: obj.receiverName }, { receiverName: obj.senderName }] },
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
    console.log('dm컨트롤러 114번줄- dm컬렉션에서 이전 dm들 모아서 배열로 리턴 하기 바로직전',result) // 🐱
    return result;
  };
import DataUser from '../../models/DataUser';
import { Socket } from 'socket.io';
// import { io } from '../..';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import { userMap } from '../..';

const rooms: Record<string, string[]> = {};
// const rooms_chat: Record<string, Object[]> = {};
interface IRoomParams {
  roomId: string;
  userId: string;
}

const createRoom = () => {
  const roomId = uuidV4();
  rooms[roomId] = [];
  console.log('Data-game room[', roomId, '] created.');
  return roomId;
};

export const DataController = (socket: Socket) => {
  const joinRoom = (host: { roomId: string; userId: string; }) => {
    let { roomId } = host;
    const { userId } = host;

    if (rooms[roomId]) {
      console.log('user Joined the room', roomId, userId);
      rooms[roomId].push(userId);
      socket.join(roomId);
    } else {
      roomId = createRoom();
      rooms[roomId].push(userId);
    }
    startGame({ roomId, userId });
    // -- 게임 ---
    socket.on('disconnect', () => {
      console.log('user left the room', host);
      leftGame(roomId);
    });
  };

  const startGame = ({ roomId, userId: userId }: IRoomParams) => {
    socket.to(roomId).emit('user-started-game', userId);
  };
  const leftGame = (roomId: string) => {
    socket.to(roomId).emit('user-left-game');
  };

  socket.on('join-room', joinRoom);
};
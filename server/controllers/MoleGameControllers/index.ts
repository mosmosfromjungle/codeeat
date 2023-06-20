import User from '../../models/User';
import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import { Request, Response } from 'express';
import Mole from '../../models/MoleGame';

const rooms: Record<string, string[]> = {};
// const rooms_chat: Record<string, Object[]> = {};
interface IRoomParams {
  roomId: string;
  userId: string;
}

const createRoom = () => {
  const roomId = uuidV4();
  rooms[roomId] = [];
  console.log('Mole-game room[', roomId, '] created.');
  return roomId;
};

export const MoleController = (socket: Socket) => {
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
    socket.on('playerScore', (playerInfo) => {
      addScore(playerInfo)
      socket.to(roomId).emit(playerInfo)
    })
    //-----------
    socket.on('disconnect', () => {
      console.log('user left the room', host);
      leaveRoom({roomId, userId: userId});
    });
  };

  const startGame = ({ roomId, userId: userId }: IRoomParams) => {
    socket.to(roomId).emit('user-started-game', userId);
  };
  const leaveRoom = ({ roomId, userId: userId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
    deleteHistory({ playerId: userId})
    socket.to(roomId).emit('user-disconnected', userId);
  }

  socket.on('join-room', joinRoom);
};

export const addScore = (playerInfo: {
  playerId: string;
  playerScore: number;
}) => {
  Mole.collection.findAndModify({
    playerId: playerInfo.playerId,
    playerScore: playerInfo.playerScore + 1
  })
}

export const deleteHistory = (playerInfo: {
  playerId: string;
}) => {
  Mole.collection.findOneAndDelete({
    playerId: playerInfo.playerId
  })
}

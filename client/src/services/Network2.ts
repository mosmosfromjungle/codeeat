import React from 'react';
import { io, Socket } from 'socket.io-client';
import ParasolImg from 'src/assets/directmessage/parasol.png';
import store from '../stores';
// import { setNewMessageCnt, setNewMessage, setRequestFriendCnt } from 'src/stores/DMboxStore';
// import Cookies from 'universal-cookie';
import { fireNotification } from '../api/notification';
import DataStructureStore from '../stores/DataGameStore';
// const cookies = new Cookies();

interface Player{
  player: string;
  playerScore: number;
}

export default class gameNetwork {
  private socketClient: Socket;
  public playerScores: Player[] = [];

  constructor() {
    const socketUrl =
      process.env.NODE_ENV === 'production' || import.meta.env.VITE_SERVER === 'PRO'
        ? `https://${import.meta.env.VITE_SOCKET_SERVER_URL}`
        : `http://${window.location.hostname}:5173`;

    this.socketClient = io(socketUrl, {
      transports: ['websocket', 'polling', 'flashsocket'],
      withCredentials: true,
    });
    this.socketClient.on('connection_mole', (data) => {
      
    });
    this.socketClient.on('connection_data', (data) => {
      
    });
    this.socketClient.on('connection_rain', (data) => {
      
    });
    this.socketClient.on('addscore_mole', (data) => {
      
    });
    this.socketClient.on('addscore_data', (data) => {
      
    });
    this.socketClient.on('addscore_rain', (data) => {
      
    });
    this.socketClient.on('win_mole', (data) => {
      
    });
    this.socketClient.on('win_data', (data) => {
      
    });
    this.socketClient.on('win_rain', (data) => {
      
    });
  }

  getSocket = () => {
    return this.socketClient;
  };

  joinRoom = (roomId: string, userId: string) => {
    this.socketClient.emit('join-room', { roomId: roomId, userId: userId });

  };

  whoRU = (userId: string) => {
    this.socketClient.emit('whoRU', userId);
  };
}

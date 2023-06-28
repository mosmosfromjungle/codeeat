import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import store from '../stores'
import { Message } from '../../../types/Messages'
import { setNewMessage } from '../stores/DMStore';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export default class DMNetwork {
  private socketClient: Socket;
  public oldMessages: any[];
  constructor() {
    const socketUrl = `http://localhost:8888/`
    this.socketClient = io(socketUrl, {
      transports: ['websocket', 'polling', 'flashsocket'],
      withCredentials: true,
    });
    this.oldMessages = []
    this.socketClient.on("connect_error", (err) => {
      console.log(`connetion err${err.message}`);
      console.error(err)
    })
    this.socketClient.on('message', (data) => {
      store.dispatch(setNewMessage(data))
    })
  }

  async getSocket () {
    return this.socketClient;
  };

  async joinRoom (roomId: string, senderId: string, receiverId: string, callback: any) {
    console.log('JOINROOM-----MyId:',senderId,'acqId:',receiverId) // 🐱
    this.socketClient.emit('join-room', { roomId: roomId, userId: senderId, receiverId: receiverId });

    this.socketClient.on('old-messages', (data) => {
      console.log('old messages')
      const userId = store.getState().user.userId || cookies.get('userId');
      this.oldMessages = [];
      data.forEach((element: any) => {
        if (element.senderId) {
          this.oldMessages.push(element);
        }
      });
      callback(this.oldMessages);
    });
  };

  sendMessage = (message: object) => {
    console.log('디엠네트워크 60줄 소켓이벤트 분출 직전 ') // 🐱
    this.socketClient.emit('message', message)
  }

  whoAmI = (userId: string) => {
    this.socketClient.emit('whoAmI', userId);
  };
}
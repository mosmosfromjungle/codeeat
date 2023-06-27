import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import store from '../stores'
import { Message } from '../../../types/Messages'
import { setNewMessage } from '../stores/DMStore';

interface OldMessage{
  _id: string;
  createdAt: number;
  message: string;
  receiverId: string;
  senderId: string;
}
export default class DMNetwork {
  private socketClient: Socket;
  public oldMessages: OldMessage[];
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

  joinRoom = (roomId: string, user1_Id: string, user2_Id: string, callback: any) => {
    this.socketClient.emit('join-room', { roomId: roomId, user1_Id: user1_Id, user2_Id: user2_Id });

    this.socketClient.on('old-messages', (data) => {
      const userId = store.getState().user.userId;
      this.oldMessages = [];
      data.forEach((element: OldMessage) => {
        if (element.senderId == userId) {
          this.oldMessages.push(element);
        }
      });
      callback(this.oldMessages);
    });
  };

  sendMessage = (message: object) => {
    this.socketClient.emit('message', message)
  }

  whoAmI = (userId: string) => {
    this.socketClient.emit('whoAmI', userId);
  };
}
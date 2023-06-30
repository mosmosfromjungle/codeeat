import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import store from '../stores'
import { Message } from '../../../types/Messages'
import { setNewMessage } from '../stores/DMStore';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
interface OldMessage{
  _id: string
  createdAt: number
  message: string
  senderName: string
  receiverName: string
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

  joinRoom = (roomId: string, senderName: string, receiverName: string) => {
    this.socketClient.emit('join-room', { roomId: roomId, userName: senderName, receiverName: receiverName });
    console.log(' 여기 ---')
    this.socketClient.on('old-messages', (data) => {
      this.oldMessages = [];
      data.forEach((element: any) => {
        if (element.senderName) {
          this.oldMessages.push(element);
        }
      });
    });
  };

  sendMessage = (message: object) => {
    console.log('디엠네트워크 50줄 소켓이벤트 분출 직전 ') // 🐱
    this.socketClient.emit('message', message)
  }

  whoAmI = (userName: string) => {
    this.socketClient.emit('whoAmI', userName);
  };

}
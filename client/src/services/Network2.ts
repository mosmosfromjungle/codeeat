import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { phaserEvents, Event } from 'src/events/EventCenter';
import { ServerToClientEvents, ClientToServerEvents } from 'src/api/chat';
import ParasolImg from 'src/assets/directmessage/parasol.png';
import store from '../stores';
import { setNewMessageCnt, setNewMessage, setRequestFriendCnt } from 'src/stores/DMboxStore';
import Cookies from 'universal-cookie';
import { fireNotification } from 'src/api/notification';
const cookies = new Cookies();
export default class chatNetwork {
  private socketClient: Socket;
  public oldMessages: any[];

  constructor() {
    // const socketUrl = `https://www.para-solo.site`
    const socketUrl = `http://localhost:8886/`
    // const socketUrl = `http://43.201.119.149:3000/socket-server/`
    // this.socketClient = io("www.parasolo-soc.com")
    this.socketClient = io(socketUrl)
    this.socketClient.on("connect_error", (err) => {
      console.log(`connetion err${err.message}`);
      console.error(err)
      
    })
    // this.socketClient = io("https://www.para-solo.site/socket-server", {
    //   // path:'/socket/',
    //   // withCredentials: true
    // });
    this.oldMessages = [];
    
    this.socketClient.on('getscore', (data) => {
        this.socketClient.emit('updatescore',this.socketClient.id)
      console.log('getscore', data);
    });

    this.socketClient.on('win', (data) => {
      data.player.score += 1
    });
  }

  async getSocket () {
    return this.socketClient;
  };

  async joinRoom (roomId: string, userId: string, friendId: string, callback: any) {
    console.log('join!');
    console.log(this.socketClient)
    this.socketClient.emit('join-room', { roomId: roomId, userId: userId, friendId: friendId });
  };

  async whoAmI (userId: string) {
    console.log('myId is ....', userId);
    this.socketClient.emit('whoAmI', userId)
  };
}

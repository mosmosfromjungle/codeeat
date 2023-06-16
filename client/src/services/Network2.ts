import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
export default class datastructureNetwork {
  private socketClient: Socket;

  constructor() {
    const socketUrl = `http://localhost:8886/`
    this.socketClient = io(socketUrl)
    this.socketClient.on("connect_error", (err) => {
      console.log(`connetion err${err.message}`);
      console.error(err)
      
    })
    // this.socketClient = io("https://www.para-solo.site/socket-server", {
    //   // path:'/socket/',
    //   // withCredentials: true
    // });
    
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

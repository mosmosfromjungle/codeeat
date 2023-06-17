import 'express-async-errors';
import { connectDB } from './DB/db';
import { Socket, Server } from 'socket.io';
import {  } from './controllers/MoleGameControllers'
import {  } from './controllers/ComputerControllers'
import {  } from './controllers/WhiteboardControllers'

const socketPort = 8888
export const userMap = new Map<string, Socket>();
export const io = new Server(socketPort);
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
io.on('connection', (socket: Socket) => {
  socket.on('whoAmI', (userId) => {
    console.log(userId, "logged in to socket-server.")
    userMap.set(userId, socket);
  });
  console.log('connection');

  socket.on('disconnect', () => {
    console.log('player disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on('Mole_addScore', (player) => {

  })
  socket.on('Rain_addScore', (player) => {

  })
  socket.on('Data_addScore', (player) => {

  })

  socket.on('Mole_win', (player) => {

  })
  socket.on('Rain_win', (player) => {

  })
  socket.on('Data_win', (player) => {

  })

  
});
connectDB()
.then((db) => {
  
  console.log(`Listening on wss://localhost:${socketPort}`);
})
.catch(console.error);

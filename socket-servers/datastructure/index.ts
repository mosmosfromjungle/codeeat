import 'express-async-errors';
import { connectDB } from './DB/db';
import { Socket, Server } from 'socket.io';

const socketPort = 8886
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
});

connectDB()
.then((db) => {
  
  console.log(`Listening on wss://localhost:${socketPort}`);
})
.catch(console.error);

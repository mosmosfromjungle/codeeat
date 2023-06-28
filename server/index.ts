import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'
import authRouter from './routes/auth';
import friendsRouter from './routes/friends';
import lastdmRouter from './routes/lastdm'
import dmRouter from './routes/dm'
import molegameRouter from './routes/molegame';
// import socialRoutes from "@colyseus/social/express"

import { connectDB } from './DB/db'
import { SkyOffice } from './rooms/SkyOffice'
import { GameRoom } from './rooms/GameRoom'
import { BrickGameRoom } from './rooms/BrickGameRoom'
import { DMController } from './controllers/DMControllers'
import { Socket } from 'socket.io'

// const mongoose = require('mongoose')
// var cookieParser = require('cookie-parser')
const port = Number(process.env.PORT || 2567)
const socketPort = Number(process.env.SOCKET_PORT || 8888);
const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'authorization',
    '*',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: allowedOrigins,
  preflightContinue: false,
};

app.use(cors(options))
app.use(express.json())
// app.use(express.static('dist'))

const server = http.createServer(app)
const mainServer = new Server({
  server,
})

/* register room handlers */
mainServer.define(RoomType.LOBBY, LobbyRoom)
mainServer.define(RoomType.PUBLIC, SkyOffice, {
  name: 'codeEat',
  description: '친구들과 재밌게 코딩하자!',
  password: null,
  autoDispose: false,
})
mainServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing()

mainServer.define(RoomType.BRICKLOBBY, LobbyRoom)
mainServer.define(RoomType.MOLELOBBY, LobbyRoom)
mainServer.define(RoomType.RAINLOBBY, LobbyRoom)
mainServer.define(RoomType.FACECHATLOBBY, LobbyRoom)

mainServer.define(RoomType.BRICK, BrickGameRoom).enableRealtimeListing()
mainServer.define(RoomType.MOLE, GameRoom).enableRealtimeListing()
mainServer.define(RoomType.RAIN, GameRoom).enableRealtimeListing()
mainServer.define(RoomType.FACECHAT, GameRoom).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

/* API Routes */
app.use('/auth', authRouter);
app.use('/friends', friendsRouter);
app.use('/dm', dmRouter)
app.use('/lastdm', lastdmRouter);
app.use('/molegame', molegameRouter);

/* Connect DB and run game server */
connectDB().then(db => {
  mainServer.listen(port)  
  console.log(`Listening on ws://localhost:${port}`)
}).catch(console.error);

const socketServer = http.createServer(app)
socketServer.listen(socketPort, () => console.log(`socketServer listening on ${socketPort}`))
export const io = require('socket.io')(socketServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

export const userMap = new Map<string, Socket>();

io.on('connection', (socket: Socket) => {
  console.log('접속', socket.id);
  socket.on('whoAmI', (userId) => {
    console.log('아이디는', userId);
    userMap.set(userId, socket);
  });
  DMController(socket);
  socket.on('disconnect', () => {
    console.log('퇴장');
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
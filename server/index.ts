import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { RoomType } from '../types/Rooms'
import authRouter from './routes/auth';
import 'express-async-errors'
import { SkyOffice } from './rooms/SkyOffice'
import { connectDB, createCollection } from './DB/db'
import { DataController } from './controllers/DataGameControllers'
import { RainController } from './controllers/RainGameControllers'
import { MoleController } from './controllers/MoleGameControllers'
import { Socket } from 'socket.io';
const mongoose = require('mongoose');

// import socialRoutes from "@colyseus/social/express"


const port = Number(process.env.PORT || 2567)
const socketPort = Number(process.env.SOCKET_PORT || 8888)
const app = express()
app.get('/', (req, res) => {
  res.json({ message: `Server is running on ${req.secure ? 'HTTPS' : 'HTTP'}`});
})
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001'
]
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
  methods: 'GET, POST, OPTIONS, PUT, PATCH, POST, DELETE',
  origin: allowedOrigins
}
app.use(cors(options))
app.use(express.json())
// app.use(express.static('dist'))

const server = http.createServer(app)
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: '모스모스로',
  description: '초대합니다',
  password: null,
  autoDispose: false,
})
app.use('auth', authRouter)

connectDB()
.then(() => {
  gameServer.listen(port)

  console.log(`gameServer is listening on port ${port}`)
})
.catch((err) => {
  console.log(err.message)
})

const socketServer = http.createServer(app);
socketServer.listen(socketPort, () => console.log(`socketServer is listening on port${socketPort}`));
export const io = require('socket.io')(socketServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})

export const userMap = new Map<string, Socket>();
export const gameMap = new Map<string, Socket>();

io.on('connection', (socket:Socket) => {
  console.log(`${socket.id} 입장`)
  socket.on('whoRU', (userId) => {
    console.log('whoRU', userId)

    userMap.set(userId, socket)
  })
  DataController(socket)
  socket.on('disconnect', () => {
    console.log(`${socket.id} 퇴장`)
  })
  socket.on('connect_error', (err) => {
    console.log(`connection error: ${err.message}`)
  })
})

app.use((err, res) => {
  console.error(err)
  res.status(500).json({
    status: 500,
    message: `서버 오류: ${err}`,
  })
})

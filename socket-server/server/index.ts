import 'express-async-errors';
import { MoleController } from './controllers/MoleGameControllers'
import { DataController } from './controllers/DataGameControllers'
import { RainController } from './controllers/RainGameControllers'
import express from 'express'
import { Socket, Server } from 'socket.io'

const socketPort = 3001
const app = express()
const server = app.listen(socketPort, () => console.log(`server on ${socketPort}`))
import { connectDB } from './DB/db';
export const io = new Server(socketPort, {
  cors: {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'authorization',
    ],
    origin: ['http://localhost:5173', 'http://localhost:2567'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

const presentPlayers = new Map<Socket, Number>();
io.on('connection', onConnect)

function onConnect(socket) {
  console.log(socket.id, '입장')
  presentPlayers.set(socket, Number(0))

  socket.on('disconnect', () => {
    console.log(socket.id, '퇴장')
    presentPlayers.delete(socket)
    // io.emit('players', presentPlayers.size)
  })

  socket.on('gotAnswer', () => {
    console.log(socket.id, '득점')
    let player = presentPlayers.get(socket)
    presentPlayers.set(socket, Number(player) + 1)
    const data = {
      socketid: socket.id,
      score: Number(player)
    }
    socket.emit('addScore', data)
  })

  socket.on('win', (socket) => {
    socket.emit('gameEnd', socket.id)
  })
}
connectDB()
.then(() => {
  console.log(`Listening on wss://localhost:${socketPort}`)
})
.catch(console.error)

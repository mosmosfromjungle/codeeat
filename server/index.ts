import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { RoomType } from '../types/Rooms'
import authRouter from './routes/auth';
import 'express-async-errors'

const socketIO = require('socket.io')

// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/SkyOffice'
import { connectDB } from './DB/db'

const port = Number(process.env.PORT || 2567)
const app = express()

const options: cors.CorsOptions = {
  methods: 'GET, POST',
  origin: '*'
}
app.use(cors(options))
app.use(express.json())
// app.use(express.static('dist'))

const server = app.listen(8888, () => {
  console.log('socket listening')
})

const gameServer = new Server()
const io = socketIO(server)

let presentPlayers = new Map()

io.on('connection', onConnect)

function onConnect(socket) {
  console.log(socket.id, '입장')
  presentPlayers.set(socket.id, {score: 0})
  io.emit('new-player', socket.id)

  socket.on('disconnect', () => {
    console.log(socket.id, '퇴장')
    presentPlayers.delete(socket.id)
    // io.emit('players', presentPlayers.size)
    console.log(presentPlayers.size)
  })

  socket.on('gotAnswer', () => {
    console.log(socket.id, '득점')
    const player = presentPlayers.get(socket.id)
    player.score += 1
    const data = {
      socketid: socket.id,
      score: player.score
    }
    socket.emit('addScore', data)
  })

  socket.on('win', () => {
    socket.emit('gameEnd', socket.id)
  })
}

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: 'Public Lobby',
  description: 'For making friends and familiarizing yourself with the controls',
  password: null,
  autoDispose: false,
})
connectDB()
.then(() => {
  gameServer.listen(port)
})
.catch((err) => {
  console.log(err.message)
})
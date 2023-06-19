import 'express-async-errors';
import { MoleController } from './controllers/MoleGameControllers'
import { DataController } from './controllers/DataGameControllers'
import { RainController } from './controllers/RainGameControllers'
import express from 'express'

const socketPort = 8888
const app = express()
const server = app.listen(socketPort, () => console.log(`server on ${socketPort}`))
const io = require('socket.io')(server)

let presentPlayers = new Set()

io.on('connection', onConnect)

function onConnect(socket) {
  console.log(socket.id, '입장')
  presentPlayers.add({id:socket.id, score: 0})
  io.emit('new-player', socket.id)

  socket.on('disconnect', () => {
    console.log(socket.id, '퇴장')
    presentPlayers.delete(socket.id)
    io.emit('players', presentPlayers.size)
  })

  socket.on('gotAnswer', (socket) => {
    console.log(socket.id, '득점')
    presentPlayers[socket.id].score += 1
    const data = {
      socketid:socket.id,
      score: presentPlayers[socket.id].score
    }
    socket.emit('addScore', data)
  })

  socket.on('win', (socket) => {
    socket.emit('gameEnd', socket.id)
  })
}

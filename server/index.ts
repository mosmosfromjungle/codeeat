import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'
import authRouter from './routes/auth';
import friendsRouter from './routes/friends';

// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/SkyOffice'
import { connectDB } from './DB/db'

// const mongoose = require('mongoose')
// var cookieParser = require('cookie-parser')
const port = Number(process.env.PORT || 2567)
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
const gameServer = new Server({
  server,
})

/* register room handlers */
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: 'Public Lobby',
  description: 'For making friends and familiarizing yourself with the controls',
  password: null,
  autoDispose: false,
})

gameServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

/* Routes */
app.use('/auth', authRouter);
app.use('/friends', friendsRouter);

/* Connect DB and run game server */
connectDB().then(db => {
  gameServer.listen(port)  
  console.log(`Listening on ws://localhost:${port}`)
}).catch(console.error);

// connectDB()
// .then(() => {
//   gameServer.listen(port)
// })
// .catch((err) => {
//   console.log(err.message)
// })

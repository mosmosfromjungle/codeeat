import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData, IRoomData } from '../../types/Rooms'
// import { Player, OfficeState, MoleGame, BrickGame, TypingGame } from './schema/OfficeState'
import { GameState, GamePlayer } from './schema/GameState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import GamePlayUpdateCommand from './commands/GamePlayUpdateCommand'
// import {
//   BrickGameAddUserCommand,
//   BrickGameRemoveUserCommand,
// } from './commands/BrickGameUpdateArrayCommand'
// import {
//   MoleGameAddUserCommand,
//   MoleGameRemoveUserCommand,
// } from './commands/MoleGameUpdateArrayCommand'
// import {
//   TypingGameAddUserCommand,
//   TypingGameRemoveUserCommand,
// } from './commands/TypingGameUpdateArrayCommand'
// import ChatMessageUpdateCommand from './commands/ChatMessageUpdateCommand'

export class GameRoom extends Room<GameState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IGameRoomData) {
    const { name, description, password, username } = options
    this.name = name
    this.description = description
    this.autoDispose = true
    this.maxClients = 2

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }
    this.setMetadata({ name, description, hasPassword })

    this.setState(new GameState())
    this.state.host = username

    // // HARD-CODED: Add 5 brickgames in a room
    // for (let i = 0; i < 5; i++) {
    //   this.state.brickgames.set(String(i), new BrickGame())
    // }

    // // HARD-CODED: Add 3 typinggames in a room
    // for (let i = 0; i < 30; i++) {
    //   this.state.typinggames.set(String(i), new TypingGame())
    // }

    // // HARD-CODED: Add 1 molegames in a room
    // for (let i = 0; i < 20; i++) {
    //   this.state.molegames.set(String(i), new MoleGame())
    // }

    // // when a player connect to a typinggame, add to the typinggame connectedUser array
    // this.onMessage(Message.CONNECT_TO_TYPINGGAME, (client, message: { typinggameId: string }) => {
    //   this.dispatcher.dispatch(new TypingGameAddUserCommand(), {
    //     client,
    //     typinggameId: message.typinggameId,
    //   })
    // })

    // // when a player disconnect from a typinggame, remove from the typinggame connectedUser array
    // this.onMessage(Message.DISCONNECT_FROM_TYPINGGAME, (client, message: { typinggameId: string }) => {
    //     this.dispatcher.dispatch(new TypingGameRemoveUserCommand(), {
    //       client,
    //       typinggameId: message.typinggameId,
    //     })
    //   }
    // )

    // // when a player connect to a molegame, add to the molegame connectedUser array
    // this.onMessage(Message.CONNECT_TO_MOLEGAME, (client, message: { moleGameId: string }) => {
    //   this.dispatcher.dispatch(new MoleGameAddUserCommand(), {
    //     client,
    //     moleGameId: message.moleGameId,
    //   })
    // })

    // // when a player disconnect from a molegame, remove from the molegame connectedUser array
    // this.onMessage(Message.DISCONNECT_FROM_MOLEGAME, (client, message: { moleGameId: string }) => {
    //     this.dispatcher.dispatch(new MoleGameRemoveUserCommand(), {
    //       client,
    //       moleGameId: message.moleGameId,
    //     })
    //   }
    // )

    // // when a player connect to a brickgame, add to the brickgame connectedUser array
    // this.onMessage(Message.CONNECT_TO_BRICKGAME, (client, message: { brickGameId: string }) => {
    //   this.dispatcher.dispatch(new BrickGameAddUserCommand(), {
    //     client,
    //     brickGameId: message.brickGameId,
    //   })
    // })

    // // when a player disconnect from a brickgame, remove from the brickgame connectedUser array
    // this.onMessage(Message.DISCONNECT_FROM_BRICKGAME, (client, message: { brickGameId: string }) => {
    //     this.dispatcher.dispatch(new BrickGameRemoveUserCommand(), {
    //       client,
    //       brickGameId: message.brickGameId,
    //     })
    //   }
    // )

    function broadcastPlayersData(room: GameRoom) {
      const players = Array.from(room.state.players.values())
        .map((player: GamePlayer) => ({
          name: player.name,
          anim: player.anim,
        }))
      room.broadcast(Message.SEND_GAME_PLAYERS, players)
    }
    
    // when receiving updatePlayer message, call the PlayerUpdateCommand
    this.onMessage(Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
        broadcastPlayersData(this)
      }
    )

    // when receiving updatePlayerName message, call the PlayerUpdateNameCommand
    this.onMessage(Message.UPDATE_PLAYER_NAME, (client, message: { name: string }) => {
      this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
        client,
        name: message.name,
      })
      broadcastPlayersData(this)
    })
    

    // TODO: 각각의 게임에 필요한 정보에 맞춰 수정 필요 
    this.onMessage(Message.UPDATE_GAME_PLAY,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new GamePlayUpdateCommand(), {
          client,
          anim: message.anim,
        })
      }
    )

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    // this.onMessage(Message.READY_TO_CONNECT, (client) => {
    //   const player = this.state.players.get(client.sessionId)
    //   if (player) player.readyToConnect = true
    // })

    // // when a player is ready to connect, call the PlayerReadyToConnectCommand
    // this.onMessage(Message.VIDEO_CONNECTED, (client) => {
    //   const player = this.state.players.get(client.sessionId)
    //   if (player) player.videoConnected = true
    // })

    // // when a player disconnect a stream, broadcast the signal to the other player connected to the stream
    // this.onMessage(Message.DISCONNECT_STREAM, (client, message: { clientId: string }) => {
    //   this.clients.forEach((cli) => {
    //     if (cli.sessionId === message.clientId) {
    //       cli.send(Message.DISCONNECT_STREAM, client.sessionId)
    //     }
    //   })
    // })

    // // when a player send a chat message, update the message array and broadcast to all connected clients except the sender
    // this.onMessage(Message.ADD_CHAT_MESSAGE, (client, message: { content: string }) => {
    //   // update the message array (so that players join later can also see the message)
    //   this.dispatcher.dispatch(new ChatMessageUpdateCommand(), {
    //     client,
    //     content: message.content,
    //   })

    //   // broadcast to all currently connected clients except the sender (to render in-game dialog on top of the character)
    //   this.broadcast(
    //     Message.ADD_CHAT_MESSAGE,
    //     { clientId: client.sessionId, content: message.content },
    //     { except: client }
    //   )
    // })
  }

  async onAuth(client: Client, options: { password: string | null }) {
    if (this.password) {
      const validPassword = await bcrypt.compare(options.password, this.password)
      if (!validPassword) {
        throw new ServerError(403, 'Password is incorrect!')
      }
    }
    return true
  }

  onJoin(client: Client, options: any) {
    const { username } = options
    this.state.players.set(client.sessionId, new GamePlayer(username))
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })

    function broadcastPlayersData(room: GameRoom) {
      const players = Array.from(room.state.players.values())
        .map((player: GamePlayer) => ({
          name: player.name,
          anim: player.anim,
        }))
      room.broadcast(Message.SEND_GAME_PLAYERS, players);
    }

    broadcastPlayersData(this)
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    // this.state.brickgames.forEach((brickgame) => {
    //   if (brickgame.connectedUser.has(client.sessionId)) {
    //     brickgame.connectedUser.delete(client.sessionId)
    //   }
    // })
    // this.state.typinggames.forEach((typinggame) => {
    //   if (typinggame.connectedUser.has(client.sessionId)) {
    //     typinggame.connectedUser.delete(client.sessionId)
    //   }
    // })
    // this.state.molegames.forEach((molegame) => {
    //   if (molegame.connectedUser.has(client.sessionId)) {
    //     molegame.connectedUser.delete(client.sessionId)
    //   }
    // })

    function broadcastPlayersData(room: GameRoom) {
      const players = Array.from(room.state.players.values())
        .map((player: GamePlayer) => ({
          name: player.name,
          anim: player.anim,
        }))
      room.broadcast(Message.SEND_GAME_PLAYERS, players);
    }
    
    broadcastPlayersData(this)
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
}

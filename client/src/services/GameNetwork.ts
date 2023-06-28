import { Client, Room } from 'colyseus.js'
// import { IOfficeState, IPlayer, IMoleGame, IBrickGame, IRainGame, IFaceChat } from '../../../types/IOfficeState'
import { IGameState, IGamePlayer, IBrickPlayer, IBrickGameState } from '../../../types/IGameState'
import { Message } from '../../../types/Messages'
import { IGameRoomData, IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import { phaserEvents, Event } from '../events/EventCenter'
import WebRTC from '../web/WebRTC'
import store from '../stores'
import { setPlayerNameMap, removePlayerNameMap, setGameSessionId } from '../stores/UserStore'
import { 
  setMoleGameFriendInfo,
  setMoleGameFriendData,
  setMoleGameProblem,
  setMoleGameNext,
 } from '../stores/MoleGameStore'
import {
  setLobbyJoined,
  setJoinedGameRoomData,
  setGamePlayers,
  setAvailableBrickRooms,
  setAvailableMoleRooms,
  setAvailableRainRooms,
  setAvailableFaceChatRooms,
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import { setBrickGameState, setMyPlayerScore, setMyPlayerStatus, setOppPlayerScore, setOppPlayerStatus } from '../stores/BrickGameStore'

export default class GameNetwork {
  private client: Client
  private lobby?: Room | undefined
  private room?: Room<IGameState>
  mySessionId!: string

  constructor() {
    const protocol = window.location.protocol.replace('http', 'ws')
    const endpoint =
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_SERVER_URL
        : `${protocol}//${window.location.hostname}:2567`
    this.client = new Client(endpoint)
    
    // phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    // phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    // phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  async leaveGameRoom() {
    if (this.room) {
      await this.room.leave()
      this.room = undefined
      this.mySessionId = ''
      store.dispatch(setGameSessionId(''))
    }
  }

  async leaveLobbyRoom() {
    if (this.lobby) {
      await this.lobby.leave()
    }
    this.lobby = undefined
  }
  
  async joinLobbyRoom(type: RoomType) {
    if (this.lobby) return

    this.lobby = await this.client.joinOrCreate(type)
    store.dispatch(setLobbyJoined(true))

    if (type === RoomType.BRICKLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableBrickRooms(rooms))
      })
    } else if (type === RoomType.MOLELOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableMoleRooms(rooms))
      })
    } else if (type === RoomType.RAINLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableRainRooms(rooms))
      })
    } else if (type === RoomType.FACECHATLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableFaceChatRooms(rooms))
      })
    }

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  async joinCustomById(roomId: string, password: string | null, username: string) {
    this.room = await this.client.joinById(roomId, { password, username })
    if (this.room.name === RoomType.BRICK) {
      this.brick_game_init()
    } else {
      this.initialize()
    }
  }

  async createBrickRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.BRICK, {  
      name,
      description,
      password,
      username,
    })
    this.brick_game_init()
  }

  async createMoleRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.MOLE, {
      name,
      description,
      password,
      username,
    })
    this.initialize()
  }
  
  async createRainRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.RAIN, {
      name,
      description,
      password,
      username,
    })
    this.initialize()
  }

  async createFaceChatRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.FACECHAT, {
      name,
      description,
      password,
      username,
    })
    this.initialize()
  }

  // set up all network listeners before the game starts
  initialize() {
    if (!this.room) return

    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
    store.dispatch(setGameSessionId(this.room.sessionId)) 
    // // this.webRTC = new WebRTC(this.mySessionId, this)

    // // new instance added to the players MapSchema
    // this.room.state.players.onAdd = (player: IPlayer, key: string) => {
    //   if (key === this.mySessionId) return

    //   // track changes on every child object inside the players MapSchema
    //   player.onChange = (changes) => {
    //     changes.forEach((change) => {
    //       const { field, value } = change
    //       // phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

    //       // when a new player finished setting up player name
    //       if (field === 'name' && value !== '') {
    //         // phaserEvents.emit(Event.PLAYER_JOINED, player, key)
    //         store.dispatch(setPlayerNameMap({ id: key, name: value }))
    //         store.dispatch(pushPlayerJoinedMessage(value))
    //       }
    //     })
    //   }
    // }

    // // an instance removed from the players MapSchema
    // this.room.state.players.onRemove = (player: IPlayer, key: string) => {
    //   // phaserEvents.emit(Event.PLAYER_LEFT, key)
    //   // this.webRTC?.deleteVideoStream(key)
    //   // this.webRTC?.deleteOnCalledVideoStream(key)
    //   store.dispatch(pushPlayerLeftMessage(player.name))
    //   store.dispatch(removePlayerNameMap(key))
    // }

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedGameRoomData(content))
    })

    // when the server sends data of players in this room
    this.room.onMessage(Message.SEND_GAME_PLAYERS, (content) => {
      store.dispatch(setGamePlayers(content))
    })

    // ↓ Mole Game
    // method to receive friend info to me in mole game
    this.room.onMessage(Message.RECEIVE_MOLE, (content) => {
      store.dispatch(setMoleGameFriendInfo(content));
    });

    // method to receive friend point to me in mole game
    this.room.onMessage(Message.RECEIVE_YOUR_POINT, (content) => {
      store.dispatch(setMoleGameFriendData(content));
    });

    // method to receive friend point to me in mole game
    this.room.onMessage(Message.RESPONSE_MOLE, (content) => {
      store.dispatch(setMoleGameProblem(content));
    });
  }

  // method to send player updates to Colyseus server
  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    this.room?.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
  }

  // method to send player name to Colyseus server
  updatePlayerName(currentName: string) {
    this.room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
  }

  // method to send ready-to-connect signal to Colyseus server
  readyToConnect() {
    this.room?.send(Message.READY_TO_CONNECT)
    phaserEvents.emit(Event.MY_PLAYER_READY)
  }

  brick_game_init() {
    if (!this.room) return

    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
    store.dispatch(setGameSessionId(this.room.sessionId)) 

    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedGameRoomData(content))
      console.log('saved metadata')
    })

    this.room.onMessage(Message.SEND_GAME_PLAYERS, (content) => {
      store.dispatch(setGamePlayers(content))
    })

    this.room.onMessage(Message.BRICK_GAME_STATE, (content) => {
      store.dispatch(setBrickGameState(content))
    })

    this.room.onMessage(Message.BRICK_GAME_STATE, (content) => {
      store.dispatch(setBrickGameState(content))
    })

    this.room.onMessage(Message.BRICK_PLAYER_UPDATE, (content) => {
      const { client, payload } = content
      if (client.sessionId === this.mySessionId) {
        console.log('update my player info')
        store.dispatch(setMyPlayerScore(payload.playerScore))
        store.dispatch(setMyPlayerStatus(payload.playerStatus))
      } else {
        console.log('update opponent player info')
        store.dispatch(setOppPlayerScore(payload.playerScore))
        store.dispatch(setOppPlayerStatus(payload.playerStatus))
      }
    })

    // // TODO: 이거 왜 안될까 ㅜㅜ 
    // this.room.state.brickgames.brickPlayers?.forEach((value: IBrickPlayer, key: string, map: Map<string, IBrickPlayer>) => {
    //   this.brickPlayerListen(value, key)
    // })

    // this.room.state.brickgames.brickPlayers.onAdd = (player: IBrickPlayer, key: string) => {
    //   this.brickPlayerListen(player, key)
    // }
  }

  /* BRICK GAMES */
  // brickPlayerListen(player: IBrickPlayer, key: string) {
  //   if (key === this.mySessionId) {
  //     player.onChange = (changes) => {
  //       changes.forEach((change) => {
  //         const { field, value } = change
  //         if (field === 'playerScore') {
  //           store.dispatch(setMyPlayerScore(value))
  //         }
  //         if (field === 'playerStatus') {
  //           console.log('status change: ', value)
  //           store.dispatch(setMyPlayerStatus(value))
  //         }
  //       })
  //     }
  //   } else {
  //     player.onChange = (changes) => {
  //       changes.forEach((change) => {
  //         const { field, value } = change
  //         if (field === 'playerScore') {
  //           store.dispatch(setOppPlayerScore(value))
  //         }
  //         if (field === 'playerStatus') {
  //           store.dispatch(setOppPlayerStatus(value))
  //         }
  //       })
  //     }
  //   }
  // }

  brickGameCommand(command: string) {
    console.log('command: ', command)
    this.room?.send(Message.BRICK_GAME_COMMAND, { command: command })
  }


  // ↓ Mole Game
  // method to send my info to friend in mole game
  sendMyInfo(myName: string, myCharacter: string) {
    this.room?.send(Message.SEND_MOLE, { name: myName, character: myCharacter })
  }

  // method to send my point to friend in mole game
  sendMyPoint(myPoint: string) {
    this.room?.send(Message.SEND_MY_POINT, { point: myPoint })
  }

  // method to send my point to friend in mole game
  startGame(problem: string) {
    this.room?.send(Message.REQUEST_MOLE, { problem: problem })
  }
}

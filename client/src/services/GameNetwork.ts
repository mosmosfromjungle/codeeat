import { Client, Room } from 'colyseus.js'
import { IGameRoomData, RoomType } from '../../../types/Rooms'
import { IGameState } from '../../../types/IGameState'
import { Message } from '../../../types/Messages'
import store from '../stores'
import { setGameSessionId } from '../stores/UserStore'
import {
  setLobbyJoined,
  setGameJoined,
  setJoinedGameRoomData,
  setAvailableBrickRooms,
  setAvailableMoleRooms,
  setAvailableRainRooms,
  setAvailableCodingRooms,
  addAvailableRooms,
  removeAvailableRooms,
  clearAvailabelGameRooms,
} from '../stores/RoomStore'
import {
  setMoleGameFriendInfo,
  setMoleGameFriendData,
  setMoleGameProblem,
  setMoleGameHost,
  setMoleGameLife,
  clearMoleGameFriendInfo,
 } from '../stores/MoleGameStore'
import {
  setBrickGameState,
  setMyPlayerScore,
  setMyPlayerStatus,
  setOppPlayerScore,
  setOppPlayerStatus,
  setOppInfo,
} from '../stores/BrickGameStore'
import { 
  setRainGameMe, 
  setRainGameYou, 
  setRainGameMyState,
  setRainGameHost, 
  setRainGameYouState, 
  setRainGameReady, 
  setRainGameInProgress 
} from '../stores/RainGameStore'
// import { 
// } from '../stores/CodingRunStore'


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
  }

  async leaveGameRoom() {
    if (this.room) {
      await this.room.leave()
      this.room = undefined
      this.mySessionId = ''
      store.dispatch(setGameSessionId(''))
      store.dispatch(setGameJoined(false))
      store.dispatch(setJoinedGameRoomData({ id: '', name: '', description: '' }))
    }
  }

  leaveLobbyRoom() {
    if (this.lobby) {
      this.lobby.leave()
      store.dispatch(clearAvailabelGameRooms())
    }
    this.lobby = undefined
  }

  async joinLobbyRoom(type: RoomType) {
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
    } else if (type === RoomType.CODINGLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableCodingRooms(rooms))
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
    if (this.room.name === RoomType.BRICK) this.brick_game_init()
    if (this.room.name === RoomType.RAIN) this.rain_game_init()
    if (this.room.name === RoomType.MOLE) this.mole_game_init()
    if (this.room.name === RoomType.CODING) this.coding_run_init()
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
    this.mole_game_init()
  }

  async createRainRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.RAIN, {
      name,
      description,
      password,
      username,
    })
    this.rain_game_init()
  }

  async createCodingRoom(roomData: IGameRoomData) {
    const { name, description, password, username } = roomData
    this.room = await this.client.create(RoomType.CODING, {
      name,
      description,
      password,
      username,
    })
    this.coding_run_init()
  }

  /* BRICK GAME */

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

    this.room.onMessage(Message.BRICK_GAME_PLAYERS, (content) => {
      if (content.length < 2) {
        store.dispatch(setOppInfo({name: '', character: ''}))
      } else {
        content.map(element => {
          const { sessionId, name, character } = element
          if (sessionId !== this.mySessionId) {
            store.dispatch(setOppInfo({name, character}))
          }
        })
      }
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
  }

  brickGameCommand(command: string) {
    console.log('command: ', command)
    this.room?.send(Message.BRICK_GAME_COMMAND, { command: command })
  }


  /* MOLE GAME  */

  mole_game_init() {
    if (!this.room) return
    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
    store.dispatch(setGameSessionId(this.room.sessionId))

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedGameRoomData(content))
    })

    // ↓ Mole Game
    // method to receive friend info to me in mole game
    this.room.onMessage(Message.RECEIVE_MOLE, (content) => {
      store.dispatch(setMoleGameFriendInfo(content))
    })

    // method to receive friend point to me in mole game
    this.room.onMessage(Message.RECEIVE_YOUR_POINT, (content) => {
      store.dispatch(setMoleGameFriendData(content))
    })

    // method to receive friend point to me in mole game
    this.room.onMessage(Message.RESPONSE_MOLE, (content) => {
      store.dispatch(setMoleGameProblem(content))
    })

    // method to receive host to me in mole game
    this.room.onMessage(Message.RECEIVE_HOST, (content) => {
      store.dispatch(setMoleGameHost(content));
    });

    // method to receive life to friend in mole game
    this.room.onMessage(Message.RECEIVE_YOUR_LIFE, (content) => {
      store.dispatch(setMoleGameLife(content));
    });
  
    // method to clear friend info in mole game
    this.room.onMessage(Message.CLEAR_FRIEND, () => {
      store.dispatch(clearMoleGameFriendInfo());
    });
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

  // method to send host in mole game
  changeHost(host: string) {
    this.room?.send(Message.SEND_HOST, { host: host })
  }
  
  // method to send life count in mole game
  sendMyLife(myLife: string) {
    this.room?.send(Message.SEND_MY_LIFE, { life: myLife })
  }
  
  // method to clear friend info in mole game
  clearFriendInfo() {
    this.room?.send(Message.CLEAR_FRIEND)
  }

  /* RAIN GAME */
  
  startRainGame() {
    console.log('startRainGame')
    this.room?.send(Message.RAIN_GAME_START)
  }

  // GetWordsList(username1, username2) {
  //   console.log('GetWordsList')
  //   this.room?.send(Message.RAIN_GAME_WORD, { username1, username2 })
  // }

  sendMyInfoToServer(username: string, character: string) {
    console.log('sendMyInfoToServer')
    if (!this.room) return

    this.room.send(Message.RAIN_GAME_USER, { username: username, character: character })
  }

  rain_game_init() {
    if (!this.room) return
    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
    store.dispatch(setGameSessionId(this.room.sessionId))

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      const roomData = {
        id : content.id,
        name: content.name,
        description: content.description
      }
      store.dispatch(setJoinedGameRoomData(roomData))
      store.dispatch(setRainGameHost(content.host))
    })

    this.room.onMessage(Message.RAIN_GAME_USER, (data) => {
      for (let key in data) {
          let user = data[key];
          if (key === this.mySessionId) {
              store.dispatch(setRainGameMe(user));
          } else {
              store.dispatch(setRainGameYou(user));
          }
      }
    });

    this.room.onMessage(Message.RAIN_GAME_START, () => {
      store.dispatch(setRainGameInProgress(true));
    
      const mySessionId = this.mySessionId;
    });

    this.room.onMessage(Message.RAIN_GAME_READY, () => {
      store.dispatch(setRainGameReady(true))
    })
  }
  
  /* Coding Run */
  coding_run_init() {
    if (!this.room) return
    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
    store.dispatch(setGameSessionId(this.room.sessionId))
  }
}
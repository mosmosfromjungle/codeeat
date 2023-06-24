import { Client, Room } from 'colyseus.js'
import { IOfficeState, IPlayer, IMoleGame, IBrickGame, IRainGame } from '../../../types/IOfficeState'
import { Message } from '../../../types/Messages'
import { IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import { phaserEvents, Event } from '../events/EventCenter'
import WebRTC from '../web/WebRTC'
import store from '../stores'
import { setPlayerNameMap, removePlayerNameMap, setGameSessionId } from '../stores/UserStore'
import {
  setLobbyJoined,
  // setJoinedRoomData,
  setJoinedGameRoomData,
  setGamePlayers,
  setAvailableBrickRooms,
  setAvailableMoleRooms,
  setAvailableRainRooms,
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from '../stores/ChatStore'

export default class GameNetwork {
  private client: Client
  private lobby!: Room | undefined
  private room?: Room<IOfficeState>
  // webRTC?: WebRTC
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
    }

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  async joinCustomById(roomId: string, password: string | null) {
    this.room = await this.client.joinById(roomId, { password })
    this.initialize()
  }

  async createBrickRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.BRICK, {  
      name,
      description,
      password,
      autoDispose,
    })
    this.initialize()
  }

  async createMoleRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.MOLE, {
      name,
      description,
      password,
      autoDispose,
    })
    this.initialize()
  }
  
  async createRainRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.RAIN, {
      name,
      description,
      password,
      autoDispose,
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
    // this.webRTC = new WebRTC(this.mySessionId, this)

    // new instance added to the players MapSchema
    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return

      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          // phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {
            // phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      // phaserEvents.emit(Event.PLAYER_LEFT, key)
      // this.webRTC?.deleteVideoStream(key)
      // this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
    }
    
    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedGameRoomData(content))
    })

    // when the server sends data of players in this room
    this.room.onMessage(Message.SEND_GAME_PLAYERS, (content) => {
      store.dispatch(setGamePlayers(content))
    })
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

}

import { Client, Room } from 'colyseus.js'
import { IOfficeState, IPlayer, IMoleGame, IBrickGame, ITypingGame } from '../../../types/IOfficeState'
import { Message } from '../../../types/Messages'
import { IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import { phaserEvents, Event } from '../events/EventCenter'
import WebRTC from '../web/WebRTC'
import store from '../stores'
import { setPlayerNameMap, removePlayerNameMap, setGameSessionId } from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableBrickRooms,
  setAvailableMoleRooms,
  setAvailableTypingRooms,
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
  private lobby!: Room
  private room?: Room<IOfficeState>
  webRTC?: WebRTC
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
  }

  async joinLobby(type:RoomType) {
    this.joinLobbyRoom(type).then(() => {
      store.dispatch(setLobbyJoined(true))
    })
  }

  async joinLobbyRoom(type: RoomType) {
    this.lobby = await this.client.joinOrCreate(type)

    if (type === RoomType.BRICKLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableBrickRooms(rooms))
      })
    } else if (type === RoomType.MOLELOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableMoleRooms(rooms))
      })
    } else if (type === RoomType.TYPINGLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableTypingRooms(rooms))
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
  
  async createTypingRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.TYPING, {
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

    // // new instance added to the brickgames MapSchema
    // this.room.state.brickgames.onAdd = (brickgame: IBrickGame, key: string) => {
    //   // track changes on every child object's connectedUser
    //   brickgame.connectedUser.onAdd = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.BRICKGAME)
    //   }
    //   brickgame.connectedUser.onRemove = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.BRICKGAME)
    //   }
    // }

    // // new instance added to the typinggames MapSchema
    // this.room.state.typinggames.onAdd = (typinggame: ITypingGame, key: string) => {
    //   // track changes on every child object's connectedUser
    //   typinggame.connectedUser.onAdd = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.TYPINGGAME)
    //   }
    //   typinggame.connectedUser.onRemove = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.TYPINGGAME)
    //   }
    // }

    // // new instance added to the molegames MapSchema
    // this.room.state.molegames.onAdd = (molegame: IMoleGame, key: string) => {
    //   // track changes on every child object's connectedUser
    //   molegame.connectedUser.onAdd = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.MOLEGAME)
    //   }
    //   molegame.connectedUser.onRemove = (item, index) => {
    //     phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.MOLEGAME)
    //   }
    // }
    
    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    // when the server sends data of players in this room
    this.room.onMessage(Message.SEND_GAME_PLAYERS, (content) => {
      
    })
    
    // // new instance added to the chatMessages ArraySchema
    // this.room.state.chatMessages.onAdd = (item, index) => {
    //   store.dispatch(pushChatMessage(item))
    // }

    // // when a user sends a message
    // this.room.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
    //   phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    // })

    // // when a peer disconnects with myPeer
    // this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
    //   this.webRTC?.deleteOnCalledVideoStream(clientId)
    // })
  }

  // // method to register event listener and call back function when a item user added
  // onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
  //   phaserEvents.on(Event.UPDATE_DIALOG_BUBBLE, callback, context)
  // }

  // // method to register event listener and call back function when a item user added
  // onItemUserAdded(
  //   callback: (playerId: string, key: string, itemType: ItemType) => void,
  //   context?: any
  // ) {
  //   phaserEvents.on(Event.ITEM_USER_ADDED, callback, context)
  // }

  // // method to register event listener and call back function when a item user removed
  // onItemUserRemoved(
  //   callback: (playerId: string, key: string, itemType: ItemType) => void,
  //   context?: any
  // ) {
  //   phaserEvents.on(Event.ITEM_USER_REMOVED, callback, context)
  // }

  // // method to register event listener and call back function when a player joined
  // onPlayerJoined(callback: (Player: IPlayer, key: string) => void, context?: any) {
  //   phaserEvents.on(Event.PLAYER_JOINED, callback, context)
  // }

  // // method to register event listener and call back function when a player left
  // onPlayerLeft(callback: (key: string) => void, context?: any) {
  //   phaserEvents.on(Event.PLAYER_LEFT, callback, context)
  // }

  // // method to register event listener and call back function when myPlayer is ready to connect
  // onMyPlayerReady(callback: (key: string) => void, context?: any) {
  //   phaserEvents.on(Event.MY_PLAYER_READY, callback, context)
  // }

  // // method to register event listener and call back function when my video is connected
  // onMyPlayerVideoConnected(callback: (key: string) => void, context?: any) {
  //   phaserEvents.on(Event.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  // }

  // // method to register event listener and call back function when a player updated
  // onPlayerUpdated(
  //   callback: (field: string, value: number | string, key: string) => void,
  //   context?: any
  // ) {
  //   phaserEvents.on(Event.PLAYER_UPDATED, callback, context)
  // }

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

  // // method to send ready-to-connect signal to Colyseus server
  // videoConnected() {
  //   this.room?.send(Message.VIDEO_CONNECTED)
  //   phaserEvents.emit(Event.MY_PLAYER_VIDEO_CONNECTED)
  // }

  // // method to send stream-disconnection signal to Colyseus server
  // playerStreamDisconnect(id: string) {
  //   this.room?.send(Message.DISCONNECT_STREAM, { clientId: id })
  //   this.webRTC?.deleteVideoStream(id)
  // }

  // connectToMoleGame(id: string) {
  //   this.room?.send(Message.CONNECT_TO_MOLEGAME, { moleGameId: id })
  // }

  // disconnectFromMoleGame(id: string) {
  //   this.room?.send(Message.DISCONNECT_FROM_MOLEGAME, { moleGameId: id })
  // }

  // connectToBrickGame(id: string) {
  //   this.room?.send(Message.CONNECT_TO_BRICKGAME, { brickgameId: id })
  // }

  // disconnectFromBrickGame(id: string) {
  //   this.room?.send(Message.DISCONNECT_FROM_BRICKGAME, { brickgameId: id })
  // }

  // connectToTypingGame(id: string) {
  //   this.room?.send(Message.CONNECT_TO_TYPINGGAME, { typinggameId: id })
  // }

  // disconnectFromTypingGame(id: string) {
  //   this.room?.send(Message.DISCONNECT_FROM_TYPINGGAME, { typinggameId: id })
  // }

  // addChatMessage(content: string) {
  //   this.room?.send(Message.ADD_CHAT_MESSAGE, { content: content })
  // }

  // TODO: Might need it, not sure 
  // disableGamePlayer(playerSessionId: string) {
  //   phaserEvents.off(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayer, this);
  //   this.room?.send(Message.DISABLE_GAME_PLAYER, {playerSessionId: playerSessionId})
  // }

  // reactivateGamePlayer(playerSessionId: string) {
  //   phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayer, this);
  //   this.room?.send(Message.REACTIVATE_GAME_PLAYER, {playerSessionId: playerSessionId})
  // }
}

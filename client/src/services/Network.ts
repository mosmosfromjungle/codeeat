import { Client, Room } from 'colyseus.js'
import { IOfficeState, IPlayer, IMoleGame, IBrickGame, IRainGame } from '../../../types/IOfficeState'
import { Message } from '../../../types/Messages'
import { IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import WebRTC from '../web/WebRTC'
import { phaserEvents, Event } from '../events/EventCenter'
import store from '../stores'
import { setSessionId, setPlayerNameMap, removePlayerNameMap, setGameSessionId } from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableRooms,
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
import { FacebookInstantGamesLeaderboard } from 'phaser'


export enum NetworkType {
  MAIN = 'main',
  GAME = 'game',
}

export default class Network {
  private client: Client
  private lobby!: Room
  private room?: Room<IOfficeState>
  private gameroom?: Room<IOfficeState>

  webRTC?: WebRTC
  gameWebRTC?: WebRTC

  mySessionId!: string
  myGameSessionId!: string

  constructor() {
    const protocol = window.location.protocol.replace('http', 'ws')
    const endpoint =
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_SERVER_URL
        : `${protocol}//${window.location.hostname}:2567`
    this.client = new Client(endpoint)

    this.joinLobby(RoomType.LOBBY)

    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  async leaveGameRoom() {
    if (this.gameroom) {
      await this.gameroom.leave()
      this.gameroom = undefined
      this.myGameSessionId = ''
      store.dispatch(setGameSessionId(''))

      // TODO: 기존에 있던 방이 다시 연결되어야 함 
    }
  }

  async joinLobby(type: RoomType) {
    this.joinLobbyRoom(type).then(() => {
      store.dispatch(setLobbyJoined(true))
    })
  }

  /**
   * method to join Colyseus' built-in LobbyRoom, which automatically notifies
   * connected clients whenever rooms with "realtime listing" have updates
   */
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
    } else if (type === RoomType.RAINLOBBY) {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableRainRooms(rooms))
      })
    } else {
      this.lobby.onMessage('rooms', (rooms) => {
        store.dispatch(setAvailableRooms(rooms))
      })
    }

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  // method to join the public room
  async joinOrCreatePublic() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC)
    this.initialize()
  }

  // method to join a custom room
  async joinCustomById(roomId: string, password: string | null) {
    this.gameroom = await this.client.joinById(roomId, { password })
    this.initialize()
  }

  // method to create a custom room
  async createCustom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.CUSTOM, {
      name,
      description,
      password,
      autoDispose: false,
    })
    this.initialize()
  }

  async createBrickRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.gameroom = await this.client.create(RoomType.BRICK, {
      name,
      description,
      password,
      autoDispose,
    })
    this.init_game()
  }

  async createMoleRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.gameroom = await this.client.create(RoomType.MOLE, {
      name,
      description,
      password,
      autoDispose,
    })
    this.init_game()
  }

  async createRainRoom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.gameroom = await this.client.create(RoomType.RAIN, {
      name,
      description,
      password,
      autoDispose,
    })
    this.init_game()
  }

  // set up all network listeners before the game starts
  initialize() {
    if (!this.room) return

    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId  // TODO: gameroom 전용 sessionId도 만들어줘야 함 
    store.dispatch(setSessionId(this.room.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)

    // new instance added to the players MapSchema
    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return

      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {
            phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
    }

    // new instance added to the brickgames MapSchema
    this.room.state.brickgames.onAdd = (brickgame: IBrickGame, key: string) => {
      // track changes on every child object's connectedUser
      brickgame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.BRICKGAME)
      }
      brickgame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.BRICKGAME)
      }
    }

    // new instance added to the raingames MapSchema
    this.room.state.raingames.onAdd = (raingame: IRainGame, key: string) => {
      // track changes on every child object's connectedUser
      raingame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.RAINGAME)
      }
      raingame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.RAINGAME)
      }
    }

    // new instance added to the molegames MapSchema
    this.room.state.molegames.onAdd = (molegame: IMoleGame, key: string) => {
      // track changes on every child object's connectedUser
      molegame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.MOLEGAME)
      }
      molegame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.MOLEGAME)
      }
    }

    // new instance added to the chatMessages ArraySchema
    this.room.state.chatMessages.onAdd = (item, index) => {
      store.dispatch(pushChatMessage(item))
    }

    // when the server sends room data
    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    // when a user sends a message
    this.room.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
      phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    })

    // when a peer disconnects with myPeer
    this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })
  }

  init_game() {
    if (!this.gameroom) return

    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.myGameSessionId = this.gameroom.sessionId
    store.dispatch(setGameSessionId(this.gameroom.sessionId))
    this.webRTC = new WebRTC(this.myGameSessionId, this)

    // new instance added to the players MapSchema
    this.gameroom.state.players.onAdd = (player: IPlayer, key: string) => {
      if (key === this.mySessionId) return

      // track changes on every child object inside the players MapSchema
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)

          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {
            phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    // an instance removed from the players MapSchema
    this.gameroom.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
    }

    // new instance added to the brickgames MapSchema
    this.gameroom.state.brickgames.onAdd = (brickgame: IBrickGame, key: string) => {
      // track changes on every child object's connectedUser
      brickgame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.BRICKGAME)
      }
      brickgame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.BRICKGAME)
      }
    }

    // new instance added to the molegames MapSchema
    this.gameroom.state.molegames.onAdd = (molegame: IMoleGame, key: string) => {
      // track changes on every child object's connectedUser
      molegame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.MOLEGAME)
      }
      molegame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.MOLEGAME)
      }
    }

    // new instance added to the raingames MapSchema
    this.gameroom.state.raingames.onAdd = (raingame: IRainGame, key: string) => {
      // track changes on every child object's connectedUser
      raingame.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.RAINGAME)
      }
      raingame.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.RAINGAME)
      }
    }

    // new instance added to the chatMessages ArraySchema
    this.gameroom.state.chatMessages.onAdd = (item, index) => {
      store.dispatch(pushChatMessage(item))
    }

    // when the server sends gameroom data
    this.gameroom.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    // when a user sends a message
    this.gameroom.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
      phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    })

    // when a peer disconnects with myPeer
    this.gameroom.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })
  }

  // method to register event listener and call back function when a item user added
  onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
    phaserEvents.on(Event.UPDATE_DIALOG_BUBBLE, callback, context)
  }

  // method to register event listener and call back function when a item user added
  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_ADDED, callback, context)
  }

  // method to register event listener and call back function when a item user removed
  onItemUserRemoved(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_REMOVED, callback, context)
  }

  // method to register event listener and call back function when a player joined
  onPlayerJoined(callback: (Player: IPlayer, key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_JOINED, callback, context)
  }

  // method to register event listener and call back function when a player left
  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_LEFT, callback, context)
  }

  // method to register event listener and call back function when myPlayer is ready to connect
  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_READY, callback, context)
  }

  // method to register event listener and call back function when my video is connected
  onMyPlayerVideoConnected(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  }

  // method to register event listener and call back function when a player updated
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.PLAYER_UPDATED, callback, context)
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

  // method to send ready-to-connect signal to Colyseus server
  videoConnected() {
    this.room?.send(Message.VIDEO_CONNECTED)
    phaserEvents.emit(Event.MY_PLAYER_VIDEO_CONNECTED)
  }

  // method to send stream-disconnection signal to Colyseus server
  playerStreamDisconnect(id: string) {
    this.room?.send(Message.DISCONNECT_STREAM, { clientId: id })
    this.webRTC?.deleteVideoStream(id)
  }

  connectToBrickGame(id: string) {
    this.room?.send(Message.CONNECT_TO_BRICKGAME, { brickgameId: id })
  }

  disconnectFromBrickGame(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_BRICKGAME, { brickgameId: id })
  }

  connectToRainGame(id: string) {
    this.room?.send(Message.CONNECT_TO_RAINGAME, { raingameId: id })
  }

  disconnectFromRainGame(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_RAINGAME, { raingameId: id })
  }

  addChatMessage(content: string) {
    this.room?.send(Message.ADD_CHAT_MESSAGE, { content: content })
  }

  connectToMoleGame(id: string) {
    this.room?.send(Message.CONNECT_TO_MOLEGAME, { moleGameId: id })
  }

  disconnectFromMoleGame(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_MOLEGAME, { moleGameId: id })
  }

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

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
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from '../stores/ChatStore'

export default class Network {
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
    
    this.joinLobbyRoom(RoomType.LOBBY).then(() => {
      store.dispatch(setLobbyJoined(true))
    })
    
    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  async leaveRoom() {
    if (this.room) {
      await this.room.leave()
      this.room = undefined
      this.mySessionId = ''
      store.dispatch(setSessionId(''))
    }
  }

  /**
   * method to join Colyseus' built-in LobbyRoom, which automatically notifies
   * connected clients whenever rooms with "realtime listing" have updates
   */
  async joinLobbyRoom(type: RoomType) {
    this.lobby = await this.client.joinOrCreate(type)

    this.lobby.onMessage('rooms', (rooms) => {
      store.dispatch(setAvailableRooms(rooms))
    })

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
  // async joinCustomById(roomId: string, password: string | null) {
  //   this.gameroom = await this.client.joinById(roomId, { password })
  //   this.initialize()
  // }

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

  // set up all network listeners before the game starts
  initialize() {
    if (!this.room) return

    this.lobby.leave()
    store.dispatch(setLobbyJoined(false))
    this.mySessionId = this.room.sessionId
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

          // UGLY: 플레이어가 이름을 바꿀때마다 새로운 플레이어가 Join 했다는 메세지를 푸시하게 된다. 로직 수정 필요 
          // when a new player finished setting up player name
          if (field === 'name' && value !== '') {   // 이름을 세팅하면 플레이어가 새로 join한걸로 처리된다... 
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
  
  // addChatMessage(content: string) {
  //   this.room?.send(Message.ADD_CHAT_MESSAGE, { content: content })
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

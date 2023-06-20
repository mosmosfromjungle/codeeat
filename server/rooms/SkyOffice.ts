import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, OfficeState, DataStructure, AcidRain, MoleGame } from './schema/OfficeState'
import { Message } from '../../types/Messages'
import { IRoomData } from '../../types/Rooms'
import { acidrainRoomIds } from './schema/OfficeState'
import { moleGameRoomIds } from './schema/OfficeState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import {
  DataStructureAddUserCommand,
  DataStructureRemoveUserCommand,
} from './commands/DataStructureUpdateArrayCommand'
import {
  AcidRainAddUserCommand,
  AcidRainRemoveUserCommand,
} from './commands/AcidRainUpdateArrayCommand'
import {
  MoleGameAddUserCommand,
  MoleGameRemoveUserCommand,
} from './commands/MoleGameUpdateArrayCommand'
import ChatMessageUpdateCommand from './commands/ChatMessageUpdateCommand'

export class SkyOffice extends Room<OfficeState> {
  private dispatcher = new Dispatcher(this)
  private name: string
  private description: string
  private password: string | null = null

  async onCreate(options: IRoomData) {
    const { name, description, password, autoDispose } = options
    this.name = name
    this.description = description
    this.autoDispose = autoDispose

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }
    this.setMetadata({ name, description, hasPassword })

    this.setState(new OfficeState())

    // HARD-CODED: Add 5 datastructures in a room
    for (let i = 0; i < 5; i++) {
      this.state.datastructures.set(String(i), new DataStructure())
    }

    // HARD-CODED: Add 3 acidrains in a room
    for (let i = 0; i < 3; i++) {
      this.state.acidrains.set(String(i), new AcidRain())
    }

    // HARD-CODED: Add 1 molegames in a room
    for (let i = 0; i < 1; i++) {
      this.state.molegames.set(String(i), new MoleGame())
    }

    // when a player connect to a datastructure, add to the datastructure connectedUser array
    this.onMessage(Message.CONNECT_TO_DATASTRUCTURE, (client, message: { datastructureId: string }) => {
      this.dispatcher.dispatch(new DataStructureAddUserCommand(), {
        client,
        datastructureId: message.datastructureId,
      })
    })

    // when a player disconnect from a datastructure, remove from the datastructure connectedUser array
    this.onMessage(Message.DISCONNECT_FROM_DATASTRUCTURE, (client, message: { datastructureId: string }) => {
      this.dispatcher.dispatch(new DataStructureRemoveUserCommand(), {
        client,
        datastructureId: message.datastructureId,
      })
    })

    // when a player connect to a acidrain, add to the acidrain connectedUser array
    this.onMessage(Message.CONNECT_TO_ACIDRAIN, (client, message: { acidrainId: string }) => {
      this.dispatcher.dispatch(new AcidRainAddUserCommand(), {
        client,
        acidrainId: message.acidrainId,
      })
    })

    // when a player disconnect from a acidrain, remove from the acidrain connectedUser array
    this.onMessage(
      Message.DISCONNECT_FROM_ACIDRAIN,
      (client, message: { acidrainId: string }) => {
        this.dispatcher.dispatch(new AcidRainRemoveUserCommand(), {
          client,
          acidrainId: message.acidrainId,
        })
      }
    )

    // when a player connect to a molegame, add to the molegame connectedUser array
    this.onMessage(Message.CONNECT_TO_MOLEGAME, (client, message: { moleGameId: string }) => {
      this.dispatcher.dispatch(new MoleGameAddUserCommand(), {
        client,
        moleGameId: message.moleGameId,
      })
    })

    // when a player disconnect from a molegame, remove from the molegame connectedUser array
    this.onMessage(
      Message.DISCONNECT_FROM_MOLEGAME,
      (client, message: { moleGameId: string }) => {
        this.dispatcher.dispatch(new MoleGameRemoveUserCommand(), {
          client,
          moleGameId: message.moleGameId,
        })
      }
    )

    // when receiving updatePlayer message, call the PlayerUpdateCommand
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: { x: number; y: number; anim: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          client,
          x: message.x,
          y: message.y,
          anim: message.anim,
        })
      }
    )

    // when receiving updatePlayerName message, call the PlayerUpdateNameCommand
    this.onMessage(Message.UPDATE_PLAYER_NAME, (client, message: { name: string }) => {
      this.dispatcher.dispatch(new PlayerUpdateNameCommand(), {
        client,
        name: message.name,
      })
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId)
      if (player) player.readyToConnect = true
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.VIDEO_CONNECTED, (client) => {
      const player = this.state.players.get(client.sessionId)
      if (player) player.videoConnected = true
    })

    // when a player disconnect a stream, broadcast the signal to the other player connected to the stream
    this.onMessage(Message.DISCONNECT_STREAM, (client, message: { clientId: string }) => {
      this.clients.forEach((cli) => {
        if (cli.sessionId === message.clientId) {
          cli.send(Message.DISCONNECT_STREAM, client.sessionId)
        }
      })
    })

    // when a player send a chat message, update the message array and broadcast to all connected clients except the sender
    this.onMessage(Message.ADD_CHAT_MESSAGE, (client, message: { content: string }) => {
      // update the message array (so that players join later can also see the message)
      this.dispatcher.dispatch(new ChatMessageUpdateCommand(), {
        client,
        content: message.content,
      })

      // broadcast to all currently connected clients except the sender (to render in-game dialog on top of the character)
      this.broadcast(
        Message.ADD_CHAT_MESSAGE,
        { clientId: client.sessionId, content: message.content },
        { except: client }
      )
    })
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
    this.state.players.set(client.sessionId, new Player())
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    })
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
    this.state.datastructures.forEach((datastructure) => {
      if (datastructure.connectedUser.has(client.sessionId)) {
        datastructure.connectedUser.delete(client.sessionId)
      }
    })
    this.state.acidrains.forEach((acidrain) => {
      if (acidrain.connectedUser.has(client.sessionId)) {
        acidrain.connectedUser.delete(client.sessionId)
      }
    })
    this.state.molegames.forEach((molegame) => {
      if (molegame.connectedUser.has(client.sessionId)) {
        molegame.connectedUser.delete(client.sessionId)
      }
    })
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
    this.dispatcher.stop()
  }
}

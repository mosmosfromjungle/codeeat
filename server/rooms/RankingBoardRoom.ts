import bcrypt from 'bcrypt'
import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Message } from '../../types/Messages'
import { IGameRoomData } from '../../types/Rooms'
import { GameState, GamePlayer } from './schema/GameState'
import PlayerUpdateCommand from './commands/PlayerUpdateCommand'
import PlayerUpdateNameCommand from './commands/PlayerUpdateNameCommand'
import {
} from './commands/RankingBoardUpdateArrayCommand'

export class RankingBoardRoom extends Room<GameState> {
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

    this.broadcast(Message.CLEAR_FRIEND);
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
  }

  onDispose() {
    console.log('Ranking Board room', this.roomId, 'disposing ...')
    this.dispatcher.stop()
  }
}

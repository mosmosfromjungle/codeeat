import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'

type Payload = {
  client: Client
  name: string
  userId: string
}

export default class PlayerUpdateNameCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, name, userId } = data

    const player = this.room.state.players.get(client.sessionId)

    if (!player) return
    player.name = name
    player.userid = userId
  }
}
